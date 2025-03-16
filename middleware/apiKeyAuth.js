import { pool } from "../db/config.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { redisClient } from "../server.js"

export const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"]

    if (!apiKey) {
      return res.status(401).json({ message: "API key is required" })
    }

    // Check Redis cache first for performance
    const cachedApiKey = await redisClient.get(`apikey:${apiKey}`)

    if (cachedApiKey) {
      const apiKeyData = JSON.parse(cachedApiKey)

      // Check if API key is active
      if (!apiKeyData.isActive) {
        return res.status(401).json({ message: "API key is inactive" })
      }

      // Attach API key data to request
      req.apiKey = apiKeyData

      // Update usage count in Redis
      await redisClient.hincrby(`apikey:usage:${apiKey}`, "count", 1)

      // Log API key usage
      createAuditLog({
        action: "API_KEY_USED",
        userId: apiKeyData.userId,
        details: {
          apiKeyId: apiKeyData.id,
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip,
        },
      }).catch((err) => console.error("Error logging API key usage:", err))

      return next()
    }

    // If not in Redis, check database
    const apiKeyResult = await pool.query("SELECT * FROM api_keys WHERE key = $1 AND expires_at > NOW()", [apiKey])

    if (apiKeyResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired API key" })
    }

    const apiKeyData = apiKeyResult.rows[0]

    // Check if API key is active
    if (!apiKeyData.is_active) {
      return res.status(401).json({ message: "API key is inactive" })
    }

    // Store API key data in Redis for future fast access
    await redisClient.set(
      `apikey:${apiKey}`,
      JSON.stringify({
        id: apiKeyData.id,
        userId: apiKeyData.user_id,
        name: apiKeyData.name,
        permissions: apiKeyData.permissions,
        isActive: apiKeyData.is_active,
      }),
      "EX",
      3600, // 1 hour in seconds
    )

    // Initialize usage counter in Redis
    await redisClient.hset(`apikey:usage:${apiKey}`, "count", 1)
    await redisClient.expire(`apikey:usage:${apiKey}`, 86400) // 24 hours

    // Attach API key data to request
    req.apiKey = {
      id: apiKeyData.id,
      userId: apiKeyData.user_id,
      name: apiKeyData.name,
      permissions: apiKeyData.permissions,
      isActive: apiKeyData.is_active,
    }

    // Update last used timestamp in database
    await pool.query("UPDATE api_keys SET last_used_at = NOW() WHERE id = $1", [apiKeyData.id])

    // Log API key usage
    createAuditLog({
      action: "API_KEY_USED",
      userId: apiKeyData.user_id,
      details: {
        apiKeyId: apiKeyData.id,
        endpoint: req.originalUrl,
        method: req.method,
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging API key usage:", err))

    next()
  } catch (error) {
    console.error("API key authentication error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

