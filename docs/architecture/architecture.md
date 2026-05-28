# Architecture

## Overview

OpsPilot follows a clean, modular architecture split into two independently deployable services:

- **Frontend (React + Vite)**: Single-page app with Redux Toolkit, React Query, and Socket.IO client for real-time collaboration.
- **Backend (Node.js + Express)**: API and WebSocket server with MongoDB, Redis, JWT authentication, and structured logging.

The backend separates **controllers**, **services**, and **repositories** so business logic can be extracted into microservices without refactoring the UI or API contracts.

File uploads are stored locally in `UPLOAD_DIR` with a clean storage abstraction, so switching to S3 or another object store is a drop-in change.

## Tech stack

The project uses modern, widely supported tooling for frontend, backend, and infrastructure.

**Frontend**
- React 18 (Vite) — fast dev server and optimized production builds
- Redux Toolkit for predictable state management
- TanStack Query (React Query) for server state and caching
- Axios for HTTP client
- Socket.IO client for real-time updates
- Build tooling: Vite, ESLint, and standard npm scripts in `frontend/package.json`

**Backend**
- Node.js (LTS, 18+) with Express for the API and WebSocket integration
- MongoDB via Mongoose for document persistence
- Redis (session store / cache) via `ioredis` or `redis` client
- Socket.IO server for real-time messaging and presence
- Authentication: JWT access + refresh token pattern
- Security & validation: Helmet, `express-rate-limit`, Joi, `xss-clean`, `express-mongo-sanitize`
- Logging: Winston or Pino for structured logs

**Infra & DevOps**
- Containerization: Docker and Docker Compose for local development
- Kubernetes manifests under `k8s/` with Kustomize overlays (including `kind-cluster/`)
- GitOps: Argo CD application manifests for automated deploys
- Monitoring: Prometheus + Grafana; metrics gathered via `metrics-server` for HPA
- Ingress: `ingress-nginx` for local testing (kind) and ALB/Ingress manifests for cloud
- CI / Scans: Jenkins pipeline (`Jenkinsfile`) with SonarQube, Trivy, and OWASP Dependency Check

## Folder structure

This is a pragmatic, service-oriented layout that matches the repository contents. Keep per-service README files for development-specific commands.

Top-level

```
docker-compose.yml
Jenkinsfile
README.md
docs/                # canonical documentation and guides
Images/              # screenshots and CI evidence
k8s/                 # base k8s manifests and examples
kind-cluster/        # kustomize overlay for local kind testing
backend/             # backend service (API + sockets)
frontend/            # frontend single-page app (Vite + React)
```

Backend (core layout)

```
backend/
  Dockerfile
  package.json
  eslint.config.js
  src/
    server.js
    config/          # env, logger, mongo, redis, cors, rate limiter
    controllers/     # HTTP request handlers
    services/        # business logic and orchestration
    repositories/    # data access (Mongoose)
    routes/          # express route wiring
    middlewares/     # auth, validation, error handling
    models/          # Mongoose schemas
    jobs/            # scheduled/background jobs
    sockets/         # socket init and events
    utils/           # helper modules and API response wrappers
  .env.example
```

Frontend (core layout)

```
frontend/
  Dockerfile
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    api/             # axios client and API surface
    app/             # app shell, providers (store, query client)
    components/      # reusable UI pieces
    pages/           # routed views
    layouts/         # layout components
    redux/           # store setup and slices
    sockets/         # socket client wrapper
    styles/          # global and component styles
  index.html
  .env.example
```

Kubernetes and overlays

```
k8s/                 # base manifests (deployments, services, ingress)
kind-cluster/        # kustomize overlay for local kind cluster
```

Notes

- Keep service-specific examples (`.env.example`) next to each service.
- Use `kind-cluster/` for local testing to avoid cloud-specific resources (ALB, ACM).
- Avoid committing real secrets; use `k8s/*.example.yml` and sealed secrets for GitOps.

## Scaling strategy

- Stateless API nodes behind a load balancer
- Redis-backed session tracking
- Event-driven sockets for real-time updates
- Clean service boundaries to enable microservice extraction
- Dedicated repositories to swap persistence layers

## Security features

- Helmet-secured headers
- Rate limiting on all API routes
- Input validation (Joi)
- MongoDB injection sanitization
- XSS sanitization
- HttpOnly refresh cookies
- JWT access/refresh separation
- Structured logging with redaction
