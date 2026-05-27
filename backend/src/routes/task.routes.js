import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createTask,
  listTasks,
  updateTask,
  addComment,
} from '../validations/task.validation.js'
import {
  createTask as createTaskHandler,
  listProjectTasks,
  getTask,
  updateTask as updateTaskHandler,
  deleteTask,
  addComment as addCommentHandler,
} from '../controllers/task.controller.js'

const router = Router()

router.get(
  '/projects/:projectId/tasks',
  authenticate,
  validateRequest(listTasks),
  listProjectTasks,
)
router.post(
  '/projects/:projectId/tasks',
  authenticate,
  validateRequest(createTask),
  createTaskHandler,
)
router.get('/tasks/:taskId', authenticate, getTask)
router.patch(
  '/tasks/:taskId',
  authenticate,
  validateRequest(updateTask),
  updateTaskHandler,
)
router.delete('/tasks/:taskId', authenticate, deleteTask)
router.post(
  '/tasks/:taskId/comments',
  authenticate,
  validateRequest(addComment),
  addCommentHandler,
)

export default router
