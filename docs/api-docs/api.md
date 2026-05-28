# API Documentation

Base path: `/api/v1`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

## Workspaces
- `GET /workspaces`
- `POST /workspaces`
- `POST /workspaces/:workspaceId/invites`
- `POST /workspaces/:workspaceId/invites/accept`

## Projects
- `GET /workspaces/:workspaceId/projects`
- `POST /workspaces/:workspaceId/projects`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId`
- `DELETE /projects/:projectId`

## Tasks
- `GET /projects/:projectId/tasks`
- `POST /projects/:projectId/tasks`
- `GET /tasks/:taskId`
- `PATCH /tasks/:taskId`
- `DELETE /tasks/:taskId`
- `POST /tasks/:taskId/comments`

## Notifications
- `GET /notifications`
- `POST /notifications/:notificationId/read`
- `POST /notifications/read-all`

## Files
- `POST /files/upload`

## Health
- `GET /health`
- `GET /health/ready`

## WebSocket events
- Client events: `workspace:join`, `workspace:leave`, `project:join`, `project:leave`
- Server events: `task:created`, `task:updated`, `task:deleted`, `task:commented`, `notification:new`


