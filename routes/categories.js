import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         name: parentId
 *         schema:
 *           type: integer
 *         description: Filter by parent ID
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", parentId } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (parentId) {
      conditions.push(`parent_id = $${paramIndex}`)
      params.push(parentId)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM categories ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalCategories = Number.parseInt(countResult.rows[0].count)

    // Get categories with pagination
    const query = `
      SELECT c.*, p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      ${whereClause}
      ORDER BY c.name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      categories: result.rows.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        parentId: category.parent_id,
        parentName: category.parent_name,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      })),
      pagination: {
        total: totalCategories,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalCategories / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT c.*, p.name as parent_name
       FROM categories c
       LEFT JOIN categories p ON c.parent_id = p.id
       WHERE c.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    const category = result.rows[0]

    res.status(200).json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        parentId: category.parent_id,
        parentName: category.parent_name,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, description, parentId } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    // Check if parent category exists
    if (parentId) {
      const parentExists = await pool.query("SELECT * FROM categories WHERE id = $1", [parentId])
      if (parentExists.rows.length === 0) {
        return res.status(400).json({ message: "Parent category not found" })
      }
    }

    // Create category
    const result = await pool.query(
      "INSERT INTO categories (name, description, parent_id) VALUES ($1, $2, $3) RETURNING *",
      [name, description, parentId],
    )

    const newCategory = result.rows[0]

    res.status(201).json({
      message: "Category created successfully",
      category: {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        parentId: newCategory.parent_id,
        createdAt: newCategory.created_at,
        updatedAt: newCategory.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.put("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, parentId } = req.body

    // Check if category exists
    const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [id])
    if (categoryExists.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if parent category exists
    if (parentId) {
      // Prevent circular reference
      if (Number.parseInt(id) === Number.parseInt(parentId)) {
        return res.status(400).json({ message: "A category cannot be its own parent" })
      }

      const parentExists = await pool.query("SELECT * FROM categories WHERE id = $1", [parentId])
      if (parentExists.rows.length === 0) {
        return res.status(400).json({ message: "Parent category not found" })
      }
    }

    // Update category
    const result = await pool.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           parent_id = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [name, description, parentId, id],
    )

    const updatedCategory = result.rows[0]

    res.status(200).json({
      message: "Category updated successfully",
      category: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        parentId: updatedCategory.parent_id,
        createdAt: updatedCategory.created_at,
        updatedAt: updatedCategory.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category has child categories or items
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if category exists
    const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [id])
    if (categoryExists.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if category has child categories
    const childCategories = await pool.query("SELECT * FROM categories WHERE parent_id = $1", [id])
    if (childCategories.rows.length > 0) {
      return res.status(409).json({ message: "Category has child categories. Delete them first." })
    }

    // Check if category has items
    const items = await pool.query("SELECT * FROM items WHERE category_id = $1", [id])
    if (items.rows.length > 0) {
      return res.status(409).json({ message: "Category has items. Delete them first." })
    }

    // Delete category
    await pool.query("DELETE FROM categories WHERE id = $1", [id])

    res.status(200).json({ message: "Category deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router

