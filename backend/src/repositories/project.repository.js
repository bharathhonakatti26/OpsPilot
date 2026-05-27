import { Project } from '../models/Project.js'

export const createProject = (data) => Project.create(data)

export const findProjectsByWorkspace = (workspaceId, { skip, limit, sort }) =>
  Project.find({ workspace: workspaceId }).sort(sort).skip(skip).limit(limit)

export const findProjectById = (id) => Project.findById(id)

export const updateProject = (id, data) =>
  Project.findByIdAndUpdate(id, data, { new: true })

export const deleteProject = (id) => Project.findByIdAndDelete(id)
