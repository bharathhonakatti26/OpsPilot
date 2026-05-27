import apiClient from '../api/axiosClient.js'

export const listNotifications = async (params) => {
  const { data } = await apiClient.get('/notifications', { params })
  return data.data
}

export const markRead = async (notificationId) => {
  const { data } = await apiClient.post(
    `/notifications/${notificationId}/read`,
  )
  return data.data
}

export const markAllRead = async () => {
  const { data } = await apiClient.post('/notifications/read-all')
  return data.data
}
