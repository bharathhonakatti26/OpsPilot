export const mapStoredFile = (file) => ({
  id: file.filename,
  originalName: file.originalname,
  mimeType: file.mimetype,
  size: file.size,
  path: file.path,
})
