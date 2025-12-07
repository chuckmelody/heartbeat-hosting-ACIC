# Heartbeat Hosting Workflow

This playbook keeps every deployment task inside `/home/gregh/projects/hosting`. Follow it from top to bottom each work session so your VS Code tunnel, git state, Docker stack, and production server always stay in sync.

## 0. Remote VS Code session
1. Launch VS Code → **Remote Explorer → Tunnels** and connect to `hq`, or open `https://vscode.dev/tunnel/hq/home/gregh/projects/hosting`.
2. Open a terminal in that window and `cd /home/gregh/projects/hosting`. All commands/scripts in this doc assume that directory.
3. Use this same window for git, Docker, and deployment commands; it already has the right SSH keys for GitHub and your VPS.

## 1. One-time bootstrap (run on the VPS once)
```bash
sudo apt update
sudo apt install gh -y
gh auth login         # choose GitHub.com → SSH → use existing key

cd /home/gregh/projects/hosting
git init
gh repo create chuckmelody/heartbeacic --private --source=. --remote=origin --push
git branch -M main
git remote set-url origin git@github.com:chuckmelody/heartbeacic.git
```
After the repo exists, always `git checkout main && git pull origin main` before you start a new task. Use `scripts/git-feature.sh` to create feature branches and push them (it still prompts for branch name, stages, commits, and pushes).

## 2. Helper scripts overview
- `scripts/local-rebuild.sh` – shuts down the stack, rebuilds it from scratch, starts everything, tails nginx logs, removes the default site if it exists, and reloads nginx.
- `scripts/package-build.sh [full|update]` – mirrors `/home/gregh/projects/hosting/` into `/home/gregh/projects/hosting-build/` while excluding `.git/` and `strapi/`. `full` uses `--delete` for a clean mirror; `update` uses `--update` to copy only changed files.
- `scripts/deploy-remote.sh` – rsyncs `hosting-build/` to `gregh@159.198.41.95:/home/gregh/projects/hosting/`, rebuilds the stack remotely, and tails nginx logs. Override `REMOTE_HOST`/`REMOTE_DIR` env vars if needed.
- `scripts/run-certbot.sh` – stops nginx, runs `sudo certbot --nginx` for the domains in `CERTBOT_DOMAINS` (defaults to `heartbeacic.org www.heartbeacic.org`), then restarts nginx.
- `scripts/verify-production.sh` – prints `docker compose ps`, tails nginx logs, and curls both `https://heartbeatacic.org` and `https://www.heartbeatacic.org`.
- `scripts/tools-up.sh` / `scripts/tools-down.sh` – start/stop the bundled IT Tools container that powers `/tools/it-tools`. Use these if the iframe is blank or you need to free resources.
- `scripts/git-feature.sh` – existing helper for creating/pushing feature branches off `main`.
- `scripts/git-publish.sh` – stages all changes, prompts for a commit message, pushes the current branch, and optionally opens `gh pr create` (after confirming you ran the verification script).
- `scripts/workflow-menu.sh` – interactive menu that wraps the common scripts above so you can pick actions (local rebuild, package, deploy, certbot, git publish, etc.) without memorizing each command.
- `md/wiki-gateway.md` / `md/waffle-news.md` – reference docs for the wiki proxy and the new red-top news layout (hero, bulletins, masonry cards).

### Custom IT Tools image
- `docker/it-tools/Dockerfile` inherits the upstream `ghcr.io/corentinth/it-tools` image and rewrites the compiled `BASE_URL` literal to `/tools/it-tools/`. This prevents the iframe from loading the upstream “404 / Back home” page when the SPA bootstraps under a sub-path.
- When upgrading the upstream release or tweaking the base path:
  ```bash
  # 1. Edit docker-compose.yml (IT_TOOLS_IMAGE arg) if you want a newer tag.
  COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 docker compose build it-tools
  ./scripts/local-rebuild.sh          # restarts nginx + reloads the proxy rules
  ```
  After the rebuild, open `https://dev.heartbeat.local/tools` and make sure the tool grid appears immediately (no “Back home” message). From there, continue with the normal package/deploy/verify steps so production picks up the patched image.

