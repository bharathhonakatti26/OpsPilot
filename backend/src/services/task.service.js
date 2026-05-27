import { AppError } from '../utils/appError.js'
import {
  createTask,
  findTasks,
  findTaskById,
  updateTask,
  deleteTask,
  addComment,
} from '../repositories/task.repository.js'
import { getIO } from '../sockets/index.js'

const emitTaskEvent = (workspaceId, event, payload) => {
  try {
    const io = getIO()
    io.to(`workspace:${workspaceId}`).emit(event, payload)
  } catch (error) {
    return
  }
}

export const createTaskForProject = async (payload) => {
  const task = await createTask(payload)
  emitTaskEvent(task.workspace.toString(), 'task:created', { task })
  return task
}

export const listTasks = async (filters, pagination) => findTasks(filters, pagination)

export const updateTaskById = async (taskId, updates) => {
  const task = await updateTask(taskId, updates)
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  emitTaskEvent(task.workspace.toString(), 'task:updated', { task })
  return task
}

export const deleteTaskById = async (taskId) => {
  const task = await deleteTask(taskId)
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  emitTaskEvent(task.workspace.toString(), 'task:deleted', { taskId })
  return task
}

export const addTaskComment = async (taskId, comment) => {
  const task = await addComment(taskId, comment)
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  emitTaskEvent(task.workspace.toString(), 'task:commented', { taskId, comment })
  return task
}

export const getTaskById = async (taskId) => {
  const task = await findTaskById(taskId)
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  return task
}
