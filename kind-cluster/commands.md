
# OpsPilot on Kind: End-to-End Commands

Run commands from the repository root.

## 1. Install tools

### Ubuntu 24.04 AMI (EC2) prerequisites

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Install Docker Engine
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
	$(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
	sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow ubuntu user to run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

docker --version
```

### Linux/macOS

```bash
chmod +x kind-cluster/install_kind.sh kind-cluster/install_kubectl.sh
./kind-cluster/install_kind.sh
./kind-cluster/install_kubectl.sh
```

For Ubuntu AMI, use this Linux/macOS section after Docker install.

## 2. Create Kind cluster

```bash
kind create cluster --config kind-cluster/config.yml
kubectl cluster-info
kubectl get nodes -o wide
```

## 3. Install ingress-nginx controller (required for local Ingress)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=Ready pod --selector=app.kubernetes.io/component=controller --timeout=180s
```

## 4. Build and load local images into Kind

```bash
docker-compose build backend frontend
kind load docker-image opspilot-backend:latest --name opspilot-kind
kind load docker-image opspilot-frontend:latest --name opspilot-kind
```

Why this works: Compose still builds the backend and frontend images, but now it tags them as `opspilot-backend:latest` and `opspilot-frontend:latest`, which Kind can load directly.

## 4b. Push images for Argo CD on EC2

If you are using Argo CD with the `k8s` folder from GitHub, push the images to GitHub Container Registry so the cluster can pull them:

```bash
docker build -t ghcr.io/bharathhonakatti26/opspilot-backend:latest ./backend
docker build -t ghcr.io/bharathhonakatti26/opspilot-frontend:latest ./frontend
docker push ghcr.io/bharathhonakatti26/opspilot-backend:latest
docker push ghcr.io/bharathhonakatti26/opspilot-frontend:latest
```

Then let Argo CD sync [k8s/argocd-application.yml](../k8s/argocd-application.yml) with `path: k8s`.

## 5. Ensure Kubernetes secrets exist

Use your local secrets files:
- k8s/backend-secret.yml
- k8s/mongodb-secret.yml
- k8s/redis-secret.yml

## 6. Deploy using Kind overlay

```bash
kubectl apply -k kind-cluster/kustomization-kind.yml
kubectl get all -n opspilot
```

## 7. Verify

```bash
kubectl get pods -n opspilot
kubectl get svc -n opspilot
kubectl get ingress -n opspilot
kubectl describe hpa -n opspilot
```

## 8. Access app

If ingress is healthy, open:
- http://localhost/

Backend API should be routed on:
- http://localhost/api/v1

If this is an EC2 instance, access with the instance public IP:
- http://<EC2_PUBLIC_IP>/
- http://<EC2_PUBLIC_IP>/api/v1

Make sure EC2 Security Group allows inbound TCP 80.

## 9. Install Kubernetes Dashboard (optional)

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
kubectl apply -f kind-cluster/dashboard-adminuser.yml
kubectl -n kubernetes-dashboard create token admin-user
kubectl proxy
```

Dashboard URL:
- http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

## 10. Installing Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl get svc -n argocd
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
kubectl port-forward -n argocd service/argocd-server 8443:443 &
```

Create the Argo CD Application from [k8s/argocd-application.yml](../k8s/argocd-application.yml) and set:
- `repoURL` to your GitHub repository
- `targetRevision` to `main` or your branch
- `path` to `k8s`

This works because [k8s/kustomization.yml](../k8s/kustomization.yml) now references the tracked `*.example.yml` secret manifests, so Argo CD can sync the whole folder directly from GitHub.

## 11. Argo CD Initial Admin Password

```bash
kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

## 12. Install HELM

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

## 13. Install Kube Prometheus Stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update
kubectl create namespace monitoring
helm install kind-prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --set prometheus.service.nodePort=30000 --set prometheus.service.type=NodePort --set grafana.service.nodePort=31000 --set grafana.service.type=NodePort --set alertmanager.service.nodePort=32000 --set alertmanager.service.type=NodePort --set prometheus-node-exporter.service.nodePort=32001 --set prometheus-node-exporter.service.type=NodePort
kubectl get svc -n monitoring
kubectl get namespace
kubectl port-forward svc/kind-prometheus-kube-prome-prometheus -n monitoring 9090:9090 --address=0.0.0.0 &
kubectl port-forward svc/kind-prometheus-grafana -n monitoring 31000:80 --address=0.0.0.0 &
```

## 14. Prometheus Queries

```bash
sum (rate (container_cpu_usage_seconds_total{namespace="default"}[1m])) / sum (machine_cpu_cores) * 100

sum (container_memory_usage_bytes{namespace="default"}) by (pod)


sum(rate(container_network_receive_bytes_total{namespace="default"}[5m])) by (pod)
sum(rate(container_network_transmit_bytes_total{namespace="default"}[5m])) by (pod)
```

## 15. Troubleshooting

```bash
kubectl get events -n opspilot --sort-by=.lastTimestamp
kubectl logs deployment/backend -n opspilot --tail=100
kubectl logs deployment/frontend -n opspilot --tail=100
kubectl logs statefulset/mongodb -n opspilot --tail=100
kubectl logs statefulset/redis -n opspilot --tail=100
```

## 16. Delete cluster

```bash
kind delete cluster --name opspilot-kind
```



