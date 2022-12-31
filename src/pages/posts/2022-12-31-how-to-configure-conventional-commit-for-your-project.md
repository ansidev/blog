---
type: post
title: How to configure conventional commit for your project?
date: 2022-12-31T20:55:39+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-configure-conventional-commit-for-your-project
categories:
  - Tips and Tricks
  - Javascript
tags:
  - conventional commit
  - commitlint
  - commitizen
---

## What is Conventional Commit?

[Conventional Commit](https://conventionalcommits.org/) is

> A specification for adding human and machine readable meaning to commit messages

In this tutorial, I will guide you on configuring conventional commit for a Javascript/TypeScript/NodeJS project.

## Tutorial

This tutorial uses `pnpm`.

### Configure `husky`

1. Install dependency packages

```shell
pnpm add -D husky
```

2. Active husky hook manually

```shell
pnpm exec husky install
```

3. Active husky hook automatically on first time setting up project in the future

```shell
pnpm pkg set scripts.prepare="husky install"
```

**Note:**
- You need to add the script `prepare` manually if it exists to avoid overwriting.
- `prepare` script is incompatible with `yarn berry` (v2+) at this moment.

### Configure `commitlint`

1. Install dependency packages

```shell
pnpm add -D @commitlint/config-conventional @commitlint/cli
```

2. Configure `commitlint` to use conventional config

```shell
echo '{ "extends": [ "@commitlint/config-conventional" ] }' > .commitlintrc.json
```

or

```shell
echo "module.exports = { extends: [ '@commitlint/config-conventional' ] }" > commitlint.config.js
```

3. Add husky hook to validate commit message on committing

```shell
pnpm exec husky add .husky/commit-msg 'pnpm exec commitlint --edit ${1}'
```

### Configure `commitizen`

1. Install dependency packages

```shell
pnpm add -D commitizen cz-conventional-changelog
```

2. Init `commitizen` config

```shell
echo '{ "path": "./node_modules/cz-conventional-changelog" }' > .czrc
```

3. Add husky hook to trigger commitizen automatically on running `git commit`

```shell
pnpm exec husky add .husky/prepare-commit-msg 'exec < /dev/tty && [ -z "$(cat ${1})" ] && pnpm exec cz --hook || true'
```

Advanced script for `prepare-commit-msg` hook

```shell
if [ -t 0 ];
then
  # running via terminal
  exec < /dev/tty && [ -z "$(cat ${1})" ] && pnpm exec cz --hook || true
else
  # running via GUI
  [ -z "$(cat ${1})" ] && pnpm exec cz --hook || true
fi
```

4. Add badge (optional) to `README.md`

```markdown
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
```
