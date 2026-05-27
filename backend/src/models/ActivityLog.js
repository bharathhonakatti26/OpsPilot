import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true, trim: true, maxlength: 120 },
    entityType: { type: String, trim: true, maxlength: 120 },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object, default: {} },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
)

activityLogSchema.index({ workspace: 1, createdAt: -1 })

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)
