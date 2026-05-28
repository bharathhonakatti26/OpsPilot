#!/usr/bin/env bash
set -euo pipefail

KIND_VERSION="v0.23.0"

if command -v kind >/dev/null 2>&1; then
	echo "kind is already installed: $(kind --version)"
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

BINARY_URL="https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-${OS}-${ARCH}"
echo "Downloading kind from ${BINARY_URL}"

curl -fsSL "$BINARY_URL" -o ./kind
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

echo "kind installed successfully: $(kind --version)"
