import { asyncHandler } from '../utils/asyncHandler.js'
import { parsePagination } from '../utils/pagination.js'
import {
  createWorkspaceForUser,
  listWorkspaces,
  inviteWorkspaceMember,
  acceptWorkspaceInvite,
} from '../services/workspace.service.js'
import { logActivity } from '../services/activityLog.service.js'

export const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await createWorkspaceForUser({
    name: req.body.name,
    ownerId: req.user.id,
  })

  await logActivity({
    workspaceId: workspace._id,
    actorId: req.user.id,
    action: 'workspace.created',
    entityType: 'workspace',
    entityId: workspace._id,
    metadata: { name: workspace.name },
    req,
  })

  res.success({
    statusCode: 201,
    message: 'Workspace created',
    data: { workspace },
  })
})

export const listUserWorkspaces = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query)
  const workspaces = await listWorkspaces(req.user.id, pagination)

  res.success({
    message: 'Workspaces retrieved',
    data: { workspaces },
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      count: workspaces.length,
    },
  })
})

export const inviteMember = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params
  const { email, role } = req.body

  const result = await inviteWorkspaceMember({
    workspaceId,
    email,
    role,
    invitedBy: req.user.id,
  })

  await logActivity({
    workspaceId,
    actorId: req.user.id,
    action: 'workspace.invite.created',
    entityType: 'invite',
    entityId: workspaceId,
    metadata: { email, role },
    req,
  })

  res.success({
    statusCode: 201,
    message: 'Invite created',
    data: result,
  })
})

export const acceptInvite = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params
  const { token } = req.body

  const workspace = await acceptWorkspaceInvite({
    workspaceId,
    token,
    userId: req.user.id,
  })

  await logActivity({
    workspaceId,
    actorId: req.user.id,
    action: 'workspace.invite.accepted',
    entityType: 'invite',
    entityId: workspaceId,
    metadata: { userId: req.user.id },
    req,
  })

  res.success({
    message: 'Invite accepted',
    data: { workspace },
  })
})
