---
summary: "CLI reference for `jar4 devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
---

# `jar4 devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `jar4 devices list`

List pending pairing requests and paired devices.

```
jar4 devices list
jar4 devices list --json
```

### `jar4 devices approve <requestId>`

Approve a pending device pairing request.

```
jar4 devices approve <requestId>
```

### `jar4 devices reject <requestId>`

Reject a pending device pairing request.

```
jar4 devices reject <requestId>
```

### `jar4 devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
jar4 devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `jar4 devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
jar4 devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
