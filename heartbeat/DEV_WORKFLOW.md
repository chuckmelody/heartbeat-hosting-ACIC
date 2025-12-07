# Development Workflow Commands

This guide contains all the essential Docker Compose commands for building, running, and debugging the Heartbeat development environment.

All commands should be run from the project's root directory (`/home/gregh/projects/heartbeat/`).

---

## 1. Build and Start the Environment

This is the main command you will use to start your work. It builds fresh images for your services and starts them in the background.

```bash
docker-compose --profile dev up --build -d
```

### Command Breakdown:
*   `docker-compose`: The command-line tool for managing multi-container Docker applications.
*   `--profile dev`: This is crucial. It tells Docker Compose to only activate the services marked with the `dev` profile in your `docker-compose.yml` file (which are `spa-frontend-dev` and `nginx`).
*   `up`: The command to create and start the containers.
*   `--build`: Rebuilds the Docker images before starting. You should use this whenever you change code in your application or modify a `Dockerfile`.
*   `-d`: Runs the containers in "detached" mode, meaning they run in the background and don't take over your terminal.

---

## 2. Check Service Status

To see which containers are currently running and which ports they are using.

```bash
docker-compose ps
```

---

## 3. View Logs

Viewing logs is essential for debugging. The `-f` flag "follows" the log output, so you can see new messages in real-time.

### View Logs for All Services
This streams the logs from all running services in your `dev` profile.

```bash
docker-compose logs -f
```

### View Logs for a Specific Service
To focus on a single service, specify its name. This is very useful for isolating issues.

```bash
# View logs for the frontend development server
docker-compose logs -f spa_frontend_dev

# View logs for the Nginx proxy
docker-compose logs -f heartbeat-nginx
```

---

## 4. Stop the Environment

When you are finished working, use this command to stop and remove the running containers, network, and volumes associated with the project.

```bash
docker-compose down -v
```