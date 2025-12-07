# Docker Full Reset Script

Use this script when you need to return a Docker host to a pristine state. It stops and removes all containers, images, volumes, and custom networks, prunes builder caches, clears CLI metadata, and (optionally) wipes `/var/lib/docker` for a factory reset on Linux.

```bash
#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

log "Stopping running containers (if any)..."
docker ps -q | xargs -r docker stop

log "Removing all containers..."
docker ps -aq | xargs -r docker rm -f

log "Tearing down docker compose stacks..."
docker compose down --volumes --remove-orphans || true

log "Removing all images..."
docker images -aq | xargs -r docker rmi -f

log "Removing all volumes..."
docker volume ls -q | xargs -r docker volume rm

log "Pruning non-default networks..."
docker network prune -f

log "Pruning builder cache..."
docker builder prune -af

log "Pruning system artifacts (including volumes)..."
docker system prune -af --volumes

log "Docker disk utilization after cleanup:"
docker system df || true

read -rp $'\nDo you want to perform a full factory reset? This deletes /var/lib/docker (requires sudo). [y/N] ' CONFIRM
if [[ "${CONFIRM:-}" =~ ^[Yy]$ ]]; then
  log "Stopping Docker daemon..."
  sudo systemctl stop docker

  log "Deleting /var/lib/docker..."
  sudo rm -rf /var/lib/docker

  log "Starting Docker daemon..."
  sudo systemctl start docker
fi

read -rp $'\nDo you also want to remove per-user Docker CLI settings (~/.docker)? [y/N] ' WIPE_CFG
if [[ "${WIPE_CFG:-}" =~ ^[Yy]$ ]]; then
  log "Removing ~/.docker..."
  rm -rf "$HOME/.docker"
fi

log "Reset complete. Verify with: docker run hello-world"
```

## Usage
1. Save the script as `docker-reset.sh`.
2. Make it executable with `chmod +x docker-reset.sh`.
3. Run it: `./docker-reset.sh`.
4. After completion, verify Docker by running `docker run hello-world`.

> **Warning:** This script irreversibly deletes containers, images, volumes, and Docker state. Double-check before running in production environments.
