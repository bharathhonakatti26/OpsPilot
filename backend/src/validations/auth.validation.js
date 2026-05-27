import Joi from 'joi'

export const register = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
  }).required(),
})

export const login = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
  }).required(),
})

export const refresh = Joi.object({
  body: Joi.object({}).optional(),
})

export const logout = Joi.object({
  body: Joi.object({}).optional(),
})

export const forgotPassword = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
  }).required(),
})

export const resetPassword = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
  }).required(),
})

export const verifyEmail = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
  }).required(),
})
