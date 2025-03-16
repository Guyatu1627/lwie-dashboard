import express from "express"
import crypto from "crypto"
import { pool } from "../db/config.js"
import { authenticateToken } from "../middleware/auth.js"
import { createAuditLog } from "../utils/auditLogger.js"
import { redisClient } from "../server.js"

const router = express.Router()

/**
 * @swagger
 * /api/api-keys:
 *   get:
 *     summary: Get all API keys for current user
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    // Regular users can only see their own API keys
    // Admins can see all API keys if query param is provided
    const { all } = req.query
    let query
    let params

    if (req.user.role === "admin" && all === "true") {
      query = `
        SELECT ak.*, u.email as user_email, u.first_name, u.last_name
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        ORDER BY ak.created_at DESC
      `
      params = []
    } else {
      query = `
        SELECT *
        FROM api_keys
        WHERE user_id = $1
        ORDER BY created_at DESC
      `
      params = [req.user.id]
    }

    const result = await pool.query(query, params)

    res.status(200).json({
      apiKeys: result.rows.map((key) => ({
        id: key.id,
        name: key.name,
        // Don't send the actual key, only the last 8 characters
        key: key.key ? `••••••••${key.key.slice(-8)}` : null,
        userId: key.user_id,
        userEmail: key.user_email,
        userName: key.first_name && key.last_name ? `${key.first_name} ${key.last_name}` : null,
        permissions: key.permissions,
        isActive: key.is_active,
        lastUsedAt: key.last_used_at,
        expiresAt: key.expires_at,
        createdAt: key.created_at,
      })),
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/api-keys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               expiresIn:
 *                 type: integer
 *                 description: Number of days until expiration (default 365)
 *     responses:
 *       201:
 *         description: API key created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { name, permissions = ["read"], expiresIn = 365 } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString("hex")

    // Calculate expiration date
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresIn)

    // Create API key
    const result = await pool.query(
      `INSERT INTO api_keys (user_id, name, key, permissions, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, key, permissions, is_active, expires_at, created_at`,
      [req.user.id, name, apiKey, permissions, expiresAt],
    )

    const newApiKey = result.rows[0]

    // Log API key creation
    await createAuditLog({
      action: "API_KEY_CREATED",
      userId: req.user.id,
      details: {
        apiKeyId: newApiKey.id,
        name,
        permissions,
        expiresAt,
      },
      ip: req.ip,
    })

    res.status(201).json({
      message: "API key created successfully",
      apiKey: {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key, // Send the full key only once
        permissions: newApiKey.permissions,
        isActive: newApiKey.is_active,
        expiresAt: newApiKey.expires_at,
        createdAt: newApiKey.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/api-keys/{id}:
 *   patch:
 *     summary: Update API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: API key updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: API key not found
 */
router.patch("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, permissions, isActive } = req.body

    // Check if API key exists and belongs to user
    const apiKeyExists = await pool.query("SELECT * FROM api_keys WHERE id = $1 AND (user_id = $2 OR $3 = true)", [
      id,
      req.user.id,
      req.user.role === "admin",
    ])

    if (apiKeyExists.rows.length === 0) {
      return res.status(404).json({ message: "API key not found or you do not have permission to update it" })
    }

    const apiKey = apiKeyExists.rows[0]

    // Update API key
    const result = await pool.query(
      `UPDATE api_keys 
       SET name = COALESCE($1, name),
           permissions = COALESCE($2, permissions),
           is_active = COALESCE($3, is_active)
       WHERE id = $4
       RETURNING id, name, permissions, is_active, expires_at, created_at`,
      [name, permissions, isActive, id],
    )

    const updatedApiKey = result.rows[0]

    // Clear Redis cache for this API key
    await redisClient.del(`apikey:${apiKey.key}`)

    // Log API key update
    await createAuditLog({
      action: "API_KEY_UPDATED",
      userId: req.user.id,
      details: {
        apiKeyId: id,
        name: name || apiKey.name,
        permissions: permissions || apiKey.permissions,
        isActive: isActive !== undefined ? isActive : apiKey.is_active,
      },
      ip: req.ip,
    })

    res.status(200).json({
      message: "API key updated successfully",
      apiKey: {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        permissions: updatedApiKey.permissions,
        isActive: updatedApiKey.is_active,
        expiresAt: updatedApiKey.expires_at,
        createdAt: updatedApiKey.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/api-keys/{id}:
 *   delete:
 *     summary: Delete API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: API key not found
 */
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if API key exists and belongs to user
    const apiKeyExists = await pool.query("SELECT * FROM api_keys WHERE id = $1 AND (user_id = $2 OR $3 = true)", [
      id,
      req.user.id,
      req.user.role === "admin",
    ])

    if (apiKeyExists.rows.length === 0) {
      return res.status(404).json({ message: "API key not found or you do not have permission to delete it" })
    }

    const apiKey = apiKeyExists.rows[0]

    // Delete API key
    await pool.query("DELETE FROM api_keys WHERE id = $1", [id])

    // Clear Redis cache for this API key
    await redisClient.del(`apikey:${apiKey.key}`)

    // Log API key deletion
    await createAuditLog({
      action: "API_KEY_DELETED",
      userId: req.user.id,
      details: {
        apiKeyId: id,
        name: apiKey.name,
      },
      ip: req.ip,
    })

    res.status(200).json({ message: "API key deleted successfully" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/api-keys/{id}/regenerate:
 *   post:
 *     summary: Regenerate API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key regenerated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: API key not found
 */
router.post("/:id/regenerate", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if API key exists and belongs to user
    const apiKeyExists = await pool.query("SELECT * FROM api_keys WHERE id = $1 AND (user_id = $2 OR $3 = true)", [
      id,
      req.user.id,
      req.user.role === "admin",
    ])

    if (apiKeyExists.rows.length === 0) {
      return res.status(404).json({ message: "API key not found or you do not have permission to regenerate it" })
    }

    const apiKey = apiKeyExists.rows[0]

    // Generate new API key
    const newApiKey = crypto.randomBytes(32).toString("hex")

    // Update API key
    const result = await pool.query(
      `UPDATE api_keys 
       SET key = $1
       WHERE id = $2
       RETURNING id, name, key, permissions, is_active, expires_at, created_at`,
      [newApiKey, id],
    )

    const updatedApiKey = result.rows[0]

    // Clear Redis cache for old API key
    await redisClient.del(`apikey:${apiKey.key}`)

    // Log API key regeneration
    await createAuditLog({
      action: "API_KEY_REGENERATED",
      userId: req.user.id,
      details: {
        apiKeyId: id,
        name: apiKey.name,
      },
      ip: req.ip,
    })

    res.status(200).json({
      message: "API key regenerated successfully",
      apiKey: {
        id: updatedApiKey.id,
        name: updatedApiKey.name,
        key: updatedApiKey.key, // Send the full key only once
        permissions: updatedApiKey.permissions,
        isActive: updatedApiKey.is_active,
        expiresAt: updatedApiKey.expires_at,
        createdAt: updatedApiKey.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router

