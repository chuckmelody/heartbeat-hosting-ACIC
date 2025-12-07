# Deployment Plan: Heartbeat Stack on DigitalOcean

This document provides a comprehensive, step-by-step guide to deploy your full-stack application (Strapi backend, Heartbeat frontend) onto a DigitalOcean Droplet. We will use a single Nginx instance on the host server to act as a reverse proxy, manage all traffic, and handle SSL certificates via Let's Encrypt.

## 1. Final Architecture Overview

This plan will create the following architecture, which is robust, secure, and easy to manage:

```
                               +--------------------------+
                               |   Internet Users         |
                               +-------------+------------+
                                             |
                                             | (HTTPS on Port 443)
                                             |
                  +--------------------------v--------------------------+
                  |              DigitalOcean Droplet (VPS)             |
                  |                                                     |
                  |  +-----------------------------------------------+  |
                  |  |         Nginx Reverse Proxy (on host)         |  |
                  |  |   - Handles all SSL/TLS with Let's Encrypt    |  |
                  |  |   - Routes requests based on domain name      |  |
                  |  +------------------+-------------+--------------+  |
                  |                     |             |                 |
+-----------------------+  +----------------+  +----------------+  +----------------+
| heartbeacic.org       |  | api.heartbeacic.org |  | admin.heartbeacic.org |
| www.heartbeacic.org   |  |                     |  |                       |
+-----------------------+  +----------------+  +----------------+  +----------------+
           |                        |                 |
           | (proxies to localhost:3230) | (proxies to localhost:1337) |
           v                        v                 v
  +----------------+     +----------------+     +----------------+
  | Frontend App   |     | Strapi API App |     | Strapi Admin   |
  | (Docker)       |     | (Docker)       |     | (Docker)       |
  | Port: 3230     |     | Port: 1337     |     | Port: 1337     |
  +----------------+     +----------------+     +----------------+
                  |                                                     |
                  +-----------------------------------------------------+
```

## 2. Phase 1: Infrastructure Setup

### Step 1: Set Up Namecheap VPS

1.  Log in to your Namecheap account and purchase a VPS plan (e.g., Pulsar, Quasar).
2.  During the server setup process, select **Ubuntu 22.04** as the operating system.
3.  After the VPS is provisioned, Namecheap will send you a **Welcome Email**. This email contains critical information:
    *   Your Server's **IP Address**.
    *   The `root` username.
    *   The initial `root` password.
4.  Keep this information ready for the next phase.

### Step 2: Configure Namecheap DNS

1.  Log in to your Namecheap account and manage the `heartbeacic.org` domain.
2.  Go to the "Advanced DNS" tab.
3.  Under "Host Records", create four **A Records** pointing to your new VPS IP address. If these records already exist from a previous setup, ensure their "Value" is updated to the new IP.

| Type     | Host  | Value                     | TTL    |
| :------- | :---- | :------------------------ | :----- |
| A Record | `@`   | `YOUR_VPS_IP_ADDRESS`     | 30 min |
| A Record | `www` | `YOUR_VPS_IP_ADDRESS`     | 30 min |
| A Record | `api` | `YOUR_VPS_IP_ADDRESS`     | 30 min |
| A Record | `admin`| `YOUR_VPS_IP_ADDRESS`     | 30 min |

**Note:** DNS propagation can take time. Use a tool like dnschecker.org to verify.

## 3. Phase 2: Server Preparation

Connect to your new Droplet via SSH: `ssh root@YOUR_DROPLET_IP_ADDRESS`.

### Step 1: Initial Server Security (Crucial)

Unlike some providers, Namecheap VPS starts with password authentication. Securing it is your first priority.

1.  **Connect to the Server:** Use the password from your Welcome Email.
    ```bash
    ssh root@YOUR_VPS_IP_ADDRESS
    ```
2.  **Change Root Password:** You will be forced to change your root password on first login. Choose a strong, unique password.
    ```bash
    passwd
    ```
    When prompted, enter the current root password from the email, then type the new one twice. Prefer a long, high-entropy passphrase and store it safely—for example, in your password manager.

3.  **Create a New User:** Running everything as `root` is risky. Create a new user for daily tasks.
    ```bash
    adduser gregh # Or your preferred username
    usermod -aG sudo gregh # Grant sudo (administrator) privileges
    ```
