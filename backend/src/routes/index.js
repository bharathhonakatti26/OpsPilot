import { Router } from 'express'
import authRoutes from './auth.routes.js'
import workspaceRoutes from './workspace.routes.js'
import projectRoutes from './project.routes.js'
import taskRoutes from './task.routes.js'
import notificationRoutes from './notification.routes.js'
import healthRoutes from './health.routes.js'
import fileRoutes from './file.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/workspaces', workspaceRoutes)
router.use('/', projectRoutes)
router.use('/', taskRoutes)
router.use('/', notificationRoutes)
router.use('/', fileRoutes)
router.use('/', healthRoutes)

export default router
