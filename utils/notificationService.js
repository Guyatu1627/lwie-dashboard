import { pool } from "../db/config.js"
import { io } from "../server.js"

/**
 * Send a notification to a user
 * @param {number} userId - The ID of the user to send the notification to
 * @param {Object} notification - The notification object
 * @param {string} notification.title - The notification title
 * @param {string} notification.message - The notification message
 * @param {string} notification.type - The notification type
 * @param {number} [notification.relatedId] - The ID of the related entity
 * @param {string} [notification.relatedType] - The type of the related entity
 * @param {string} [notification.actionUrl] - The URL to navigate to when clicking the notification
 * @returns {Promise<Object>} The created notification
 */
export const sendNotification = async (userId, notification) => {
  try {
    // Insert notification into database
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, related_id, related_type, action_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        notification.title,
        notification.message,
        notification.type,
        notification.relatedId || null,
        notification.relatedType || null,
        notification.actionUrl || null,
      ],
    )

    const createdNotification = result.rows[0]

    // Send real-time notification via Socket.io
    if (io) {
      io.to(`user:${userId}`).emit("notification", createdNotification)
    }

    return createdNotification
  } catch (error) {
    console.error("Error sending notification:", error)
    throw error
  }
}

/**
 * Send a notification to all managers
 * @param {Object} notification - The notification object
 * @param {string} notification.title - The notification title
 * @param {string} notification.message - The notification message
 * @param {string} notification.type - The notification type
 * @param {number} [notification.relatedId] - The ID of the related entity
 * @param {string} [notification.relatedType] - The type of the related entity
 * @param {string} [notification.actionUrl] - The URL to navigate to when clicking the notification
 * @returns {Promise<Array>} The created notifications
 */
export const sendManagerNotification = async (notification) => {
  try {
    // Get all manager user IDs
    const managersResult = await pool.query("SELECT id FROM users WHERE role = $1 AND is_active = true", ["manager"])

    const managerIds = managersResult.rows.map((row) => row.id)

    if (managerIds.length === 0) {
      return []
    }

    // Create notification values for batch insert
    const notificationValues = managerIds
      .map(
        (id, i) =>
          `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`,
      )
      .join(", ")

    const notificationParams = managerIds.flatMap((id) => [
      id,
      notification.title,
      notification.message,
      notification.type,
      notification.relatedId || null,
      notification.relatedType || null,
      notification.actionUrl || null,
    ])

    // Batch insert notifications
    const result = await pool.query(
      `INSERT INTO manager_notifications (user_id, title, message, notification_type, related_id, related_type, action_url)
       VALUES ${notificationValues}
       RETURNING *`,
      notificationParams,
    )

    const createdNotifications = result.rows

    // Send real-time notifications via Socket.io
    if (io) {
      managerIds.forEach((managerId, index) => {
        io.to(`user:${managerId}`).emit("notification", createdNotifications[index])
      })
    }

    return createdNotifications
  } catch (error) {
    console.error("Error sending manager notifications:", error)
    throw error
  }
}

/**
 * Get unread notification count for a user
 * @param {number} userId - The ID of the user
 * @param {boolean} isManager - Whether to get manager notifications
 * @returns {Promise<number>} The unread notification count
 */
export const getUnreadNotificationCount = async (userId, isManager = false) => {
  try {
    const table = isManager ? "manager_notifications" : "notifications"

    const result = await pool.query(`SELECT COUNT(*) FROM ${table} WHERE user_id = $1 AND is_read = false`, [userId])

    return Number.parseInt(result.rows[0].count)
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    throw error
  }
}

