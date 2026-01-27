---
summary: "CLI reference for `jar4 voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
---

# `jar4 voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:
- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
jar4 voicecall status --call-id <id>
jar4 voicecall call --to "+15555550123" --message "Hello" --mode notify
jar4 voicecall continue --call-id <id> --message "Any questions?"
jar4 voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
jar4 voicecall expose --mode serve
jar4 voicecall expose --mode funnel
jar4 voicecall unexpose
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.

