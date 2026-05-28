# OpsPilot Frontend

This folder contains the React/Vite single-page application for OpsPilot.

## Quickstart (local dev)

1. Install dependencies: `cd frontend && npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` and `VITE_SOCKET_URL`.
3. Run the dev server: `npm run dev` (default port `5173`).

## Build & Docker

- Build for production: `npm run build`
- Local preview of production build: `npm run preview`
- Build Docker image:
	- `docker build -t opspilot-frontend:dev -f Dockerfile .`

To run in kind, load the built image into kind: `kind load docker-image opspilot-frontend:dev --name opspilot` and deploy the k8s manifests in `k8s/` or `kind-cluster/`.

## Environment variables

- `VITE_API_BASE_URL` — Backend API base (e.g. `http://localhost:8080/api/v1`)
- `VITE_SOCKET_URL` — Socket.IO URL (e.g. `ws://localhost:8080`)
- `VITE_APP_NAME` — App display name

## Testing

- Run unit tests (if configured): `npm test`

## Common commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

For platform-level setup and monitoring instructions, see the root README: [README.md](../README.md)
