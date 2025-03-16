import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import { isManager } from "../middleware/auth.js"
import { pool } from "../db/config.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiter for notification operations
const notificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

/**
 * @swagger
 * /api/manager/notifications:
 *   get:
 *     summary: Get manager notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/", authenticateToken, isManager, notificationRateLimiter, async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 10 } = req.query

    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = ["user_id = $1"]
    const params = [req.user.id]
    let paramIndex = 2

    if (isRead !== undefined) {
      conditions.push(`is_read = $${paramIndex}`)
      params.push(isRead === "true")
      paramIndex++
    }

    const whereClause = conditions.join(" AND ")

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM manager_notifications
      WHERE ${whereClause}
    `

    const countResult = await pool.query(countQuery, params)
    const totalItems = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get notifications
    const query = `
      SELECT * 
      FROM manager_notifications
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)

    const result = await pool.query(query, params)

    // Get unread count
    const unreadCountQuery = `
      SELECT COUNT(*) 
      FROM manager_notifications
      WHERE user_id = $1 AND is_read = false
    `

    const unreadCountResult = await pool.query(unreadCountQuery, [req.user.id])
    const unreadCount = Number.parseInt(unreadCountResult.rows[0].count)

    res.status(200).json({
      notifications: result.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: Number.parseInt(page),
        itemsPerPage: Number.parseInt(limit),
      },
      unreadCount,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/notifications/{id}/read:
 *   post:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Notification not found
 */
router.post("/:id/read", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if notification exists and belongs to the user
    const notificationResult = await pool.query("SELECT * FROM manager_notifications WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ])

    if (notificationResult.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" })
    }

    // Update notification
    await pool.query("UPDATE manager_notifications SET is_read = true WHERE id = $1", [id])

    res.status(200).json({ message: "Notification marked as read" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/notifications/read-all:
 *   post:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.post("/read-all", authenticateToken, isManager, async (req, res, next) => {
  try {
    // Update all unread notifications for the user
    const result = await pool.query(
      "UPDATE manager_notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING id",
      [req.user.id],
    )

    const count = result.rowCount

    res.status(200).json({
      message: "All notifications marked as read",
      count,
    })
  } catch (error) {
    next(error)
  }
})

export default router

