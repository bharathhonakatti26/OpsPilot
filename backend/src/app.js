import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import { apiLimiter } from './config/rateLimiter.js'
import { requestLogger } from './middlewares/requestLogger.js'
import { responseHandler } from './middlewares/responseHandler.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'
import healthRoutes from './routes/health.routes.js'

export const createApp = () => {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(requestLogger)
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }))
  app.use(express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }))
  app.use(cookieParser(env.COOKIE_SECRET))
  app.use(mongoSanitize())
  app.use(xss())
  app.use(hpp())
  // expose health endpoints before rate limiter so Kubernetes probes are not rate-limited
  app.use('/api/v1', healthRoutes)

  app.use(apiLimiter)
  app.use(responseHandler)

  app.use('/api/v1', routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
