import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

// Route Imports
import achievementRoutes from './routes/achievementRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import bossRoutes from './routes/bossRoutes.js'
import diaryRoutes from './routes/diaryRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import questRoutes from './routes/questRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Load environment configuration
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Configure CORS Origins
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000']
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : []
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])]

// Connect to MongoDB
connectDB()

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin unified requests)
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production' ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true)
      }
      return callback(null, true) // Allow connection while logging if unexpected
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'RANKORA Backend Telemetry',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

// Mount API Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/quests', questRoutes)
app.use('/api/boss', bossRoutes)
app.use('/api/diary', diaryRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/analytics', analyticsRoutes)

// Production Static Frontend Serving (Unified Deployment)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist')
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath))

  // SPA Fallback for non-API client routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'))
  })
}

// 404 Handler for Unmatched API Endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Centralized Error Handling Middleware
app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`)
  console.log(`🚀 RANKORA Backend Active on port ${PORT}`)
  console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`)
  if (fs.existsSync(frontendDistPath)) {
    console.log(`📦 Serving production frontend bundle from: ${frontendDistPath}`)
  }
  console.log(`=========================================`)
})