4.  **Need to Reset a User’s Password Later?** Use the same `passwd` command while logged in as that user or with `sudo`. For example, to reset `gregh`’s password:
    ```bash
    sudo passwd gregh
    ```
    You’ll be prompted for a new password—enter it twice. If you don’t remember the current password, run the command while logged in as a sudo-capable account (such as `gregh`) so you can reset it without the old value.
4.  **Set up SSH Keys (Highly Recommended):** This allows you to log in without a password and is much more secure.
    *   On your **local machine**, copy your public SSH key: `cat ~/.ssh/id_rsa.pub`
    *   On the **server**, as the new user (`gregh`), create the SSH directory and add your key:
        ```bash
        su - gregh # Switch to the new user
        mkdir ~/.ssh
        chmod 700 ~/.ssh
        echo "paste-your-public-key-here" >> ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys
        exit # Return to root user
        ```
5.  **Disable Root Login & Password Authentication:** In `/etc/ssh/sshd_config`, set `PermitRootLogin no` and `PasswordAuthentication no`. Then run `systemctl restart sshd`. **Do this last, after confirming you can log in with your new user and SSH key.**

**From now on, connect to your server using `ssh gregh@YOUR_VPS_IP_ADDRESS`.**

### Step 2: System Updates & Software Installation

1.  **Update System:**
    ```bash
    apt update && apt upgrade -y
    ```
2.  **Install Core Services (Docker stack only):**
    ```bash
    # Install Docker Engine
    apt install docker.io -y
    systemctl start docker
    systemctl enable docker

    # Install Docker Compose V2
    apt install docker-compose-v2 -y
    ```
    > **Note:** We continue to use the Dockerized nginx proxy inside the compose stack (`heartbeat-nginx`), so there is no need to install nginx on the host. The host ports 80/443 are forwarded directly into the containerized proxy that already handles TLS and routes to the frontend/Strapi services.

### Step 3: Configure Firewall (UFW)

We will only allow traffic for SSH (so you can connect) and Nginx.

```bash
ufw allow 'OpenSSH'
ufw allow 'Nginx Full' # This rule allows traffic on both port 80 (HTTP) and 443 (HTTPS)
ufw enable # Press 'y' and Enter to confirm
```

If `ufw` responds “Could not find profile 'Nginx Full'”, list the built-in application profiles and choose the appropriate one:

```bash
ufw app list
```

That command prints every profile shipped with `ufw`; look for `Nginx Full` or the combination of `Nginx HTTP` and `Nginx HTTPS`. Then allow whichever profile(s) exist:

```bash
ufw allow 'Nginx HTTP'
ufw allow 'Nginx HTTPS'
```

Verify the active rules with `ufw status verbose`.

## 4. Step 4: Version Control & GitHub

Keep the codebase synchronized with your GitHub repository so you can push/pull safely when you add features.

1.  **Generate or reuse an SSH key on your workstation** (local machine):
    ```bash
    ssh-keygen -t ed25519 -C "you@heartbeat.local"
    ```
    Accept the default location (`~/.ssh/id_ed25519`) and add a passphrase if desired. Keep the private key secure—you will copy the `.pub` file to both the VPS and GitHub.

2.  **Copy the public key to the VPS** (now using `gregh` or `root`):
    ```bash
    cat ~/.ssh/id_ed25519.pub | ssh gregh@YOUR_VPS_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
    ```
    This ensures every `ssh gregh@YOUR_VPS_IP` login trusts your machine without entering a password.

3.  **Add the same public key to GitHub:**
    * From your workstation run `cat ~/.ssh/id_ed25519.pub`, copy the entire output.
    * Log in to GitHub, go to **Settings → SSH and GPG keys → New SSH key**, and paste the copied text into the key field.
    * Give it a descriptive title such as “VPS workstation key”.

4.  **Verify GitHub connectivity from the VPS:**
    ```bash
    ssh -T git@github.com
    ```
    The first time, accept the host fingerprint (`yes`) so GitHub is added to `~/.ssh/known_hosts`.  
    If you still see `Permission denied (publickey)` after accepting, it means the public key hasn’t been added to your GitHub account yet. Re-open your GitHub SSH settings, paste the contents of `~/.ssh/id_ed25519.pub`, save the key, and rerun the `ssh -T` command until you see:
    ```
    Hi <username>! You've successfully authenticated, but GitHub does not provide shell access.
    ```

