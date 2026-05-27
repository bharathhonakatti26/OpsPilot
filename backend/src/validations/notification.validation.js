import Joi from 'joi'

export const listNotifications = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }).optional(),
})

export const markRead = Joi.object({
  params: Joi.object({
    notificationId: Joi.string().required(),
  }).required(),
})
