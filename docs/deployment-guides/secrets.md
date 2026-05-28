# Secrets and YAML files

This page explains how secrets are represented in this repo, safe handling practices, and examples for creating Kubernetes secrets from YAML or via CLI.

## Repository examples

Example secret templates (placeholders) are provided in `k8s/`:

- `k8s/backend-secret.example.yml`
- `k8s/mongodb-secret.example.yml`
- `k8s/redis-secret.example.yml`

These files are templates only and MUST NOT contain real credentials. Keep real secret values out of the repository.

## Recommended workflow

- Keep templates in the repo with placeholder values and the `.example.yml` suffix.
- Never commit files that contain real secrets. Add any literal secret files to `.gitignore`.
- For GitOps, store encrypted sealed secrets or use an external secret store (Vault, AWS Secrets Manager, Azure Key Vault) and an operator (ExternalSecrets) to inject them.
- CI systems should use secure credential stores (Jenkins credentials, GitHub Actions secrets) and inject secrets at runtime.

## Kubernetes: creating secrets

From an existing template (edit placeholders locally then apply):

```bash
# Edit k8s/backend-secret.example.yml and replace placeholders locally, then apply
kubectl apply -f k8s/backend-secret.example.yml
```

Create from literals (recommended for quick local testing):

```bash
kubectl create secret generic backend-secret \
  --from-literal=JWT_ACCESS_SECRET='supersecret' \
  --from-literal=JWT_REFRESH_SECRET='anothersecret' \
  --from-literal=MONGO_URI='mongodb://user:pass@mongodb:27017/opspilot?authSource=admin' \
  --namespace opspilot
```

Create from files (recommended when secrets are stored in files):

```bash
kubectl create secret generic redis-secret --from-file=redis-password=./redis-password.txt --namespace opspilot
```

Use `--dry-run=client -o yaml` to generate a YAML without applying:

```bash
kubectl create secret generic backend-secret --from-literal=JWT_ACCESS_SECRET='...' --dry-run=client -o yaml > k8s/backend-secret.yml
```

## Kustomize: secretGenerator

You can generate secrets with kustomize using `secretGenerator` in your overlay `kustomization.yaml`:

```yaml
secretGenerator:
  - name: backend-secret
    literals:
      - MONGO_URI=mongodb://user:pass@mongodb:27017/opspilot?authSource=admin
      - JWT_ACCESS_SECRET=supersecret
generatorOptions:
  disableNameSuffixHash: true
```

Note: generated secrets will be rendered into the final manifest. Avoid committing generated secrets; generate them at deploy time or use encrypted variants.

## Sealed Secrets (git-friendly, encrypted)

For GitOps workflows you can use Bitnami Sealed Secrets or Mozilla SOPS to keep encrypted secrets in Git.

Example with `kubeseal` (requires cluster `kubeseal` controller):

```bash
kubectl create secret generic backend-secret --from-literal=JWT_ACCESS_SECRET='supersecret' --dry-run=client -o yaml \
  | kubeseal --format=yaml > k8s/backend-sealed.yml
# Commit sealed file safely; apply sealed file to cluster
kubectl apply -f k8s/backend-sealed.yml
```

## CI/CD: inject secrets securely

- Jenkins: store credentials in Jenkins Credentials store and inject them using `withCredentials` or credential bindings in pipelines. Do NOT store secrets in the Jenkinsfile.

Example snippet (Jenkinsfile):

```groovy
withCredentials([string(credentialsId: 'JWT_ACCESS_SECRET_ID', variable: 'JWT_ACCESS_SECRET')]) {
  sh 'echo $JWT_ACCESS_SECRET'
}
```

- GitHub Actions: store secrets in the repository or organization Secrets and reference them via `secrets.NAME` in workflows.

## Referencing secrets in manifests

Deployment example using `envFrom`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  template:
    spec:
      containers:
        - name: backend
          image: ghcr.io/your/repo/backend:latest
          envFrom:
            - secretRef:
                name: backend-secret
```

Or reference a specific key:

```yaml
          env:
            - name: JWT_ACCESS_SECRET
              valueFrom:
                secretKeyRef:
                  name: backend-secret
                  key: JWT_ACCESS_SECRET
```

## Best practices checklist

- [ ] Use `.example.yml` templates for repository-checked templates.
- [ ] Never commit plaintext secrets; add accidental files to `.gitignore`.
- [ ] Prefer sealed-secrets, SOPS, or external secret managers for GitOps.
- [ ] Use CI credential stores (Jenkins/GitHub) for pipeline secrets.
- [ ] Rotate secrets regularly and document rotation procedures in this doc.

## Repo-specific notes

- Example secret template files are under `k8s/` and use `stringData` with `<CHANGE_ME>` placeholders. Replace and create real secrets at deploy time.

If you want, I can:
- Add a `docs/deployment-guides/secrets-rotation.md` with rotation steps, or
- Add a `k8s/README.md` that explains how the repo secret templates are used during deployments.
