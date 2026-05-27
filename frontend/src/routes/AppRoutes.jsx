import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import VerifyEmail from '../pages/VerifyEmail.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Workspaces from '../pages/Workspaces.jsx'
import Projects from '../pages/Projects.jsx'
import TaskBoard from '../pages/TaskBoard.jsx'
import ActivityLog from '../pages/ActivityLog.jsx'
import Settings from '../pages/Settings.jsx'
import NotFound from '../pages/NotFound.jsx'
import AppShell from '../layouts/AppShell.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<TaskBoard />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRoutes
