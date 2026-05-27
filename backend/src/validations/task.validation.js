import Joi from 'joi'
import { TASK_PRIORITY, TASK_STATUS } from '../utils/constants.js'

export const createTask = Joi.object({
  params: Joi.object({
    projectId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    title: Joi.string().min(3).max(160).required(),
    description: Joi.string().allow('').max(4000).optional(),
    priority: Joi.string()
      .valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH,
        TASK_PRIORITY.CRITICAL,
      )
      .optional(),
    assignee: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    labels: Joi.array().items(Joi.string().max(40)).optional(),
  }).required(),
})

export const listTasks = Joi.object({
  params: Joi.object({
    projectId: Joi.string().required(),
  }).required(),
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    status: Joi.string()
      .valid(
        TASK_STATUS.TODO,
        TASK_STATUS.IN_PROGRESS,
        TASK_STATUS.BLOCKED,
        TASK_STATUS.DONE,
      )
      .optional(),
    priority: Joi.string()
      .valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH,
        TASK_PRIORITY.CRITICAL,
      )
      .optional(),
    assignee: Joi.string().optional(),
  }).optional(),
})

export const updateTask = Joi.object({
  params: Joi.object({
    taskId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    title: Joi.string().min(3).max(160).optional(),
    description: Joi.string().allow('').max(4000).optional(),
    status: Joi.string()
      .valid(
        TASK_STATUS.TODO,
        TASK_STATUS.IN_PROGRESS,
        TASK_STATUS.BLOCKED,
        TASK_STATUS.DONE,
      )
      .optional(),
    priority: Joi.string()
      .valid(
        TASK_PRIORITY.LOW,
        TASK_PRIORITY.MEDIUM,
        TASK_PRIORITY.HIGH,
        TASK_PRIORITY.CRITICAL,
      )
      .optional(),
    assignee: Joi.string().allow(null).optional(),
    dueDate: Joi.date().allow(null).optional(),
    labels: Joi.array().items(Joi.string().max(40)).optional(),
  }).required(),
})

export const addComment = Joi.object({
  params: Joi.object({
    taskId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    body: Joi.string().min(1).max(2000).required(),
  }).required(),
})
