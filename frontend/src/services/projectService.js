import apiClient from '../api/axiosClient.js'

export const listProjects = async (workspaceId, params) => {
  const { data } = await apiClient.get(
    `/workspaces/${workspaceId}/projects`,
    { params },
  )
  return data.data
}

export const createProject = async (workspaceId, payload) => {
  const { data } = await apiClient.post(
    `/workspaces/${workspaceId}/projects`,
    payload,
  )
  return data.data
}

export const updateProject = async (projectId, payload) => {
  const { data } = await apiClient.patch(`/projects/${projectId}`, payload)
  return data.data
}

export const deleteProject = async (projectId) => {
  const { data } = await apiClient.delete(`/projects/${projectId}`)
  return data.data
}
