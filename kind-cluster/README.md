# Kind cluster overlay (local testing)

This folder contains kustomize overlays and helper manifests tailored for running OpsPilot in a local `kind` cluster.

## Purpose

- Provide local-friendly variants of production manifests (nginx ingress, no ALB certs, image patches).
- Keep production `k8s/` manifests unchanged; overlay lives in `kind-cluster/`.

## Common commands

- Create cluster: `kind create cluster --name opspilot --config kind-cluster/kind-config.yml`
- Install metrics-server: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`
- Install ingress-nginx for kind: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.6.4/deploy/static/provider/kind/deploy.yaml`
- Apply overlay via kustomize: `kubectl apply -k kind-cluster/`

## Notes

- Ingress in the overlay uses `ingressClassName: nginx` and does not reference cloud provider-specific annotations (ALB/ACM).
- Deployments intentionally omit `spec.replicas` when an HPA is present to avoid controller drift with Argo CD.

## Troubleshooting

- If HPAs show `FailedGetResourceMetric`, check `kubectl get apiservice v1beta1.metrics.k8s.io -o yaml` and ensure endpoints exist for metrics-server.
- If ingress does not show an external address, verify the `ingress-nginx` controller pods are Ready and check logs: `kubectl -n ingress-nginx logs deploy/ingress-nginx-controller`.

See the root README for full monitoring and Argo CD instructions: [../README.md](../README.md)
