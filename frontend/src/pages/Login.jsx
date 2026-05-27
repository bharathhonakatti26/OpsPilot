import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { setCredentials } from '../redux/authSlice.js'
import { login } from '../services/authService.js'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const data = await login(form)
      dispatch(setCredentials(data))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="form-card">
      <h2>Welcome back</h2>
      <p>Sign in to your OpsPilot workspace.</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Work email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error ? <div className="form-error">{error}</div> : null}
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="form-footer">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create an account</Link>
      </div>
    </div>
  )
}

export default Login
