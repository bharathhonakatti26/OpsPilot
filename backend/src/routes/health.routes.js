import { Router } from 'express'
import { healthCheck, readinessCheck } from '../controllers/health.controller.js'

const router = Router()

router.get('/health', healthCheck)
router.get('/health/ready', readinessCheck)

export default router
