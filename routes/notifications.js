import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Filter by unread notifications only
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = ["user_id = $1"]
    const params = [req.user.id]
    const paramIndex = 2

    if (unreadOnly === "true") {
      conditions.push(`is_read = false`)
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM notifications ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalNotifications = Number.parseInt(countResult.rows[0].count)

    // Get notifications with pagination
    const query = `
      SELECT *
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    // Get unread count
    const unreadCountQuery = `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`
    const unreadCountResult = await pool.query(unreadCountQuery, [req.user.id])
    const unreadCount = Number.parseInt(unreadCountResult.rows[0].count)

    res.status(200).json({
      notifications: result.rows.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.is_read,
        createdAt: notification.created_at,
      })),
      unreadCount,
      pagination: {
        total: totalNotifications,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalNotifications / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
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
 *       404:
 *         description: Notification not found
 */
router.patch("/:id/read", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if notification exists and belongs to user
    const notificationExists = await pool.query("SELECT * FROM notifications WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ])

    if (notificationExists.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found or you do not have permission to update it" })
    }

    // Mark notification as read
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [id])

    res.status(200).json({ message: "Notification marked as read" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/notifications/mark-all-read:
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
 */
router.post("/mark-all-read", authenticateToken, async (req, res, next) => {
  try {
    // Mark all notifications as read
    await pool.query("UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false", [req.user.id])

    res.status(200).json({ message: "All notifications marked as read" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send notification to user (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post("/send", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body

    // Validate input
    if (!userId || !title || !message) {
      return res.status(400).json({ message: "User ID, title, and message are required" })
    }

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [userId])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Create notification
    const result = await pool.query(
      "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, title, message, type],
    )

    const notification = result.rows[0]

    res.status(201).json({
      message: "Notification sent successfully",
      notification: {
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.is_read,
        createdAt: notification.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/notifications/broadcast:
 *   post:
 *     summary: Send notification to all users (admin only)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *     responses:
 *       201:
 *         description: Notification broadcast successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/broadcast", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { title, message, type, role } = req.body

    // Validate input
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" })
    }

    // Build query conditions for users
    const conditions = []
    const params = []
    let paramIndex = 1

    if (role) {
      conditions.push(`role = $${paramIndex}`)
      params.push(role)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get users
    const usersQuery = `SELECT id FROM users ${whereClause}`
    const usersResult = await pool.query(usersQuery, params)

    // Create notifications for all users
    const notifications = []
    for (const user of usersResult.rows) {
      const result = await pool.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.id, title, message, type],
      )

      notifications.push(result.rows[0])
    }

    res.status(201).json({
      message: `Notification broadcast to ${notifications.length} users successfully`,
      notificationCount: notifications.length,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
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
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if notification exists and belongs to user
    const notificationExists = await pool.query("SELECT * FROM notifications WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ])

    if (notificationExists.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found or you do not have permission to delete it" })
    }

    // Delete notification
    await pool.query("DELETE FROM notifications WHERE id = $1", [id])

    res.status(200).json({ message: "Notification deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router

