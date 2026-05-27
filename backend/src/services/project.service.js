import { AppError } from '../utils/appError.js'
import {
  createProject,
  findProjectsByWorkspace,
  findProjectById,
  updateProject,
  deleteProject,
} from '../repositories/project.repository.js'

export const createProjectForWorkspace = async (payload) => createProject(payload)

export const listProjects = async (workspaceId, pagination) =>
  findProjectsByWorkspace(workspaceId, pagination)

export const updateProjectById = async (projectId, updates) => {
  const project = await updateProject(projectId, updates)
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
  }
  return project
}

export const deleteProjectById = async (projectId) => {
  const project = await deleteProject(projectId)
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
  }
  return project
}

export const getProjectById = async (projectId) => {
  const project = await findProjectById(projectId)
  if (!project) {
    throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND')
  }
  return project
}
