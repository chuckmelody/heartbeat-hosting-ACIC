#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="${ROOT_DIR%/}/hosting-build"

REMOTE_HOST="${REMOTE_HOST:-gregh@159.198.41.95}"
REMOTE_DIR="${REMOTE_DIR:-/home/gregh/projects/hosting}"

if [[ ! -d "${BUILD_DIR}" ]]; then
  echo "Build directory ${BUILD_DIR} not found. Run scripts/package-build.sh first." >&2
  exit 1
fi

if [[ -z "${REMOTE_HOST}" ]]; then
  echo "REMOTE_HOST is empty." >&2
  exit 1
fi

REQUIRED_ITEMS=(
  "docker-compose.yml"
  "scripts"
  "nginx/nginx.conf"
)
for item in "${REQUIRED_ITEMS[@]}"; do
  if [[ ! -e "${BUILD_DIR}/${item}" ]]; then
    echo "[x] Build directory is missing '${item}'. Re-run ./scripts/clean-package-rebuild.sh before deploying." >&2
    exit 1
  fi
done

LOCAL_DEPLOY=false
if [[ "${REMOTE_HOST}" == "local" || "${REMOTE_HOST}" == "localhost" ]]; then
  LOCAL_DEPLOY=true
fi

RSYNC_BASE_ARGS=(-av --delete)
RSYNC_EXCLUDES=(
  --exclude='hosting-build/'
  --exclude='.git/'
)

if ${LOCAL_DEPLOY}; then
  echo "[1/3] Syncing ${BUILD_DIR} -> ${REMOTE_DIR} (local)"
  rsync "${RSYNC_BASE_ARGS[@]}" "${RSYNC_EXCLUDES[@]}" "${BUILD_DIR}/" "${REMOTE_DIR}/"

  echo "[2/3] Rebuilding stack locally"
  (
    cd "${REMOTE_DIR}"
    docker compose down --volumes --remove-orphans
    COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose build --no-cache
    docker compose up -d
  )

  echo "[3/3] Local nginx logs tail (20 lines)"
  (
    cd "${REMOTE_DIR}"
    docker compose logs nginx --tail 20
  )
else
  echo "[1/3] Syncing ${BUILD_DIR} -> ${REMOTE_HOST}:${REMOTE_DIR}"
  rsync "${RSYNC_BASE_ARGS[@]}" "${RSYNC_EXCLUDES[@]}" "${BUILD_DIR}/" "${REMOTE_HOST}:${REMOTE_DIR}/"

  echo "[2/3] Rebuilding stack on ${REMOTE_HOST}"
  SSH_CMD="cd ${REMOTE_DIR} && docker compose down --volumes --remove-orphans && COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose build --no-cache && docker compose up -d"
  ssh "${REMOTE_HOST}" "${SSH_CMD}"

  echo "[3/3] Remote nginx logs tail (20 lines)"
  ssh "${REMOTE_HOST}" "cd ${REMOTE_DIR} && docker compose logs nginx --tail 20"
fi

cat <<'MSG'
Deployment finished. Visit https://heartbeatacic.org to verify the SPA.
MSG
