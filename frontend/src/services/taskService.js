import apiClient from '../api/axiosClient.js'

export const listTasks = async (projectId, params) => {
  const { data } = await apiClient.get(`/projects/${projectId}/tasks`, {
    params,
  })
  return data.data
}

export const createTask = async (projectId, payload) => {
  const { data } = await apiClient.post(`/projects/${projectId}/tasks`, payload)
  return data.data
}

export const updateTask = async (taskId, payload) => {
  const { data } = await apiClient.patch(`/tasks/${taskId}`, payload)
  return data.data
}

export const deleteTask = async (taskId) => {
  const { data } = await apiClient.delete(`/tasks/${taskId}`)
  return data.data
}

export const addComment = async (taskId, payload) => {
  const { data } = await apiClient.post(`/tasks/${taskId}/comments`, payload)
  return data.data
}
