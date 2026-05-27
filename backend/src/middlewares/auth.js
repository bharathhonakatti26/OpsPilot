import { AppError } from '../utils/appError.js'
import { verifyAccessToken } from '../services/token.service.js'

export const authenticate = (req, _res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'))
  }

  try {
    const payload = verifyAccessToken(token)
    if (payload.type !== 'access') {
      return next(new AppError('Invalid token', 401, 'UNAUTHORIZED'))
    }
    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      name: payload.name,
    }
    return next()
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'))
  }
}
