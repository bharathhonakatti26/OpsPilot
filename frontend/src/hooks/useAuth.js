import { useSelector } from 'react-redux'
import { storage } from '../utils/storage.js'

export const useAuth = () => {
  const auth = useSelector((state) => state.auth)
  const storedToken = storage.getAccessToken()
  const storedUser = storage.getUser()
  const accessToken = storedToken || auth.accessToken
  const user = storedUser || auth.user

  return {
    ...auth,
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
  }
}
