import { createClient } from 'redis'
import { env } from './env.js'
import { logger } from './logger.js'
import { delay } from '../utils/delay.js'

let redisClient

export const connectRedis = async () => {
  for (let attempt = 1; attempt <= env.REDIS_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const client = createClient({
        url: env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
        },
      })

      client.on('error', (error) => {
        logger.error({ err: error }, 'Redis client error')
      })

      await client.connect()
      redisClient = client
      logger.info({ attempt }, 'Redis connection established')
      return redisClient
    } catch (error) {
      logger.warn({ attempt, err: error }, 'Redis connection failed')
      if (attempt === env.REDIS_RETRY_ATTEMPTS) throw error
      await delay(env.REDIS_RETRY_DELAY_MS)
    }
  }
  return redisClient
}

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client is not initialized')
  }
  return redisClient
}

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit()
  }
}
