#!/bin/bash
#
# Firewall Configuration Script for HeartbeatACIC
# This script configures the Uncomplicated Firewall (ufw) to allow essential
# traffic for the web server and SSH access. It is idempotent, meaning it
# can be run multiple times without causing issues.
#
# Run this script once on the server before deploying the application.
#
set -e  # Exit immediately if a command exits with a non-zero status.
set -x  # Print each command to the terminal before it is executed (for debugging).

echo "--- Starting Firewall Configuration ---"

echo
echo "[DEBUG] Allowing SSH traffic on port 22 so you don't get locked out."
sudo ufw allow ssh

echo
echo "[DEBUG] Allowing HTTP traffic on port 80. This is REQUIRED for Let's Encrypt validation."
sudo ufw allow http

echo
echo "[DEBUG] Allowing HTTPS traffic on port 443 for the live website."
sudo ufw allow https

echo
echo "[DEBUG] Enabling the firewall with the new rules."
sudo ufw --force enable

echo
echo "[DEBUG] Firewall configuration complete. Displaying final status:"
sudo ufw status verbose