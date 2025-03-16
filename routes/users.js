import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdmin, isAdminOrManager, isResourceOwner } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", role, sortBy = "created_at", sortOrder = "DESC" } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (search) {
      conditions.push(
        `(email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`,
      )
      params.push(`%${search}%`)
      paramIndex++
    }

    if (role) {
      conditions.push(`role = $${paramIndex}`)
      params.push(role)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalUsers = Number.parseInt(countResult.rows[0].count)

    // Get users with pagination
    const query = `
      SELECT id, email, first_name, last_name, role, profile_image, is_active, is_approved, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      users: result.rows.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profileImage: user.profile_image,
        isActive: user.is_active,
        isApproved: user.is_approved,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
      pagination: {
        total: totalUsers,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticateToken, isResourceOwner, async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "SELECT id, email, first_name, last_name, role, profile_image, phone, location, bio, is_active, is_approved, created_at, updated_at FROM users WHERE id = $1",
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = result.rows[0]

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        profileImage: user.profile_image,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        isActive: user.is_active,
        isApproved: user.is_approved,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already taken
 */
router.put("/:id", authenticateToken, isResourceOwner, async (req, res, next) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, phone, location, bio, profileImage } = req.body

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is already taken by another user
    if (email) {
      const emailExists = await pool.query("SELECT * FROM users WHERE email = $1 AND id != $2", [email, id])
      if (emailExists.rows.length > 0) {
        return res.status(409).json({ message: "Email is already taken" })
      }
    }

    // Update user
    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           email = COALESCE($3, email),
           phone = COALESCE($4, phone),
           location = COALESCE($5, location),
           bio = COALESCE($6, bio),
           profile_image = COALESCE($7, profile_image),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, email, first_name, last_name, role, profile_image, phone, location, bio, is_active, is_approved`,
      [firstName, lastName, email, phone, location, bio, profileImage, id],
    )

    const updatedUser = result.rows[0]

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        profileImage: updatedUser.profile_image,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        isActive: updatedUser.is_active,
        isApproved: updatedUser.is_approved,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/role", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Validate role
    if (!role || !["admin", "manager", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Role must be admin, manager, or user." })
    }

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user role
    const result = await pool.query(
      `UPDATE users 
       SET role = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, role`,
      [role, id],
    )

    const updatedUser = result.rows[0]

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Activate/Deactivate user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/status", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    // Validate isActive
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" })
    }

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user status
    const result = await pool.query(
      `UPDATE users 
       SET is_active = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, role, is_active`,
      [isActive, id],
    )

    const updatedUser = result.rows[0]

    res.status(200).json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}/approve:
 *   patch:
 *     summary: Approve user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isApproved
 *             properties:
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User approval status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/approve", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const { isApproved } = req.body

    // Validate isApproved
    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ message: "isApproved must be a boolean" })
    }

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user approval status
    const result = await pool.query(
      `UPDATE users 
       SET is_approved = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, email, first_name, last_name, role, is_active, is_approved`,
      [isApproved, id],
    )

    const updatedUser = result.rows[0]

    // Create notification for user
    if (isApproved) {
      await pool.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)", [
        id,
        "Account Approved",
        "Your account has been approved. You can now access all features of the platform.",
        "account",
      ])
    }

    res.status(200).json({
      message: `User ${isApproved ? "approved" : "unapproved"} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
        isApproved: updatedUser.is_approved,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/users/{id}/activity:
 *   get:
 *     summary: Get user activity
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User activity
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get("/:id/activity", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { id } = req.params
    const { startDate, endDate, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    // Build query conditions
    const conditions = [`user_id = $1`]
    const params = [id]
    let paramIndex = 2

    if (startDate) {
      conditions.push(`created_at >= $${paramIndex}`)
      params.push(new Date(startDate))
      paramIndex++
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramIndex}`)
      params.push(new Date(endDate))
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM (
        SELECT id FROM items ${whereClause}
        UNION ALL
        SELECT id FROM transactions ${whereClause}
      ) AS activity
    `
    const countResult = await pool.query(countQuery, params)
    const totalActivities = Number.parseInt(countResult.rows[0].count)

    // Get user activity with pagination
    const query = `
      SELECT 'item' as type, id, title, status, created_at
      FROM items
      ${whereClause}
      UNION ALL
      SELECT 'transaction' as type, id, NULL as title, status, created_at
      FROM transactions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      activities: result.rows.map((activity) => ({
        type: activity.type,
        id: activity.id,
        title: activity.title,
        status: activity.status,
        createdAt: activity.created_at,
      })),
      pagination: {
        total: totalActivities,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalActivities / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router

