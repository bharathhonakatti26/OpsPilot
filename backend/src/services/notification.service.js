import {
  createNotification,
  findNotificationsByUser,
  markNotificationRead,
  markAllRead,
} from '../repositories/notification.repository.js'
import { AppError } from '../utils/appError.js'
import { getIO } from '../sockets/index.js'

const emitNotification = (userId, payload) => {
  try {
    const io = getIO()
    io.to(`user:${userId}`).emit('notification:new', payload)
  } catch (error) {
    return
  }
}

export const createUserNotification = async (payload) => {
  const notification = await createNotification(payload)
  emitNotification(notification.user.toString(), { notification })
  return notification
}

export const listNotifications = async (userId, pagination) =>
  findNotificationsByUser(userId, pagination)

export const markNotificationAsRead = async (id, userId) => {
  const notification = await markNotificationRead(id, userId)
  if (!notification) {
    throw new AppError('Notification not found', 404, 'NOTIFICATION_NOT_FOUND')
  }
  return notification
}

export const markAllNotificationsRead = async (userId) => {
  await markAllRead(userId)
  return { success: true }
}
