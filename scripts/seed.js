import bcrypt from "bcrypt"
import { pool, initializeDatabase } from "../db/config.js"

// Function to seed the database with initial data
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...")

    // Initialize database (create tables)
    await initializeDatabase()

    // Create admin user
    const salt = await bcrypt.genSalt(10)
    const adminPassword = await bcrypt.hash("admin123", salt)
    const managerPassword = await bcrypt.hash("manager123", salt)
    const userPassword = await bcrypt.hash("user123", salt)

    // Check if admin user already exists
    const adminExists = await pool.query("SELECT * FROM users WHERE email = 'admin@lwie.com'")
    if (adminExists.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (email, password, first_name, last_name, role, is_active, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        ["admin@lwie.com", adminPassword, "Admin", "User", "admin", true, true],
      )
      console.log("Admin user created")
    }

    // Check if manager user already exists
    const managerExists = await pool.query("SELECT * FROM users WHERE email = 'manager@lwie.com'")
    if (managerExists.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (email, password, first_name, last_name, role, is_active, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        ["manager@lwie.com", managerPassword, "Manager", "User", "manager", true, true],
      )
      console.log("Manager user created")
    }

    // Check if regular user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = 'user@lwie.com'")
    if (userExists.rows.length === 0) {
      await pool.query(
        "INSERT INTO users (email, password, first_name, last_name, role, is_active, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        ["user@lwie.com", userPassword, "Regular", "User", "user", true, true],
      )
      console.log("Regular user created")
    }

    // Create categories
    const categories = [
      { name: "Electronics", description: "Electronic devices and gadgets" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Home & Garden", description: "Items for home and garden" },
      { name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
      { name: "Toys & Games", description: "Toys, games, and entertainment items" },
    ]

    for (const category of categories) {
      const categoryExists = await pool.query("SELECT * FROM categories WHERE name = $1", [category.name])
      if (categoryExists.rows.length === 0) {
        await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [
          category.name,
          category.description,
        ])
        console.log(`Category "${category.name}" created`)
      }
    }

    // Create templates
    const electronicsCategory = await pool.query("SELECT id FROM categories WHERE name = $1", ["Electronics"])
    if (electronicsCategory.rows.length > 0) {
      const electronicsTemplateExists = await pool.query("SELECT * FROM templates WHERE name = $1", [
        "Electronics Item",
      ])
      if (electronicsTemplateExists.rows.length === 0) {
        const electronicsFields = [
          { name: "brand", label: "Brand", type: "text", required: true },
          { name: "model", label: "Model", type: "text", required: true },
          {
            name: "condition",
            label: "Condition",
            type: "select",
            options: ["New", "Like New", "Good", "Fair", "Poor"],
            required: true,
          },
          { name: "age", label: "Age (years)", type: "number", required: false },
          { name: "specifications", label: "Specifications", type: "textarea", required: false },
        ]

        await pool.query("INSERT INTO templates (name, description, category_id, fields) VALUES ($1, $2, $3, $4)", [
          "Electronics Item",
          "Template for electronics items",
          electronicsCategory.rows[0].id,
          JSON.stringify(electronicsFields),
        ])
        console.log("Electronics template created")
      }
    }

    // Create sample items
    const adminUser = await pool.query("SELECT id FROM users WHERE email = 'admin@lwie.com'")
    const managerUser = await pool.query("SELECT id FROM users WHERE email = 'manager@lwie.com'")
    const regularUser = await pool.query("SELECT id FROM users WHERE email = 'user@lwie.com'")

    if (adminUser.rows.length > 0 && electronicsCategory.rows.length > 0) {
      const sampleItemExists = await pool.query("SELECT * FROM items WHERE title = $1", ["Sample Laptop"])
      if (sampleItemExists.rows.length === 0) {
        const customFields = {
          brand: "Sample Brand",
          model: "X1000",
          condition: "Good",
          age: 2,
          specifications: "16GB RAM, 512GB SSD, Intel i7",
        }

        await pool.query(
          "INSERT INTO items (title, description, category_id, user_id, status, images, location, custom_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            "Sample Laptop",
            "A sample laptop for demonstration purposes",
            electronicsCategory.rows[0].id,
            adminUser.rows[0].id,
            "active",
            ["/placeholder.svg?height=300&width=400"],
            "New York, NY",
            JSON.stringify(customFields),
          ],
        )
        console.log("Sample item created")
      }
    }

    console.log("Database seeding completed successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    // Close the pool
    await pool.end()
  }
}

// Run the seed function
seedDatabase()

