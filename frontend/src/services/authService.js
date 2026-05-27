import apiClient from '../api/axiosClient.js'

export const register = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload)
  return data.data
}

export const login = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload)
  return data.data
}

export const logout = async () => {
  const { data } = await apiClient.post('/auth/logout')
  return data.data
}

export const requestPasswordReset = async (payload) => {
  const { data } = await apiClient.post('/auth/forgot-password', payload)
  return data.data
}

export const resetPassword = async (payload) => {
  const { data } = await apiClient.post('/auth/reset-password', payload)
  return data.data
}

export const verifyEmail = async (payload) => {
  const { data } = await apiClient.post('/auth/verify-email', payload)
  return data.data
}
