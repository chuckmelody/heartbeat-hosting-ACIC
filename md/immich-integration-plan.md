# Immich Integration Plan

## 0. Current Hosting Snapshot
- `docker-compose.yml` currently runs `heartbeat-frontend`, `nginx`, and the patched `it-tools` container on the single `heartbeat-backend-net` bridge. All traffic terminates inside `nginx` (`nginx/nginx.conf`) with TLS certs bind-mounted from `/etc/letsencrypt`.
- Helper automation (`scripts/local-rebuild.sh`, `scripts/package-build.sh`, `scripts/deploy-remote.sh`, `scripts/verify-production.sh`) already enforces a rebuild → package → deploy → verify loop, so any new service should plug into that pipeline instead of introducing bespoke commands.
- Documentation lives in `md/` (see `md/it-tools-integration.md`), so this plan mirrors that format and assumes all future notes about Immich land in this folder.

## 1. Upstream Research Tasks
1. Clone https://github.com/immich-app/immich (or download a release archive) into `~/scratch` for reference only; we will not vendor the entire repo.
2. Read:
   - `README.md` and `docs/docs/installation/docker-compose.md` for the official compose topology.
   - `compose.yaml` for exact service names, exposed ports (`2283` for the API/UI, `3003` for machine learning), environment defaults, and volume mounts.
   - `docs/docs/configuration/environment-variables.md` to capture all required variables (database passwords, JWT secret, reverse-proxy headers, mapbox keys, etc.).
3. Capture Immich release/tag we plan to pin (for example `release-1.102.0`) and verify there is a matching docker image (`ghcr.io/immich-app/immich-server:<tag>`).
4. List optional components (machine-learning GPU acceleration, object storage backends, WebDAV importers) and decide which ones we can run on the current VPS hardware.

Deliverable: a short findings note appended to this file identifying the pinned version, required ENV vars, CPU/RAM/disk estimates, and which upstream docs matter most for maintenance.

## 2. Target Architecture Overview
| Layer | Component(s) | Notes |
| --- | --- | --- |
| Runtime containers | `immich-server`, `immich-microservices`, `immich-machine-learning`, `immich-redis`, `immich-postgres`, `immich-typesense` | Compose services live inside the existing `heartbeat-backend-net` so `nginx` can proxy them without exposing new host ports. |
| Storage | `immich_uploads`, `immich_library`, `immich_db`, `immich_redis`, `immich_typesense` volumes + bind-mount for original media (e.g. `/srv/immich/library`) | Keeps application data, generated thumbnails, and DB files isolated for backup/restore. |
| Configuration | `docker/immich/compose.immich.yml`, `.env.immich`, `docker/immich/README.md` | Compose override lives under `docker/immich/`; env file stays at repo root but excluded from git if it contains secrets. |
| Entry points | `photos.heartbeatacic.org` (public) + `photos.dev.heartbeat.local` (dev) | Each host proxies to `immich-server:2283` via `nginx`, enabling both the PWA and the Android app to connect over HTTPS. |

## 3. Docker & Configuration Work
1. Create `docker/immich/compose.immich.yml`:
   - Copy the upstream services, remove host port bindings, and set `networks: [heartbeat-backend-net]`.
   - Add `depends_on` for `immich-redis`, `immich-postgres`, and `immich-typesense`.
   - Scope image tags via build args (`IMMICH_VERSION`) so bumps only change a single variable.
2. Add a repo-level `.env.immich.example` documenting required variables:
   - `IMMICH_VERSION`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `TYPESENSE_API_KEY`, `REDIS_PASSWORD` (optional), and absolute host paths for the photo library/import folders.
   - Mention GPU flags (e.g., `IMMICH_MACHINE_LEARNING_GPU=true`) and note they will stay disabled unless the VPS has CUDA.
3. Update `docker-compose.yml` to include `- docker/immich/compose.immich.yml` via `docker compose -f docker-compose.yml -f docker/immich/compose.immich.yml up`. Document this in `PROJECT-WORKFLOW.md`.
4. Ensure `scripts/local-rebuild.sh` and `scripts/deploy-remote.sh` automatically load the Immich env file (e.g., `export $(grep -v '^#' .env.immich | xargs)`) before invoking `docker compose` so secrets are available during `build`/`up`.
5. Add helper scripts:
   - `scripts/immich-up.sh` / `scripts/immich-down.sh` mirroring the IT Tools helpers for targeted restarts.
   - `scripts/immich-shell.sh <service>` to exec into `immich-server` or `immich-postgres` quickly.

## 4. Networking, DNS, and TLS
1. Domain plan:
   - Production: create an A record `photos.heartbeatacic.org → VPS`.
   - Dev: reuse the hosts entry workflow and reserve `photos.dev.heartbeat.local` for local testing.
2. Certificates:
   - Update `scripts/run-certbot.sh` to include the new public hostname in `CERTBOT_DOMAINS`.
   - Mirror the dev certificate approach by generating a `heartbeat/photos-dev-cert.pem` bundle (self-signed) so browsers trust `photos.dev.heartbeat.local`.
