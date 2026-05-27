import pino from 'pino'
import { env } from './env.js'

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: 'opspilot-api',
    env: env.NODE_ENV,
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.newPassword',
      'req.body.refreshToken',
      'passwordHash',
      'refreshToken',
      'accessToken',
    ],
    remove: true,
  },
})
