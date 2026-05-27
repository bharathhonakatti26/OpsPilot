import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { resetPassword } from '../services/authService.js'

const ResetPassword = () => {
  const [form, setForm] = useState({ token: '', newPassword: '' })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError(null)
    setMessage(null)

    try {
      await resetPassword(form)
      setMessage('Password reset successfully. You can now sign in.')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="form-card">
      <h2>Set a new password</h2>
      <p>Enter your reset token and choose a new password.</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Reset token"
          name="token"
          value={form.token}
          onChange={handleChange}
          required
        />
        <Input
          label="New password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        {error ? <div className="form-error">{error}</div> : null}
        {message ? <div className="form-success">{message}</div> : null}
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Updating...' : 'Update password'}
        </Button>
      </form>
      <div className="form-footer">
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  )
}

export default ResetPassword
