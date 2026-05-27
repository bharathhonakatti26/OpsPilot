import axios from 'axios'
import { env } from '../utils/env.js'
import { storage } from '../utils/storage.js'

const baseURL = env.apiBaseUrl

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true
      try {
        const refreshResponse = await refreshClient.post('/auth/refresh')
        const newToken = refreshResponse.data?.data?.accessToken
        if (newToken) {
          storage.setAccessToken(newToken)
          original.headers.Authorization = `Bearer ${newToken}`
        }
        return apiClient(original)
      } catch (refreshError) {
        storage.clear()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
