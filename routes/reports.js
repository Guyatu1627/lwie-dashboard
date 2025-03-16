import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdminOrManager } from "../middleware/auth.js"

const router = express.Router()

// Get all reports
router.get("/", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = ["created_by = $1"]
    const params = [req.user.id]
    let paramIndex = 2

    if (type) {
      conditions.push(`type = $${paramIndex}`)
      params.push(type)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM reports ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalReports = Number.parseInt(countResult.rows[0].count)

    // Get reports with pagination
    const query = `
      SELECT *
      FROM reports
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      reports: result.rows.map((report) => ({
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      })),
      pagination: {
        total: totalReports,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalReports / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

// Get report by ID
router.get("/:id", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Get report
    const result = await pool.query("SELECT * FROM reports WHERE id = $1 AND created_by = $2", [id, req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Report not found or you do not have permission to view it" })
    }

    const report = result.rows[0]

    res.status(200).json({
      report: {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Generate user activity report
router.post("/user-activity", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { name, startDate, endDate, userId } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Report name is required" })
    }

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (userId) {
      conditions.push(`user_id = $${paramIndex}`)
      params.push(userId)
      paramIndex++
    }

    if (startDate) {
      conditions.push(`created_at >= $${paramIndex}`)
      params.push(new Date(startDate))
      paramIndex++
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramIndex}`)
      params.push(new Date(endDate))
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get user activity data
    const sessionsQuery = `
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as session_count
      FROM sessions
      ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `

    const sessionsResult = await pool.query(sessionsQuery, params)

    // Get user items data
    const itemsQuery = `
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as item_count
      FROM items
      ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `

    const itemsResult = await pool.query(itemsQuery, params)

    // Get user transactions data
    const transactionsQuery = `
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as transaction_count
      FROM transactions
      ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `

    const transactionsResult = await pool.query(transactionsQuery, params)

    // Prepare report results
    const results = {
      sessions: sessionsResult.rows.map((row) => ({
        day: row.day,
        sessionCount: Number.parseInt(row.session_count),
      })),
      items: itemsResult.rows.map((row) => ({
        day: row.day,
        itemCount: Number.parseInt(row.item_count),
      })),
      transactions: transactionsResult.rows.map((row) => ({
        day: row.day,
        transactionCount: Number.parseInt(row.transaction_count),
      })),
    }

    // Save report
    const reportResult = await pool.query(
      `INSERT INTO reports (name, type, parameters, results, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, "user_activity", { startDate, endDate, userId }, results, req.user.id],
    )

    const report = reportResult.rows[0]

    res.status(201).json({
      message: "User activity report generated successfully",
      report: {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Generate revenue report
router.post("/revenue", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { name, startDate, endDate, groupBy = "day" } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Report name is required" })
    }

    // Validate groupBy
    if (!["day", "week", "month"].includes(groupBy)) {
      return res.status(400).json({ message: "Invalid groupBy. Must be day, week, or month." })
    }

    // Build query conditions
    const conditions = ["status = 'completed'"]
    const params = []
    let paramIndex = 1

    if (startDate) {
      conditions.push(`created_at >= $${paramIndex}`)
      params.push(new Date(startDate))
      paramIndex++
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramIndex}`)
      params.push(new Date(endDate))
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get revenue data
    const revenueQuery = `
      SELECT 
        DATE_TRUNC('${groupBy}', created_at) as period,
        SUM(amount) as total_amount,
        COUNT(*) as payment_count
      FROM payments
      ${whereClause}
      GROUP BY DATE_TRUNC('${groupBy}', created_at)
      ORDER BY period
    `

    const revenueResult = await pool.query(revenueQuery, params)

    // Get revenue by payment method
    const revenueByMethodQuery = `
      SELECT 
        payment_method,
        SUM(amount) as total_amount,
        COUNT(*) as payment_count
      FROM payments
      ${whereClause}
      GROUP BY payment_method
      ORDER BY total_amount DESC
    `

    const revenueByMethodResult = await pool.query(revenueByMethodQuery, params)

    // Prepare report results
    const results = {
      revenueByPeriod: revenueResult.rows.map((row) => ({
        period: row.period,
        totalAmount: Number.parseFloat(row.total_amount),
        paymentCount: Number.parseInt(row.payment_count),
      })),
      revenueByMethod: revenueByMethodResult.rows.map((row) => ({
        paymentMethod: row.payment_method,
        totalAmount: Number.parseFloat(row.total_amount),
        paymentCount: Number.parseInt(row.payment_count),
      })),
      summary: {
        totalRevenue: revenueResult.rows.reduce((sum, row) => sum + Number.parseFloat(row.total_amount), 0),
        totalPayments: revenueResult.rows.reduce((sum, row) => sum + Number.parseInt(row.payment_count), 0),
      },
    }

    // Save report
    const reportResult = await pool.query(
      `INSERT INTO reports (name, type, parameters, results, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, "revenue", { startDate, endDate, groupBy }, results, req.user.id],
    )

    const report = reportResult.rows[0]

    res.status(201).json({
      message: "Revenue report generated successfully",
      report: {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Generate content report
router.post("/content", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { name, startDate, endDate, categoryId } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Report name is required" })
    }

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (categoryId) {
      conditions.push(`category_id = $${paramIndex}`)
      params.push(categoryId)
      paramIndex++
    }

    if (startDate) {
      conditions.push(`created_at >= $${paramIndex}`)
      params.push(new Date(startDate))
      paramIndex++
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramIndex}`)
      params.push(new Date(endDate))
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get content data by status
    const contentByStatusQuery = `
      SELECT 
        status,
        COUNT(*) as item_count
      FROM items
      ${whereClause}
      GROUP BY status
      ORDER BY item_count DESC
    `

    const contentByStatusResult = await pool.query(contentByStatusQuery, params)

    // Get content data by category
    const contentByCategoryQuery = `
      SELECT 
        c.name as category_name,
        COUNT(i.id) as item_count
      FROM items i
      JOIN categories c ON i.category_id = c.id
      ${whereClause}
      GROUP BY c.name
      ORDER BY item_count DESC
    `

    const contentByCategoryResult = await pool.query(contentByCategoryQuery, params)

    // Get content growth over time
    const contentGrowthQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as item_count
      FROM items
      ${whereClause}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `

    const contentGrowthResult = await pool.query(contentGrowthQuery, params)

    // Prepare report results
    const results = {
      contentByStatus: contentByStatusResult.rows.map((row) => ({
        status: row.status,
        itemCount: Number.parseInt(row.item_count),
      })),
      contentByCategory: contentByCategoryResult.rows.map((row) => ({
        categoryName: row.category_name,
        itemCount: Number.parseInt(row.item_count),
      })),
      contentGrowth: contentGrowthResult.rows.map((row) => ({
        month: row.month,
        itemCount: Number.parseInt(row.item_count),
      })),
      summary: {
        totalItems: contentByStatusResult.rows.reduce((sum, row) => sum + Number.parseInt(row.item_count), 0),
      },
    }

    // Save report
    const reportResult = await pool.query(
      `INSERT INTO reports (name, type, parameters, results, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, "content", { startDate, endDate, categoryId }, results, req.user.id],
    )

    const report = reportResult.rows[0]

    res.status(201).json({
      message: "Content report generated successfully",
      report: {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Generate platform performance report
router.post("/platform-performance", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { name, startDate, endDate, period = "30days" } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Report name is required" })
    }

    let interval
    let groupBy

    switch (period) {
      case "7days":
        interval = "7 days"
        groupBy = "day"
        break
      case "30days":
        interval = "30 days"
        groupBy = "day"
        break
      case "90days":
        interval = "90 days"
        groupBy = "week"
        break
      case "1year":
        interval = "1 year"
        groupBy = "month"
        break
      default:
        interval = "30 days"
        groupBy = "day"
    }

    // Build date range condition
    let dateRangeCondition = ""
    let params = []

    if (startDate && endDate) {
      dateRangeCondition = "WHERE created_at BETWEEN $1 AND $2"
      params = [new Date(startDate), new Date(endDate)]
    } else {
      dateRangeCondition = `WHERE created_at > NOW() - INTERVAL '${interval}'`
    }

    // Get user growth
    const userGrowthQuery = `
      SELECT 
        DATE_TRUNC('${groupBy}', created_at) as time_period,
        COUNT(*) as count
      FROM users
      ${dateRangeCondition}
      GROUP BY DATE_TRUNC('${groupBy}', created_at)
      ORDER BY time_period
    `

    const userGrowthResult = await pool.query(userGrowthQuery, params)

    // Get item growth
    const itemGrowthQuery = `
      SELECT 
        DATE_TRUNC('${groupBy}', created_at) as time_period,
        COUNT(*) as count
      FROM items
      ${dateRangeCondition}
      GROUP BY DATE_TRUNC('${groupBy}', created_at)
      ORDER BY time_period
    `

    const itemGrowthResult = await pool.query(itemGrowthQuery, params)

    // Get transaction growth
    const transactionGrowthQuery = `
      SELECT 
        DATE_TRUNC('${groupBy}', created_at) as time_period,
        COUNT(*) as count
      FROM transactions
      ${dateRangeCondition}
      GROUP BY DATE_TRUNC('${groupBy}', created_at)
      ORDER BY time_period
    `

    const transactionGrowthResult = await pool.query(transactionGrowthQuery, params)

    // Get session data
    const sessionQuery = `
      SELECT 
        DATE_TRUNC('${groupBy}', created_at) as time_period,
        COUNT(*) as count
      FROM sessions
      ${dateRangeCondition}
      GROUP BY DATE_TRUNC('${groupBy}', created_at)
      ORDER BY time_period
    `

    const sessionResult = await pool.query(sessionQuery, params)

    // Prepare report results
    const results = {
      userGrowth: userGrowthResult.rows.map((row) => ({
        timePeriod: row.time_period,
        count: Number.parseInt(row.count),
      })),
      itemGrowth: itemGrowthResult.rows.map((row) => ({
        timePeriod: row.time_period,
        count: Number.parseInt(row.count),
      })),
      transactionGrowth: transactionGrowthResult.rows.map((row) => ({
        timePeriod: row.time_period,
        count: Number.parseInt(row.count),
      })),
      sessionData: sessionResult.rows.map((row) => ({
        timePeriod: row.time_period,
        count: Number.parseInt(row.count),
      })),
      summary: {
        totalUsers: userGrowthResult.rows.reduce((sum, row) => sum + Number.parseInt(row.count), 0),
        totalItems: itemGrowthResult.rows.reduce((sum, row) => sum + Number.parseInt(row.count), 0),
        totalTransactions: transactionGrowthResult.rows.reduce((sum, row) => sum + Number.parseInt(row.count), 0),
        totalSessions: sessionResult.rows.reduce((sum, row) => sum + Number.parseInt(row.count), 0),
      },
    }

    // Save report
    const reportResult = await pool.query(
      `INSERT INTO reports (name, type, parameters, results, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, "platform_performance", { startDate, endDate, period }, results, req.user.id],
    )

    const report = reportResult.rows[0]

    res.status(201).json({
      message: "Platform performance report generated successfully",
      report: {
        id: report.id,
        name: report.name,
        type: report.type,
        parameters: report.parameters,
        results: report.results,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Delete report
router.delete("/:id", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if report exists and belongs to user
    const reportExists = await pool.query("SELECT * FROM reports WHERE id = $1 AND created_by = $2", [id, req.user.id])

    if (reportExists.rows.length === 0) {
      return res.status(404).json({ message: "Report not found or you do not have permission to delete it" })
    }

    // Delete report
    await pool.query("DELETE FROM reports WHERE id = $1", [id])

    res.status(200).json({ message: "Report deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router

