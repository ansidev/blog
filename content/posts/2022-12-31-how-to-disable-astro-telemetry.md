---
type: post
title: How to disable telemetry in Astro project?
date: 2022-12-31T18:29:48+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-disable-astro-telemetry
categories:
  - Tips and Tricks
  - Javascript
  - Astro
tags:
  - disable telemetry
---

## Problem

> Telemetry is anonymous data that provides the Astro team insights into which Astro features are most often used.

By default, Astro will collect these anonymous data when it runs.

Telemetry config will be saved to a config file.

Source code: [config.ts](https://github.com/withastro/astro/blob/main/packages/telemetry/src/config.ts)

| OS      | Config                                                  |
| ------- | ------------------------------------------------------- |
| macOS   | `$HOME/Library/Preferences/astro/config.json`           |
| Windows | `$USERPROFILE\AppData\Roaming\astro\Config\config.json` |
| Linux   | `$HOME/.config/astro/config.json`                       |

We see how to disable telemetry.

## Solutions

1. Use `astro` command

   ```shell
   pnpm run astro telemetry disable
   ```

   You can run it automatically on the first-time setting up the project.

   ```shell
   pnpm pkg set scripts.prepare="astro telemetry disable"
   ```

2. Additional method

   Block Astro's telemetry domain by adding this line to OS's host file.

   ```
   127.0.0.1 telemetry.astro.build
   ```
