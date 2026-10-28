---
type: project
title: pi-permission-suite
repositoryUrl: https://github.com/ansidev/pi-permission-suite
license: MIT
licenseUrl: https://github.com/ansidev/pi-permission-suite/blob/main/LICENSE
techs:
  - TypeScript
  - Tree-sitter
developmentStatus: active
date: 2026-08-31T18:20:24+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

Four approval modes and command-level security restrictions for the Pi coding agent.

<!-- more -->

## Story

I use the [Pi coding agent](https://github.com/earendil-works/pi) a lot, and I want to control what the agent is allowed to do: sometimes full permissions, sometimes read-only planning, and always a hard block for dangerous commands.

`pi-permission-suite` is an enhanced fork of [`@gotgenes/pi-permission-system`](https://www.npmjs.com/package/@gotgenes/pi-permission-system).

## Technologies

`pi-permission-suite` is built with:

- [TypeScript](https://typescriptlang.org).
- [tree-sitter-bash](https://github.com/tree-sitter/tree-sitter-bash) and [web-tree-sitter](https://github.com/tree-sitter/tree-sitter/tree/master/lib/binding_web) to parse shell commands.

## Features

- Four approval modes: Act, Auto, Ask and Plan.
- `/approval-mode` command and `Ctrl+Q` shortcut to switch modes.
- `set_approval_mode` tool, so the agent can switch modes by itself.
- Rule engine to block dangerous commands and protect paths in all modes.
- Subagent-based auto-approval for uncertain tool calls.

## Installation

```bash
pi install npm:pi-permission-suite
```

## Usage

https://github.com/ansidev/pi-permission-suite/blob/main/README.md
