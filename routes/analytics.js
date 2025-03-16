import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdminOrManager } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard analytics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/dashboard", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    // Get total users
    const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users")
    const totalUsers = Number.parseInt(totalUsersResult.rows[0].count)

    // Get active users (users who have logged in within the last 30 days)
    const activeUsersResult = await pool.query(
      "SELECT COUNT(DISTINCT user_id) FROM sessions WHERE created_at > NOW() - INTERVAL '30 days'",
    )
    const activeUsers = Number.parseInt(activeUsersResult.rows[0].count)

    // Get total items
    const totalItemsResult = await pool.query("SELECT COUNT(*) FROM items")
    const totalItems = Number.parseInt(totalItemsResult.rows[0].count)

    // Get active items
    const activeItemsResult = await pool.query("SELECT COUNT(*) FROM items WHERE status = 'active'")
    const activeItems = Number.parseInt(activeItemsResult.rows[0].count)

    // Get total transactions
    const totalTransactionsResult = await pool.query("SELECT COUNT(*) FROM transactions")
    const totalTransactions = Number.parseInt(totalTransactionsResult.rows[0].count)

    // Get completed transactions
    const completedTransactionsResult = await pool.query("SELECT COUNT(*) FROM transactions WHERE status = 'completed'")
    const completedTransactions = Number.parseInt(completedTransactionsResult.rows[0].count)

    // Get pending items for moderation
    const pendingItemsResult = await pool.query("SELECT COUNT(*) FROM items WHERE status = 'pending'")
    const pendingItems = Number.parseInt(pendingItemsResult.rows[0].count)

    // Get recent user growth (last 6 months)
    const userGrowthResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_users
      FROM users
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `)

    // Get recent item growth (last 6 months)
    const itemGrowthResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_items
      FROM items
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `)

    // Get category distribution
    const categoryDistributionResult = await pool.query(`
      SELECT 
        c.name as category_name,
        COUNT(i.id) as item_count
      FROM items i
      JOIN categories c ON i.category_id = c.id
      GROUP BY c.name
      ORDER BY item_count DESC
      LIMIT 10
    `)

    res.status(200).json({
      overview: {
        totalUsers,
        activeUsers,
        totalItems,
        activeItems,
        totalTransactions,
        completedTransactions,
        pendingItems,
      },
      userGrowth: userGrowthResult.rows.map((row) => ({
        month: row.month,
        newUsers: Number.parseInt(row.new_users),
      })),
      itemGrowth: itemGrowthResult.rows.map((row) => ({
        month: row.month,
        newItems: Number.parseInt(row.new_items),
      })),
      categoryDistribution: categoryDistributionResult.rows.map((row) => ({
        categoryName: row.category_name,
        itemCount: Number.parseInt(row.item_count),
      })),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/analytics/user-activity:
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
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *     responses:
 *       200:
 *         description: User activity analytics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/user-activity", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    // Build query conditions
    const conditions = []
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

    // Get daily active users
    const dailyActiveUsersResult = await pool.query(
      `
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(DISTINCT user_id) as active_users
      FROM sessions
      ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `,
      params,
    )

    // Get most active users
    const mostActiveUsersResult = await pool.query(
      `
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(s.id) as session_count
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      ${whereClause}
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY session_count DESC
      LIMIT 10
    `,
      params,
    )

    // Get user engagement by hour
    const userEngagementByHourResult = await pool.query(
      `
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(DISTINCT user_id) as active_users
      FROM sessions
      ${whereClause}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `,
      params,
    )

    res.status(200).json({
      dailyActiveUsers: dailyActiveUsersResult.rows.map((row) => ({
        day: row.day,
        activeUsers: Number.parseInt(row.active_users),
      })),
      mostActiveUsers: mostActiveUsersResult.rows.map((row) => ({
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        sessionCount: Number.parseInt(row.session_count),
      })),
      userEngagementByHour: userEngagementByHourResult.rows.map((row) => ({
        hour: Number.parseInt(row.hour),
        activeUsers: Number.parseInt(row.active_users),
      })),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/analytics/content:
 *   get:
 *     summary: Get content analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *     responses:
 *       200:
 *         description: Content analytics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/content", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    // Build query conditions
    const conditions = []
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

    // Get content by status
    const contentByStatusResult = await pool.query(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM items
      ${whereClause}
      GROUP BY status
    `,
      params,
    )

    // Get content by category
    const contentByCategoryResult = await pool.query(
      `
      SELECT 
        c.name as category_name,
        COUNT(i.id) as count
      FROM items i
      JOIN categories c ON i.category_id = c.id
      ${whereClause ? whereClause.replace("WHERE", "WHERE i.") : ""}
      GROUP BY c.name
      ORDER BY count DESC
    `,
      params,
    )

    // Get content creation over time
    const contentCreationResult = await pool.query(
      `
      SELECT 
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as count
      FROM items
      ${whereClause}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY day
    `,
      params,
    )

    res.status(200).json({
      contentByStatus: contentByStatusResult.rows.map((row) => ({
        status: row.status,
        count: Number.parseInt(row.count),
      })),
      contentByCategory: contentByCategoryResult.rows.map((row) => ({
        categoryName: row.category_name,
        count: Number.parseInt(row.count),
      })),
      contentCreation: contentCreationResult.rows.map((row) => ({
        day: row.day,
        count: Number.parseInt(row.count),
      })),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/analytics/geographical:
 *   get:
 *     summary: Get geographical distribution
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Geographical distribution
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/geographical", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    // Get user distribution by location
    const userDistributionResult = await pool.query(`
      SELECT 
        location,
        COUNT(*) as user_count
      FROM users
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY user_count DESC
      LIMIT 20
    `)

    // Get item distribution by location
    const itemDistributionResult = await pool.query(`
      SELECT 
        location,
        COUNT(*) as item_count
      FROM items
      WHERE location IS NOT NULL
      GROUP BY location
      ORDER BY item_count DESC
      LIMIT 20
    `)

    res.status(200).json({
      userDistribution: userDistributionResult.rows.map((row) => ({
        location: row.location,
        userCount: Number.parseInt(row.user_count),
      })),
      itemDistribution: itemDistributionResult.rows.map((row) => ({
        location: row.location,
        itemCount: Number.parseInt(row.item_count),
      })),
    })
  } catch (error) {
    next(error)
  }
})

export default router

