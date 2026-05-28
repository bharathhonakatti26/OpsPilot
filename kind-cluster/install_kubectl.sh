#!/usr/bin/env bash
set -euo pipefail

KUBECTL_VERSION="v1.30.2"

if command -v kubectl >/dev/null 2>&1; then
	echo "kubectl is already installed: $(kubectl version --client 2>/dev/null | head -n 1)"
	exit 0
fi

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
	x86_64|amd64) ARCH="amd64" ;;
	arm64|aarch64) ARCH="arm64" ;;
	*)
		echo "Unsupported architecture: $ARCH"
		exit 1
		;;
esac

BINARY_URL="https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/${OS}/${ARCH}/kubectl"
echo "Downloading kubectl from ${BINARY_URL}"

curl -fsSL "$BINARY_URL" -o ./kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

echo "kubectl installation complete"
kubectl version --client
