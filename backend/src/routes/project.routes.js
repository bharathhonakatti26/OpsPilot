import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  createProject,
  listProjects,
  updateProject,
} from '../validations/project.validation.js'
import {
  createProject as createProjectHandler,
  listWorkspaceProjects,
  getProject,
  updateProject as updateProjectHandler,
  deleteProject,
} from '../controllers/project.controller.js'

const router = Router()

router.get(
  '/workspaces/:workspaceId/projects',
  authenticate,
  validateRequest(listProjects),
  listWorkspaceProjects,
)
router.post(
  '/workspaces/:workspaceId/projects',
  authenticate,
  validateRequest(createProject),
  createProjectHandler,
)
router.get('/projects/:projectId', authenticate, getProject)
router.patch(
  '/projects/:projectId',
  authenticate,
  validateRequest(updateProject),
  updateProjectHandler,
)
router.delete('/projects/:projectId', authenticate, deleteProject)

export default router
