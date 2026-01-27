---
name: boot-md
description: "Run BOOT.md on gateway startup"
homepage: https://docs.molt.bot/hooks#boot-md
metadata:
  {
    "jar4":
      {
        "emoji": "🚀",
        "events": ["gateway:startup"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with Jar4" }],
      },
  }
---

# Boot Checklist Hook

Runs `BOOT.md` every time the gateway starts, if the file exists in the workspace.
