import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import { isManager } from "../middleware/auth.js"
import { pool } from "../db/config.js"
import { redisClient } from "../server.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { sendNotification } from "../utils/notificationService.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiter for advertisement operations
const adRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

/**
 * @swagger
 * /api/manager/advertisements:
 *   get:
 *     summary: Get all advertisements with filtering and pagination
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, expired]
 *         description: Filter by advertisement status
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
 *         description: List of advertisements
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/", authenticateToken, isManager, adRateLimiter, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = "created_at", order = "desc", search = "" } = req.query

    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (status) {
      conditions.push(`a.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (search) {
      conditions.push(`(a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Validate sort field to prevent SQL injection
    const validSortFields = ["created_at", "updated_at", "title", "status", "budget", "start_date", "end_date"]
    const sortField = validSortFields.includes(sort) ? sort : "created_at"

    // Validate order
    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC"

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) 
      FROM advertisements a
      ${whereClause}
    `

    const countResult = await pool.query(countQuery, params)
    const totalItems = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    // Get advertisements with user info
    const query = `
      SELECT 
        a.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        p.status as payment_status,
        p.amount as payment_amount,
        p.id as payment_id,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = a.approved_by) as approved_by_name
      FROM advertisements a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN payments p ON p.advertisement_id = a.id
      ${whereClause}
      ORDER BY a.${sortField} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit, offset)

    const result = await pool.query(query, params)

    res.status(200).json({
      advertisements: result.rows,
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
 * /api/manager/advertisements/{id}:
 *   get:
 *     summary: Get advertisement by ID
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Advertisement not found
 */
