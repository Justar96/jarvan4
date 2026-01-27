---
summary: "Uninstall Jar4 completely (CLI, service, state, workspace)"
read_when:
  - You want to remove Jar4 from a machine
  - The gateway service is still running after uninstall
---

# Uninstall

Two paths:
- **Easy path** if `jar4` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
jar4 uninstall
```

Non-interactive (automation / npx):

```bash
jar4 uninstall --all --yes --non-interactive
npx -y jar4 uninstall --all --yes --non-interactive
```

Manual steps (same result):

1) Stop the gateway service:

```bash
jar4 gateway stop
```

2) Uninstall the gateway service (launchd/systemd/schtasks):

```bash
jar4 gateway uninstall
```

3) Delete state + config:

```bash
rm -rf "${JAR4_STATE_DIR:-$HOME/.jar4}"
```

If you set `JAR4_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4) Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/clawd
```

5) Remove the CLI install (pick the one you used):

```bash
npm rm -g jar4
pnpm remove -g jar4
bun remove -g jar4
```

6) If you installed the macOS app:

```bash
rm -rf /Applications/Jar4.app
```

Notes:
- If you used profiles (`--profile` / `JAR4_PROFILE`), repeat step 3 for each state dir (defaults are `~/.jar4-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `jar4` is missing.

### macOS (launchd)

Default label is `com.jar4.gateway` (or `com.jar4.<profile>`):

```bash
launchctl bootout gui/$UID/com.jar4.gateway
rm -f ~/Library/LaunchAgents/com.jar4.gateway.plist
```

If you used a profile, replace the label and plist name with `com.jar4.<profile>`.

### Linux (systemd user unit)

Default unit name is `jar4-gateway.service` (or `jar4-gateway-<profile>.service`):

```bash
systemctl --user disable --now jar4-gateway.service
rm -f ~/.config/systemd/user/jar4-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `Jar4 Gateway` (or `Jar4 Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "Jar4 Gateway"
Remove-Item -Force "$env:USERPROFILE\.jar4\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.jar4-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://molt.bot/install.sh` or `install.ps1`, the CLI was installed with `npm install -g jar4@latest`.
Remove it with `npm rm -g jar4` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `jar4 ...` / `bun run jar4 ...`):

1) Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2) Delete the repo directory.
3) Remove state + workspace as shown above.
