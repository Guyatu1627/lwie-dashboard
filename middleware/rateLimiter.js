import { redisClient } from "../server.js"

/**
 * Redis-based rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests in the time window
 * @param {string} options.keyPrefix - Prefix for Redis keys
 * @param {string} options.message - Error message when rate limit is exceeded
 * @returns {Function} Express middleware function
 */
export function createRateLimiter({
  windowMs = 60 * 1000, // 1 minute
  max = 10, // 10 requests per minute
  keyPrefix = "rl:",
  message = "Too many requests, please try again later",
} = {}) {
  return async (req, res, next) => {
    try {
      // Create a unique key based on IP address and optional route
      const key = `${keyPrefix}${req.ip}`

      // Get current count for this key
      const currentCount = await redisClient.get(key)

      if (currentCount && Number.parseInt(currentCount) >= max) {
        return res.status(429).json({
          message,
          retryAfter: Math.ceil(windowMs / 1000),
        })
      }

      // Increment count or set to 1 if it doesn't exist
      if (currentCount) {
        await redisClient.incr(key)
      } else {
        await redisClient.set(key, 1, {
          EX: Math.ceil(windowMs / 1000), // Set expiration in seconds
        })
      }

      next()
    } catch (error) {
      console.error("Rate limiter error:", error)
      // If Redis fails, allow the request to proceed
      next()
    }
  }
}

// Pre-configured rate limiters for common use cases
export const loginRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 login attempts per 5 minutes
  keyPrefix: "rl:login:",
  message: "Too many login attempts, please try again after 5 minutes",
})

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  keyPrefix: "rl:pwreset:",
  message: "Too many password reset attempts, please try again after an hour",
})

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  keyPrefix: "rl:api:",
  message: "Too many API requests, please try again later",
})

