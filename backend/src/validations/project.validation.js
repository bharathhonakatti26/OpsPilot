import Joi from 'joi'

export const createProject = Joi.object({
  params: Joi.object({
    workspaceId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    name: Joi.string().min(3).max(120).required(),
    key: Joi.string().min(2).max(10).required(),
    description: Joi.string().allow('').max(2000).optional(),
  }).required(),
})

export const listProjects = Joi.object({
  params: Joi.object({
    workspaceId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }).optional(),
})

export const updateProject = Joi.object({
  params: Joi.object({
    projectId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    name: Joi.string().min(3).max(120).optional(),
    description: Joi.string().allow('').max(2000).optional(),
    status: Joi.string().valid('active', 'archived').optional(),
  }).required(),
})
