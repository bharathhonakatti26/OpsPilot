# Deployment Guides & Quickstart

## Local setup (development)

1. Install dependencies
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
2. Copy environment templates and set values
   - Backend: `backend/.env.example` -> `backend/.env`
   - Frontend: `frontend/.env.example` -> `frontend/.env`
3. Run services
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

## Quickstart — Local (kind)

1. Install `kind` and `kubectl`.
2. Create the cluster (optional):

```bash
kind create cluster --name opspilot --config kind-cluster/kind-config.yml
```

3. Install cluster addons used by this repo:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/kind/deploy.yaml
```

4. Load Docker images (if building locally):

```bash
kind load docker-image opspilot-backend:dev --name opspilot
kind load docker-image opspilot-frontend:dev --name opspilot
```

5. Apply the local overlay (kustomize):

```bash
kubectl apply -k kind-cluster/
```

## Deploy with Argo CD

- For local testing, Argo CD should point at the `kind-cluster` overlay so ingress and certificates are appropriate for kind.
- The Argo Application manifest is at `k8s/argocd-application.yml`. Update `spec.source.path` to `kind-cluster` for local clusters.
- After pushing manifests, refresh the Argo App in the UI or run:

```bash
kubectl -n argocd annotate application <app-name> argocd.argoproj.io/refresh:manual
kubectl -n argocd get applications
```

## Monitoring (Prometheus, Grafana, Argo CD)

- Prometheus: collects metrics from pods and nodes. Port-forward example:

```bash
kubectl -n monitoring port-forward svc/prometheus 9090:9090
# open http://localhost:9090
```

- Grafana: dashboards live under `Images/Grafana/`. Port-forward:

```bash
kubectl -n monitoring port-forward svc/grafana 3000:3000
# open http://localhost:3000 (default admin/admin)
```

- Argo CD: UI screenshots are in `Images/Argo CD/`. Access:

```bash
kubectl -n argocd port-forward svc/argocd-server 8080:443
# open https://localhost:8080
```

## Images & screenshots

Screenshots used in docs are stored under `Images/` and grouped by tool (Argo CD, Prometheus, Grafana, Kubernetes). Recommended Jenkins evidence folder is `Images/Jenkins/`.
