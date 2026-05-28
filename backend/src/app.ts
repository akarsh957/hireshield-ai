import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import authRoutes from './routes/auth.routes'
import analysisRoutes from './routes/analysis.routes'
import reportRoutes from './routes/report.routes'
import chatRoutes from './routes/chat.routes'
import adminRoutes from './routes/admin.routes'
import { errorHandler } from './middleware/errorHandler'
import { createTables } from './config/database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'HireShield AI API', version: '1.0.0', description: 'Intelligent job scam detection REST API' },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
  },
  apis: ['./src/routes/*.ts']
})
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'HireShield API', timestamp: new Date().toISOString() }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/admin', adminRoutes)

// Error handler
app.use(errorHandler)

// Initialize database tables
createTables()

app.listen(PORT, () => {
  console.log(`\n🛡  HireShield API running on http://localhost:${PORT}`)
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`)
  console.log(`✅ Health:   http://localhost:${PORT}/health\n`)
})

export default app
