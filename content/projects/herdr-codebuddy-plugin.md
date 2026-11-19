---
type: project
title: herdr-codebuddy-plugin
repositoryUrl: https://github.com/ansidev/herdr-codebuddy-plugin
license: MIT
licenseUrl: https://github.com/ansidev/herdr-codebuddy-plugin/blob/main/LICENSE
techs:
  - Node.js
  - CodeBuddy
  - Herdr
developmentStatus: active
date: 2026-01-15T10:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

A Herdr plugin that manages CodeBuddy hooks and translates supported lifecycle events into Herdr pane state and session reports. It enables Herdr users to see whether a CodeBuddy agent is working, idle, or waiting for permission, and to restore CodeBuddy sessions when the necessary session information is available.

**Current Status**: Beta. Hook payloads and subagent behavior may change across CodeBuddy releases. Failed reporting intentionally degrades to continued CodeBuddy operation without interruption.

<!-- more -->

## Installation prerequisites

| Component | Minimum Version |
|-----------|----------------|
| Node.js | 18+ |
| CodeBuddy Code | v1.16.0+ |
| Herdr | 0.9.2+ |

## Plugin activation

### 1. Install the integration

```bash
# From the herdr-codebuddy-plugin directory
node scripts/manage_hooks.js install
```

This will:

- Create `settings.json` in your CodeBuddy config directory (or `~/.codebuddy/settings.json` if `CODEBUDDY_CONFIG_DIR` is not set)
- Register six owned hooks for CodeBuddy lifecycle events: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, and `Notification` (with `permission_prompt` subtype)
- Preserve all unrelated CodeBuddy settings and hooks

### 2. Verify installation

```bash
node scripts/manage_hooks.js status
```

Expected output:

```
Status: installed
Details: 6 of 6 integration hooks are installed
Installed: 6/6
Owned hooks:
  - SessionStart: owned
  - UserPromptSubmit: owned
  - PreToolUse: owned
  - PostToolUse: owned
  - Stop: owned
  - Notification: owned
```

### 3. Remove the integration (if needed)

```bash
node scripts/manage_hooks.js remove
```

This will:

- Delete only the integration-owned hooks
- Preserve all unrelated CodeBuddy settings and hooks
- Clean up empty groups if applicable

## Plugin workflow

### Startup behavior

The plugin manifest (`herdr-plugin.toml`) has `enabled = false` by default. This means:

- A linked or enabled plugin does **not** automatically run startup immediately
- Users can explicitly invoke the install action: `node scripts/manage_hooks.js install`
- To enable auto-startup, set `enabled = true` in `herdr-plugin.toml`

### Supported platforms

- **darwin** (macOS) — Full support
- **linux** — Full support
- **windows** — Pending Git Bash shell quoting verification

## Observed limitations

- Full subagent and interruption tracking are **not promised** without verified event support from CodeBuddy
- The event schema is beta; payload and subagent behavior may change across CodeBuddy releases
- Permission prompts (`Notification` with `permission_prompt`) are reflected in Herdr pane state as `blocked`, but prompt contents are never copied into Herdr calls
- Session restoration relies on CodeBuddy supplying a valid `session_id` in supported events
- Windows Git Bash quoting for paths containing spaces or apostrophes requires explicit handling

## Development

### Project structure

```
herdr-codebuddy-plugin/
├── herdr-plugin.toml        # Plugin manifest
├── package.json             # Node.js project setup
├── scripts/
│   └── manage_hooks.js      # Hook manager (install/remove/status)
├── hooks/
│   └── herdr_agent_state.js # Hook reporter (event→state mapping)
├── tests/
│   ├── manage_hooks.test.js   # Manager tests
│   └── herdr_agent_state.test.js # Reporter tests
└── README.md                # This file
```

### Running tests

```bash
# From the project root
npm test
# or
node --test tests/manage_hooks.test.js
node --test tests/herdr_agent_state.test.js
```

## License

MIT. See the accompanying [LICENSE](https://github.com/ansidev/herdr-codebuddy-plugin/blob/main/LICENSE) file for details.