import Joi from 'joi'

export const uploadFile = Joi.object({
  body: Joi.object({
    workspaceId: Joi.string().required(),
    projectId: Joi.string().optional(),
  }).required(),
})
