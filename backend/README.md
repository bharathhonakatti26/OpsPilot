# OpsPilot Backend

Node.js + Express API and Socket.IO server used by OpsPilot.

## Quickstart (local dev)

1. Install deps: `cd backend && npm install`
2. Copy `env.example` to `.env` and set values for `MONGO_URI`, `REDIS_URL`, `JWT_*` secrets, and `CLIENT_URL`.
3. Run dev server: `npm run dev` (uses nodemon)

## Build & Docker

- Build production image: `docker build -t opspilot-backend:dev -f Dockerfile .`
- To load into kind: `kind load docker-image opspilot-backend:dev --name opspilot`

## Environment variables (high level)

- `PORT` — server port
- `NODE_ENV` — environment
- `MONGO_URI` — MongoDB connection string
- `REDIS_URL` — Redis connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — auth secrets
- `CLIENT_URL` — frontend origin for CORS

## Run in Kubernetes (kind)

1. Ensure `kind` cluster running and ingress + metrics-server installed.
2. Load images into kind (see Build & Docker).
3. Apply manifests from the `kind-cluster/` overlay: `kubectl apply -k kind-cluster/`

## Troubleshooting

- HPA reports `FailedGetResourceMetric`: ensure `metrics-server` is installed and APIService is `Available`.
- Argo CD shows `OutOfSync` due to replicas drift: Deployments in `k8s/` omit fixed `spec.replicas` so HPA controls scaling.

For project-level architecture and monitoring, see the root README: [../README.md](../README.md)
