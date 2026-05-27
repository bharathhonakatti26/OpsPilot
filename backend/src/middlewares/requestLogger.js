import pinoHttp from 'pino-http'
import { nanoid } from 'nanoid'
import { logger } from '../config/logger.js'

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || nanoid(),
})
