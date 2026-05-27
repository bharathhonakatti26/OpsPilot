import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  listNotifications,
  markRead,
} from '../validations/notification.validation.js'
import {
  listUserNotifications,
  markRead as markReadHandler,
  markAllRead,
} from '../controllers/notification.controller.js'

const router = Router()

router.get(
  '/notifications',
  authenticate,
  validateRequest(listNotifications),
  listUserNotifications,
)
router.post(
  '/notifications/:notificationId/read',
  authenticate,
  validateRequest(markRead),
  markReadHandler,
)
router.post('/notifications/read-all', authenticate, markAllRead)

export default router
