---
summary: "Linux support + companion app status"
read_when:
  - Looking for Linux companion app status
  - Planning platform coverage or contributions
---
# Linux App

The Gateway is fully supported on Linux. **Node is the recommended runtime**.
Bun is not recommended for the Gateway (WhatsApp/Telegram bugs).

Native Linux companion apps are planned. Contributions are welcome if you want to help build one.

## Beginner quick path (VPS)

1) Install Node 22+  
2) `npm i -g jar4@latest`  
3) `jar4 onboard --install-daemon`  
4) From your laptop: `ssh -N -L 18789:127.0.0.1:18789 <user>@<host>`  
5) Open `http://127.0.0.1:18789/` and paste your token

Step-by-step VPS guide: [exe.dev](/platforms/exe-dev)

## Install
- [Getting Started](/start/getting-started)
- [Install & updates](/install/updating)
- Optional flows: [Bun (experimental)](/install/bun), [Nix](/install/nix), [Docker](/install/docker)

## Gateway
- [Gateway runbook](/gateway)
- [Configuration](/gateway/configuration)

## Gateway service install (CLI)

Use one of these:

```
jar4 onboard --install-daemon
```

Or:

```
jar4 gateway install
```

Or:

```
jar4 configure
```

Select **Gateway service** when prompted.

Repair/migrate:

```
jar4 doctor
```

## System control (systemd user unit)
Jar4 installs a systemd **user** service by default. Use a **system**
service for shared or always-on servers. The full unit example and guidance
live in the [Gateway runbook](/gateway).

Minimal setup:

Create `~/.config/systemd/user/jar4-gateway[-<profile>].service`:

```
[Unit]
Description=Jar4 Gateway (profile: <profile>, v<version>)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/jar4 gateway --port 18789
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
```

Enable it:

```
systemctl --user enable --now jar4-gateway[-<profile>].service
```
