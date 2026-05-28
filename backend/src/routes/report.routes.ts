import { Router } from 'express'
import { getReports, createReport } from '../controllers/reportController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()
router.get('/', getReports)
router.post('/', authenticate, createReport)
export default router
