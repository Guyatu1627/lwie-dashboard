import nodemailer from "nodemailer"
import { createAuditLog } from "./auditLogger.js"

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.text] - Email plain text content
 * @param {string} [options.from] - Sender email (defaults to EMAIL_FROM env var)
 * @returns {Promise<Object>} - Nodemailer info object
 */
export async function sendEmail({ to, subject, html, text, from = process.env.EMAIL_FROM }) {
  try {
    // Verify connection configuration
    await transporter.verify()

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    })

    // Log email sent
    createAuditLog({
      action: "EMAIL_SENT",
      details: {
        to,
        subject,
        messageId: info.messageId,
      },
    }).catch((err) => console.error("Error logging email sent:", err))

    return info
  } catch (error) {
    console.error("Email sending error:", error)

    // Log email error
    createAuditLog({
      action: "EMAIL_ERROR",
      details: {
        to,
        subject,
        error: error.message,
      },
    }).catch((err) => console.error("Error logging email error:", err))

    throw error
  }
}

