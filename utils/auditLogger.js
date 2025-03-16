import { pool } from "../db/config.js"
import { redisClient } from "../server.js"

export const createAuditLog = async ({ action, userId, details = {}, ip = null }) => {
  try {
    // Insert audit log into database
    const result = await pool.query(
      "INSERT INTO audit_logs (action, user_id, details, ip_address) VALUES ($1, $2, $3, $4) RETURNING id",
      [action, userId, JSON.stringify(details), ip],
    )

    // Store in Redis for real-time notifications if it's a significant action
    const significantActions = [
      "LOGIN_FAILED",
      "MFA_FAILED",
      "UNAUTHORIZED_ACCESS",
      "USER_ROLE_CHANGED",
      "USER_APPROVED",
      "USER_DEACTIVATED",
      "ITEM_REJECTED",
      "SECURITY_ALERT",
    ]

    if (significantActions.includes(action)) {
      // Add to Redis list for admin notifications
      await redisClient.lpush(
        "admin:notifications",
        JSON.stringify({
          id: result.rows[0].id,
          action,
          userId,
          details,
          timestamp: new Date().toISOString(),
        }),
      )

      // Trim list to keep only recent notifications
      await redisClient.ltrim("admin:notifications", 0, 99) // Keep last 100 notifications

      // Publish to Redis channel for real-time notifications
      await redisClient.publish(
        "admin:notifications",
        JSON.stringify({
          id: result.rows[0].id,
          action,
          userId,
          details,
          timestamp: new Date().toISOString(),
        }),
      )
    }

    return result.rows[0].id
  } catch (error) {
    console.error("Error creating audit log:", error)
    // Don't throw error to prevent disrupting the main application flow
    return null
  }
}

export const getAuditLogs = async ({
  userId = null,
  action = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 20,
}) => {
  try {
    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (userId) {
      conditions.push(`user_id = $${paramIndex}`)
      params.push(userId)
      paramIndex++
    }

    if (action) {
      conditions.push(`action = $${paramIndex}`)
      params.push(action)
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

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM audit_logs ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalLogs = Number.parseInt(countResult.rows[0].count)

    // Calculate offset
    const offset = (page - 1) * limit

    // Get audit logs with pagination
    const query = `
      SELECT al.*, u.email as user_email, u.first_name, u.last_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    return {
      logs: result.rows.map((log) => ({
        id: log.id,
        action: log.action,
        userId: log.user_id,
        userEmail: log.user_email,
        userName: `${log.first_name || ""} ${log.last_name || ""}`.trim() || null,
        details: log.details,
        ipAddress: log.ip_address,
        createdAt: log.created_at,
      })),
      pagination: {
        total: totalLogs,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalLogs / limit),
      },
    }
  } catch (error) {
    console.error("Error getting audit logs:", error)
    throw error
  }
}

