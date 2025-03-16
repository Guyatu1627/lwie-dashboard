import jwt from "jsonwebtoken"
import { redisClient } from "../server.js"
import { createAuditLog } from "../utils/auditLogger.js"

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error: No token provided"))
    }

    // Check Redis for faster validation
    const cachedSession = await redisClient.get(`session:${token}`)

    if (cachedSession) {
      // Token is valid and in Redis cache
      const session = JSON.parse(cachedSession)

      // Attach user data to socket
      socket.user = {
        id: session.userId,
        role: session.role,
      }

      // Log socket connection
      createAuditLog({
        action: "SOCKET_CONNECT",
        userId: session.userId,
        details: {
          socketId: socket.id,
          ip: socket.handshake.address,
        },
      }).catch((err) => console.error("Error logging socket connection:", err))

      return next()
    }

    // If not in Redis, verify JWT
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach user data to socket
      socket.user = {
        id: decoded.userId,
        role: decoded.role,
      }

      // Store in Redis for future fast access
      await redisClient.set(
        `session:${token}`,
        JSON.stringify({ userId: decoded.userId, role: decoded.role }),
        "EX",
        900, // 15 minutes in seconds
      )

      // Log socket connection
      createAuditLog({
        action: "SOCKET_CONNECT",
        userId: decoded.userId,
        details: {
          socketId: socket.id,
          ip: socket.handshake.address,
        },
      }).catch((err) => console.error("Error logging socket connection:", err))

      next()
    } catch (jwtError) {
      return next(new Error("Authentication error: Invalid token"))
    }
  } catch (error) {
    return next(new Error("Internal server error"))
  }
}

