---
summary: "CLI reference for `jar4 logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
---

# `jar4 logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:
- Logging overview: [Logging](/logging)

## Examples

```bash
jar4 logs
jar4 logs --follow
jar4 logs --json
jar4 logs --limit 500
```

