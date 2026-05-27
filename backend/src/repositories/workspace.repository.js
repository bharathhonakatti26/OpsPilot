import { Workspace } from '../models/Workspace.js'

export const createWorkspace = (data) => Workspace.create(data)

export const findWorkspaceById = (id) => Workspace.findById(id)

export const findWorkspacesByMember = (userId, { skip, limit, sort }) =>
  Workspace.find({ 'members.user': userId }).sort(sort).skip(skip).limit(limit)

export const addMember = (workspaceId, member) =>
  Workspace.findOneAndUpdate(
    { _id: workspaceId, 'members.user': { $ne: member.user } },
    { $addToSet: { members: member } },
    { new: true },
  )

export const addInvite = (workspaceId, invite) =>
  Workspace.findByIdAndUpdate(
    workspaceId,
    { $push: { invites: invite } },
    { new: true },
  )

export const acceptInvite = async (workspaceId, tokenHash, userId) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    'invites.tokenHash': tokenHash,
    'invites.status': 'pending',
    'invites.expiresAt': { $gt: new Date() },
  })

  if (!workspace) return null

  const invite = workspace.invites.find(
    (item) => item.tokenHash === tokenHash && item.status === 'pending',
  )

  if (!invite) return null

  invite.status = 'accepted'
  workspace.members.push({ user: userId, role: invite.role })
  await workspace.save()
  return workspace
}
