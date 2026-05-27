import { nanoid } from 'nanoid'
import { env } from '../config/env.js'
import { AppError } from '../utils/appError.js'
import { hashToken } from '../utils/crypto.js'
import { ROLES } from '../utils/constants.js'
import { slugify } from '../utils/slug.js'
import {
  createWorkspace,
  findWorkspaceById,
  findWorkspacesByMember,
  addInvite,
  acceptInvite,
} from '../repositories/workspace.repository.js'

export const createWorkspaceForUser = async ({ name, ownerId }) => {
  const slugBase = slugify(name)
  const slug = `${slugBase}-${nanoid(6)}`

  return createWorkspace({
    name,
    slug,
    owner: ownerId,
    members: [{ user: ownerId, role: ROLES.OWNER }],
  })
}

export const listWorkspaces = async (userId, pagination) =>
  findWorkspacesByMember(userId, pagination)

export const inviteWorkspaceMember = async ({
  workspaceId,
  email,
  role,
  invitedBy,
}) => {
  const workspace = await findWorkspaceById(workspaceId)
  if (!workspace) {
    throw new AppError('Workspace not found', 404, 'WORKSPACE_NOT_FOUND')
  }

  const inviteToken = nanoid(32)
  const tokenHash = hashToken(inviteToken)
  const expiresAt = new Date(Date.now() + env.EMAIL_VERIFY_TTL_SECONDS * 1000)

  const updated = await addInvite(workspaceId, {
    email,
    role,
    tokenHash,
    invitedBy,
    expiresAt,
  })

  return { workspace: updated, inviteToken }
}

export const acceptWorkspaceInvite = async ({ workspaceId, token, userId }) => {
  const tokenHash = hashToken(token)
  const workspace = await acceptInvite(workspaceId, tokenHash, userId)

  if (!workspace) {
    throw new AppError('Invite is invalid or expired', 400, 'INVITE_INVALID')
  }

  return workspace
}
