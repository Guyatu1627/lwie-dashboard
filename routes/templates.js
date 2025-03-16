import express from "express"
import { pool } from "../db/config.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all templates
 *     tags: [Templates]
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
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: List of templates
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", categoryId } = req.query
    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    const params = []
    let paramIndex = 1

    if (search) {
      conditions.push(`(t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (categoryId) {
      conditions.push(`t.category_id = $${paramIndex}`)
      params.push(categoryId)
      paramIndex++
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM templates t ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const totalTemplates = Number.parseInt(countResult.rows[0].count)

    // Get templates with pagination
    const query = `
      SELECT t.*, c.name as category_name
      FROM templates t
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    const result = await pool.query(query, [...params, limit, offset])

    res.status(200).json({
      templates: result.rows.map((template) => ({
        id: template.id,
        name: template.name,
        description: template.description,
        categoryId: template.category_id,
        categoryName: template.category_name,
        fields: template.fields,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
      })),
      pagination: {
        total: totalTemplates,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        totalPages: Math.ceil(totalTemplates / limit),
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 */
router.get("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT t.*, c.name as category_name
       FROM templates t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" })
    }

    const template = result.rows[0]

    res.status(200).json({
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
        categoryId: template.category_id,
        categoryName: template.category_name,
        fields: template.fields,
        createdAt: template.created_at,
        updatedAt: template.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
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
 *               - fields
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Template created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, description, categoryId, fields } = req.body

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Fields are required and must be an array" })
    }

    // Check if category exists
    if (categoryId) {
      const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId])
      if (categoryExists.rows.length === 0) {
        return res.status(400).json({ message: "Category not found" })
      }
    }

    // Create template
    const result = await pool.query(
      "INSERT INTO templates (name, description, category_id, fields) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, categoryId, JSON.stringify(fields)],
    )

    const newTemplate = result.rows[0]

    res.status(201).json({
      message: "Template created successfully",
      template: {
        id: newTemplate.id,
        name: newTemplate.name,
        description: newTemplate.description,
        categoryId: newTemplate.category_id,
        fields: newTemplate.fields,
        createdAt: newTemplate.created_at,
        updatedAt: newTemplate.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/templates/{id}:
 *   put:
 *     summary: Update template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Template ID
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
 *               categoryId:
 *                 type: integer
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Template not found
 */
router.put("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, categoryId, fields } = req.body

    // Check if template exists
    const templateExists = await pool.query("SELECT * FROM templates WHERE id = $1", [id])
    if (templateExists.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" })
    }

    // Check if category exists
    if (categoryId) {
      const categoryExists = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId])
      if (categoryExists.rows.length === 0) {
        return res.status(400).json({ message: "Category not found" })
      }
    }

    // Validate fields if provided
    if (fields && (!Array.isArray(fields) || fields.length === 0)) {
      return res.status(400).json({ message: "Fields must be an array and cannot be empty" })
    }

    // Update template
    const result = await pool.query(
      `UPDATE templates 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           fields = COALESCE($4, fields),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, categoryId, fields ? JSON.stringify(fields) : null, id],
    )

    const updatedTemplate = result.rows[0]

    res.status(200).json({
      message: "Template updated successfully",
      template: {
        id: updatedTemplate.id,
        name: updatedTemplate.name,
        description: updatedTemplate.description,
        categoryId: updatedTemplate.category_id,
        fields: updatedTemplate.fields,
        createdAt: updatedTemplate.created_at,
        updatedAt: updatedTemplate.updated_at,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Template not found
 *       409:
 *         description: Template is in use
 */
router.delete("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if template exists
    const templateExists = await pool.query("SELECT * FROM templates WHERE id = $1", [id])
    if (templateExists.rows.length === 0) {
      return res.status(404).json({ message: "Template not found" })
    }

    // Check if template is in use
    const items = await pool.query("SELECT * FROM items WHERE category_id = $1", [id])
    if (items.rows.length > 0) {
      return res.status(409).json({ message: "Template is in use by items. Delete them first." })
    }

    // Delete template
    await pool.query("DELETE FROM templates WHERE id = $1", [id])

    res.status(200).json({ message: "Template deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router

