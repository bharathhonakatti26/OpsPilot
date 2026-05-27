import { User } from '../models/User.js'

export const createUser = (data) => User.create(data)

export const findUserByEmail = (email) =>
  User.findOne({ email }).select('+passwordHash')

export const findUserById = (id) => User.findById(id)

export const setEmailVerification = (id, tokenHash, expiresAt) =>
  User.findByIdAndUpdate(
    id,
    {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: expiresAt,
    },
    { new: true },
  )

export const setPasswordReset = (id, tokenHash, expiresAt) =>
  User.findByIdAndUpdate(
    id,
    {
      passwordResetToken: tokenHash,
      passwordResetExpires: expiresAt,
    },
    { new: true },
  )

export const verifyEmailByToken = (tokenHash) =>
  User.findOneAndUpdate(
    {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    },
    {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
    { new: true },
  )

export const resetPasswordByToken = (tokenHash, passwordHash) =>
  User.findOneAndUpdate(
    {
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    },
    {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
    { new: true },
  )

export const updateLastLogin = (id) =>
  User.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true })
