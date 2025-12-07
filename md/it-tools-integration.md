# IT Tools Integration Plan

## 1. Understand Upstream Project
- Repository: https://github.com/CorentinTh/it-tools (Vue 3, Vite, pnpm, Docker image available).
- Actions:
  - Read README, LICENSE, and Docker instructions.
  - Note build command (`pnpm install && pnpm build`) and output folder.
  - Document required env vars/resources.
  - Capture findings here for future upgrades.

## 2. Integration Strategy
| Option | Description | Pros | Cons | When to prefer |
| --- | --- | --- | --- | --- |
| **A. Embedded iframe** | Run `it-tools` elsewhere (remote or local container) and load it inside an iframe on `/tools`. | Minimal coupling; upgrades handled where it’s hosted; SPA only needs a simple page. | Iframe feels less native; cross-origin CSP restrictions; must manage authentication or message passing; poor deep-linking. | When infrastructure already hosts `it-tools` and we only need a view into it. |
| **B. Reverse proxy** | Start an `it-tools` Docker container alongside our stack; proxy `/tools/it-tools` to it so users stay on `dev.heartbeat.local`. | Native feel; no iframe limitations; CSP manageable because traffic is same-origin; container lifecycle controlled via our scripts. | Another service to monitor + patch; adds complexity to `docker-compose`; need to ensure resource limits so it doesn’t impact main SPA. | General-purpose, recommended if we want the full app without duplicating build pipelines. |
| **C. Bundle static assets** | Pull the repo, build it with pnpm, and serve compiled assets from Express/Nginx as part of our SPA bundle. | One build/dev pipeline; no extra container; works offline. | Increases our build time and bundle size; we must keep upstream dependencies updated; potential CSS/JS conflicts; license compliance similar to vendor libs. | If we want `it-tools` to behave like a built-in feature and are ready to own the merge/upgrade story. |

**Decision:** Option B (reverse proxy) is locked in. We run a pinned container inside our stack, expose it at `/tools/it-tools`, and keep all traffic same-origin so the iframe behaves like a native screen. Because the upstream bundle is built with `BASE_URL="/"`, we now maintain a tiny derived image (`docker/it-tools/Dockerfile`) that rewrites the compiled `BASE_URL` literal to `/tools/it-tools/` during the Docker build. That keeps routing correct without forking or rebuilding the whole project.

## 3. Application Changes
- Sidebar nav: add “Tools” linking to `/tools`.
- New view `frontend/static/js/views/Tools.js`:
  - Intro card explaining what IT Tools provides + link to upstream repo.
  - Embed `<iframe src="/tools/it-tools">` with fallback copy when unavailable.
  - Provide CTA to open in a new tab for full-screen mode.
- Router (`frontend/static/js/index.js`) needs the `/tools` route + dynamic CSS.
- GSAP selectors: include `.tools-page`, `.it-tools-frame` for smooth transitions.

## 4. Docker / Automation
- `docker-compose.yml`:
  - Service `it-tools` now builds from `docker/it-tools/Dockerfile`, which inherits the upstream image, patches the compiled bundle so `BASE_URL=/tools/it-tools/`, and tags the result locally as `hosting-it-tools:latest`.
  - `build.args.IT_TOOLS_IMAGE` lets us bump the upstream tag, while `IT_TOOLS_BASE` controls the proxy path if we ever change it.
  - Container stays on the same bridge network as nginx and still only exposes port 80 internally.
- Scripts:
  - `./scripts/tools-up.sh` → `docker compose up -d it-tools`.
  - `./scripts/tools-down.sh` → `docker compose stop it-tools`.
  - `./scripts/local-rebuild.sh` already rebuilds every service, so rerunning it picks up any Dockerfile changes (including the it-tools patch).
- Packaging (`scripts/package-build.sh full`): copy updated compose/nginx configs and the `docker/it-tools/` context into `hosting-build` so the remote host rebuilds the same patched image.

## 5. CSP & Routing
- Audit the it-tools app for external hosts (fonts, cdnjs, jsdelivr, etc.) and extend CSP (`script-src`, `style-src`, `font-src`, `connect-src`) as needed.
- Nginx handles `/tools/it-tools/*`: it proxies directly to `heartbeat-it-tools`, drops `Accept-Encoding`, and uses `sub_filter` to prepend `/tools/it-tools/` onto root-relative asset URLs (scripts, styles, service worker, manifest, CSS `url()` tokens, etc.).
- No Express proxy is required—the SPA only needs the iframe pointed at `/tools/it-tools/`.
- Config knobs now live entirely in the nginx config (e.g., tweak the `sub_filter` list if upstream assets change).

## 6. Testing & Documentation
- Manual test checklist:
  - `/tools` landing page renders; `/tools/it-tools` returns HTTP 200.
  - Stopping the container triggers a friendly “service unavailable” message.
  - Navigation back to other SPA pages works.
  - `./scripts/tools-up.sh` and `tools-down.sh` start/stop cleanly.
- Documentation:
  - `PROJECT-WORKFLOW.md` now explains how to rebuild the patched image (`docker compose build it-tools` followed by `./scripts/local-rebuild.sh`) whenever we bump the upstream version or tweak the base path.
  - Record the pinned upstream image/tag and the current `IT_TOOLS_BASE` so upgrades stay predictable.
  - (Optional) add a helper script that checks the upstream GitHub repo for new releases/tags.

## 7. Upgrading the embedded build
1. Edit `docker/it-tools/Dockerfile` (or the `IT_TOOLS_IMAGE` arg in `docker-compose.yml`) to point at the new upstream tag.
2. `COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose build it-tools`
3. `./scripts/local-rebuild.sh`
4. Browse `https://dev.heartbeat.local/tools` to confirm routing works.
5. Run the usual `package-build → deploy-remote → verify-production` flow so the server reuses the patched image.
