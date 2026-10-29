import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { globalLimiter } from './config/redis'
import authRoutes from './routes/auth.routes'
import scansRoutes from './routes/scans.routes'
import analyticsRoutes from './routes/analytics.routes'
import { prisma } from '@hireshield/database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

// -----------------------------------------------------------------------------
// Security Hardening (OWASP Compliance)
// -----------------------------------------------------------------------------

// Helmet helps secure Express apps by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false
  })
)

// CORS Configuration allowing specific Frontend Origins
const allowedOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
)

// Body parsers with payload size limits to guard against DoS
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Apply Global Rate Limiting (Upstash Redis or in-memory fallback)
app.use(globalLimiter)

// -----------------------------------------------------------------------------
// System Health & Diagnostics Probe
// -----------------------------------------------------------------------------

app.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'healthy'
  try {
    // Quick probe query to Neon
    await prisma.$queryRaw`SELECT 1`
  } catch (err: any) {
    dbStatus = `offline (${err.message.slice(0, 80)})`
  }

  res.status(200).json({
    status: 'online',
    service: 'hireshield-api-gateway',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    demoModeAvailable: true
  })
})

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------

app.use('/api/auth', authRoutes)
app.use('/api/scans', scansRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'The requested API route was not found on this server.'
  })
})

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🚨 [Express Global Error]:', err)

  if (err.message && err.message.includes('CORS blocked')) {
    res.status(403).json({ success: false, error: err.message })
    return
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on the server.' 
      : err.message || 'Internal Server Error'
  })
})

// -----------------------------------------------------------------------------
// Server Start
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`\n🛡️  HireShield AI Backend Gateway running natively on http://localhost:${PORT}`)
  console.log(`🌐 Allowed CORS Origins: ${allowedOrigins.join(', ')}`)
  console.log(`🔒 Security: Helmet & Upstash Rate Limiting active\n`)
})

export default app
