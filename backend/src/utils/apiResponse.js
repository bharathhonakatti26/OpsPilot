export const buildSuccess = ({ message, data, meta, requestId }) => ({
  success: true,
  message,
  data,
  meta,
  requestId,
})

export const buildError = ({ message, code, details, requestId }) => ({
  success: false,
  message,
  error: {
    code,
    details,
  },
  requestId,
})
