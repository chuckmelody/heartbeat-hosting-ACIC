#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

DOMAINS=(${CERTBOT_DOMAINS:-heartbeacic.org www.heartbeacic.org})
EMAIL="${CERTBOT_EMAIL:-}"

if [[ ${#DOMAINS[@]} -eq 0 ]]; then
  echo "No domains specified via CERTBOT_DOMAINS." >&2
  exit 1
fi

CERTBOT_ARGS=(--nginx --non-interactive --agree-tos)
if [[ -n "$EMAIL" ]]; then
  CERTBOT_ARGS+=("--email" "$EMAIL")
else
  CERTBOT_ARGS+=("--register-unsafely-without-email")
fi

for domain in "${DOMAINS[@]}"; do
  CERTBOT_ARGS+=(-d "$domain")
done

echo "Stopping nginx container so Certbot can bind to 80/443..."
docker compose stop nginx

echo "Requesting certificates for: ${DOMAINS[*]}"
sudo certbot "${CERTBOT_ARGS[@]}"

echo "Starting nginx container again..."
docker compose start nginx
docker compose restart nginx

cat <<'MSG'
Certificates requested. Ensure /etc/letsencrypt/live contains the new certs and nginx picked them up.
MSG
