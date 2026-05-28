# Kubernetes manifests (k8s)

This folder contains Kubernetes manifests and example secret templates for deploying OpsPilot. Use these files as the canonical cluster manifests; for local testing use the `kind-cluster/` overlay.

Files

- `argocd-application.yml` — Argo CD Application manifest to deploy the repo manifests via GitOps.
- `backend-configmap.yml` — backend configuration as a ConfigMap (non-secret values).
- `backend-deployment.yml` — backend Deployment manifest.
- `backend-secret.example.yml` — template for backend secrets (`stringData` placeholders). DO NOT commit real secrets.
- `backend-secret.yml` — example secret (should be generated or created at deploy time).
- `backend-service.yml` — Service for backend pods.
- `frontend-deployment.yml` — frontend Deployment manifest.
- `frontend-service.yml` — Service for frontend.
- `hpa.yml` — HorizontalPodAutoscaler definitions (HPA) that autoscale deployments.
- `ingress.yml` — base Ingress manifest (cloud-oriented). See `kind-cluster/` for local overlay.
- `kustomization.yml` — base kustomize file supporting overlays.
- `mongodb-*.yml` — MongoDB StatefulSet, Service and secret templates.
- `redis-*.yml` — Redis StatefulSet, Service and secret templates.
- `namespace.yml` — namespace manifest used by overlays.

Quick apply (recommended order)

1. Create the namespace (if not using overlays that do this):

```bash
kubectl apply -f k8s/namespace.yml
```

2. Create secrets and configmaps (edit `*.example.yml` locally or generate):

```bash
# Option A: apply files you created locally (preferred)
kubectl apply -f k8s/backend-secret.yml
kubectl apply -f k8s/mongodb-secret.yml
kubectl apply -f k8s/redis-secret.yml
kubectl apply -f k8s/backend-configmap.yml

# Option B: create secrets from literals (local/dev only)
kubectl create secret generic backend-secret --from-literal=JWT_ACCESS_SECRET='...' -n opspilot
```

3. Deploy stateful services (MongoDB, Redis) so endpoints exist:

```bash
kubectl apply -f k8s/mongodb-statefulset.yml
kubectl apply -f k8s/mongodb-service.yml
kubectl apply -f k8s/redis-statefulset.yml
kubectl apply -f k8s/redis-service.yml
```

4. Deploy core services and HPA:

```bash
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/backend-service.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
kubectl apply -f k8s/hpa.yml
```

5. Install/verify cluster addons required by HPA and ingress (metrics-server, ingress controller) before applying `ingress.yml` or overlay ingress:

```bash
# metrics-server (required for HPA metrics)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# ingress-nginx for local kind
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/kind/deploy.yaml
```

6. Apply Ingress (use `kind-cluster/ingress-kind.yml` for local testing):

```bash
# For cloud/prod (may reference ALB/ACM)
kubectl apply -f k8s/ingress.yml

# For local kind overlay
kubectl apply -k kind-cluster/
```

Using the `kind-cluster` overlay

The `kind-cluster/` overlay contains kustomize patches and a local-friendly `ingress-kind.yml` to avoid cloud-only resources (ALB, ACM). For local testing with `kind`:

```bash
# build and load images locally (if needed)
# kind load docker-image opspilot-backend:dev --name opspilot
# kind load docker-image opspilot-frontend:dev --name opspilot

kubectl apply -k kind-cluster/
```

Secrets & GitOps

- Keep sensitive values out of Git. Use `k8s/*.example.yml` as templates and generate `k8s/*-secret.yml` at deploy time.
- For GitOps workflows, use Sealed Secrets or external secret managers. Example with `kubeseal`:

```bash
kubectl create secret generic backend-secret --from-literal=JWT_ACCESS_SECRET='...' --dry-run=client -o yaml \
  | kubeseal --format=yaml > k8s/backend-sealed.yml
kubectl apply -f k8s/backend-sealed.yml
```

Argo CD

- `argocd-application.yml` shows an example Application CR. For local testing, point `spec.source.path` to `kind-cluster` so Argo deploys the overlay appropriate for kind.
- After changes, refresh or sync the Argo Application in the UI or via `kubectl -n argocd annotate application <app-name> argocd.argoproj.io/refresh:manual`.

HPA and metrics

- HPAs in `hpa.yml` require the Kubernetes aggregated metrics API (metrics-server). Ensure `metrics-server` is installed and healthy (`kubectl get apiservice | grep metrics`).
- If HPA events show `FailedGetResourceMetric`, check metrics-server logs and Service/Endpoint naming (the port name should be `https` and targetPort `10250` for kubelet metrics).

Troubleshooting

- Argo CD `Progressing`/`OutOfSync` issues: ensure Argo targets the correct overlay (cloud vs `kind-cluster`) and avoid hard-coded `spec.replicas` when HPA controls scaling.
- Ingress not getting an ADDRESS in `kind`: verify `ingress-nginx` controller is deployed and `kubectl -n ingress-nginx get pods` shows it ready.
- HPA not scaling: verify `kubectl top pods` works (metrics-server) and check HPA events (`kubectl describe hpa`).

Notes

- This folder contains example and template manifests — adapt them to your environment before use.
- Do not commit files containing real credentials. Add generated secret files to `.gitignore` if created locally.

If you want, I can add a small `k8s/quickstart.md` with exact commands for a local `kind` demo and image build/load steps.
