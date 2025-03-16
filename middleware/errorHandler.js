import { createAuditLog } from "../utils/auditLogger.js"

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error("Error:", err)

  // Generate a unique error ID for tracking
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

  // Log error to audit log if user is authenticated
  if (req.user) {
    createAuditLog({
      action: "ERROR",
      userId: req.user.id,
      details: {
        errorId,
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        endpoint: req.originalUrl,
        method: req.method,
        ip: req.ip,
      },
    }).catch((logErr) => console.error("Error logging to audit log:", logErr))
  }

  // Check for specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
      errorId,
    })
  }

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Unauthorized: Invalid token",
      errorId,
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Unauthorized: Token expired",
      code: "TOKEN_EXPIRED",
      errorId,
    })
  }

  if (err.code === "23505") {
    return res.status(409).json({
      message: "Duplicate entry found",
      errorId,
    })
  }

  if (err.code === "23503") {
    return res.status(400).json({
      message: "Foreign key constraint violation",
      errorId,
    })
  }

  // Default to 500 server error
  return res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
    errorId,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}

