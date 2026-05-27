import { createActivityLog } from '../repositories/activityLog.repository.js'

export const logActivity = async ({
  workspaceId,
  actorId,
  action,
  entityType,
  entityId,
  metadata,
  req,
}) =>
  createActivityLog({
    workspace: workspaceId,
    actor: actorId,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress: req?.ip,
    userAgent: req?.headers?.['user-agent'],
  })