router.get("/:id", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Try to get from cache first
    const cachedAd = await redisClient.get(`ad:${id}`)
    if (cachedAd) {
      return res.status(200).json(JSON.parse(cachedAd))
    }

    // Get advertisement with user info and payment details
    const query = `
      SELECT 
        a.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.phone as user_phone,
        p.status as payment_status,
        p.amount as payment_amount,
        p.id as payment_id,
        p.transaction_id as payment_transaction_id,
        p.payment_method as payment_method,
        p.created_at as payment_date,
        (SELECT first_name || ' ' || last_name FROM users WHERE id = a.approved_by) as approved_by_name
      FROM advertisements a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN payments p ON p.advertisement_id = a.id
      WHERE a.id = $1
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Advertisement not found" })
    }

    // Get advertisement statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as impression_count,
        SUM(CASE WHEN activity_type = 'ad_click' THEN 1 ELSE 0 END) as click_count
      FROM user_activity
      WHERE activity_type IN ('ad_impression', 'ad_click')
      AND details->>'advertisement_id' = $1
    `

    const statsResult = await pool.query(statsQuery, [id])
    const stats = statsResult.rows[0]

    const advertisement = {
      ...result.rows[0],
      statistics: {
        impressions: Number.parseInt(stats.impression_count) || 0,
        clicks: Number.parseInt(stats.click_count) || 0,
        ctr: stats.impression_count > 0 ? ((stats.click_count / stats.impression_count) * 100).toFixed(2) + "%" : "0%",
      },
    }

    // Cache the result for 5 minutes
    await redisClient.set(`ad:${id}`, JSON.stringify(advertisement), "EX", 300)

    res.status(200).json(advertisement)
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/advertisements/{id}/approve:
 *   post:
 *     summary: Approve an advertisement
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement approved successfully
 *       400:
 *         description: Cannot approve - payment not verified
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Advertisement not found
 */
router.post("/:id/approve", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params

    // Start a transaction
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Get advertisement
      const adResult = await client.query("SELECT * FROM advertisements WHERE id = $1", [id])

      if (adResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ message: "Advertisement not found" })
      }

      const ad = adResult.rows[0]

      // Check if already approved
      if (ad.status === "approved") {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Advertisement is already approved" })
      }

      // Check if payment is verified
      const paymentResult = await client.query("SELECT * FROM payments WHERE advertisement_id = $1 AND status = $2", [
        id,
        "completed",
      ])

      if (paymentResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Cannot approve advertisement - payment not verified" })
      }

      // Update advertisement status
      await client.query(
        "UPDATE advertisements SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        ["approved", req.user.id, id],
      )

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, related_id, related_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          ad.user_id,
          "Advertisement Approved",
          `Your advertisement "${ad.title}" has been approved and is now live.`,
          "ad_approved",
          ad.id,
          "advertisement",
        ],
      )

      // Log the action
      await createAuditLog({
        action: "ADVERTISEMENT_APPROVED",
        userId: req.user.id,
        details: {
          advertisementId: ad.id,
          advertisementTitle: ad.title,
          userId: ad.user_id,
        },
      })

      await client.query("COMMIT")

      // Invalidate cache
      await redisClient.del(`ad:${id}`)

      // Send notification to user
      sendNotification(ad.user_id, {
        title: "Advertisement Approved",
        message: `Your advertisement "${ad.title}" has been approved and is now live.`,
        type: "ad_approved",
        relatedId: ad.id,
        relatedType: "advertisement",
      })

      res.status(200).json({
        message: "Advertisement approved successfully",
        advertisement: {
          id: ad.id,
          title: ad.title,
          status: "approved",
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
 * /api/manager/advertisements/{id}/reject:
 *   post:
 *     summary: Reject an advertisement
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advertisement ID
 *     requestBody:
 *       required:
 *           type: integer
 *         description: Advertisement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 description: Reason for rejecting the advertisement
 *     responses:
 *       200:
 *         description: Advertisement rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 *       404:
 *         description: Advertisement not found
 */
router.post("/:id/reject", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { id } = req.params
    const { rejectionReason } = req.body

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" })
    }

    // Start a transaction
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Get advertisement
      const adResult = await client.query("SELECT * FROM advertisements WHERE id = $1", [id])

      if (adResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ message: "Advertisement not found" })
      }

      const ad = adResult.rows[0]

      // Check if already rejected
      if (ad.status === "rejected") {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Advertisement is already rejected" })
      }

      // Update advertisement status
      await client.query(
        "UPDATE advertisements SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        ["rejected", rejectionReason, id],
      )

      // Create notification for user
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, related_id, related_type) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          ad.user_id,
          "Advertisement Rejected",
          `Your advertisement "${ad.title}" has been rejected. Reason: ${rejectionReason}`,
          "ad_rejected",
          ad.id,
          "advertisement",
        ],
      )

      // Log the action
      await createAuditLog({
        action: "ADVERTISEMENT_REJECTED",
        userId: req.user.id,
        details: {
          advertisementId: ad.id,
          advertisementTitle: ad.title,
          userId: ad.user_id,
          rejectionReason,
        },
      })

      await client.query("COMMIT")

      // Invalidate cache
      await redisClient.del(`ad:${id}`)

      // Send notification to user
      sendNotification(ad.user_id, {
        title: "Advertisement Rejected",
        message: `Your advertisement "${ad.title}" has been rejected. Reason: ${rejectionReason}`,
        type: "ad_rejected",
        relatedId: ad.id,
        relatedType: "advertisement",
      })

      res.status(200).json({
        message: "Advertisement rejected successfully",
        advertisement: {
          id: ad.id,
          title: ad.title,
          status: "rejected",
          rejectionReason,
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
 * /api/manager/advertisements/bulk-approve:
 *   post:
 *     summary: Bulk approve advertisements
 *     tags: [Advertisements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of advertisement IDs to approve
 *     responses:
 *       200:
 *         description: Advertisements approved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.post("/bulk-approve", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Advertisement IDs array is required" })
    }

    // Start a transaction
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      // Get advertisements with verified payments
      const adsResult = await client.query(
        `SELECT a.id, a.title, a.user_id 
         FROM advertisements a
         JOIN payments p ON a.id = p.advertisement_id
         WHERE a.id = ANY($1::int[])
         AND a.status = 'pending'
         AND p.status = 'completed'`,
        [ids],
      )

      if (adsResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "No valid advertisements to approve" })
      }

      // Update advertisements status
      await client.query(
        `UPDATE advertisements 
         SET status = 'approved', 
             approved_by = $1, 
             approved_at = CURRENT_TIMESTAMP, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ANY($2::int[])
         AND status = 'pending'`,
        [req.user.id, ids],
      )

      // Create notifications for users
      const notifications = adsResult.rows.map((ad) => ({
        userId: ad.user_id,
        title: "Advertisement Approved",
        message: `Your advertisement "${ad.title}" has been approved and is now live.`,
        type: "ad_approved",
        relatedId: ad.id,
        relatedType: "advertisement",
      }))

      // Batch insert notifications
      if (notifications.length > 0) {
        const notificationValues = notifications
          .map((n, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
          .join(", ")

        const notificationParams = notifications.flatMap((n) => [
          n.userId,
          n.title,
          n.message,
          n.type,
          n.relatedId,
          n.relatedType,
        ])

        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, related_id, related_type) 
           VALUES ${notificationValues}`,
          notificationParams,
        )
      }

      // Log the action
      await createAuditLog({
        action: "BULK_ADVERTISEMENTS_APPROVED",
        userId: req.user.id,
        details: {
          advertisementIds: adsResult.rows.map((ad) => ad.id),
          count: adsResult.rows.length,
        },
      })

      await client.query("COMMIT")

      // Invalidate cache for each ad
      for (const ad of adsResult.rows) {
        await redisClient.del(`ad:${ad.id}`)

        // Send notification to user
        sendNotification(ad.user_id, {
          title: "Advertisement Approved",
          message: `Your advertisement "${ad.title}" has been approved and is now live.`,
          type: "ad_approved",
          relatedId: ad.id,
          relatedType: "advertisement",
        })
      }

      res.status(200).json({
        message: "Advertisements approved successfully",
        approved: adsResult.rows.map((ad) => ({
          id: ad.id,
          title: ad.title,
        })),
        count: adsResult.rows.length,
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

