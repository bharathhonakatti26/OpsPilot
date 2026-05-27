import ms from 'ms'
import { env } from '../config/env.js'

export const getRefreshCookieOptions = (overrides = {}) => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAMESITE,
  domain: env.COOKIE_DOMAIN || undefined,
  signed: true,
  maxAge: ms(env.JWT_REFRESH_EXPIRES),
  ...overrides,
})
