import { Notification } from '../models/Notification.js'

export const createNotification = (data) => Notification.create(data)

export const findNotificationsByUser = (userId, { skip, limit, sort }) =>
  Notification.find({ user: userId }).sort(sort).skip(skip).limit(limit)

export const markNotificationRead = (id, userId) =>
  Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { readAt: new Date() },
    { new: true },
  )

export const markAllRead = (userId) =>
  Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() })
