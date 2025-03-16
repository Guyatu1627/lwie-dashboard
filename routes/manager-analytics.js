import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import { isManager } from "../middleware/auth.js"
import { pool } from "../db/config.js"
import { redisClient } from "../server.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { generatePDF } from "../utils/pdfGenerator.js"
import { generateCSV } from "../utils/csvGenerator.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiter for analytics operations
const analyticsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

/**
 * @swagger
 * /api/manager/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/dashboard", authenticateToken, isManager, async (req, res, next) => {
  try {
    // Try to get from cache first
    const cachedData = await redisClient.get("manager:dashboard:analytics")
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData))
    }

    // Get counts
    const countsQuery = `
      SELECT
        (SELECT COUNT(*) FROM advertisements WHERE status = 'pending') as pending_ads,
        (SELECT COUNT(*) FROM advertisements WHERE status = 'approved') as approved_ads,
        (SELECT COUNT(*) FROM advertisements WHERE status = 'rejected') as rejected_ads,
        (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments,
        (SELECT COUNT(*) FROM payments WHERE status = 'completed') as completed_payments,
        (SELECT COUNT(*) FROM users WHERE role = 'user' AND is_active = true) as active_users,
        (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_last_week
    `

    const countsResult = await pool.query(countsQuery)

    // Get revenue data
    const revenueQuery = `
      SELECT 
        DATE_TRUNC('day', created_at)::date as date,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'completed'
      AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)::date
      ORDER BY date
    `

    const revenueResult = await pool.query(revenueQuery)

    // Get top advertisements
    const topAdsQuery = `
      SELECT 
        a.id,
        a.title,
        a.placement,
        COUNT(ua.id) as impressions,
        SUM(CASE WHEN ua.activity_type = 'ad_click' THEN 1 ELSE 0 END) as clicks,
        CASE 
          WHEN COUNT(ua.id) > 0 
          THEN ROUND((SUM(CASE WHEN ua.activity_type = 'ad_click' THEN 1 ELSE 0 END)::numeric / COUNT(ua.id)) * 100, 2)
          ELSE 0
        END as ctr
      FROM advertisements a
      LEFT JOIN user_activity ua ON ua.details->>'advertisement_id' = a.id::text
      WHERE a.status = 'approved'
      AND ua.created_at > NOW() - INTERVAL '30 days'
      GROUP BY a.id, a.title, a.placement
      ORDER BY impressions DESC
      LIMIT 5
    `

    const topAdsResult = await pool.query(topAdsQuery)

    // Get user activity by day
    const userActivityQuery = `
      SELECT 
        DATE_TRUNC('day', created_at)::date as date,
        COUNT(*) as activity_count
      FROM user_activity
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)::date
      ORDER BY date
    `

    const userActivityResult = await pool.query(userActivityQuery)

    // Get top categories
    const topCategoriesQuery = `
      SELECT 
        c.name as category,
        COUNT(i.id) as item_count
      FROM categories c
      JOIN items i ON i.category_id = c.id
      WHERE i.created_at > NOW() - INTERVAL '30 days'
      GROUP BY c.name
      ORDER BY item_count DESC
      LIMIT 5
    `

    const topCategoriesResult = await pool.query(topCategoriesQuery)

    const dashboardData = {
      counts: countsResult.rows[0],
      revenue: {
        data: revenueResult.rows,
        total: revenueResult.rows.reduce((sum, row) => sum + Number.parseFloat(row.revenue), 0),
      },
      topAds: topAdsResult.rows,
      userActivity: userActivityResult.rows,
      topCategories: topCategoriesResult.rows,
    }

    // Cache the result for 1 hour
    await redisClient.set("manager:dashboard:analytics", JSON.stringify(dashboardData), "EX", 3600)

    res.status(200).json(dashboardData)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/analytics/user-activity:
 *   get:
 *     summary: Get user activity analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: activityType
 *         schema:
 *           type: string
 *         description: Filter by activity type
 *     responses:
 *       200:
 *         description: User activity analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/user-activity", authenticateToken, isManager, analyticsRateLimiter, async (req, res, next) => {
  try {
    const { startDate, endDate, activityType } = req.query

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const end = endDate ? new Date(endDate) : new Date() // Default to today

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." })
    }

    // Build query conditions
    const conditions = ["created_at BETWEEN $1 AND $2"]
    const params = [start, end]
    let paramIndex = 3

    if (activityType) {
      conditions.push(`activity_type = $${paramIndex}`)
      params.push(activityType)
      paramIndex++
    }

    const whereClause = conditions.join(" AND ")

    // Get activity by day
    const activityByDayQuery = `
      SELECT 
        DATE_TRUNC('day', created_at)::date as date,
        activity_type,
        COUNT(*) as count
      FROM user_activity
      WHERE ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)::date, activity_type
      ORDER BY date, activity_type
    `

    const activityByDayResult = await pool.query(activityByDayQuery, params)

    // Get activity by type
    const activityByTypeQuery = `
      SELECT 
        activity_type,
        COUNT(*) as count
      FROM user_activity
      WHERE ${whereClause}
      GROUP BY activity_type
      ORDER BY count DESC
    `

    const activityByTypeResult = await pool.query(activityByTypeQuery, params)

    // Get top users
    const topUsersQuery = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(ua.id) as activity_count
      FROM users u
      JOIN user_activity ua ON ua.user_id = u.id
      WHERE ${whereClause}
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY activity_count DESC
      LIMIT 10
    `

    const topUsersResult = await pool.query(topUsersQuery, params)

    // Get activity by page
    const activityByPageQuery = `
      SELECT 
        page_url,
        COUNT(*) as count
      FROM user_activity
      WHERE ${whereClause} AND page_url IS NOT NULL
      GROUP BY page_url
      ORDER BY count DESC
      LIMIT 10
    `

    const activityByPageResult = await pool.query(activityByPageQuery, params)

    // Get activity by device
    const activityByDeviceQuery = `
      SELECT 
        device_info,
        COUNT(*) as count
      FROM user_activity
      WHERE ${whereClause} AND device_info IS NOT NULL
      GROUP BY device_info
      ORDER BY count DESC
      LIMIT 10
    `

    const activityByDeviceResult = await pool.query(activityByDeviceQuery, params)

    const activityData = {
      activityByDay: activityByDayResult.rows,
      activityByType: activityByTypeResult.rows,
      topUsers: topUsersResult.rows,
      activityByPage: activityByPageResult.rows,
      activityByDevice: activityByDeviceResult.rows,
      totalActivities: activityByTypeResult.rows.reduce((sum, row) => sum + Number.parseInt(row.count), 0),
    }

    res.status(200).json(activityData)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/analytics/ad-performance:
 *   get:
 *     summary: Get advertisement performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: placement
 *         schema:
 *           type: string
 *         description: Filter by ad placement
 *     responses:
 *       200:
 *         description: Advertisement performance analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/ad-performance", authenticateToken, isManager, analyticsRateLimiter, async (req, res, next) => {
  try {
    const { startDate, endDate, placement } = req.query

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const end = endDate ? new Date(endDate) : new Date() // Default to today

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." })
    }

    // Build query conditions
    const conditions = ["a.status = $1", "ua.created_at BETWEEN $2 AND $3"]
    const params = ["approved", start, end]
    let paramIndex = 4

    if (placement) {
      conditions.push(`a.placement = $${paramIndex}`)
      params.push(placement)
      paramIndex++
    }

    const whereClause = conditions.join(" AND ")

    // Get performance by day
    const performanceByDayQuery = `
      SELECT 
        DATE_TRUNC('day', ua.created_at)::date as date,
        COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) as impressions,
        COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END) as clicks,
        CASE 
          WHEN COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) > 0 
          THEN ROUND((COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END)::numeric / 
                      COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END)) * 100, 2)
          ELSE 0
        END as ctr
      FROM advertisements a
      JOIN user_activity ua ON ua.details->>'advertisement_id' = a.id::text
      WHERE ${whereClause}
      GROUP BY DATE_TRUNC('day', ua.created_at)::date
      ORDER BY date
    `

    const performanceByDayResult = await pool.query(performanceByDayQuery, params)

    // Get performance by placement
    const performanceByPlacementQuery = `
      SELECT 
        a.placement,
        COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) as impressions,
        COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END) as clicks,
        CASE 
          WHEN COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) > 0 
          THEN ROUND((COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END)::numeric / 
                      COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END)) * 100, 2)
          ELSE 0
        END as ctr
      FROM advertisements a
      JOIN user_activity ua ON ua.details->>'advertisement_id' = a.id::text
      WHERE ${whereClause}
      GROUP BY a.placement
      ORDER BY impressions DESC
    `

    const performanceByPlacementResult = await pool.query(performanceByPlacementQuery, params)

    // Get top performing ads
    const topAdsQuery = `
      SELECT 
        a.id,
        a.title,
        a.placement,
        COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) as impressions,
        COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END) as clicks,
        CASE 
          WHEN COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END) > 0 
          THEN ROUND((COUNT(CASE WHEN ua.activity_type = 'ad_click' THEN 1 END)::numeric / 
                      COUNT(CASE WHEN ua.activity_type = 'ad_impression' THEN 1 END)) * 100, 2)
          ELSE 0
        END as ctr
      FROM advertisements a
      JOIN user_activity ua ON ua.details->>'advertisement_id' = a.id::text
      WHERE ${whereClause}
      GROUP BY a.id, a.title, a.placement
      ORDER BY clicks DESC
      LIMIT 10
    `

    const topAdsResult = await pool.query(topAdsQuery, params)

    const adPerformanceData = {
      performanceByDay: performanceByDayResult.rows,
      performanceByPlacement: performanceByPlacementResult.rows,
      topAds: topAdsResult.rows,
      summary: {
        totalImpressions: performanceByPlacementResult.rows.reduce(
          (sum, row) => sum + Number.parseInt(row.impressions),
          0,
        ),
        totalClicks: performanceByPlacementResult.rows.reduce((sum, row) => sum + Number.parseInt(row.clicks), 0),
        averageCTR:
          performanceByPlacementResult.rows.length > 0
            ? (
                performanceByPlacementResult.rows.reduce((sum, row) => sum + Number.parseFloat(row.ctr), 0) /
                performanceByPlacementResult.rows.length
              ).toFixed(2)
            : 0,
      },
    }

    res.status(200).json(adPerformanceData)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *         description: Group results by time period
 *     responses:
 *       200:
 *         description: Revenue analytics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/revenue", authenticateToken, isManager, analyticsRateLimiter, async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const end = endDate ? new Date(endDate) : new Date() // Default to today

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." })
    }

    // Validate groupBy
    const validGroupBy = ["day", "week", "month"]
    if (!validGroupBy.includes(groupBy)) {
      return res.status(400).json({ message: "Invalid groupBy parameter. Use day, week, or month." })
    }

    // Determine date truncation based on groupBy
    let dateTrunc
    switch (groupBy) {
      case "week":
        dateTrunc = "week"
        break
      case "month":
        dateTrunc = "month"
        break
      default:
        dateTrunc = "day"
    }

    // Get revenue by time period
    const revenueByPeriodQuery = `
      SELECT 
        DATE_TRUNC('${dateTrunc}', created_at)::date as period,
        SUM(amount) as revenue,
        COUNT(*) as payment_count
      FROM payments
      WHERE status = 'completed'
      AND created_at BETWEEN $1 AND $2
      GROUP BY DATE_TRUNC('${dateTrunc}', created_at)::date
      ORDER BY period
    `

    const revenueByPeriodResult = await pool.query(revenueByPeriodQuery, [start, end])

    // Get revenue by payment method
    const revenueByMethodQuery = `
      SELECT 
        payment_method,
        SUM(amount) as revenue,
        COUNT(*) as payment_count
      FROM payments
      WHERE status = 'completed'
      AND created_at BETWEEN $1 AND $2
      GROUP BY payment_method
      ORDER BY revenue DESC
    `

    const revenueByMethodResult = await pool.query(revenueByMethodQuery, [start, end])

    // Get top paying users
    const topPayingUsersQuery = `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        SUM(p.amount) as total_spent,
        COUNT(p.id) as payment_count
      FROM users u
      JOIN payments p ON p.user_id = u.id
      WHERE p.status = 'completed'
      AND p.created_at BETWEEN $1 AND $2
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY total_spent DESC
      LIMIT 10
    `

    const topPayingUsersResult = await pool.query(topPayingUsersQuery, [start, end])

    // Get revenue by ad placement
    const revenueByPlacementQuery = `
      SELECT 
        a.placement,
        SUM(p.amount) as revenue,
        COUNT(p.id) as payment_count
      FROM payments p
      JOIN advertisements a ON p.advertisement_id = a.id
      WHERE p.status = 'completed'
      AND p.created_at BETWEEN $1 AND $2
      GROUP BY a.placement
      ORDER BY revenue DESC
    `

    const revenueByPlacementResult = await pool.query(revenueByPlacementQuery, [start, end])

    const revenueData = {
      revenueByPeriod: revenueByPeriodResult.rows,
      revenueByMethod: revenueByMethodResult.rows,
      topPayingUsers: topPayingUsersResult.rows,
      revenueByPlacement: revenueByPlacementResult.rows,
      summary: {
        totalRevenue: revenueByPeriodResult.rows.reduce((sum, row) => sum + Number.parseFloat(row.revenue), 0),
        totalPayments: revenueByPeriodResult.rows.reduce((sum, row) => sum + Number.parseInt(row.payment_count), 0),
        averagePayment:
          revenueByPeriodResult.rows.length > 0
            ? (
                revenueByPeriodResult.rows.reduce((sum, row) => sum + Number.parseFloat(row.revenue), 0) /
                revenueByPeriodResult.rows.reduce((sum, row) => sum + Number.parseInt(row.payment_count), 0)
              ).toFixed(2)
            : 0,
      },
    }

    res.status(200).json(revenueData)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/analytics/export:
 *   post:
 *     summary: Export analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportType
 *               - format
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [user-activity, ad-performance, revenue]
 *               format:
 *                 type: string
 *                 enum: [pdf, csv]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               filters:
 *                 type: object
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.post("/export", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { reportType, format, startDate, endDate, filters } = req.body

    // Validate required fields
    if (!reportType || !format) {
      return res.status(400).json({ message: "Report type and format are required" })
    }

    // Validate report type
    const validReportTypes = ["user-activity", "ad-performance", "revenue"]
    if (!validReportTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid report type" })
    }

    // Validate format
    const validFormats = ["pdf", "csv"]
    if (!validFormats.includes(format)) {
      return res.status(400).json({ message: "Invalid format. Use pdf or csv." })
    }

    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    const end = endDate ? new Date(endDate) : new Date() // Default to today

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." })
    }

    // Generate report title
    const reportTitle = `${reportType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Report`

    // Get report data based on type
    let reportData
    switch (reportType) {
      case "user-activity":
        // Fetch user activity data
        reportData = await getUserActivityData(start, end, filters)
        break
      case "ad-performance":
        // Fetch ad performance data
        reportData = await getAdPerformanceData(start, end, filters)
        break
      case "revenue":
        // Fetch revenue data
        reportData = await getRevenueData(start, end, filters)
        break
    }

    // Generate report file
    let reportFile
    let mimeType

    if (format === "pdf") {
      reportFile = await generatePDF(reportTitle, reportData, start, end)
      mimeType = "application/pdf"
    } else {
      reportFile = await generateCSV(reportData)
      mimeType = "text/csv"
    }

    // Save report to database
    const reportResult = await pool.query(
      `INSERT INTO reports (title, description, report_type, data, created_by, date_range_start, date_range_end)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        reportTitle,
        `${reportType} report from ${start.toISOString().split("T")[0]} to ${end.toISOString().split("T")[0]}`,
        reportType,
        JSON.stringify(reportData),
        req.user.id,
        start,
        end,
      ],
    )

    const reportId = reportResult.rows[0].id

    // Log the action
    await createAuditLog({
      action: "REPORT_GENERATED",
      userId: req.user.id,
      details: {
        reportId,
        reportType,
        format,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    })

    // Send the file
    res.setHeader("Content-Type", mimeType)
    res.setHeader("Content-Disposition", `attachment; filename=${reportType}-report-${Date.now()}.${format}`)
    res.send(reportFile)
  } catch (error) {
    next(error)
  }
})

// Helper functions for report data
async function getUserActivityData(start, end, filters) {
  // Implementation details omitted for brevity
  // This would fetch the user activity data from the database
  return {
    /* user activity data */
  }
}

async function getAdPerformanceData(start, end, filters) {
  // Implementation details omitted for brevity
  // This would fetch the ad performance data from the database
  return {
    /* ad performance data */
  }
}

async function getRevenueData(start, end, filters) {
  // Implementation details omitted for brevity
  // This would fetch the revenue data from the database
  return {
    /* revenue data */
  }
}

export default router

