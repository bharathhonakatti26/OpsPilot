# Environment variables

## Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` - Base API URL (include `/api/v1`)
- `VITE_SOCKET_URL` - Socket.IO URL
- `VITE_APP_NAME` - Display name
- `VITE_ENVIRONMENT` - Environment label shown in the UI

## Backend (`backend/.env`)

### Core
- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `MONGO_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES`
- `JWT_REFRESH_EXPIRES`
- `COOKIE_SECRET`
- `CORS_ORIGIN`
- `LOG_LEVEL`
- `SOCKET_CORS_ORIGIN`

### Operational tuning
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `REQUEST_BODY_LIMIT`
- `UPLOAD_DIR`
- `TOKEN_ISSUER`
- `TOKEN_AUDIENCE`
- `MONGO_RETRY_ATTEMPTS`
- `MONGO_RETRY_DELAY_MS`
- `REDIS_RETRY_ATTEMPTS`
- `REDIS_RETRY_DELAY_MS`
- `SESSION_TTL_SECONDS`
- `EMAIL_VERIFY_TTL_SECONDS`
- `PASSWORD_RESET_TTL_SECONDS`
- `COOKIE_SAMESITE`
- `COOKIE_SECURE`
- `COOKIE_DOMAIN`


Place any additional environment examples or `.env.example` files alongside the service folders (`backend/.env.example`, `frontend/.env.example`).
