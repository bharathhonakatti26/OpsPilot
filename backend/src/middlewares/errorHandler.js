import { buildError } from '../utils/apiResponse.js'
import { AppError } from '../utils/appError.js'
import { logger } from '../config/logger.js'

export const errorHandler = (err, req, res, _next) => {
  const isOperational = err instanceof AppError && err.isOperational
  const statusCode = isOperational ? err.statusCode : 500
  const message = isOperational ? err.message : 'Internal server error'
  const code = isOperational ? err.code : 'INTERNAL_ERROR'

  if (!isOperational) {
    logger.error({ err, requestId: req.id }, 'Unhandled error')
  }

  res.set('X-Request-Id', req.id)
  res.status(statusCode).json(
    buildError({
      message,
      code,
      details: isOperational ? err.details : undefined,
      requestId: req.id,
    }),
  )
}