5.  **Set Git identity on the VPS** (only after SSH works):
    ```bash
    git config --global user.name "chuckmelody"
    git config --global user.email "greg.henry@hotmail.co.uk"
    ```

6.  **Clone the repository** (if not already):
    ```bash
    mkdir -p /var/www
    cd /var/www
    git clone git@github.com:YOUR_ORG/heartbeat.git hb
    cd hb
    git checkout main
    git pull origin main
    ```

7.  **Standard GitHub workflow recap:**
    * `git status` to check workspace cleanliness.  
    * `git add -A` and `git commit -m "...“`
    * `git push origin feature/your-branch`
    * Create a PR via GitHub or `gh pr create`.

   The `scripts/git-feature.sh` helper (documented below) wraps these steps when you spin up a new feature branch.

2.  **Ensure a remote is configured:** From `/var/www/hb`, run:
    ```bash
    git remote add origin git@github.com:YOUR_ORG/heartbeat.git
    git fetch origin
    ```
3.  **Clone or pull the repo locally:** If `/var/www/hb` already exists, skip clone. Otherwise:
    ```bash
    git clone git@github.com:YOUR_ORG/heartbeat.git /var/www/hb
    cd /var/www/hb
    git checkout main
    git pull origin main
    ```
4.  **Standard git workflow on the VPS:**
    * `git status` to view dirty files.
    * `git add -A` to stage, `git commit -m "..."` to commit.
    * `git push origin feature/your-branch` to push new work.
    * `git pull origin main` before opening a PR to ensure you’re current.

3.  **Stay up to date before starting work:**
    ```bash
    git checkout main
    git pull origin main
    ```

4.  **Use the helper script** (`scripts/git-feature.sh`) whenever you start a new feature. It asks for a branch name, ensures the working tree is clean, pulls the latest code, creates the feature branch, runs your smoke-test placeholder, commits staged changes, and pushes the new branch to GitHub with verbose messaging so you always see what happened.

5.  **When you finish a feature:**
    * Review `git status` to confirm tracked files.
    * Run `git diff` if you need to inspect changes.
    * Merge the feature branch via PR on GitHub, then `git checkout main && git pull` on the VPS again.

6.  **If you ever need to reset a password:** `sudo passwd gregh` (as noted earlier) or use the helper script before pushing commits so you don't commit secrets.

## 4. Phase 3: Application Deployment

### Step 1: Clone Code and Prepare Files

1.  **Create Project Directory and Clone Repositories:**
    ```bash
    # Create a parent directory
    mkdir -p /var/www
    cd /var/www

    # Clone your two projects
    git clone <your-strapi-backend-repo-url> hb
    git clone <your-frontend-repo-url> heartbeat
    ```
2.  **Copy everything except Strapi into `/home/gregh/projects/hosting`:**
    ```bash
    mkdir -p /home/gregh/projects/hosting
    rsync -av --delete \
      --exclude='strapi/' \
      --exclude='.git/' \
      /home/gregh/projects/hb/ /home/gregh/projects/hosting/
    ```
    This syncs your frontend, docs, scripts, etc. into the hosting directory without touching the Strapi source tree or Git history.
2.  **Place `docker-compose.yml`:** Your `docker-compose.yml` file should be located at `/var/www/hb/docker-compose.yml`.
3.  **Create Strapi Environment File:** Create the `.env` file that your `docker-compose.yml` expects.
    ```bash
    nano /var/www/hb/.env
    ```
    Paste your environment variables into this file. **Crucially, ensure the `DATABASE_HOST` points to your Docker service name.**
    ```ini
    # /var/www/hb/.env

    # Database Credentials
    DATABASE_CLIENT=mysql
    DATABASE_HOST=db # Must match the service name in docker-compose.yml
    DATABASE_PORT=3306
    DATABASE_NAME=strapi_db_name
    DATABASE_USERNAME=strapi_user
    DATABASE_PASSWORD=your_secure_password
    MYSQL_USER=strapi_user
    MYSQL_PASSWORD=your_secure_password
    MYSQL_DATABASE=strapi_db_name
    MYSQL_ROOT_PASSWORD=a_very_secure_root_password

    # Strapi Application Keys (Generate these with `openssl rand -base64 32`)
    APP_KEYS=your_generated_app_key,another_generated_key
    API_TOKEN_SALT=your_generated_salt
    ADMIN_JWT_SECRET=your_generated_admin_secret
    JWT_SECRET=your_generated_jwt_secret
    ```

