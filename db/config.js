import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

// Create a new pool instance with connection details from environment variables
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  // Add connection pool configuration for better performance
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
})

// Function to initialize the database with required tables
export const initializeDatabase = async () => {
  const client = await pool.connect()

  try {
    // Begin transaction
    await client.query("BEGIN")

    // Create users table with MFA support
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
        profile_image VARCHAR(255),
        phone VARCHAR(20),
        location VARCHAR(100),
        bio TEXT,
        is_active BOOLEAN DEFAULT true,
        is_approved BOOLEAN DEFAULT false,
        mfa_enabled BOOLEAN DEFAULT false,
        mfa_secret VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create refresh_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        ip_address VARCHAR(50),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create password_reset_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        parent_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        fields JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(20) CHECK (status IN ('pending', 'active', 'rejected', 'completed')),
        images TEXT[],
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        custom_fields JSONB
      )
    `)

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id),
        user_id INTEGER REFERENCES users(id),
        recipient_id INTEGER REFERENCES users(id),
        status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        active_users INTEGER DEFAULT 0,
        new_users INTEGER DEFAULT 0,
        total_items INTEGER DEFAULT 0,
        new_items INTEGER DEFAULT 0,
        completed_transactions INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create audit_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create api_keys table
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        key VARCHAR(255) NOT NULL UNIQUE,
        permissions TEXT[] DEFAULT ARRAY['read'],
        is_active BOOLEAN DEFAULT true,
        last_used_at TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for performance
    await client.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_items_status ON items(status)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_templates_category_id ON templates(category_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key)")

    // Create admin user if it doesn't exist
    const adminExists = await client.query("SELECT * FROM users WHERE email = $1", ["admin@lwie.com"])
    if (adminExists.rows.length === 0) {
      const bcrypt = await import("bcrypt")
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("admin123", salt)

      await client.query(
        "INSERT INTO users (email, password, first_name, last_name, role, is_active, is_approved) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        ["admin@lwie.com", hashedPassword, "Admin", "User", "admin", true, true],
      )
      console.log("Admin user created")
    }

    // Commit transaction
    await client.query("COMMIT")

    console.log("Database initialized successfully")
  } catch (err) {
    // Rollback transaction in case of error
    await client.query("ROLLBACK")
    console.error("Error initializing database:", err.message)
    throw err
  } finally {
    // Release client back to pool
    client.release()
  }
}

// Export a function to run queries with automatic retries for better resilience
export const query = async (text, params, retries = 3) => {
  let lastError

  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(text, params)
    } catch (error) {
      lastError = error

      // Only retry on connection errors, not query errors
      if (error.code !== "ECONNREFUSED" && error.code !== "ETIMEDOUT") {
        throw error
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 100))
    }
  }

  throw lastError
}

// Function to check database health
export const checkDatabaseHealth = async () => {
  try {
    const client = await pool.connect()
    try {
      await client.query("SELECT 1")
      return { status: "healthy" }
    } finally {
      client.release()
    }
  } catch (error) {
    return { status: "unhealthy", error: error.message }
  }
}

// Update package.json with new dependencies

