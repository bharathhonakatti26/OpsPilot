import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { env } from './env.js'

export const createUploader = () => {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true })

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, env.UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      const name = `${Date.now()}-${nanoid(10)}${ext}`
      cb(null, name)
    },
  })

  return multer({ storage })
}
