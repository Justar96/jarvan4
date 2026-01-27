---
summary: "CLI reference for `jar4 directory` (self, peers, groups)"
read_when:
  - You want to look up contacts/groups/self ids for a channel
  - You are developing a channel directory adapter
---

# `jar4 directory`

Directory lookups for channels that support it (contacts/peers, groups, and “me”).

## Common flags
- `--channel <name>`: channel id/alias (required when multiple channels are configured; auto when only one is configured)
- `--account <id>`: account id (default: channel default)
- `--json`: output JSON

## Notes
- `directory` is meant to help you find IDs you can paste into other commands (especially `jar4 message send --target ...`).
- For many channels, results are config-backed (allowlists / configured groups) rather than a live provider directory.
- Default output is `id` (and sometimes `name`) separated by a tab; use `--json` for scripting.

## Using results with `message send`

```bash
jar4 directory peers list --channel slack --query "U0"
jar4 message send --channel slack --target user:U012ABCDEF --message "hello"
```

## ID formats (by channel)

- WhatsApp: `+15551234567` (DM), `1234567890-1234567890@g.us` (group)
- Telegram: `@username` or numeric chat id; groups are numeric ids
- Slack: `user:U…` and `channel:C…`
- Discord: `user:<id>` and `channel:<id>`
- Matrix (plugin): `user:@user:server`, `room:!roomId:server`, or `#alias:server`
- Microsoft Teams (plugin): `user:<id>` and `conversation:<id>`
- Zalo (plugin): user id (Bot API)
- Zalo Personal / `zalouser` (plugin): thread id (DM/group) from `zca` (`me`, `friend list`, `group list`)

## Self (“me”)

```bash
jar4 directory self --channel zalouser
```

## Peers (contacts/users)

```bash
jar4 directory peers list --channel zalouser
jar4 directory peers list --channel zalouser --query "name"
jar4 directory peers list --channel zalouser --limit 50
```

## Groups

```bash
jar4 directory groups list --channel zalouser
jar4 directory groups list --channel zalouser --query "work"
jar4 directory groups members --channel zalouser --group-id <id>
```
