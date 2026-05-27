import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

const schema = Joi.object({
  PORT: Joi.number().port().required(),
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  CLIENT_URL: Joi.string().uri().required(),
  MONGO_URI: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: Joi.string().required(),
  JWT_REFRESH_EXPIRES: Joi.string().required(),
  COOKIE_SECRET: Joi.string().min(16).required(),
  CORS_ORIGIN: Joi.string().required(),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .required(),
  SOCKET_CORS_ORIGIN: Joi.string().required(),
  RATE_LIMIT_WINDOW_MS: Joi.number().required(),
  RATE_LIMIT_MAX: Joi.number().required(),
  REQUEST_BODY_LIMIT: Joi.string().required(),
  UPLOAD_DIR: Joi.string().required(),
  TOKEN_ISSUER: Joi.string().required(),
  TOKEN_AUDIENCE: Joi.string().required(),
  MONGO_RETRY_ATTEMPTS: Joi.number().required(),
  MONGO_RETRY_DELAY_MS: Joi.number().required(),
  REDIS_RETRY_ATTEMPTS: Joi.number().required(),
  REDIS_RETRY_DELAY_MS: Joi.number().required(),
  SESSION_TTL_SECONDS: Joi.number().required(),
  EMAIL_VERIFY_TTL_SECONDS: Joi.number().required(),
  PASSWORD_RESET_TTL_SECONDS: Joi.number().required(),
  COOKIE_SAMESITE: Joi.string().valid('lax', 'strict', 'none').required(),
  COOKIE_SECURE: Joi.string().valid('true', 'false').required(),
  COOKIE_DOMAIN: Joi.string().allow('').required(),
}).unknown()

const { value, error } = schema.validate(process.env, { abortEarly: false })

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`)
}

export const env = {
  ...value,
  PORT: Number(value.PORT),
  RATE_LIMIT_WINDOW_MS: Number(value.RATE_LIMIT_WINDOW_MS),
  RATE_LIMIT_MAX: Number(value.RATE_LIMIT_MAX),
  MONGO_RETRY_ATTEMPTS: Number(value.MONGO_RETRY_ATTEMPTS),
  MONGO_RETRY_DELAY_MS: Number(value.MONGO_RETRY_DELAY_MS),
  REDIS_RETRY_ATTEMPTS: Number(value.REDIS_RETRY_ATTEMPTS),
  REDIS_RETRY_DELAY_MS: Number(value.REDIS_RETRY_DELAY_MS),
  SESSION_TTL_SECONDS: Number(value.SESSION_TTL_SECONDS),
  EMAIL_VERIFY_TTL_SECONDS: Number(value.EMAIL_VERIFY_TTL_SECONDS),
  PASSWORD_RESET_TTL_SECONDS: Number(value.PASSWORD_RESET_TTL_SECONDS),
  COOKIE_SECURE: value.COOKIE_SECURE === 'true',
}
