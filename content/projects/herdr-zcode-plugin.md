---
type: project
title: herdr-zcode-plugin
repositoryUrl: https://github.com/ansidev/herdr-zcode
license: MIT
licenseUrl: https://github.com/ansidev/herdr-zcode/blob/main/LICENSE
techs:
  - Node.js
  - ZCode (zcode-app-cli)
  - Herdr
developmentStatus: active
date: 2026-10-11T20:25:14+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

A [Herdr](https://herdr.dev) plugin that adds [ZCode](https://github.com/kingsword09/zcode-cli) (`zcode` CLI, a.k.a. `zcode-app-cli`) agent support: panes running `zcode` show up in the sidebar as agents with live `working` / `blocked` / `idle` state, and sessions can be reattached after a Herdr restart.

<!-- more -->

## Story

Herdr cannot recognize zcode by itself — it is not in Herdr's built-in agent list. Instead, this plugin uses Herdr's official self-reporting API ([add-herdr-support](https://herdr.dev/docs/add-herdr-support/)): it registers lifecycle hooks in zcode's settings file (`~/.zcode/cli/config.json`) that report pane state to Herdr as zcode runs. Outside Herdr panes the hooks are no-ops.

## Requirements

| Requirement | Version | Why |
|-------------|---------|-----|
| [Herdr](https://herdr.dev) | **0.9.2+** | Session reattach (`--resume` argv) needs 0.9.2+; older versions ignore it |
| [zcode-app-cli](https://github.com/kingsword09/zcode-cli) | latest | The `zcode` CLI this plugin integrates with; `zcode` must be on PATH |
| [Node.js](https://nodejs.org) | **22.19+** | Same runtime zcode-app-cli already requires — the plugin scripts are dependency-free Node |

Works on macOS, Linux and Windows.

## Install

```bash
herdr plugin install ansidev/herdr-zcode
```

The repo is tagged `herdr-plugin`, so it also appears in Herdr's plugin marketplace index.

Local development:

```bash
herdr plugin link /path/to/herdr-zcode
```

## What it does

- **On startup** (and via the *Install ZCode integration hooks* action): keeps a copy of the reporter script in the plugin's config dir and registers it on all zcode hook events (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostToolUseFailure`, `Stop`) in `~/.zcode/cli/config.json`. Idempotent — safe to run repeatedly, replaces older copies of the same integration.
- **State mapping**: prompt submit / tool start / tool end → `working`; permission request → `blocked`; turn stop / session start → `idle`.
- **Session restore**: `SessionStart` reports `zcode --resume <session-id>` so Herdr can reattach to the right session (requires Herdr 0.9.2+).
- **Remove ZCode integration hooks** action unregisters everything.

## Verify

```bash
herdr plugin action invoke herdr-zcode.status
```

Then start `zcode` in a Herdr pane and submit a prompt — the pane appears as a `zcode` agent in the sidebar. State only updates after zcode sessions restart (hooks load at process startup).

## Notes

- The self-report source id is `zcode-herdr` (Herdr reserves the `herdr:` prefix for its built-in integrations).
- Detection manifests are intentionally not shipped: Herdr only loads manifests for agent ids it already knows, so self-reporting is the supported path.
- "ZCode" here means the community terminal client [kingsword09/zcode-cli](https://github.com/kingsword09/zcode-cli) (`npm install -g zcode-app-cli`). Compatibility with other zcode distributions depends on them sharing the same hook events (`hooks.events.*` in `~/.zcode/cli/config.json`) and settings path.
- Plugins run unsandboxed with full CLI access. Review `scripts/manage_hooks.js` and `hooks/herdr_agent_state.js` — they only touch the zcode settings file and call `herdr pane report-agent*`.

## Credits

Fork of [ichadhr/herdr-zcode](https://github.com/ichadhr/herdr-zcode) by [ichadhr](https://github.com/ichadhr), which designed and built the whole zcode → herdr self-reporting integration. Maintained here by [Le Minh Tri (ansidev)](https://github.com/ansidev). Both projects are MIT licensed; see [LICENSE](https://github.com/ansidev/herdr-zcode/blob/main/LICENSE).