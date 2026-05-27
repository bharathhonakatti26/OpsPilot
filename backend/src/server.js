import http from 'http'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { connectMongo, disconnectMongo } from './config/mongo.js'
import { connectRedis, disconnectRedis } from './config/redis.js'
import { initSocket } from './sockets/index.js'

const app = createApp()
const server = http.createServer(app)

const startServer = async () => {
  await connectMongo()
  await connectRedis()
  initSocket(server)

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'OpsPilot API listening')
  })
}

const shutdown = async (signal) => {
  logger.info({ signal }, 'Shutting down server')

  server.close(async () => {
    await disconnectMongo()
    await disconnectRedis()
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection')
})
process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception')
  shutdown('uncaughtException')
})

startServer().catch((error) => {
  logger.error({ err: error }, 'Failed to start server')
  process.exit(1)
})
