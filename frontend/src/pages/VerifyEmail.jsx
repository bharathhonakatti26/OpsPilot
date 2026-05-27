import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { verifyEmail } from '../services/authService.js'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') || '')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleVerify = async () => {
    if (!token) return
    setStatus('loading')
    setError(null)
    setMessage(null)

    try {
      await verifyEmail({ token })
      setMessage('Email verified. You can now sign in.')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setStatus('idle')
    }
  }

  useEffect(() => {
    if (searchParams.get('token')) {
      handleVerify()
    }
  }, [searchParams])

  return (
    <div className="form-card">
      <h2>Verify your email</h2>
      <p>Enter the verification token we sent to your inbox.</p>
      <Input
        label="Verification token"
        name="token"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        required
      />
      {error ? <div className="form-error">{error}</div> : null}
      {message ? <div className="form-success">{message}</div> : null}
      <Button onClick={handleVerify} disabled={status === 'loading'}>
        {status === 'loading' ? 'Verifying...' : 'Verify email'}
      </Button>
      <div className="form-footer">
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  )
}

export default VerifyEmail
