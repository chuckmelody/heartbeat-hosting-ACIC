#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-full}"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="${ROOT_DIR%/}/"
TARGET_DIR="${ROOT_DIR%/}/hosting-build/"
FRONTEND_INDEX="${ROOT_DIR%/}/heartbeat/frontend/index.html"

mkdir -p "${TARGET_DIR}"

if [[ ! -f "${FRONTEND_INDEX}" ]]; then
  cat <<EOF >&2
[x] heartbeat/frontend is missing a built SPA bundle (index.html not found).
    Rebuild or restore the frontend assets before running $0 so deployments
    don’t wipe the live copy.
EOF
  exit 1
fi

EXCLUDES=(
  "--exclude=.git/"
  "--exclude=strapi/"
  "--exclude=hosting-build/"
  "--exclude=heartbeat/certs/"
)

case "${MODE}" in
  full)
    RSYNC_FLAGS=(-av --delete)
    ;;
  update)
    RSYNC_FLAGS=(-av --update)
    ;;
  *)
    echo "Usage: $0 [full|update]" >&2
    exit 1
    ;;
esac

echo "Syncing workspace (${MODE} mode) -> ${TARGET_DIR}"
rsync "${RSYNC_FLAGS[@]}" "${EXCLUDES[@]}" "${SOURCE_DIR}" "${TARGET_DIR}"

echo "Package ready at ${TARGET_DIR}"
