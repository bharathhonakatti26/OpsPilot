import { asyncHandler } from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import {
  listNotifications,
  markNotificationAsRead,
  markAllNotificationsRead,
} from '../services/notification.service.js'

export const listUserNotifications = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query)
  const notifications = await listNotifications(req.user.id, pagination)

  res.success({
    message: 'Notifications retrieved',
    data: { notifications },
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: notifications.length,
    },
  })
})

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(
    req.params.notificationId,
    req.user.id,
  )
  res.success({ message: 'Notification marked read', data: { notification } })
})

export const markAllRead = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.user.id)
  res.success({ message: 'All notifications marked read' })
})
