import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/appError.js'
import { mapStoredFile } from '../services/storage.service.js'

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('File is required', 400, 'FILE_REQUIRED')
  }

  res.success({
    statusCode: 201,
    message: 'File uploaded',
    data: {
      file: mapStoredFile(req.file),
    },
  })
})
