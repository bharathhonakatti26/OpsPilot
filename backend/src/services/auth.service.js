import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { env } from '../config/env.js'
import { AppError } from '../utils/appError.js'
import { hashToken } from '../utils/crypto.js'
import {
  createUser,
  findUserByEmail,
  findUserById,
  setEmailVerification,
  setPasswordReset,
  verifyEmailByToken,
  resetPasswordByToken,
  updateLastLogin,
} from '../repositories/user.repository.js'
import {
  storeSession,
  getSession,
  deleteSession,
} from '../repositories/session.repository.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './token.service.js'

export const registerUser = async ({ name, email, password }) => {
  const existing = await findUserByEmail(email)
  if (existing) {
    throw new AppError('Email already in use', 409, 'EMAIL_IN_USE')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await createUser({ name, email, passwordHash })

  const verificationToken = nanoid(32)
  const tokenHash = hashToken(verificationToken)
  const expiresAt = new Date(Date.now() + env.EMAIL_VERIFY_TTL_SECONDS * 1000)
  await setEmailVerification(user._id, tokenHash, expiresAt)

  return { user, verificationToken }
}

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email)

  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
  }

  if (!user.isEmailVerified) {
    throw new AppError('Email not verified', 403, 'EMAIL_NOT_VERIFIED')
  }

  if (user.status !== 'active') {
    throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED')
  }

  await updateLastLogin(user._id)

  const accessToken = signAccessToken({
    id: user._id.toString(),
    email: user.email,
    roles: user.roles,
    name: user.name,
  })

  const { token: refreshToken, tokenId } = signRefreshToken({
    id: user._id.toString(),
  })

  await storeSession({
    tokenId,
    payload: { userId: user._id.toString() },
    ttlSeconds: env.SESSION_TTL_SECONDS,
  })

  return { user: user.toJSON(), accessToken, refreshToken, tokenId }
}

export const refreshSession = async (refreshToken) => {
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH')
  }

  if (payload.type !== 'refresh') {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH')
  }

  const session = await getSession(payload.jti)
  if (!session || session.userId !== payload.sub) {
    throw new AppError('Session expired', 401, 'SESSION_EXPIRED')
  }

  await deleteSession(payload.jti)

  const user = await findUserById(payload.sub)
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  const accessToken = signAccessToken({
    id: user._id.toString(),
    email: user.email,
    roles: user.roles,
    name: user.name,
  })

  const { token: newRefreshToken, tokenId } = signRefreshToken({
    id: user._id.toString(),
  })

  await storeSession({
    tokenId,
    payload: { userId: user._id.toString() },
    ttlSeconds: env.SESSION_TTL_SECONDS,
  })

  return {
    accessToken,
    refreshToken: newRefreshToken,
    tokenId,
  }
}

export const logoutSession = async (refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken)
    await deleteSession(payload.jti)
  } catch (error) {
    return
  }
}

export const requestPasswordReset = async (email) => {
  const user = await findUserByEmail(email)
  if (!user) {
    return { requested: true }
  }

  const resetToken = nanoid(32)
  const tokenHash = hashToken(resetToken)
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TTL_SECONDS * 1000)
  await setPasswordReset(user._id, tokenHash, expiresAt)

  return { requested: true, resetToken }
}

export const resetPassword = async ({ token, newPassword }) => {
  const tokenHash = hashToken(token)
  const passwordHash = await bcrypt.hash(newPassword, 12)
  const user = await resetPasswordByToken(tokenHash, passwordHash)

  if (!user) {
    throw new AppError('Invalid or expired token', 400, 'TOKEN_INVALID')
  }

  return { user: user.toJSON() }
}

export const verifyEmail = async (token) => {
  const tokenHash = hashToken(token)
  const user = await verifyEmailByToken(tokenHash)

  if (!user) {
    throw new AppError('Invalid or expired token', 400, 'TOKEN_INVALID')
  }

  return { user: user.toJSON() }
}
