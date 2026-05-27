import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { requestPasswordReset } from '../services/authService.js'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const data = await requestPasswordReset({ email })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="form-card">
      <h2>Reset your password</h2>
      <p>We will send a reset link once email delivery is configured.</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="Work email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {error ? <div className="form-error">{error}</div> : null}
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
      {result?.resetToken ? (
        <div className="token-hint">
          Reset token (for email service wiring): {result.resetToken}
        </div>
      ) : null}
      <div className="form-footer">
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  )
}

export default ForgotPassword
