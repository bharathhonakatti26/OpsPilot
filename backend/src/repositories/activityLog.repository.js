import { ActivityLog } from '../models/ActivityLog.js'

export const createActivityLog = (data) => ActivityLog.create(data)

export const findActivityLogs = (workspaceId, { skip, limit, sort }) =>
  ActivityLog.find({ workspace: workspaceId }).sort(sort).skip(skip).limit(limit)
