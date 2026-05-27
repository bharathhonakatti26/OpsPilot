import rateLimit from 'express-rate-limit'
import { env } from './env.js'
import { buildError } from '../utils/apiResponse.js'

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      buildError({
        message: 'Too many requests',
        code: 'RATE_LIMITED',
        requestId: req.id,
      }),
    )
  },
})
