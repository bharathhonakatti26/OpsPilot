import { AppError } from '../utils/appError.js'

export const requireRoles = (...allowedRoles) => (req, _res, next) => {
  const userRoles = req.user?.roles || []
  const hasRole = allowedRoles.some((role) => userRoles.includes(role))

  if (!hasRole) {
    return next(new AppError('Forbidden', 403, 'FORBIDDEN'))
  }

  return next()
}
