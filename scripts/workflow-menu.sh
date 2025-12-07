#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

DEFAULT_REMOTE_HOST="gregh@159.198.41.95"
DEFAULT_REMOTE_DIR="/home/gregh/projects/hosting"

show_menu() {
  cat <<'MENU'
Heartbeat Workflow Menu
1) Local rebuild (clean Docker + restart stack)
2) Clean package rebuild (delete hosting-build + full mirror)
3) Package build (full)
4) Package build (update)
5) Deploy locally (REMOTE_HOST=local)
6) Deploy to remote host over SSH
7) Verify production (docker ps + curl checks)
8) Run Certbot (public cert renewal)
9) Git publish (stage/commit/push/optional PR)
q) Quit
MENU
}

while true; do
  show_menu
  read -rp "Select an option: " choice

  case "$choice" in
    1)
      ./scripts/local-rebuild.sh
      ;;
    2)
      ./scripts/clean-package-rebuild.sh
      ;;
    3)
      ./scripts/package-build.sh full
      ;;
    4)
      ./scripts/package-build.sh update
      ;;
    5)
      REMOTE_HOST=local ./scripts/deploy-remote.sh
      ;;
    6)
      read -rp "REMOTE_HOST [${DEFAULT_REMOTE_HOST}]: " host
      read -rp "REMOTE_DIR [${DEFAULT_REMOTE_DIR}]: " dir
      host="${host:-$DEFAULT_REMOTE_HOST}"
      dir="${dir:-$DEFAULT_REMOTE_DIR}"
      REMOTE_HOST="$host" REMOTE_DIR="$dir" ./scripts/deploy-remote.sh
      ;;
    7)
      ./scripts/verify-production.sh
      ;;
    8)
      read -rp "CERTBOT_EMAIL (leave blank to skip email): " email
      read -rp "CERTBOT_DOMAINS (space separated, blank for defaults): " domains
      if [[ -n "$domains" ]]; then
        CERTBOT_DOMAINS="$domains" CERTBOT_EMAIL="$email" ./scripts/run-certbot.sh
      else
        CERTBOT_EMAIL="$email" ./scripts/run-certbot.sh
      fi
      ;;
    9)
      ./scripts/git-publish.sh
      ;;
    q|Q)
      echo "Bye!"
      exit 0
      ;;
    *)
      echo "Invalid selection. Try again."
      ;;
  esac
  echo
done
