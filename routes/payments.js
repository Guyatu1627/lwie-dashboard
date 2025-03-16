import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import { isManager } from "../middleware/auth.js"
import { pool } from "../db/config.js"
import { redisClient } from "../server.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { sendNotification } from "../utils/notificationService.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiter for payment operations
const paymentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

/**
 * @swagger
 * /api/manager/payments:
 *   get:
 *     summary: Get all payments with filtering and pagination
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *         description: Filter by payment status
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
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of payments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/", authenticateToken, isManager, paymentRateLimiter, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = "created_at", order = "desc", search = "" } = req.query

    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (status) {
      conditions.push(`p.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (search) {
      conditions.push(
        `(p.transaction_id ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR a.title ILIKE $${paramIndex})`,
      )
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Validate sort field to prevent SQL injection
    const validSortFields = ["created_at", "amount", "status", "payment_method"]
    const sortField = validSortFields.includes(sort) ? sort : "created_at"

    // Validate order
    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC"

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN advertisements a ON p.advertisement_id = a.id
      ${whereClause}
    `

    const countResult = await pool.query(countQuery, params)
    const totalItems = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get payments with user and advertisement info
    const query = `
      SELECT 
        p.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        a.title as advertisement_title,
        a.status as advertisement_status,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = p.verified_by) as verified_by_name
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN advertisements a ON p.advertisement_id = a.id
      ${whereClause}
      ORDER BY p.${sortField} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)

    const result = await pool.query(query, params)

    res.status(200).json({
      payments: result.rows,
      pagination: {
        totalItems,
        totalPages,
        currentPage: Number.parseInt(page),
        itemsPerPage: Number.parseInt(limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Payment not found
 */
router.get("/:id", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Try to get from cache first
    const cachedPayment = await redisClient.get(`payment:${id}`)
    if (cachedPayment) {
      return res.status(200).json(JSON.parse(cachedPayment))
    }

    // Get payment with user and advertisement info
    const query = `
      SELECT 
        p.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.phone as user_phone,
        a.title as advertisement_title,
        a.status as advertisement_status,
        a.id as advertisement_id,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = p.verified_by) as verified_by_name
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN advertisements a ON p.advertisement_id = a.id
      WHERE p.id = $1
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" })
    }

    const payment = result.rows[0]

    // Cache the result for 5 minutes
    await redisClient.set(`payment:${id}`, JSON.stringify(payment), "EX", 300)

    res.status(200).json(payment)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/payments/{id}/verify:
 *   post:
 *     summary: Verify a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Payment not found
 */
router.post("/:id/verify", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Start a transaction
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Get payment
      const paymentResult = await client.query(
        "SELECT p.*, a.title as advertisement_title, a.user_id FROM payments p LEFT JOIN advertisements a ON p.advertisement_id = a.id WHERE p.id = $1",
        [id],
      )

      if (paymentResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ message: "Payment not found" })
      }

      const payment = paymentResult.rows[0]

      // Check if already verified
      if (payment.status === "completed") {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Payment is already verified" })
      }

      // Update payment status
      await client.query(
        "UPDATE payments SET status = $1, verified_by = $2, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        ["completed", req.user.id, id],
      )

      // Update advertisement payment status
      await client.query("UPDATE advertisements SET is_paid = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [
        payment.advertisement_id,
      ])

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, related_id, related_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          payment.user_id,
          "Payment Verified",
          `Your payment for advertisement "${payment.advertisement_title}" has been verified.`,
          "payment_verified",
          payment.id,
          "payment",
        ],
      )

      // Log the action
      await createAuditLog({
        action: "PAYMENT_VERIFIED",
        userId: req.user.id,
        details: {
          paymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          advertisementId: payment.advertisement_id,
          advertisementTitle: payment.advertisement_title,
          userId: payment.user_id,
        },
      })

      await client.query("COMMIT")

      // Invalidate cache
      await redisClient.del(`payment:${id}`)
      await redisClient.del(`ad:${payment.advertisement_id}`)

      // Send notification to user
      sendNotification(payment.user_id, {
        title: "Payment Verified",
        message: `Your payment for advertisement "${payment.advertisement_title}" has been verified.`,
        type: "payment_verified",
        relatedId: payment.id,
        relatedType: "payment",
      })

      res.status(200).json({
        message: "Payment verified successfully",
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: "completed",
        },
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/payments/{id}/reject:
 *   post:
 *     summary: Reject a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejecting the payment
 *     responses:
 *       200:
 *         description: Payment rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Payment not found
 */
router.post("/:id/reject", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" })
    }

    // Start a transaction
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Get payment
      const paymentResult = await client.query(
        "SELECT p.*, a.title as advertisement_title, a.user_id FROM payments p LEFT JOIN advertisements a ON p.advertisement_id = a.id WHERE p.id = $1",
        [id],
      )

      if (paymentResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ message: "Payment not found" })
      }

      const payment = paymentResult.rows[0]

      // Check if already failed
      if (payment.status === "failed") {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Payment is already rejected" })
      }

      // Update payment status
      await client.query(
        "UPDATE payments SET status = $1, payment_details = payment_details || $2::jsonb, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        ["failed", JSON.stringify({ rejection_reason: reason }), id],
      )

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, related_id, related_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          payment.user_id,
          "Payment Rejected",
          `Your payment for advertisement "${payment.advertisement_title}" has been rejected. Reason: ${reason}`,
          "payment_rejected",
          payment.id,
          "payment",
        ],
      )

      // Log the action
      await createAuditLog({
        action: "PAYMENT_REJECTED",
        userId: req.user.id,
        details: {
          paymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          advertisementId: payment.advertisement_id,
          advertisementTitle: payment.advertisement_title,
          userId: payment.user_id,
          reason,
        },
      })

      await client.query("COMMIT")

      // Invalidate cache
      await redisClient.del(`payment:${id}`)
      await redisClient.del(`ad:${payment.advertisement_id}`)

      // Send notification to user
      sendNotification(payment.user_id, {
        title: "Payment Rejected",
        message: `Your payment for advertisement "${payment.advertisement_title}" has been rejected. Reason: ${reason}`,
        type: "payment_rejected",
        relatedId: payment.id,
        relatedType: "payment",
      })

      res.status(200).json({
        message: "Payment rejected successfully",
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: "failed",
          reason,
        },
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    next(error)
  }
})

export default router

