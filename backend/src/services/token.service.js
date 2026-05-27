import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { env } from '../config/env.js'

export const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      name: user.name,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES,
      issuer: env.TOKEN_ISSUER,
      audience: env.TOKEN_AUDIENCE,
    },
  )

export const signRefreshToken = (user) => {
  const tokenId = nanoid()
  const token = jwt.sign(
    {
      sub: user.id,
      jti: tokenId,
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES,
      issuer: env.TOKEN_ISSUER,
      audience: env.TOKEN_AUDIENCE,
    },
  )

  return { token, tokenId }
}

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET)

export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET)
