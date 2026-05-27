import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'contributor' },
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    key: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [memberSchema],
  },
  { timestamps: true },
)

projectSchema.index({ workspace: 1, key: 1 }, { unique: true })

export const Project = mongoose.model('Project', projectSchema)
