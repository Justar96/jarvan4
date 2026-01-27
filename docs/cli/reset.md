---
summary: "CLI reference for `jar4 reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `jar4 reset`

Reset local config/state (keeps the CLI installed).

```bash
jar4 reset
jar4 reset --dry-run
jar4 reset --scope config+creds+sessions --yes --non-interactive
```

