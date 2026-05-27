import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export default ProtectedRoute
