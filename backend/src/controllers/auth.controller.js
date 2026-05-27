import { asyncHandler } from '../utils/asyncHandler.js'
import { getRefreshCookieOptions } from '../utils/cookies.js'
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from '../services/auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const { user, verificationToken } = await registerUser(req.body)
  res.success({
    statusCode: 201,
    message: 'Registration successful',
    data: { user, verificationToken },
  })
})

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body)
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions())
  res.success({
    message: 'Login successful',
    data: { user, accessToken },
  })
})

export const refresh = asyncHandler(async (req, res) => {
  const token = req.signedCookies?.refreshToken || req.cookies?.refreshToken
  const { accessToken, refreshToken } = await refreshSession(token)
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions())
  res.success({
    message: 'Token refreshed',
    data: { accessToken },
  })
})

export const logout = asyncHandler(async (req, res) => {
  const token = req.signedCookies?.refreshToken || req.cookies?.refreshToken
  if (token) {
    await logoutSession(token)
  }
  res.clearCookie('refreshToken', getRefreshCookieOptions({ maxAge: 0 }))
  res.success({ message: 'Logged out' })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await requestPasswordReset(req.body.email)
  res.success({
    message: 'Password reset requested',
    data: result,
  })
})

export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body
  const result = await resetPassword({ token, newPassword })
  res.success({
    message: 'Password reset successful',
    data: result,
  })
})

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const result = await verifyEmail(req.body.token)
  res.success({
    message: 'Email verified',
    data: result,
  })
})
