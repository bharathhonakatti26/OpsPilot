import { Router } from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../validations/auth.validation.js'
import {
  register as registerHandler,
  login as loginHandler,
  refresh as refreshHandler,
  logout as logoutHandler,
  forgotPassword as forgotPasswordHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', validateRequest(register), registerHandler)
router.post('/login', validateRequest(login), loginHandler)
router.post('/refresh', validateRequest(refresh), refreshHandler)
router.post('/logout', validateRequest(logout), logoutHandler)
router.post(
  '/forgot-password',
  validateRequest(forgotPassword),
  forgotPasswordHandler,
)
router.post('/reset-password', validateRequest(resetPassword), resetPasswordHandler)
router.post('/verify-email', validateRequest(verifyEmail), verifyEmailHandler)

export default router
