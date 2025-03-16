import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../db/config.js"
import { authenticateToken } from "../middleware/auth.js"
import { isManager } from "../middleware/auth.js"
import { redisClient } from "../server.js"
import { createAuditLog } from "../utils/auditLogger.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts from this IP, please try again after 15 minutes",
})

/**
 * @swagger
 * /api/manager/auth/login:
 *   post:
 *     summary: Login a manager
 *     tags: [Manager Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Check if user exists and is a manager
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1 AND role = $2", [email, "manager"])

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const user = userResult.rows[0]

    // Check if user is active and approved
    if (!user.is_active) {
      return res.status(401).json({ message: "Account is inactive. Please contact an administrator." })
    }

    if (!user.is_approved) {
      return res.status(401).json({ message: "Account is pending approval. Please wait for admin approval." })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      // Log failed login attempt
      await createAuditLog({
        action: "MANAGER_LOGIN_FAILED",
        userId: user.id,
        details: {
          reason: "Invalid password",
          ip: req.ip,
        },
      })

      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate access token with manager role explicitly included
    const accessToken = jwt.sign({ userId: user.id, role: "manager" }, process.env.JWT_SECRET, { expiresIn: "15m" })

    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user.id, role: "manager" }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    })

    // Store refresh token in database
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, ip_address, user_agent, expires_at) VALUES ($1, $2, $3, $4, $5)",
      [user.id, refreshToken, req.ip, req.headers["user-agent"], expiresAt],
    )

    // Store session in Redis for quick access/validation
    await redisClient.set(
      `session:${accessToken}`,
      JSON.stringify({ userId: user.id, role: "manager" }),
      "EX",
      900, // 15 minutes in seconds
    )

    // Log successful login
    await createAuditLog({
      action: "MANAGER_LOGIN_SUCCESS",
      userId: user.id,
      details: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    })

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profileImage: user.profile_image,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/auth/refresh-token:
 *   post:
 *     summary: Refresh access token for manager
 *     tags: [Manager Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" })
    }

    // Check if token exists in database
    const tokenResult = await pool.query("SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()", [
      refreshToken,
    ])

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid or expired refresh token" })
    }

    // Verify token
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      // Get user from database and ensure they are a manager
      const userResult = await pool.query(
        "SELECT id, email, first_name, last_name, role FROM users WHERE id = $1 AND role = $2 AND is_active = true AND is_approved = true",
        [decoded.userId, "manager"],
      )

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "User not found, inactive, or not a manager" })
      }

      const user = userResult.rows[0]

      // Generate new access token
      const accessToken = jwt.sign({ userId: user.id, role: "manager" }, process.env.JWT_SECRET, { expiresIn: "15m" })

      // Store new session in Redis
      await redisClient.set(
        `session:${accessToken}`,
        JSON.stringify({ userId: user.id, role: "manager" }),
        "EX",
        900, // 15 minutes in seconds
      )

      res.status(200).json({
        message: "Token refreshed successfully",
        accessToken,
      })
    } catch (jwtError) {
      // Delete invalid token from database
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])

      return res.status(401).json({ message: "Invalid refresh token" })
    }
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/auth/logout:
 *   post:
 *     summary: Logout a manager
 *     tags: [Manager Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticateToken, isManager, async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    const authHeader = req.headers["authorization"]
    const accessToken = authHeader && authHeader.split(" ")[1]

    if (!accessToken) {
      return res.status(400).json({ message: "Access token is required" })
    }

    // Remove access token from Redis
    await redisClient.del(`session:${accessToken}`)

    // Remove refresh token from database
    if (refreshToken) {
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])
    }

    // Log logout
    await createAuditLog({
      action: "MANAGER_LOGOUT",
      userId: req.user.id,
      details: {
        ip: req.ip,
      },
    })

    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/manager/auth/me:
 *   get:
 *     summary: Get current manager profile
 *     tags: [Manager Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current manager profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a manager
 */
router.get("/me", authenticateToken, isManager, async (req, res) => {
  // Get additional manager-specific data if needed
  const managerStatsResult = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM advertisements WHERE status = 'pending') as pending_ads,
      (SELECT COUNT(*) FROM advertisements WHERE status = 'approved' AND approved_by = $1) as approved_ads,
      (SELECT COUNT(*) FROM payments WHERE verified_by = $1) as verified_payments
    `,
    [req.user.id],
  )

  const managerStats = managerStatsResult.rows[0]

  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role,
      profileImage: req.user.profile_image,
    },
    stats: managerStats,
  })
})

export default router

