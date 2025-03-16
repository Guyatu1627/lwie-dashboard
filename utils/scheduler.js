import cron from "node-cron"
import { pool } from "../db/config.js"
import { redisClient } from "../server.js"
import { createAuditLog } from "./auditLogger.js"
import { backupDatabase } from "./backupUtils.js"
import fs from "fs"
import path from "path"

export const setupScheduledJobs = () => {
  // Daily database backup at 2 AM
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("Running scheduled database backup...")
      const backupPath = await backupDatabase()

      await createAuditLog({
        action: "DATABASE_BACKUP",
        userId: null,
        details: {
          path: backupPath,
          timestamp: new Date().toISOString(),
        },
      })

      console.log("Database backup completed successfully")
    } catch (error) {
      console.error("Database backup failed:", error)
    }
  })

  // Clean up expired sessions every hour
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Cleaning up expired sessions...")

      // Delete expired refresh tokens
      const refreshTokenResult = await pool.query("DELETE FROM refresh_tokens WHERE expires_at < NOW() RETURNING id")

      // Delete expired password reset tokens
      const resetTokenResult = await pool.query(
        "DELETE FROM password_reset_tokens WHERE expires_at < NOW() RETURNING id",
      )

      // Delete expired API keys
      const apiKeyResult = await pool.query("DELETE FROM api_keys WHERE expires_at < NOW() RETURNING id")

      console.log(
        `Cleanup completed: Removed ${refreshTokenResult.rowCount} refresh tokens, ${resetTokenResult.rowCount} reset tokens, and ${apiKeyResult.rowCount} API keys`,
      )
    } catch (error) {
      console.error("Session cleanup failed:", error)
    }
  })

  // Aggregate analytics data daily at 1 AM
  cron.schedule("0 1 * * *", async () => {
    try {
      console.log("Aggregating daily analytics...")
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split("T")[0]

      // Get active users count
      const activeUsersResult = await pool.query(
        "SELECT COUNT(DISTINCT user_id) FROM sessions WHERE DATE(created_at) = $1",
        [yesterdayStr],
      )
      const activeUsers = Number.parseInt(activeUsersResult.rows[0].count)

      // Get new users count
      const newUsersResult = await pool.query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = $1", [yesterdayStr])
      const newUsers = Number.parseInt(newUsersResult.rows[0].count)

      // Get new items count
      const newItemsResult = await pool.query("SELECT COUNT(*) FROM items WHERE DATE(created_at) = $1", [yesterdayStr])
      const newItems = Number.parseInt(newItemsResult.rows[0].count)

      // Get total items count
      const totalItemsResult = await pool.query("SELECT COUNT(*) FROM items WHERE DATE(created_at) <= $1", [
        yesterdayStr,
      ])
      const totalItems = Number.parseInt(totalItemsResult.rows[0].count)

      // Get completed transactions count
      const completedTransactionsResult = await pool.query(
        "SELECT COUNT(*) FROM transactions WHERE status = 'completed' AND DATE(created_at) = $1",
        [yesterdayStr],
      )
      const completedTransactions = Number.parseInt(completedTransactionsResult.rows[0].count)

      // Insert analytics record
      await pool.query(
        `INSERT INTO analytics 
         (date, active_users, new_users, total_items, new_items, completed_transactions)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [yesterdayStr, activeUsers, newUsers, totalItems, newItems, completedTransactions],
      )

      console.log("Daily analytics aggregation completed")
    } catch (error) {
      console.error("Analytics aggregation failed:", error)
    }
  })

  // Clean up old logs every week (Sunday at 3 AM)
  cron.schedule("0 3 * * 0", async () => {
    try {
      console.log("Cleaning up old logs...")

      // Delete audit logs older than 90 days
      const auditLogResult = await pool.query(
        "DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days' RETURNING id",
      )

      // Clean up log files older than 30 days
      const logsDir = path.join(process.cwd(), "logs")
      if (fs.existsSync(logsDir)) {
        const files = fs.readdirSync(logsDir)
        const now = new Date()
        let deletedFiles = 0

        for (const file of files) {
          const filePath = path.join(logsDir, file)
          const stats = fs.statSync(filePath)
          const fileDate = new Date(stats.mtime)
          const diffDays = Math.floor((now - fileDate) / (1000 * 60 * 60 * 24))

          if (diffDays > 30) {
            fs.unlinkSync(filePath)
            deletedFiles++
          }
        }

        console.log(`Deleted ${deletedFiles} old log files`)
      }

      console.log(`Log cleanup completed: Removed ${auditLogResult.rowCount} old audit logs`)
    } catch (error) {
      console.error("Log cleanup failed:", error)
    }
  })

  // Cache warming every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    try {
      console.log("Running cache warming...")

      // Cache frequently accessed data

      // 1. Active categories
      const categoriesResult = await pool.query("SELECT * FROM categories ORDER BY name")
      await redisClient.set(
        "cache:categories",
        JSON.stringify(categoriesResult.rows),
        "EX",
        21600, // 6 hours
      )

      // 2. Active templates
      const templatesResult = await pool.query("SELECT * FROM templates ORDER BY name")
      await redisClient.set(
        "cache:templates",
        JSON.stringify(templatesResult.rows),
        "EX",
        21600, // 6 hours
      )

      // 3. Recent analytics
      const analyticsResult = await pool.query("SELECT * FROM analytics ORDER BY date DESC LIMIT 30")
      await redisClient.set(
        "cache:recent_analytics",
        JSON.stringify(analyticsResult.rows),
        "EX",
        21600, // 6 hours
      )

      console.log("Cache warming completed")
    } catch (error) {
      console.error("Cache warming failed:", error)
    }
  })
}

