import express from "express"
import { authenticateToken, isAdminOrManager } from "../middleware/auth.js"
import { pool } from "../db/config.js"
import { redisClient } from "../server.js"
import { apiRateLimiter } from "../middleware/rateLimiter.js"

const router = express.Router()

// Apply rate limiting to all dashboard routes
router.use(apiRateLimiter)

// Get dashboard summary data
router.get("/summary", authenticateToken, isAdminOrManager, async (req, res) => {
  try {
    const cacheKey = `dashboard:summary:${req.user.role}:${req.user.id}`

    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }

    // Get user count
    const userCountQuery = await pool.query("SELECT COUNT(*) FROM users WHERE is_active = true")
    const userCount = Number.parseInt(userCountQuery.rows[0].count)

    // Get item count
    const itemCountQuery = await pool.query("SELECT COUNT(*) FROM items")
    const itemCount = Number.parseInt(itemCountQuery.rows[0].count)

    // Get pending items count
    const pendingItemsQuery = await pool.query("SELECT COUNT(*) FROM items WHERE status = 'pending'")
    const pendingItemsCount = Number.parseInt(pendingItemsQuery.rows[0].count)

    // Get recent activity
    const recentActivityQuery = await pool.query(`
      SELECT a.id, a.action, a.created_at, a.details, u.first_name, u.last_name, u.email
      FROM audit_logs a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `)

    // Get statistics based on role
    let statistics = {}

    if (req.user.role === "admin") {
      // Admin-specific statistics
      const newUsersQuery = await pool.query(`
        SELECT COUNT(*) FROM users 
        WHERE created_at > NOW() - INTERVAL '7 days'
      `)

      const reportedItemsQuery = await pool.query(`
        SELECT COUNT(*) FROM reports 
        WHERE created_at > NOW() - INTERVAL '30 days'
      `)

      statistics = {
        newUsers: Number.parseInt(newUsersQuery.rows[0].count),
        reportedItems: Number.parseInt(reportedItemsQuery.rows[0].count),
        activeTemplates: 0, // Placeholder, replace with actual query
        averageResponseTime: 0, // Placeholder, replace with actual query
      }
    } else {
      // Manager-specific statistics
      const pendingAdsQuery = await pool.query(`
        SELECT COUNT(*) FROM advertisements 
        WHERE status = 'pending'
      `)

      const pendingPaymentsQuery = await pool.query(`
        SELECT COUNT(*) FROM payments 
        WHERE status = 'pending'
      `)

      statistics = {
        pendingAds: Number.parseInt(pendingAdsQuery.rows[0].count),
        pendingPayments: Number.parseInt(pendingPaymentsQuery.rows[0].count),
        totalRevenue: 0, // Placeholder, replace with actual query
        activePromotions: 0, // Placeholder, replace with actual query
      }
    }

    const data = {
      counts: {
        users: userCount,
        items: itemCount,
        pendingItems: pendingItemsCount,
      },
      recentActivity: recentActivityQuery.rows,
      statistics,
    }

    // Cache the result for 5 minutes
    await redisClient.set(cacheKey, JSON.stringify(data), "EX", 300)

    res.json(data)
  } catch (error) {
    console.error("Error fetching dashboard summary:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get user activity chart data
router.get("/charts/user-activity", authenticateToken, isAdminOrManager, async (req, res) => {
  try {
    const { period = "week" } = req.query
    const cacheKey = `dashboard:charts:user-activity:${period}:${req.user.role}`

    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }

    let timeFormat
    let groupBy
    let days

    switch (period) {
      case "day":
        timeFormat = "YYYY-MM-DD HH24"
        groupBy = "hour"
        days = 1
        break
      case "week":
        timeFormat = "YYYY-MM-DD"
        groupBy = "day"
        days = 7
        break
      case "month":
        timeFormat = "YYYY-MM-DD"
        groupBy = "day"
        days = 30
        break
      case "year":
        timeFormat = "YYYY-MM"
        groupBy = "month"
        days = 365
        break
      default:
        timeFormat = "YYYY-MM-DD"
        groupBy = "day"
        days = 7
    }

    const query = `
      SELECT 
        TO_CHAR(created_at, '${timeFormat}') as time_period,
        COUNT(*) as count
      FROM user_activity
      WHERE created_at > NOW() - INTERVAL '${days} days'
      GROUP BY time_period
      ORDER BY time_period
    `

    const result = await pool.query(query)

    const data = {
      labels: result.rows.map((row) => row.time_period),
      datasets: [
        {
          label: "User Activity",
          data: result.rows.map((row) => Number.parseInt(row.count)),
        },
      ],
    }

    // Cache the result for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(data), "EX", 3600)

    res.json(data)
  } catch (error) {
    console.error("Error fetching user activity chart data:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get item statistics chart data
router.get("/charts/items", authenticateToken, isAdminOrManager, async (req, res) => {
  try {
    const cacheKey = `dashboard:charts:items:${req.user.role}`

    // Try to get from cache first
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.json(JSON.parse(cachedData))
    }

    const query = `
      SELECT 
        status,
        COUNT(*) as count
      FROM items
      GROUP BY status
    `

    const result = await pool.query(query)

    const data = {
      labels: result.rows.map((row) => row.status),
      datasets: [
        {
          label: "Items by Status",
          data: result.rows.map((row) => Number.parseInt(row.count)),
        },
      ],
    }

    // Cache the result for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(data), "EX", 3600)

    res.json(data)
  } catch (error) {
    console.error("Error fetching item statistics chart data:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

export default router

