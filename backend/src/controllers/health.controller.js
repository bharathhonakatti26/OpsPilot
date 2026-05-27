import mongoose from 'mongoose'
import { getRedisClient } from '../config/redis.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const healthCheck = asyncHandler(async (_req, res) => {
  const mongoState = mongoose.connection.readyState === 1 ? 'up' : 'down'
  let redisState = 'down'

  try {
    const client = getRedisClient()
    await client.ping()
    redisState = 'up'
  } catch (error) {
    redisState = 'down'
  }

  res.success({
    message: 'Service healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        mongo: mongoState,
        redis: redisState,
      },
    },
  })
})

export const readinessCheck = asyncHandler(async (_req, res) => {
  const mongoReady = mongoose.connection.readyState === 1
  let redisReady = false

  try {
    const client = getRedisClient()
    redisReady = Boolean(client?.isOpen)
  } catch (error) {
    redisReady = false
  }

  const ready = mongoReady && redisReady

  res.success({
    statusCode: ready ? 200 : 503,
    message: ready ? 'Service ready' : 'Service not ready',
    data: {
      ready,
      mongoReady,
      redisReady,
    },
  })
})