3. Reverse proxy updates (`nginx/nginx.conf`):
   - Define new upstreams or direct `proxy_pass http://immich-server:2283`.
   - Add a new `server` block for `photos.heartbeatacic.org` with the LetsEncrypt cert paths.
   - Duplicate for the dev host using the local certs.
   - Inside each block, forward standard Immich headers: `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Frame-Options SAMEORIGIN`.
   - Enable WebSocket upgrades (`proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`) because the Immich web UI uses them.
   - Limit upload body size (e.g., `client_max_body_size 1G;`) to support large video uploads from Android.
4. Firewall/ports: no new host ports are exposed; only nginx listens on 80/443, so the Android app connects through HTTPS automatically.

## 5. Storage, Backups, and Resource Planning
1. Host directories:
   - `/srv/immich/library` – original media (bind into `immich-server:/usr/src/app/upload/library`).
   - `/srv/immich/import` – optional drop folder for bulk import.
2. Docker volumes:
   - Define named volumes for `postgres`, `redis`, `typesense`, and generated thumbnails.
3. Backups:
   - Extend existing backup playbook (if any) to dump the Immich Postgres DB nightly and rsync the library directory to off-site storage.
   - Document manual restore steps: stop Immich, restore volume snapshots/dumps, start stack, run `immich-cli` `sync` command.
4. Monitoring disk/RAM:
   - Estimate disk usage per user (Immich stores original + derived files). Plan headroom (>= 2× expected photo volume).
   - Add `docker stats immich-*` to the ops checklist to watch for runaway ML tasks.

## 6. Changes to Automation & Docs
1. `PROJECT-WORKFLOW.md`: add Immich-specific sections explaining how to set the env file, run helper scripts, and include the Immich endpoints in the verify step.
2. `scripts/verify-production.sh`: add curl checks such as `curl -k https://photos.dev.heartbeat.local/api/server-info` and `curl https://photos.heartbeatacic.org/api/server-info`.
3. `scripts/package-build.sh`: include the new `docker/immich/` directory and `.env.immich.example` in the rsync allow list so deployments stay in sync.
4. `md/` docs: keep this plan updated and add a condensed runbook (`md/immich-operations.md`) once implementation starts (user management, manual import/export commands, backup procedures).

## 7. UX & Integration With Heartbeat
1. Heartbeat frontend:
   - Add a prominent entry point (e.g., “Photo Vault”) linking to `https://photos.heartbeatacic.org` and, for dev builds, to `https://photos.dev.heartbeat.local`.
   - If deeper integration is desired, embed a CTA card describing the Immich mobile app with download links.
2. Auth story:
   - Immich handles its own user accounts; document whether you will invite Heartbeat users manually or keep it limited to admins.
   - Consider enabling SSO later (Immich supports OIDC); plan for a future task to integrate if Heartbeat adopts an IdP.
3. Android setup instructions:
   - Document how to add the server in the Immich mobile app (use the HTTPS hostname, accept the dev certificate, login).
   - Note that background uploads require the Immich app + battery optimization exclusions; include this in user onboarding instructions.

## 8. Testing & Verification Matrix
| Stage | Tests |
| --- | --- |
| Local/dev | `./scripts/local-rebuild.sh`, confirm nginx serves `https://photos.dev.heartbeat.local`, run `docker compose logs immich-server`, upload sample photos from a laptop + Android emulator or device. |
| Pre-production | Run `scripts/package-build.sh full` + `deploy-remote.sh`, execute Immich CLI `immich-cli server-info`, stress-test uploads (1 GB video). |
| Production smoke | `scripts/verify-production.sh` extended checks, Android device upload/download, sharing albums via the web UI, verify push notifications if configured. |
| Regression | Restart only Immich services via `scripts/immich-down.sh && scripts/immich-up.sh` to ensure data persists, simulate DB restore on a staging snapshot. |

## 9. Rollout Timeline (Step-by-Step)
1. **Week 0 – Prep**
   - Gather hardware stats, confirm disk headroom, capture current nginx config and Compose files.
2. **Week 1 – Compose scaffolding**
   - Add `docker/immich` files, env templates, helper scripts; run stack locally until `https://photos.dev.heartbeat.local` loads.
3. **Week 1 – Proxy + TLS**
   - Update nginx config, generate dev certs, extend certbot script, validate `curl -k https://photos.dev.heartbeat.local/api/server-info`.
4. **Week 2 – Data + backups**
   - Mount real storage paths, seed with sample media, script Postgres dumps + rsync tasks.
5. **Week 2 – Automation & docs**
   - Update workflow/playbook files, add verify checks, document Android onboarding.
6. **Week 3 – Production enablement**
   - Request DNS + certs, deploy to VPS, run end-to-end tests with an Android device + browser.
7. **Week 3 – Launch**
   - Flip nav link live in Heartbeat, invite first users, monitor logs/metrics, iterate on feedback.

## 10. Ongoing Maintenance
- Track Immich releases (watch GitHub repo) and schedule quarterly upgrades: `IMMICH_VERSION=<tag> docker compose build immich-server immich-microservices immich-machine-learning`.
- Monitor upstream breaking changes (DB migrations, env var renames) and update `.env.immich`.
- Review storage usage monthly; expand the VPS volume before disk fills up (Immich stops accepting uploads when the DB disk is full).
- Keep an eye on `immich-machine-learning` container size—disable GPU features if the VPS cannot handle them, or offload to an external machine-learning host later.

> Once the tasks above are complete, move actionable steps into separate issues (compose file creation, nginx proxy, certbot update, automation scripts, frontend link, Android onboarding) so progress is trackable and reversible.

