const required = [
  'VITE_API_BASE_URL',
  'VITE_SOCKET_URL',
  'VITE_APP_NAME',
  'VITE_ENVIRONMENT',
]

export const assertEnv = () => {
  required.forEach((key) => {
    if (!import.meta.env[key]) {
      throw new Error(`Missing environment variable: ${key}`)
    }
  })
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  socketUrl: import.meta.env.VITE_SOCKET_URL,
  appName: import.meta.env.VITE_APP_NAME,
  environment: import.meta.env.VITE_ENVIRONMENT,
}
