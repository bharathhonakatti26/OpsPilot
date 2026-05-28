# Quickstart — Local kind cluster

This quickstart shows the minimal steps to run OpsPilot in a local `kind` cluster for development and testing. Commands are copy-pasteable; tweak image names and namespace as needed.

Prerequisites

- Docker installed and running
- kind installed (https://kind.sigs.k8s.io)
- kubectl installed
- (optional) kubeseal if you plan to use sealed-secrets

Set a namespace variable used in commands below:

```bash
NAMESPACE=opspilot
CLUSTER_NAME=opspilot
```

1) Create the kind cluster (uses `kind-cluster/kind-config.yml` if present)

```bash
kind create cluster --name "$CLUSTER_NAME" --config kind-cluster/kind-config.yml
kubectl cluster-info --context kind-$CLUSTER_NAME
kubectl wait --for=condition=Ready node --all --timeout=120s
```

2) Install required cluster addons (metrics-server and ingress-nginx)

```bash
# metrics-server (required for HPA)
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl -n kube-system wait --for=condition=available deployment/metrics-server --timeout=120s

# ingress-nginx controller for kind
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/kind/deploy.yaml
kubectl -n ingress-nginx wait --for=condition=ready pod -l app.kubernetes.io/component=controller --timeout=180s
```

3) Build and load local images into kind (recommended for iterative dev)

```bash
# Backend image
cd backend
docker build -t opspilot-backend:dev .
kind load docker-image opspilot-backend:dev --name "$CLUSTER_NAME"
cd -

# Frontend image
cd frontend
docker build -t opspilot-frontend:dev .
kind load docker-image opspilot-frontend:dev --name "$CLUSTER_NAME"
cd -
```

If you prefer to use remote images (GHCR), skip build/load and ensure imagePullSecrets are configured.

4) Create the namespace and apply secrets/config

```bash
kubectl apply -f k8s/namespace.yml

# Edit templates locally or create secrets from literals (local/dev only)
# Option A: apply prepared secret files (preferred)
kubectl apply -f k8s/backend-secret.yml
kubectl apply -f k8s/mongodb-secret.yml
kubectl apply -f k8s/redis-secret.yml
kubectl apply -f k8s/backend-configmap.yml

# Option B: quick create from literals (dev only)
kubectl create secret generic backend-secret --from-literal=JWT_ACCESS_SECRET='devsecret' -n "$NAMESPACE"
```

5) Deploy database/stateful services

```bash
kubectl apply -f k8s/mongodb-statefulset.yml
kubectl apply -f k8s/mongodb-service.yml
kubectl apply -f k8s/redis-statefulset.yml
kubectl apply -f k8s/redis-service.yml
kubectl -n "$NAMESPACE" wait --for=condition=ready pod -l app=mongodb --timeout=180s || true
kubectl -n "$NAMESPACE" wait --for=condition=ready pod -l app=redis --timeout=180s || true
```

6) Deploy application manifests (use the `kind-cluster` overlay which contains local ingress settings)

```bash
# Apply the local kustomize overlay (recommended)
kubectl apply -k kind-cluster/

# Alternatively, apply base manifests (cloud manifests may reference ALB/ACM)
# kubectl apply -f k8s/backend-deployment.yml
# kubectl apply -f k8s/backend-service.yml
# kubectl apply -f k8s/frontend-deployment.yml
# kubectl apply -f k8s/frontend-service.yml
# kubectl apply -f k8s/hpa.yml
```

7) Verify deployment status

```bash
kubectl get pods -n "$NAMESPACE"
kubectl get svc -n "$NAMESPACE"
kubectl get ingress -n "$NAMESPACE" || true
kubectl get hpa -n "$NAMESPACE" || true
kubectl top pods -n "$NAMESPACE" || true
```

8) Port-forward / access services

```bash
# Find the frontend service name and port
kubectl -n "$NAMESPACE" get svc

# Example: port-forward frontend service to localhost
kubectl -n "$NAMESPACE" port-forward svc/frontend 8080:80
# Then open http://localhost:8080

# Port-forward backend for API access
kubectl -n "$NAMESPACE" port-forward svc/backend 3000:3000
```

9) Tail logs for debugging

```bash
kubectl -n "$NAMESPACE" logs -l app=backend -f
kubectl -n "$NAMESPACE" logs -l app=frontend -f
```

10) Cleanup

```bash
# Delete resources (if you applied overlay)
kubectl delete -k kind-cluster/ || true

# Delete kind cluster
kind delete cluster --name "$CLUSTER_NAME"
```

Troubleshooting tips

- If HPA cannot read metrics, verify `metrics-server` is running and `kubectl top pods` returns values.
- If Ingress has no address in `kind`, ensure `ingress-nginx` controller pods are ready.
- If Argo CD shows `Progressing`, ensure Argo is pointed to the correct overlay (`kind-cluster`) and that deployments do not include fixed `replicas` that conflict with HPA.

If you want, I can produce a script `k8s/scripts/local-kind-up.sh` that automates these steps.
