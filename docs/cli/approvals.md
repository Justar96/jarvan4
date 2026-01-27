---
summary: "CLI reference for `jar4 approvals` (exec approvals for gateway or node hosts)"
read_when:
  - You want to edit exec approvals from the CLI
  - You need to manage allowlists on gateway or node hosts
---

# `jar4 approvals`

Manage exec approvals for the **local host**, **gateway host**, or a **node host**.
By default, commands target the local approvals file on disk. Use `--gateway` to target the gateway, or `--node` to target a specific node.

Related:
- Exec approvals: [Exec approvals](/tools/exec-approvals)
- Nodes: [Nodes](/nodes)

## Common commands

```bash
jar4 approvals get
jar4 approvals get --node <id|name|ip>
jar4 approvals get --gateway
```

## Replace approvals from a file

```bash
jar4 approvals set --file ./exec-approvals.json
jar4 approvals set --node <id|name|ip> --file ./exec-approvals.json
jar4 approvals set --gateway --file ./exec-approvals.json
```

## Allowlist helpers

```bash
jar4 approvals allowlist add "~/Projects/**/bin/rg"
jar4 approvals allowlist add --agent main --node <id|name|ip> "/usr/bin/uptime"
jar4 approvals allowlist add --agent "*" "/usr/bin/uname"

jar4 approvals allowlist remove "~/Projects/**/bin/rg"
```

## Notes

- `--node` uses the same resolver as `jar4 nodes` (id, name, ip, or id prefix).
- `--agent` defaults to `"*"`, which applies to all agents.
- The node host must advertise `system.execApprovals.get/set` (macOS app or headless node host).
- Approvals files are stored per host at `~/.jar4/exec-approvals.json`.
