import { Outlet, Link } from 'react-router-dom'
import { env } from '../utils/env.js'

const AuthLayout = () => (
  <div className="auth-layout">
    <div className="auth-brand">
      <div className="brand-mark">{env.appName}</div>
      <p>
        Orchestrate cloud operations, security reviews, and delivery pipelines
        with a single workspace.
      </p>
      <ul>
        <li>Unified incident, project, and runbook views</li>
        <li>RBAC with audit visibility from day one</li>
        <li>Designed for multi-tenant scale and compliance</li>
      </ul>
      <Link className="ghost-link" to="/">
        Back to overview
      </Link>
    </div>
    <div className="auth-form">
      <Outlet />
    </div>
  </div>
)

export default AuthLayout
