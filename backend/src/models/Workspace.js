import mongoose from 'mongoose'
import { ROLES } from '../utils/constants.js'

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const inviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
    },
    tokenHash: { type: String, required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
)

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    invites: [inviteSchema],
    settings: {
      type: Object,
      default: {
        visibility: 'private',
        retentionDays: 90,
      },
    },
  },
  { timestamps: true },
)

export const Workspace = mongoose.model('Workspace', workspaceSchema)
