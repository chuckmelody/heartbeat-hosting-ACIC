# Docker: Total Clean-Up Commands

This guide provides a set of commands to completely clean your Docker environment. These commands are destructive and will permanently remove containers, images, volumes, and networks.

**Use these commands with caution, as the data loss is irreversible.**

---

## 1. Stop and Remove All Containers

This is the first step. You need to stop all running containers before you can remove them.

### Stop All Running Containers
```bash
docker stop $(docker ps -aq)
```
*   `docker ps -aq` lists the IDs of all containers (running and stopped).
*   `docker stop` takes these IDs and stops the containers.

### Remove All Containers
Once stopped, you can remove them.
```bash
docker rm $(docker ps -aq)
```
*   `docker rm` removes the containers specified by the IDs.

---

## 2. The "Scorched Earth" Command (Recommended)

Docker provides a single, powerful command to prune the entire system. This is the most effective way to achieve a "total clean-up" and removes all stopped containers, unused networks, dangling images, and the build cache.

**This command will ask for confirmation before proceeding.**

```bash
docker system prune -a --volumes
```

### Understanding the Flags

*   **`system prune`**: The base command to clean up unused Docker objects.
*   **`-a` (or `--all`)**: This flag extends the prune to remove **all unused images**, not just dangling ones. An unused image is one that is not associated with any existing container.
*   **`--volumes`**: This is the most destructive part. It tells Docker to also remove **all unused local volumes**. A volume is considered unused if it is not referenced by any container. **This will delete all data stored in your volumes.**

After running this single command, your Docker environment will be reset to a clean, default state, with no running or stopped containers, no custom images, and no persistent volume data.

---

## 3. Specific Clean-Up Commands

If you don't want to wipe the entire system, you can use more targeted commands.

### Managing Networks

The `docker system prune` command above will remove unused networks, but if you want to manage them specifically, use these commands.

#### List All Networks
```bash
docker network ls
```

#### Remove All Unused Networks
This will remove any networks not currently used by at least one container.
```bash
docker network prune
```

#### Remove a Specific Network
You can remove one or more networks by their name or ID.
```bash
docker network rm <network_name_or_id>


####

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

####
```