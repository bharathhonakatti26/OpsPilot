export const parsePagination = (query, options = {}) => {
  const defaultLimit = options.defaultLimit || 20
  const maxLimit = options.maxLimit || 100
  const page = Math.max(parseInt(query.page || '1', 10), 1)
  const limit = Math.min(
    Math.max(parseInt(query.limit || String(defaultLimit), 10), 1),
    maxLimit,
  )
  const skip = (page - 1) * limit
  const sortBy = query.sortBy || 'createdAt'
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1

  return {
    page,
    limit,
    skip,
    sort: { [sortBy]: sortOrder },
  }
}
