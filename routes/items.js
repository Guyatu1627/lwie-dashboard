import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdminOrManager } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, rejected, completed]
 *         description: Filter by status
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of items
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status, categoryId, userId } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (search) {
      conditions.push(`(i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      conditions.push(`i.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (categoryId) {
      conditions.push(`i.category_id = $${paramIndex}`)
      params.push(categoryId)
      paramIndex++
    }

    if (userId) {
      conditions.push(`i.user_id = $${paramIndex}`)
      params.push(userId)
      paramIndex++
    }

    // Regular users can only see their own items or active items
    if (req.user.role === "user") {
      conditions.push(`(i.user_id = $${paramIndex} OR i.status = 'active')`)
      params.push(req.user.id)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM items i ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalItems = Number.parseInt(countResult.rows[0].count)

    // Get items with pagination
    const query = `
      SELECT i.*, c.name as category_name, u.email as user_email,
             u.first_name as user_first_name, u.last_name as user_last_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN users u ON i.user_id = u.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      items: result.rows.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.category_name,
        userId: item.user_id,
        userEmail: item.user_email,
        userName: `${item.user_first_name || ""} ${item.user_last_name || ""}`.trim(),
        status: item.status,
        images: item.images,
        location: item.location,
        customFields: item.custom_fields,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      pagination: {
        total: totalItems,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalItems / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT i.*, c.name as category_name, u.email as user_email,
              u.first_name as user_first_name, u.last_name as user_last_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    const item = result.rows[0]

    // Regular users can only view their own items or active items
    if (req.user.role === "user" && item.user_id !== req.user.id && item.status !== "active") {
      return res.status(403).json({ message: "You do not have permission to view this item" })
    }

    res.status(200).json({
      item: {
        id: item.id,
        title: item.title,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.category_name,
        userId: item.user_id,
        userEmail: item.user_email,
        userName: `${item.user_first_name || ""} ${item.user_last_name || ""}`.trim(),
        status: item.status,
        images: item.images,
        location: item.location,
        customFields: item.custom_fields,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               customFields:
 *                 type: object
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { title, description, categoryId, images, location, customFields } = req.body

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Title is required" })
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" })
    }

    // Check if category exists
    const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId])
    if (categoryExists.rows.length === 0) {
      return res.status(400).json({ message: "Category not found" })
    }

    // Create item
    const result = await pool.query(
      `INSERT INTO items 
       (title, description, category_id, user_id, status, images, location, custom_fields) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        title,
        description,
        categoryId,
        req.user.id,
        "pending", // All new items start as pending
        images || [],
        location,
        customFields ? JSON.stringify(customFields) : null,
      ],
    )

    const newItem = result.rows[0]

    // Notify admins about new item
    const admins = await pool.query("SELECT id FROM users WHERE role = $1", ["admin"])
    for (const admin of admins.rows) {
      await pool.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)", [
        admin.id,
        "New Item Submitted",
        `A new item "${title}" has been submitted and is pending approval.`,
        "item",
      ])
    }

    res.status(201).json({
      message: "Item created successfully and is pending approval",
      item: {
        id: newItem.id,
        title: newItem.title,
        description: newItem.description,
        categoryId: newItem.category_id,
        userId: newItem.user_id,
        status: newItem.status,
        images: newItem.images,
        location: newItem.location,
        customFields: newItem.custom_fields,
        createdAt: newItem.created_at,
        updatedAt: newItem.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               customFields:
 *                 type: object
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, description, categoryId, images, location, customFields } = req.body

    // Check if item exists
    const itemExists = await pool.query("SELECT * FROM items WHERE id = $1", [id])
    if (itemExists.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    const item = itemExists.rows[0]

    // Check if user has permission to update item
    if (req.user.role === "user" && item.user_id !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update this item" })
    }

    // Check if category exists
    if (categoryId) {
      const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId])
      if (categoryExists.rows.length === 0) {
        return res.status(400).json({ message: "Category not found" })
      }
    }

    // Update item
    const result = await pool.query(
      `UPDATE items 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           images = COALESCE($4, images),
           location = COALESCE($5, location),
           custom_fields = COALESCE($6, custom_fields),
           status = CASE WHEN $7 = 'user' AND (title != $1 OR description != $2 OR category_id != $3) THEN 'pending' ELSE status END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        title,
        description,
        categoryId,
        images ? JSON.stringify(images) : null,
        location,
        customFields ? JSON.stringify(customFields) : null,
        req.user.role,
        id,
      ],
    )

    const updatedItem = result.rows[0]

    // If user edited the item, set it back to pending and notify admins
    if (
      req.user.role === "user" &&
      (title !== item.title || description !== item.description || categoryId !== item.category_id)
    ) {
      // Notify admins about updated item
      const admins = await pool.query("SELECT id FROM users WHERE role = $1", ["admin"])
      for (const admin of admins.rows) {
        await pool.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)", [
          admin.id,
          "Item Updated",
          `Item "${updatedItem.title}" has been updated and requires re-approval.`,
          "item",
        ])
      }
    }

    res.status(200).json({
      message:
        req.user.role === "user" ? "Item updated successfully and is pending approval" : "Item updated successfully",
      item: {
        id: updatedItem.id,
        title: updatedItem.title,
        description: updatedItem.description,
        categoryId: updatedItem.category_id,
        userId: updatedItem.user_id,
        status: updatedItem.status,
        images: updatedItem.images,
        location: updatedItem.location,
        customFields: updatedItem.custom_fields,
        createdAt: updatedItem.created_at,
        updatedAt: updatedItem.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items/{id}/status:
 *   patch:
 *     summary: Update item status (admin only)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, active, rejected, completed]
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.patch("/:id/status", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, rejectionReason } = req.body

    // Validate status
    if (!status || !["pending", "active", "rejected", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Status must be pending, active, rejected, or completed." })
    }

    // Check if item exists
    const itemExists = await pool.query("SELECT * FROM items WHERE id = $1", [id])
    if (itemExists.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    const item = itemExists.rows[0]

    // If rejecting, require a reason
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required when rejecting an item" })
    }

    // Update item status
    const result = await pool.query(
      `UPDATE items 
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id],
    )

    const updatedItem = result.rows[0]

    // Notify the item owner about the status change
    let notificationTitle, notificationMessage

    switch (status) {
      case "active":
        notificationTitle = "Item Approved"
        notificationMessage = `Your item "${updatedItem.title}" has been approved and is now active.`
        break
      case "rejected":
        notificationTitle = "Item Rejected"
        notificationMessage = `Your item "${updatedItem.title}" has been rejected. Reason: ${rejectionReason}`
        break
      case "completed":
        notificationTitle = "Item Marked as Completed"
        notificationMessage = `Your item "${updatedItem.title}" has been marked as completed.`
        break
      default:
        notificationTitle = "Item Status Updated"
        notificationMessage = `Your item "${updatedItem.title}" status has been updated to ${status}.`
    }

    // Send notification to item owner
    await pool.query("INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)", [
      item.user_id,
      notificationTitle,
      notificationMessage,
      "item",
    ])

    res.status(200).json({
      message: `Item status updated to ${status} successfully`,
      item: {
        id: updatedItem.id,
        title: updatedItem.title,
        description: updatedItem.description,
        categoryId: updatedItem.category_id,
        userId: updatedItem.user_id,
        status: updatedItem.status,
        images: updatedItem.images,
        location: updatedItem.location,
        customFields: updatedItem.custom_fields,
        createdAt: updatedItem.created_at,
        updatedAt: updatedItem.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if item exists
    const itemExists = await pool.query("SELECT * FROM items WHERE id = $1", [id])
    if (itemExists.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" })
    }

    const item = itemExists.rows[0]

    // Check if user has permission to delete item
    if (req.user.role === "user" && item.user_id !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to delete this item" })
    }

    // Delete item
    await pool.query("DELETE FROM items WHERE id = $1", [id])

    res.status(200).json({ message: "Item deleted successfully" })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/items/pending:
 *   get:
 *     summary: Get pending items for moderation (admin only)
 *     tags: [Items]
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
 *     responses:
 *       200:
 *         description: List of pending items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/moderation/pending", authenticateToken, isAdminOrManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    // Get total count
    const countQuery = "SELECT COUNT(*) FROM items WHERE status = $1"
    const countResult = await pool.query(countQuery, ["pending"])
    const totalItems = Number.parseInt(countResult.rows[0].count)

    // Get pending items with pagination
    const query = `
      SELECT i.*, c.name as category_name, u.email as user_email,
             u.first_name as user_first_name, u.last_name as user_last_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.status = $1
      ORDER BY i.created_at ASC
      LIMIT $2 OFFSET $3
    `

    const result = await pool.query(query, ["pending", limit, offset])

    res.status(200).json({
      items: result.rows.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        categoryId: item.category_id,
        categoryName: item.category_name,
        userId: item.user_id,
        userEmail: item.user_email,
        userName: `${item.user_first_name || ""} ${item.user_last_name || ""}`.trim(),
        status: item.status,
        images: item.images,
        location: item.location,
        customFields: item.custom_fields,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
      pagination: {
        total: totalItems,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalItems / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router

