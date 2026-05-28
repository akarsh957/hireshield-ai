import { Router } from 'express'
import { getStats, getUsers, getPendingReports, moderateReport } from '../controllers/adminController'
import { authenticate, requireAdmin } from '../middleware/authMiddleware'

const router = Router()
router.use(authenticate, requireAdmin)
router.get('/stats', getStats)
router.get('/users', getUsers)
router.get('/reports/pending', getPendingReports)
router.patch('/reports/:id', moderateReport)
export default router
