import { getRedisClient } from '../config/redis.js'

const buildKey = (tokenId) => `session:${tokenId}`

export const storeSession = async ({ tokenId, payload, ttlSeconds }) => {
  const client = getRedisClient()
  await client.set(buildKey(tokenId), JSON.stringify(payload), {
    EX: ttlSeconds,
  })
}

export const getSession = async (tokenId) => {
  const client = getRedisClient()
  const value = await client.get(buildKey(tokenId))
  return value ? JSON.parse(value) : null
}

export const deleteSession = async (tokenId) => {
  const client = getRedisClient()
  await client.del(buildKey(tokenId))
}
