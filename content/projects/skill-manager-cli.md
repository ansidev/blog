---
type: project
title: skill-manager-cli
repositoryUrl: https://github.com/ansidev/skill-manager-cli
license: MIT
licenseUrl: https://github.com/ansidev/skill-manager-cli/blob/main/LICENSE
techs:
  - Go
  - Urfave CLI
  - YAML
  - Homebrew
developmentStatus: active
date: 2026-11-15T19:49:21+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

A Go CLI that manages agent skills for coding assistants with a declarative `config.yaml`.

<!-- more -->

## Story

I use several coding assistants, and each one has its own skill directory. Installing the same skill into all of them by hand — and keeping every install reproducible — was tedious.

`skill-manager-cli` keeps the desired skills in a declarative `config.yaml`, then makes every agent directory match it with a single `apply` command.

## Technologies

`skill-manager-cli` is built with:

- [Go](https://go.dev).
- [urfave/cli v2](https://github.com/urfave/cli).
- YAML for the declarative `config.yaml`.
- [Homebrew](https://brew.sh) for distribution.

## Features

- **Declarative state** — describe the skills you want in `config.yaml`, then run `apply` to make it so.
- **Multiple providers** — fetch skills from GitHub repositories, local filesystem paths, or custom Git hosts.
- **Multi-agent targeting** — install into several agents' skill directories at once via a `dirs` map or the `-a/--agents` flag.
- **Central skill store** — skills are cached in `~/.agents/skills` and symlinked into each agent directory.
- **Conflict detection** — conflicting skill entries across repositories are reported before any changes are made.
- **Safe operation modes** — `--dry-run` previews changes, confirmation prompts guard destructive actions, and `--overwrite` opts into replacing existing skills and symlinks.

## Installation

```bash
brew install ansidev/tap/skill-manager-cli
```

## Usage

- `skill-manager-cli init`: write a commented example `config.yaml`.
- `skill-manager-cli apply --dry-run`: preview what would change.
- `skill-manager-cli apply`: apply the configured state.
- `skill-manager-cli install` / `skill-manager-cli uninstall`: manage single skills.

See the [README](https://github.com/ansidev/skill-manager-cli/blob/main/README.md) for more details.