All scripts are executable; run them from the repo root (`./scripts/<name>.sh`).

> **Important:** make sure the host-level nginx service is disabled so Docker’s nginx can bind to ports 80/443. Run this once on the server:
> ```bash
> sudo systemctl disable --now nginx
> sudo systemctl mask nginx
> ```
> If the commands report “unit not found,” there is no host nginx installed and you can ignore the warning.

## 3. Daily workflow
1. **Update `main` and create a working branch**
   ```bash
   git checkout main
   git pull origin main
   ./scripts/git-feature.sh   # prompts for a feature/<name> branch and checks it out
   ```

   The feature script prints status, fetches `main`, creates or reuses `feature/<name>`, and keeps you off `main`. When you’ve finished testing/deploying a change set, publish it with:
   ```bash
   ./scripts/git-publish.sh   # stages, commits, pushes, optional gh pr create
   ```
   If you haven’t run `./scripts/verify-production.sh` yet, the publish helper can run it for you before continuing.

2. **Local rebuild & dev check**  
   Run `./scripts/local-rebuild.sh`. It ensures a clean Docker state, rebuilds the images, restarts nginx, removes the default config if it reappears, and shows container status. When it finishes:
   * From the VPS itself run `curl http://localhost` or `curl -I http://localhost` to confirm nginx serves the SPA.
   * From your laptop, add `159.198.41.95 dev.heartbeat.local` to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts`) so the hostname resolves to the VPS. The nginx stack presents the dev-only certificate stored in `heartbeat/cert.pem` / `heartbeat/key.pem`, so export that cert and trust it locally before browsing:
     ```bash
     # copy the cert down
     scp gregh@server1:/home/gregh/projects/hosting/heartbeat/cert.pem ~/Downloads/dev-heartbeat.crt

     # macOS example
     sudo security add-trusted-cert -d -r trustRoot \
         -k /Library/Keychains/System.keychain ~/Downloads/dev-heartbeat.crt

     # Linux example
     sudo cp ~/Downloads/dev-heartbeat.crt /usr/local/share/ca-certificates/
     sudo update-ca-certificates
     ```
     (On Windows, right-click the `.crt`, choose **Install Certificate**, and place it in “Trusted Root Certification Authorities”.) Once the cert is trusted, browsers stop blocking Service Workers and you can use `https://dev.heartbeat.local:3230/login` without TLS warnings.

3. **Use the workflow menu (optional shortcut)**  
   Instead of typing every script, run `./scripts/workflow-menu.sh`. It lists the common actions (local rebuild, clean package, deploy local/remote, verify production, certbot, git publish). Pick a number and follow the prompts; press `q` to exit. You can still run the individual commands below when you need finer control.

4. **Package deployable files**  
   Choose how aggressive the rsync should be:
   ```bash
   ./scripts/package-build.sh full    # mirror exactly (deletes files removed locally)
   ./scripts/package-build.sh update  # keep existing remote files, copy only new/changed ones
   ```
   Both modes exclude `.git/` and `strapi/`, so only the hosting bundle is staged in `hosting-build/`.
   * The scripts refuse to run if `heartbeat/frontend/index.html` is missing. That guard keeps rsync from deleting the SPA when you deploy. If you ever need to restore the bundle (for example from your HQ copy), sync it back first:
     ```bash
     # from HQ -> server1
     rsync -av --progress /home/gregh/projects/hosting/heartbeat/frontend/ \
         gregh@server1:/home/gregh/projects/hosting/heartbeat/frontend/
     ```
   * To guarantee a clean rebuild (useful after a bad sync), run `./scripts/clean-package-rebuild.sh`, which deletes the old `hosting-build/` folder and then runs the `full` mode automatically.

