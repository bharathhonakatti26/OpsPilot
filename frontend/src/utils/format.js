export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : ''
