import { Router } from 'express'
import { register, login, getProfile } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { authLimiter } from '../config/redis'

const router = Router()

// Rate-limited authentication entrypoints
router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/me', authenticate, getProfile)

export default router
