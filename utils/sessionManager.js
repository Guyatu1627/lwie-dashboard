import { redisClient } from "../server.js"
import jwt from "jsonwebtoken"

/**
 * Session manager utility for Redis-based session storage
 */
export const sessionManager = {
  /**
   * Create a new session
   * @param {string} userId - User ID
   * @param {string} role - User role
   * @param {Object} additionalData - Additional session data
   * @returns {Object} Session tokens
   */
  async createSession(userId, role, additionalData = {}) {
    // Generate tokens
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })

    // Store session data in Redis
    await redisClient.set(
      `session:${accessToken}`,
      JSON.stringify({ userId, role, ...additionalData }),
      { EX: 900 }, // 15 minutes in seconds
    )

    return { accessToken, refreshToken }
  },

  /**
   * Validate a session
   * @param {string} accessToken - Access token
   * @returns {Object|null} Session data or null if invalid
   */
  async validateSession(accessToken) {
    try {
      // Check if session exists in Redis
      const sessionData = await redisClient.get(`session:${accessToken}`)

      if (!sessionData) {
        // If not in Redis, verify JWT as fallback
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        return { userId: decoded.userId }
      }

      return JSON.parse(sessionData)
    } catch (error) {
      return null
    }
  },

  /**
   * Invalidate a session
   * @param {string} accessToken - Access token
   */
  async invalidateSession(accessToken) {
    await redisClient.del(`session:${accessToken}`)
  },

  /**
   * Refresh a session
   * @param {string} refreshToken - Refresh token
   * @param {Object} userData - User data
   * @returns {Object} New session tokens
   */
  async refreshSession(refreshToken, userData) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      // Create new session
      return await this.createSession(decoded.userId, userData.role, {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mfaEnabled: userData.mfaEnabled,
      })
    } catch (error) {
      throw new Error("Invalid refresh token")
    }
  },
}

