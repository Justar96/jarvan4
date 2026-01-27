---
summary: "CLI reference for `jar4 plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
---

# `jar4 plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:
- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
jar4 plugins list
jar4 plugins info <id>
jar4 plugins enable <id>
jar4 plugins disable <id>
jar4 plugins doctor
jar4 plugins update <id>
jar4 plugins update --all
```

Bundled plugins ship with Jar4 but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `jar4.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
jar4 plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
jar4 plugins install -l ./my-plugin
```

### Update

```bash
jar4 plugins update <id>
jar4 plugins update --all
jar4 plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