5. **Deploy to the VPS**  
   ```bash
   ./scripts/deploy-remote.sh
   ```
   - When you’re logged directly into the production server, run `REMOTE_HOST=local ./scripts/deploy-remote.sh` so the script rsyncs/rebuilds locally without trying to SSH back into itself.
   - Otherwise set `REMOTE_HOST=user@server` (and optionally `REMOTE_DIR`) to deploy over SSH. The script rsyncs `hosting-build/`, runs `docker compose down --volumes --remove-orphans`, rebuilds, and brings the stack up again.
   - The `heartbeat-frontend` container must remain `Up` after the deploy; if `docker compose ps` shows it restarting or `nginx` logs emit `connect() failed (113: No route to host)`, check `docker compose logs heartbeat-frontend` for the root cause before continuing.

6. **Manage certificates when DNS or certs change**  
   Only when you need new/renewed certs, run:
   ```bash
   CERTBOT_EMAIL=your@email ./scripts/run-certbot.sh
   ```
   Override `CERTBOT_DOMAINS` (space-separated) if you need additional hostnames. The script stops nginx, calls `sudo certbot --nginx`, then restarts nginx so the new certs are loaded.
   * To check current certificate status at any time:
     ```bash
     sudo ls /etc/letsencrypt/live
     sudo certbot certificates
     ```
     Example output:
     ```
    * Docker automatically mounts `/etc/letsencrypt/live/heartbeatacic.org/{fullchain,privkey}.pem` into the nginx container (see `docker-compose.yml`), so once the cert exists you only need to restart the stack for nginx to serve the updated certificate.
     Certificate Name: heartbeatacic.org
       Domains: heartbeatacic.org www.heartbeatacic.org
       Expiry Date: 2026-03-06 04:57:24+00:00 (VALID: 89 days)
       Certificate Path: /etc/letsencrypt/live/heartbeatacic.org/fullchain.pem
       Private Key Path: /etc/letsencrypt/live/heartbeatacic.org/privkey.pem
     ```
     Use this to decide whether you need to run the certbot script or if the existing certs are still valid.

7. **Verify production**  
   ```bash
   ./scripts/verify-production.sh
   ```
   Confirm the curl output shows valid HTTP responses/certs. Use `curl -I https://heartbeatacic.org` (public domain) from any machine once DNS and certificates are in place, and continue using `https://dev.heartbeat.local:3230` (hosts entry) when you want to spot-check the remote Docker stack before promoting changes.

## 4. Manual reference (commands executed by the scripts)
```bash
# 1. Local rebuild & dev check
./scripts/local-rebuild.sh

# 2. Package bundle (choose only one)
./scripts/package-build.sh full
./scripts/package-build.sh update

# 3. Copy to the VPS and rebuild there
./scripts/deploy-remote.sh

# 4. Obtain/renew certificates once DNS resolves
CERTBOT_EMAIL=you@example ./scripts/run-certbot.sh

# 5. Verify https://heartbeatacic.org and https://www.heartbeatacic.org
./scripts/verify-production.sh
```

Repeating these steps keeps the local Docker stack, the packaged artifacts, and the live VPS in sync. Use the scripts whenever possible so nothing is skipped or rearranged out of order. If you need to tweak behavior (different remote host, additional cert domains, etc.), set the documented environment variables before running the scripts.

## 5. Printable cheat sheet (pin near your terminal)
```
1. git checkout main && git pull
2. ./scripts/git-feature.sh
3. ./scripts/local-rebuild.sh
4. ./scripts/package-build.sh full   # or use workflow menu option 3/4
5. REMOTE_HOST=local ./scripts/deploy-remote.sh
6. ./scripts/verify-production.sh
7. ./scripts/git-publish.sh          # or workflow menu option 9
```
*Optional helpers:*  
`./scripts/workflow-menu.sh` – interactive picker for every step above  
`./scripts/clean-package-rebuild.sh` – deletes + rebuilds `hosting-build/`  
`./scripts/run-certbot.sh` – only when public certs change
