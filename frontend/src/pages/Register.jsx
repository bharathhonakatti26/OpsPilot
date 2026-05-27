import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { register } from '../services/authService.js'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [verificationToken, setVerificationToken] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const data = await register(form)
      setVerificationToken(data.verificationToken)
      navigate(`/verify-email?token=${data.verificationToken}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="form-card">
      <h2>Build your workspace</h2>
      <p>Create an OpsPilot account to start collaborating.</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          {status === 'loading' ? 'Creating...' : 'Create account'}
        </Button>
      </form>
      {verificationToken ? (
        <div className="token-hint">
          Verification token (for email service wiring): {verificationToken}
        </div>
      ) : null}
      <div className="form-footer">
        <Link to="/login">Already have access?</Link>
      </div>
    </div>
  )
}

export default Register
