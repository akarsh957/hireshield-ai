import { Router } from 'express'
import { chat, getChatHistory } from '../controllers/chatController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()
router.use(authenticate)
router.post('/', chat)
router.get('/history', getChatHistory)
export default router