### Step 2: Build and Run Docker Containers

From your Strapi project directory, launch all services.

```bash
cd /var/www/hb
docker compose up --build -d
```

*   `--build`: This tells Docker to build the images from your `Dockerfile`s before starting.
*   `-d`: This runs the containers in detached mode (in the background).

Verify that all containers are running and healthy:

```bash
docker ps
```

You should see `heartbeat_frontend_service`, `strapi`, and `mysql` containers running.

## 5. Phase 4: Nginx Reverse Proxy & SSL

### Step 1: Install Certbot

Certbot is the tool from Let's Encrypt that automates SSL certificate issuance and renewal.

```bash
apt install certbot python3-certbot-nginx -y
```

### Step 2: Create Nginx Configuration

We will create a single Nginx server block configuration file to manage all your subdomains. This is the master control panel for your web traffic.

1.  Create the configuration file:
    ```bash
    nano /etc/nginx/sites-available/heartbeat
    ```
2.  Paste the following configuration. Note the `proxy_pass` directives point to the correct ports (`3230` for frontend, `1337` for backend) that your Docker containers expose to the host.

    ```nginx
    # /etc/nginx/sites-available/heartbeat

    # HTTP Server Block
    # This block catches all insecure traffic on port 80.
    # Its only jobs are to handle the Let's Encrypt challenge and redirect to HTTPS.
    server {
        listen 80;
        listen [::]:80;

        # Listen on all your domains
        server_name heartbeacic.org www.heartbeacic.org api.heartbeacic.org admin.heartbeacic.org;

        # Allow Let's Encrypt to validate your domain
        location ~ /.well-known/acme-challenge {
          allow all;
          root /var/www/html;
        }

        # For all other traffic, issue a permanent redirect to the HTTPS version
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS Server Block: Frontend Application
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name heartbeacic.org www.heartbeacic.org;

        # SSL certificate paths will be added here automatically by Certbot
        # ssl_certificate /etc/letsencrypt/live/heartbeacic.org/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/heartbeacic.org/privkey.pem;

        location / {
            # Proxy traffic to the frontend container's exposed port
            proxy_pass http://localhost:3230;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # HTTPS Server Block: Strapi API & Admin Panel
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        # We can handle both subdomains in one block since they point to the same service
        server_name api.heartbeacic.org admin.heartbeacic.org;

        # SSL certificate paths will be added here by Certbot

        location / {
            # Proxy traffic to the Strapi container's exposed port
            proxy_pass http://localhost:1337;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

3.  **Enable the new configuration:**
    ```bash
    # Create a symbolic link to enable the site
    ln -s /etc/nginx/sites-available/heartbeat /etc/nginx/sites-enabled/

    # Test the Nginx configuration for syntax errors
    nginx -t

    # If the test is successful, reload Nginx to apply the changes
    systemctl reload nginx
    ```

### Step 3: Obtain SSL Certificates with Certbot

Run Certbot, telling it to configure Nginx and specifying all the domains you want to secure.

```bash
certbot --nginx -d heartbeacic.org -d www.heartbeacic.org -d api.heartbeacic.org -d admin.heartbeacic.org
```

*   Certbot will detect your domains from the Nginx file.
*   It will ask for an email address for renewal notices.
*   Agree to the terms of service.
*   It will perform the **HTTP-01 challenge** to verify you own the domains.
*   When finished, Certbot will have automatically edited your `/etc/nginx/sites-available/heartbeat` file to include the SSL certificate paths and will reload Nginx.

## 6. Final Verification

Your deployment is complete! You should now be able to access your services securely via HTTPS:

*   **Frontend:** `https://heartbeacic.org` (and `www.heartbeacic.org`)
*   **API:** `https://api.heartbeacic.org`
*   **Admin Panel:** `https://admin.heartbeacic.org`

All HTTP traffic will be automatically redirected to HTTPS. Certbot also sets up an automatic renewal timer, ensuring your certificates stay valid without manual intervention. You can test the renewal process with `certbot renew --dry-run`.
