import { verifyAccessToken } from '../services/token.service.js'
import { logger } from '../config/logger.js'

export const socketAuth = (socket, next) => {
  try {
    const authHeader = socket.handshake.headers?.authorization || ''
    const bearerToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null
    const token = socket.handshake.auth?.token || bearerToken

    if (!token) {
      return next(new Error('Unauthorized'))
    }

    const payload = verifyAccessToken(token)
    if (payload.type !== 'access') {
      return next(new Error('Unauthorized'))
    }
    socket.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      name: payload.name,
    }
    return next()
  } catch (error) {
    logger.warn({ err: error }, 'Socket authentication failed')
    return next(new Error('Unauthorized'))
  }
}
