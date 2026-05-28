import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()
/** @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 */
router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getMe)

export default router
