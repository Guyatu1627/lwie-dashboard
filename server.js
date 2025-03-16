import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { createServer } from "http"
import { Server } from "socket.io"
import Redis from "ioredis"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

// Import routes
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import itemRoutes from "./routes/items.js"
import templateRoutes from "./routes/templates.js"
import securityRoutes from "./routes/security.js"
import reportRoutes from "./routes/reports.js"
import dashboardRoutes from "./routes/dashboard.js"
import advertisementRoutes from "./routes/advertisements.js"
import paymentRoutes from "./routes/payments.js"
import managerAnalyticsRoutes from "./routes/manager-analytics.js"
import managerNotificationsRoutes from "./routes/manager-notifications.js"

// Import middleware
import { authenticateToken } from "./middleware/auth.js"

// Initialize Redis client
export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  db: Number.parseInt(process.env.REDIS_DB || "0"),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err)
})

redisClient.on("connect", () => {
  console.log("Connected to Redis")
})

// Initialize Express app
const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Apply middleware
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan("dev"))

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
})

// Apply rate limiting to all routes
app.use("/api/", apiLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/items", authenticateToken, itemRoutes)
app.use("/api/templates", authenticateToken, templateRoutes)
app.use("/api/security", authenticateToken, securityRoutes)
app.use("/api/reports", authenticateToken, reportRoutes)
app.use("/api/dashboard", authenticateToken, dashboardRoutes)
app.use("/api/advertisements", authenticateToken, advertisementRoutes)
app.use("/api/payments", authenticateToken, paymentRoutes)
app.use("/api/manager/analytics", authenticateToken, managerAnalyticsRoutes)
app.use("/api/notifications", authenticateToken, managerNotificationsRoutes)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Internal server error" })
})

// Create HTTP server
const server = createServer(app)

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error("Authentication error"))
    }

    // Verify token using Redis
    const sessionData = await redisClient.get(`session:${token}`)

    if (!sessionData) {
      return next(new Error("Invalid token"))
    }

    const session = JSON.parse(sessionData)
    socket.user = session
    next()
  } catch (error) {
    next(new Error("Authentication error"))
  }
})

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.userId}`)

  // Join user-specific room
  socket.join(`user:${socket.user.userId}`)

  // Join role-specific room
  socket.join(`role:${socket.user.role}`)

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user.userId}`)
  })
})

// Export Socket.IO instance
export const socketIo = io

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

