import { Router } from 'express'
import { analyzeJob, analyzeEmail, analyzeCompany, getScanHistory } from '../controllers/analysisController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()
router.use(authenticate)
router.post('/job', analyzeJob)
router.post('/email', analyzeEmail)
router.post('/company', analyzeCompany)
router.get('/history', getScanHistory)
export default router
