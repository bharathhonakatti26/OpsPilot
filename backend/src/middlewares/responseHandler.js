import { buildSuccess } from '../utils/apiResponse.js'

export const responseHandler = (req, res, next) => {
  res.success = ({ statusCode = 200, message, data, meta }) => {
    res.set('X-Request-Id', req.id)
    res.status(statusCode).json(
      buildSuccess({
        message,
        data,
        meta,
        requestId: req.id,
      }),
    )
  }
  next()
}
