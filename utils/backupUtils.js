import { exec } from "child_process"
import fs from "fs"
import path from "path"
import util from "util"
import { createAuditLog } from "./auditLogger.js"

const execPromise = util.promisify(exec)

export const backupDatabase = async () => {
  try {
    // Create backups directory if it doesn't exist
    const backupsDir = path.join(process.cwd(), "backups")
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFilename = `backup-${timestamp}.sql`
    const backupPath = path.join(backupsDir, backupFilename)

    // Build pg_dump command
    const pgDumpCmd = `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f ${backupPath}`

    // Execute pg_dump
    await execPromise(pgDumpCmd, {
      env: {
        ...process.env,
        PGPASSWORD: process.env.DB_PASSWORD,
      },
    })

    // Check if backup file was created
    if (!fs.existsSync(backupPath)) {
      throw new Error("Backup file was not created")
    }

    // Get file size
    const stats = fs.statSync(backupPath)
    const fileSizeInBytes = stats.size
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024)

    console.log(`Database backup created: ${backupPath} (${fileSizeInMB.toFixed(2)} MB)`)

    // Clean up old backups (keep only last 7)
    const files = fs
      .readdirSync(backupsDir)
      .filter((file) => file.startsWith("backup-"))
      .map((file) => ({
        name: file,
        path: path.join(backupsDir, file),
        created: fs.statSync(path.join(backupsDir, file)).birthtime,
      }))
      .sort((a, b) => b.created - a.created)

    // Delete old backups
    if (files.length > 7) {
      for (let i = 7; i < files.length; i++) {
        fs.unlinkSync(files[i].path)
        console.log(`Deleted old backup: ${files[i].path}`)
      }
    }

    return backupPath
  } catch (error) {
    console.error("Database backup failed:", error)
    throw error
  }
}

export const restoreDatabase = async (backupPath) => {
  try {
    // Check if backup file exists
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`)
    }

    // Build psql command
    const psqlCmd = `psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f ${backupPath}`

    // Execute psql
    await execPromise(psqlCmd, {
      env: {
        ...process.env,
        PGPASSWORD: process.env.DB_PASSWORD,
      },
    })

    console.log(`Database restored from: ${backupPath}`)

    // Log restoration
    await createAuditLog({
      action: "DATABASE_RESTORE",
      userId: null,
      details: {
        path: backupPath,
        timestamp: new Date().toISOString(),
      },
    })

    return true
  } catch (error) {
    console.error("Database restoration failed:", error)
    throw error
  }
}

