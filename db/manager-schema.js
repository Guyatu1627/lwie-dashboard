import { pool } from "./config.js"

export const initializeManagerSchema = async () => {
  const client = await pool.connect()

  try {
    // Begin transaction
    await client.query("BEGIN")

    // Create advertisements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        link_url TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
        rejection_reason TEXT,
        approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        placement VARCHAR(50) NOT NULL DEFAULT 'sidebar' CHECK (placement IN ('sidebar', 'banner', 'featured', 'popup')),
        priority INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        budget DECIMAL(10, 2) NOT NULL,
        cost_per_click DECIMAL(10, 2),
        cost_per_impression DECIMAL(10, 2),
        target_audience JSONB,
        is_paid BOOLEAN DEFAULT false
      )
    `)

    // Create payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        advertisement_id INTEGER REFERENCES advertisements(id) ON DELETE SET NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255),
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_details JSONB
      )
    `)

    // Create reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        report_type VARCHAR(50) NOT NULL,
        data JSONB NOT NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_range_start DATE,
        date_range_end DATE,
        is_public BOOLEAN DEFAULT false,
        download_count INTEGER DEFAULT 0
      )
    `)

    // Create user_activity table for tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        details JSONB,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        page_url VARCHAR(255),
        session_id VARCHAR(255),
        device_info VARCHAR(255)
      )
    `)

    // Create manager_notifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT false,
        related_id INTEGER,
        related_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        action_url VARCHAR(255)
      )
    `)

    // Create indexes for performance
    await client.query("CREATE INDEX IF NOT EXISTS idx_advertisements_status ON advertisements(status)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_advertisements_user_id ON advertisements(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_advertisements_approved_by ON advertisements(approved_by)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_payments_advertisement_id ON payments(advertisement_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_user_activity_activity_type ON user_activity(activity_type)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_manager_notifications_user_id ON manager_notifications(user_id)")
    await client.query("CREATE INDEX IF NOT EXISTS idx_manager_notifications_is_read ON manager_notifications(is_read)")

    // Commit transaction
    await client.query("COMMIT")

    console.log("Manager schema initialized successfully")
  } catch (err) {
    // Rollback transaction in case of error
    await client.query("ROLLBACK")
    console.error("Error initializing manager schema:", err.message)
    throw err
  } finally {
    // Release client back to pool
    client.release()
  }
}

