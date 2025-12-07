#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "docker-compose.yml" ]]; then
  echo "docker-compose.yml not found in ${ROOT_DIR}" >&2
  exit 1
fi

check_port() {
  local port=$1
  if command -v nc >/dev/null 2>&1; then
    if nc -z localhost "$port" >/dev/null 2>&1; then
      return 0
    fi
  else
    if ss -ltn 2>/dev/null | grep -q ":${port}[[:space:]]"; then
      return 0
    fi
  fi
  return 1
}

ports_in_use=0
for port in 80 443; do
  if check_port "$port"; then
    ports_in_use=1
    break
  fi
done

if [[ $ports_in_use -eq 1 ]]; then
  echo "[!] Ports 80/443 already in use. Attempting to stop any running Docker stack..."
  if docker compose ps >/dev/null 2>&1; then
    docker compose down --volumes --remove-orphans || true
  fi

  sleep 2
  still_blocked=0
  for port in 80 443; do
    if check_port "$port"; then
      still_blocked=1
      break
    fi
  done

  if [[ $still_blocked -eq 1 ]]; then
    cat <<EOF >&2
[x] Ports 80/443 are still busy after stopping the stack.
    This usually means a host-level nginx service (outside Docker) is running.
    Disable it so Docker's nginx container can bind to those ports:
        sudo systemctl disable --now nginx
        sudo systemctl mask nginx
    After stopping the host service, rerun ./scripts/local-rebuild.sh.
EOF
    exit 1
  fi
fi

echo "[1/6] Stopping stack and cleaning volumes..."
docker compose down --volumes --remove-orphans

echo "[2/6] Building images..."
COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose build --no-cache

echo "[3/6] Starting services..."
docker compose up -d

echo "[4/6] Showing nginx logs..."
docker compose logs nginx --tail 20 || true

echo "[5/6] Removing default nginx site if present..."
if docker compose exec nginx test -f /etc/nginx/conf.d/default.conf 2>/dev/null; then
  docker compose exec nginx rm -f /etc/nginx/conf.d/default.conf
else
  echo "No default.conf detected inside nginx container."
fi

echo "[6/6] Reloading nginx configuration..."
NGINX_ID="$(docker compose ps -q nginx || true)"
if [[ -z "${NGINX_ID}" ]]; then
  echo "[x] nginx container not found; skipping reload." >&2
else
  for attempt in {1..10}; do
    STATUS="$(docker inspect -f '{{.State.Status}}' "${NGINX_ID}" 2>/dev/null || echo "unknown")"
    if [[ "${STATUS}" == "running" ]]; then
      docker compose exec nginx nginx -s reload
      break
    fi
    if [[ $attempt -eq 10 ]]; then
      echo "[x] nginx container is '${STATUS}' after waiting. Check docker logs." >&2
      exit 1
    fi
    echo "    nginx status is '${STATUS}', waiting..."
    sleep 2
  done
fi

echo
docker compose ps

cat <<'MSG'
Local rebuild complete. Verify https://dev.heartbeat.local:3230/login loads the SPA.
MSG
