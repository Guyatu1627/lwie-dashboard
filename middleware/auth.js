import jwt from "jsonwebtoken"
import { pool } from "../db/config.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { sessionManager } from "../utils/sessionManager.js"

// Middleware to verify JWT access token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Access token is required" })
    }

    // Validate session using Redis
    const sessionData = await sessionManager.validateSession(token)

    if (!sessionData) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    // Get user from database
    const userResult = await pool.query(
      "SELECT id, email, first_name, last_name, role, mfa_enabled FROM users WHERE id = $1 AND is_active = true",
      [sessionData.userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found or inactive" })
    }

    const user = userResult.rows[0]

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      mfa_enabled: user.mfa_enabled,
    }

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

// Middleware to verify refresh token
export const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." })
    }

    // Check if token exists in database
    const tokenResult = await pool.query("SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()", [
      refreshToken,
    ])

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired refresh token." })
    }

    // Verify token
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      // Get user from database
      const userResult = await pool.query(
        "SELECT id, email, first_name, last_name, role, mfa_enabled FROM users WHERE id = $1 AND is_active = true AND is_approved = true",
        [decoded.userId],
      )

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "User not found, inactive, or not approved." })
      }

      // Attach user to request object
      req.user = userResult.rows[0]

      next()
    } catch (jwtError) {
      // Delete invalid token from database
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])

      return res.status(401).json({ message: "Invalid refresh token." })
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." })
  }
}

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next()
  }

  // Log unauthorized access attempt
  createAuditLog({
    action: "UNAUTHORIZED_ACCESS",
    userId: req.user.id,
    details: {
      requiredRole: "admin",
      userRole: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  }).catch((err) => console.error("Error logging unauthorized access:", err))

  return res.status(403).json({ message: "Access denied. Admin role required." })
}

// Middleware to check if user is a manager
export const isManager = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    return next()
  }

  // Log unauthorized access attempt
  createAuditLog({
    action: "UNAUTHORIZED_ACCESS",
    userId: req.user.id,
    details: {
      requiredRole: "manager",
      userRole: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  }).catch((err) => console.error("Error logging unauthorized access:", err))

  return res.status(403).json({ message: "Access denied. Manager role required." })
}

// Middleware to check if user is either admin or manager
export const isAdminOrManager = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    return next()
  }

  // Log unauthorized access attempt
  createAuditLog({
    action: "UNAUTHORIZED_ACCESS",
    userId: req.user.id,
    details: {
      requiredRole: "admin or manager",
      userRole: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  }).catch((err) => console.error("Error logging unauthorized access:", err))

  return res.status(403).json({ message: "Access denied. Admin or Manager role required." })
}

// Middleware to check if user is accessing their own resource
export const isResourceOwner = (req, res, next) => {
  const resourceUserId = Number.parseInt(req.params.userId || req.body.userId)

  if (req.user && (req.user.id === resourceUserId || req.user.role === "admin")) {
    return next()
  }

  // Log unauthorized access attempt
  createAuditLog({
    action: "UNAUTHORIZED_ACCESS",
    userId: req.user.id,
    details: {
      requiredUserId: resourceUserId,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  }).catch((err) => console.error("Error logging unauthorized access:", err))

  return res.status(403).json({ message: "Access denied. You can only access your own resources." })
}

