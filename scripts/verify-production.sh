#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PRIMARY_HOST="${PRIMARY_HOST:-heartbeatacic.org}"
WWW_HOST="${WWW_HOST:-www.heartbeatacic.org}"

echo "[1/3] docker compose ps"
docker compose ps

echo "[2/3] nginx log tail (30 lines)"
docker compose logs nginx --tail 30 || true

echo "[3/3] curl checks"
curl -I "https://${PRIMARY_HOST}" || true
curl -I "https://${WWW_HOST}" || true

cat <<'MSG'
Verification complete. Ensure both curl calls returned HTTP 200/301 with valid certificates.
MSG
