import mongoose from 'mongoose'
import { NOTIFICATION_TYPES } from '../utils/constants.js'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      default: NOTIFICATION_TYPES.SYSTEM,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    payload: { type: Object, default: {} },
    readAt: Date,
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
