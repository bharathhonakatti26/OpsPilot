import { asyncHandler } from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import {
  createTaskForProject,
  listTasks,
  updateTaskById,
  deleteTaskById,
  addTaskComment,
  getTaskById,
} from '../services/task.service.js'
import { getProjectById } from '../services/project.service.js'
import { logActivity } from '../services/activityLog.service.js'

export const createTask = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.projectId)
  const task = await createTaskForProject({
    project: project._id,
    workspace: project.workspace,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    assignee: req.body.assignee,
    dueDate: req.body.dueDate,
    labels: req.body.labels,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  })

  await logActivity({
    workspaceId: task.workspace,
    actorId: req.user.id,
    action: 'task.created',
    entityType: 'task',
    entityId: task._id,
    metadata: { title: task.title, project: task.project },
    req,
  })

  res.success({
    statusCode: 201,
    message: 'Task created',
    data: { task },
  })
})

export const listProjectTasks = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query)
  const filters = {
    project: req.params.projectId,
  }

  if (req.query.status) filters.status = req.query.status
  if (req.query.priority) filters.priority = req.query.priority
  if (req.query.assignee) filters.assignee = req.query.assignee

  const tasks = await listTasks(filters, pagination)
  res.success({
    message: 'Tasks retrieved',
    data: { tasks },
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: tasks.length,
    },
  })
})

export const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId)
  res.success({ message: 'Task retrieved', data: { task } })
})

export const updateTask = asyncHandler(async (req, res) => {
  const task = await updateTaskById(req.params.taskId, {
    ...req.body,
    updatedBy: req.user.id,
  })
  await logActivity({
    workspaceId: task.workspace,
    actorId: req.user.id,
    action: 'task.updated',
    entityType: 'task',
    entityId: task._id,
    metadata: { updates: Object.keys(req.body) },
    req,
  })
  res.success({ message: 'Task updated', data: { task } })
})

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await deleteTaskById(req.params.taskId)
  await logActivity({
    workspaceId: task.workspace,
    actorId: req.user.id,
    action: 'task.deleted',
    entityType: 'task',
    entityId: task._id,
    metadata: { title: task.title },
    req,
  })
  res.success({ message: 'Task deleted', data: { task } })
})

export const addComment = asyncHandler(async (req, res) => {
  const task = await addTaskComment(req.params.taskId, {
    author: req.user.id,
    body: req.body.body,
  })
  await logActivity({
    workspaceId: task.workspace,
    actorId: req.user.id,
    action: 'task.comment.added',
    entityType: 'task',
    entityId: task._id,
    metadata: { length: req.body.body.length },
    req,
  })
  res.success({ message: 'Comment added', data: { task } })
})
