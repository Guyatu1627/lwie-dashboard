import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../db/config.js"
import { authenticateRefreshToken, authenticateToken } from "../middleware/auth.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { sendEmail } from "../utils/emailService.js"
import { loginRateLimiter, passwordResetRateLimiter } from "../middleware/rateLimiter.js"
import { sessionManager } from "../utils/sessionManager.js"

const router = express.Router()

// Rate limiter for password reset requests
// const passwordResetLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // limit each IP to 3 requests per hour
//   message: "Too many password reset attempts, please try again after an hour",
// })

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and get tokens
 *     tags: [Authentication]
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
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 */
router.post("/login", loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Get user from database
    const userResult = await pool.query(
      "SELECT id, email, password, first_name, last_name, role, mfa_enabled, is_active, is_approved FROM users WHERE email = $1",
      [email.toLowerCase()],
    )

    if (userResult.rows.length === 0) {
      // Log failed login attempt
      createAuditLog({
        action: "FAILED_LOGIN",
        details: {
          email,
          reason: "User not found",
          ip: req.ip,
        },
      }).catch((err) => console.error("Error logging failed login:", err))

      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = userResult.rows[0]

    // Check if user is active and approved
    if (!user.is_active || !user.is_approved) {
      // Log failed login attempt
      createAuditLog({
        action: "FAILED_LOGIN",
        userId: user.id,
        details: {
          reason: !user.is_active ? "User inactive" : "User not approved",
          ip: req.ip,
        },
      }).catch((err) => console.error("Error logging failed login:", err))

      return res.status(401).json({
        message: !user.is_active
          ? "Your account has been deactivated. Please contact an administrator."
          : "Your account is pending approval. Please contact an administrator.",
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Log failed login attempt
      createAuditLog({
        action: "FAILED_LOGIN",
        userId: user.id,
        details: {
          reason: "Invalid password",
          ip: req.ip,
        },
      }).catch((err) => console.error("Error logging failed login:", err))

      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Create session using session manager
    const { accessToken, refreshToken } = await sessionManager.createSession(user.id, user.role, {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      mfaEnabled: user.mfa_enabled,
    })

    // Store refresh token in database
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
      [user.id, refreshToken],
    )

    // Log successful login
    createAuditLog({
      action: "LOGIN",
      userId: user.id,
      details: {
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging login:", err))

    // Return user info and tokens
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        mfaEnabled: user.mfa_enabled,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Get a new access token using a refresh token
 *     tags: [Authentication]
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
 *         description: Invalid or expired refresh token
 */
router.post("/refresh-token", authenticateRefreshToken, async (req, res) => {
  try {
    const { refreshToken } = req.body

    // Create new session using session manager
    const { accessToken } = await sessionManager.refreshSession(refreshToken, {
      role: req.user.role,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      mfaEnabled: req.user.mfa_enabled,
    })

    // Log token refresh
    createAuditLog({
      action: "TOKEN_REFRESH",
      userId: req.user.id,
      details: {
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging token refresh:", err))

    res.status(200).json({
      accessToken,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: req.user.role,
        mfaEnabled: req.user.mfa_enabled,
      },
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user by invalidating their refresh token
 *     tags: [Authentication]
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
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body
    const authHeader = req.headers["authorization"]
    const accessToken = authHeader && authHeader.split(" ")[1]

    if (refreshToken) {
      // Delete refresh token from database
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])
    }

    if (accessToken) {
      // Invalidate session using session manager
      await sessionManager.invalidateSession(accessToken)
    }

    // Log logout
    createAuditLog({
      action: "LOGOUT",
      userId: req.user.id,
      details: {
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging logout:", err))

    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", passwordResetRateLimiter, async (req, res) => {
  try {
    const { email } = req.body

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Get user from database
    const userResult = await pool.query(
      "SELECT id, email, first_name FROM users WHERE email = $1 AND is_active = true",
      [email.toLowerCase()],
    )

    if (userResult.rows.length === 0) {
      // We don't want to reveal if a user exists or not for security reasons
      return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" })
    }

    const user = userResult.rows[0]

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    const resetTokenHash = await bcrypt.hash(resetToken, 10)

    // Store reset token in database
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '1 hour')",
      [user.id, resetTokenHash],
    )

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h1>Hello ${user.first_name},</h1>
        <p>You requested a password reset for your Lwie account.</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
        <p>Regards,<br>The Lwie Team</p>
      `,
    })

    // Log password reset request
    createAuditLog({
      action: "PASSWORD_RESET_REQUEST",
      userId: user.id,
      details: {
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging password reset request:", err))

    res.status(200).json({ message: "If your email is registered, you will receive a password reset link" })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using a reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", passwordResetRateLimiter, async (req, res) => {
  try {
    const { token, password } = req.body

    // Validate input
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" })
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtError) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    // Get user from database
    const userResult = await pool.query("SELECT id FROM users WHERE id = $1 AND is_active = true", [decoded.userId])

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    const userId = userResult.rows[0].id

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password in database
    await pool.query("UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2", [hashedPassword, userId])

    // Delete all reset tokens for this user
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId])

    // Log password reset
    createAuditLog({
      action: "PASSWORD_RESET",
      userId,
      details: {
        ip: req.ip,
      },
    }).catch((err) => console.error("Error logging password reset:", err))

    res.status(200).json({ message: "Password reset successful" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

export default router

