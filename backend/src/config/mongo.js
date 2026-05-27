import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from './logger.js'
import { delay } from '../utils/delay.js'

mongoose.set('strictQuery', true)

export const connectMongo = async () => {
  for (let attempt = 1; attempt <= env.MONGO_RETRY_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: env.MONGO_RETRY_DELAY_MS,
      })
      logger.info({ attempt }, 'MongoDB connection established')
      return mongoose.connection
    } catch (error) {
      logger.warn({ attempt, err: error }, 'MongoDB connection failed')
      if (attempt === env.MONGO_RETRY_ATTEMPTS) throw error
      await delay(env.MONGO_RETRY_DELAY_MS)
    }
  }
  return mongoose.connection
}

export const disconnectMongo = async () => {
  await mongoose.disconnect()
}
