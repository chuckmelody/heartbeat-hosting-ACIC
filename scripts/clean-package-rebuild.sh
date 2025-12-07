#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE_DIR="${ROOT_DIR%/}/hosting-build"

echo "[1/3] Removing existing ${PACKAGE_DIR} (if any)..."
rm -rf "${PACKAGE_DIR}"

echo "[2/3] Running full package build..."
"${ROOT_DIR}/scripts/package-build.sh" full

echo "[3/3] Contents of ${PACKAGE_DIR}:"
ls -al "${PACKAGE_DIR}"
