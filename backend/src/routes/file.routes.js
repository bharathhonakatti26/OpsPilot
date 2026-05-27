import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { createUploader } from '../config/upload.js'
import { uploadFile as uploadValidation } from '../validations/file.validation.js'
import { uploadFile } from '../controllers/file.controller.js'

const router = Router()
const upload = createUploader()

router.post(
  '/files/upload',
  authenticate,
  upload.single('file'),
  validateRequest(uploadValidation),
  uploadFile,
)

export default router
