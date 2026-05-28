# OpsPilot

OpsPilot is a production-grade, cloud-native collaborative workspace and project management platform for engineering, DevOps, and security teams. It scales from local development to Docker, Kubernetes, and cloud deployments via environment-driven configuration.

## Documentation

Canonical documentation lives under the `docs/` folder. Open the docs index for a quick map of the available guides and references:

- Docs index: [docs/README.md](docs/README.md)
- Architecture: [docs/architecture/architecture.md](docs/architecture/architecture.md)
- Deployment & Quickstart: [docs/deployment-guides/deployment.md](docs/deployment-guides/deployment.md)
- Environment variables: [docs/deployment-guides/env.md](docs/deployment-guides/env.md)
- Secrets & best practices: [docs/deployment-guides/secrets.md](docs/deployment-guides/secrets.md)
- API reference: [docs/api-docs/api.md](docs/api-docs/api.md)

Keep service-level `.env.example` files in their service folders (`backend/.env.example`, `frontend/.env.example`).

## CI / DevSecOps

CI artifacts and pipeline manifests are in the repository. The primary pipeline is a Jenkinsfile at the repo root which contains SonarQube, OWASP Dependency Check and Trivy stages. See `Jenkinsfile` for details.

If you'd like, I can add local run instructions for the Jenkins stages (dockerized Trivy, Sonar scanner CLI) or create GitHub Actions snippets that mirror the Jenkins pipeline.

## Quick links

- Pipeline manifest: [Jenkinsfile](Jenkinsfile)
- CI evidence folder: `Images/Jenkins/`
- Frontend README: [frontend/README.md](frontend/README.md)
- Backend README: [backend/README.md](backend/README.md)
- Kind overlay README: [kind-cluster/README.md](kind-cluster/README.md)

## Contributing

Please follow the per-service README files for development workflows. Keep secrets out of the repo and use the `k8s/*.example.yml` templates when preparing deployment manifests.

For full deployment and monitoring instructions, follow the links in the docs index above.
