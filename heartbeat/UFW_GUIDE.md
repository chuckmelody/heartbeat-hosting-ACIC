# UFW (Uncomplicated Firewall) Guide for Ubuntu

This guide provides a clear overview of how to use `ufw`, the default firewall management tool on Ubuntu. It explains the most common commands, best practices, and how to interpret the output, especially from `sudo ufw status verbose`.

---

## 1. Checking Firewall Status

You can check the status of your firewall at any time.

### Basic Status

This command tells you if the firewall is active or inactive.

```bash
sudo ufw status
```

### Verbose Status (Recommended)

This command provides a detailed breakdown of your firewall's configuration. It is the most useful status command.

```bash
sudo ufw status verbose
```

**Example Output:**

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), deny (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

**Understanding the Verbose Output:**

*   **`Status: active`**: The firewall is running and enforcing the rules listed. If it says `inactive`, no rules are being applied.
*   **`Logging: on (low)`**: This shows that `ufw` is logging firewall activity. The level (e.g., `low`, `medium`, `high`) determines how much detail is logged. This is useful for security audits and troubleshooting.
*   **`Default: deny (incoming), allow (outgoing), deny (routed)`**: This is the core security policy.
    *   `deny (incoming)`: **(Good)** By default, all incoming connections are blocked unless a specific `ALLOW` rule exists for them. This is the most secure posture.
    *   `allow (outgoing)`: **(Good)** By default, all outgoing connections from your server are permitted. This allows your applications to connect to external services (e.g., send email, fetch API data).
    *   `deny (routed)`: This relates to packet forwarding and is typically denied by default.
*   **`New profiles: skip`**: This relates to how `ufw` handles application profiles and can generally be ignored.
*   **Rules Table**: This is the list of specific rules you have configured.
    *   `To`: The port and protocol (e.g., `22/tcp`).
    *   `Action`: What to do with the traffic (`ALLOW IN`, `DENY IN`, etc.).
    *   `From`: Where the traffic is allowed from (`Anywhere` means any IP address).

---

## 2. Basic Firewall Configuration

### Setting Default Policies (Best Practice)

This is the most important first step. You should always deny incoming traffic by default and only open the specific ports you need.

```bash
# Block all incoming connections by default
sudo ufw default deny incoming

# Allow all outgoing connections by default
sudo ufw default allow outgoing
```

### Adding Rules

For your project, you need to allow SSH and web traffic.

```bash
# Allow SSH (port 22) so you don't get locked out
sudo ufw allow ssh

# Allow HTTP traffic (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS traffic (port 443)
sudo ufw allow 443/tcp
```

### Deleting Rules

You can delete a rule by specifying it exactly.

```bash
sudo ufw delete allow 80/tcp
```

### Enabling and Disabling the Firewall

After setting your rules (especially the `allow ssh` rule), you can enable the firewall.

```bash
sudo ufw enable
```

To disable the firewall completely:

```bash
sudo ufw disable
```