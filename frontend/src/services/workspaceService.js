import apiClient from '../api/axiosClient.js'

export const listWorkspaces = async (params) => {
  const { data } = await apiClient.get('/workspaces', { params })
  return data.data
}

export const createWorkspace = async (payload) => {
  const { data } = await apiClient.post('/workspaces', payload)
  return data.data
}

export const inviteMember = async (workspaceId, payload) => {
  const { data } = await apiClient.post(
    `/workspaces/${workspaceId}/invites`,
    payload,
  )
  return data.data
}
