import express from "express"
import { authenticateToken, isAdmin } from "../middleware/auth.js"
import { getAuditLogs } from "../utils/auditLogger.js"
import { pool } from "../db.js" // Import the pool

const router = express.Router()

/**
 * @swagger
 * /api/audit/logs:
 *   get:
 *     summary: Get audit logs (admin only)
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
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
 *     responses:
 *       200:
 *         description: List of audit logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/logs", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { userId, action, startDate, endDate, page = 1, limit = 20 } = req.query

    const logs = await getAuditLogs({
      userId: userId ? Number.parseInt(userId) : null,
      action,
      startDate,
      endDate,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json(logs)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/audit/actions:
 *   get:
 *     summary: Get available audit log action types (admin only)
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of action types
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/actions", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    // Get distinct action types from audit logs
    const result = await pool.query("SELECT DISTINCT action FROM audit_logs ORDER BY action")

    const actions = result.rows.map((row) => row.action)

    res.status(200).json({ actions })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/audit/user/{userId}:
 *   get:
 *     summary: Get audit logs for a specific user (admin only)
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *     responses:
 *       200:
 *         description: List of audit logs for the user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/user/:userId", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20 } = req.query

    const logs = await getAuditLogs({
      userId: Number.parseInt(userId),
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
    })

    res.status(200).json(logs)
  } catch (error) {
    next(error)
  }
})

export default router

