import mongoose from 'mongoose'
import { ROLES } from '../utils/constants.js'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    roles: {
      type: [String],
      enum: Object.values(ROLES),
      default: [ROLES.MEMBER],
    },
    isEmailVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: Date,
    lastLoginAt: Date,
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash
    delete ret.emailVerificationToken
    delete ret.passwordResetToken
    return ret
  },
})

export const User = mongoose.model('User', userSchema)
