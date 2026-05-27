import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { env } from '../utils/env.js'
import { Button } from '../components/Button.jsx'
import { clearCredentials } from '../redux/authSlice.js'
import { logout } from '../services/authService.js'
import { useAuth } from '../hooks/useAuth.js'
import { useSocket } from '../hooks/useSocket.js'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Workspaces', path: '/workspaces' },
  { label: 'Projects', path: '/projects' },
  { label: 'Task Board', path: '/tasks' },
  { label: 'Activity', path: '/activity' },
  { label: 'Settings', path: '/settings' },
]

const AppShell = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  useSocket()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      return
    } finally {
      dispatch(clearCredentials())
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="brand-mark">{env.appName}</span>
          <span className="env-pill">{env.environment}</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <span className="user-name">{user?.name || 'Operator'}</span>
            <span className="user-role">{user?.roles?.[0] || 'member'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
