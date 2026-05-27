# OpsPilot

OpsPilot is a production-grade, cloud-native collaborative workspace and project management platform for engineering, DevOps, and security teams. It is designed to scale from local development to Docker, Kubernetes, and AWS deployments with zero code changes - only environment variables.

## Architecture overview

OpsPilot follows a clean, modular architecture split into two independently deployable services:

- **Frontend (React + Vite)**: Single-page app with Redux Toolkit, React Query, and Socket.IO client for real-time collaboration.
- **Backend (Node.js + Express)**: API and WebSocket server with MongoDB, Redis, JWT authentication, and structured logging.

The backend separates **controllers**, **services**, and **repositories** so business logic can be extracted into microservices without refactoring the UI or API contracts.

File uploads are stored locally in `UPLOAD_DIR` with a clean storage abstraction, so switching to S3 or another object store is a drop-in change.

## Tech stack

**Frontend**
- React (Vite, JSX)
- Redux Toolkit
- React Query
- Axios
- Socket.IO Client
- Plain CSS (no Tailwind)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Redis
- Socket.IO
- JWT auth with refresh tokens
- Helmet, rate limiting, input sanitization

## Folder structure

```
backend/
  src/
    config/         # env, logging, db, CORS, rate limits
    controllers/    # request handlers
    services/       # business logic
    repositories/   # data access
    routes/         # API routes
    middlewares/    # auth, validation, error handling
    models/         # Mongoose schemas
    validations/    # request validation
    utils/          # helpers
    sockets/        # Socket.IO handlers
    jobs/           # background job stubs
    logs/           # runtime logs
    server.js

frontend/
  src/
    api/            # Axios client
    app/            # app shell + error boundary
    components/     # reusable UI
    pages/          # routed views
    layouts/        # layout shells
    routes/         # route definitions
    hooks/          # shared hooks
    services/       # API services
    sockets/        # socket client
    redux/          # store and slices
    styles/         # design system
    utils/          # helpers
    main.jsx
```

## Local setup

1. Install dependencies
   - Backend: `cd backend` then `npm install`
   - Frontend: `cd frontend` then `npm install`
2. Copy environment templates and set values
   - Backend: `backend/.env.example` -> `backend/.env`
   - Frontend: `frontend/.env.example` -> `frontend/.env`
3. Run services
   - Backend: `cd backend` then `npm run dev`
   - Frontend: `cd frontend` then `npm run dev`

## Docker-ready notes

OpsPilot is designed for containerization with stateless web nodes, externally managed databases, and environment-based configuration. Recommended container patterns:

- Inject all secrets via environment variables or secret managers.
- Route traffic through a reverse proxy or gateway (ALB, Nginx, or API Gateway).
- Externalize Redis and MongoDB (Atlas, DocumentDB, or managed Redis).

## Environment variables

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` - Base API URL (include `/api/v1`)
- `VITE_SOCKET_URL` - Socket.IO URL
- `VITE_APP_NAME` - Display name
- `VITE_ENVIRONMENT` - Environment label shown in the UI

### Backend (`backend/.env`)

Core
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

Operational tuning
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

All base URLs, ports, and origins are driven by environment variables. No hostnames are hardcoded in the codebase.

## API documentation

Base path: `/api/v1`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

### Workspaces
- `GET /workspaces`
- `POST /workspaces`
- `POST /workspaces/:workspaceId/invites`
- `POST /workspaces/:workspaceId/invites/accept`

### Projects
- `GET /workspaces/:workspaceId/projects`
- `POST /workspaces/:workspaceId/projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`
- `DELETE /projects/:projectId`

### Tasks
- `GET /projects/:projectId/tasks`
- `POST /projects/:projectId/tasks`
- `GET /tasks/:taskId`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`
- `POST /tasks/:taskId/comments`

### Notifications
- `GET /notifications`
- `POST /notifications/:notificationId/read`
- `POST /notifications/read-all`

### Files
- `POST /files/upload`

### Health
- `GET /health`
- `GET /health/ready`

### WebSocket events
- Client events: `workspace:join`, `workspace:leave`, `project:join`, `project:leave`
- Server events: `task:created`, `task:updated`, `task:deleted`, `task:commented`, `notification:new`

## Authentication flow

1. User registers and receives an email verification token.
2. User verifies email and logs in.
3. Access token is returned to the client, refresh token is stored as an HttpOnly cookie.
4. Axios interceptors refresh access tokens when expired.
5. Logout invalidates the refresh session in Redis.

## Security features

- Helmet-secured headers
- Rate limiting on all API routes
- Input validation (Joi)
- MongoDB injection sanitization
- XSS sanitization
- HttpOnly refresh cookies
- JWT access/refresh separation
- Structured logging with redaction

## Scaling strategy

- Stateless API nodes behind a load balancer
- Redis-backed session tracking
- Event-driven sockets for real-time updates
- Clean service boundaries to enable microservice extraction
- Dedicated repositories to swap persistence layers

## Future DevSecOps roadmap

- CI/CD pipeline templates for Jenkins and GitHub Actions
- SonarQube and Trivy scanning stages
- OWASP ZAP baseline tests for API and UI
- Prometheus and Grafana observability presets
- Gitleaks secrets scanning in pre-commit hooks

## AWS deployment readiness

- Supports EC2, ECS, or EKS with environment-driven config
- MongoDB Atlas or DocumentDB compatibility
- Redis via ElastiCache
- Ready for ALB and CloudFront routing
- Compatible with Secrets Manager for credential injection

## Troubleshooting

- **Missing environment variables**: run the app and check for missing keys listed in the `.env.example` files.
- **CORS errors**: confirm `CORS_ORIGIN` and `SOCKET_CORS_ORIGIN` match your frontend host.
- **401 refresh failures**: verify refresh cookies are enabled and `COOKIE_*` settings match your deployment domain.
- **Redis or Mongo timeouts**: validate network access and retry settings.
