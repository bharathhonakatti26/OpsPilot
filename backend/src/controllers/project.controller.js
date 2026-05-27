import { asyncHandler } from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import {
  createProjectForWorkspace,
  listProjects,
  updateProjectById,
  deleteProjectById,
  getProjectById,
} from '../services/project.service.js'
import { logActivity } from '../services/activityLog.service.js'

export const createProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params
  const project = await createProjectForWorkspace({
    workspace: workspaceId,
    name: req.body.name,
    key: req.body.key,
    description: req.body.description,
    lead: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }],
  })

  await logActivity({
    workspaceId,
    actorId: req.user.id,
    action: 'project.created',
    entityType: 'project',
    entityId: project._id,
    metadata: { name: project.name, key: project.key },
    req,
  })

  res.success({
    statusCode: 201,
    message: 'Project created',
    data: { project },
  })
})

export const listWorkspaceProjects = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params
  const pagination = parsePagination(req.query)
  const projects = await listProjects(workspaceId, pagination)

  res.success({
    message: 'Projects retrieved',
    data: { projects },
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: projects.length,
    },
  })
})

export const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.projectId)
  res.success({ message: 'Project retrieved', data: { project } })
})

export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectById(req.params.projectId, req.body)
  await logActivity({
    workspaceId: project.workspace,
    actorId: req.user.id,
    action: 'project.updated',
    entityType: 'project',
    entityId: project._id,
    metadata: { updates: Object.keys(req.body) },
    req,
  })
  res.success({ message: 'Project updated', data: { project } })
})

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await deleteProjectById(req.params.projectId)
  await logActivity({
    workspaceId: project.workspace,
    actorId: req.user.id,
    action: 'project.deleted',
    entityType: 'project',
    entityId: project._id,
    metadata: { name: project.name },
    req,
  })
  res.success({ message: 'Project deleted', data: { project } })
})
