import { AppError } from '../utils/appError.js'

export const validateRequest = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(
    {
      body: req.body,
      params: req.params,
      query: req.query,
    },
    { abortEarly: false, stripUnknown: true },
  )

  if (error) {
    return next(
      new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.details),
    )
  }

  req.body = value.body
  req.params = value.params
  req.query = value.query
  return next()
}
