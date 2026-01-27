---
summary: "CLI reference for `jar4 health` (gateway health endpoint via RPC)"
read_when:
  - You want to quickly check the running Gateway’s health
---

# `jar4 health`

Fetch health from the running Gateway.

```bash
jar4 health
jar4 health --json
jar4 health --verbose
```

Notes:
- `--verbose` runs live probes and prints per-account timings when multiple accounts are configured.
- Output includes per-agent session stores when multiple agents are configured.
