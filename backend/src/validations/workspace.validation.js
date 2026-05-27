import Joi from 'joi'
import { ROLES } from '../utils/constants.js'

export const createWorkspace = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).max(120).required(),
  }).required(),
})

export const listWorkspaces = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }).optional(),
})

export const inviteMember = Joi.object({
  params: Joi.object({
    workspaceId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string()
      .valid(ROLES.OWNER, ROLES.ADMIN, ROLES.MEMBER)
      .required(),
  }).required(),
})

export const acceptInvite = Joi.object({
  params: Joi.object({
    workspaceId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    token: Joi.string().required(),
  }).required(),
})
