import { env } from './env.js'
import { parseCommaList } from '../utils/parse.js'

const allowedOrigins = parseCommaList(env.CORS_ORIGIN)

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true,
}
