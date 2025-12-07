#!/bin/bash
# This script renews the Let's Encrypt certificates using the standalone method.
# It must stop the main web server to free up port 80 for the renewal challenge.

# Navigate to the project directory
cd /home/gregh/projects/heartbeat || exit 1

# Stop the Nginx container to free up port 80
echo "Stopping Nginx..."
docker compose stop nginx

# Run the renewal command using the standalone authenticator
docker compose run --rm --service-ports certbot renew

# Restart all services
echo "Restarting all services..."
docker compose up -d
