---
type: project
title: anti-locker
repositoryUrl: https://github.com/ansidev/anti-locker
license: MIT
licenseUrl: https://github.com/ansidev/anti-locker/blob/main/LICENSE
techs:
  - Go
developmentStatus: active
date: 2026-08-03T09:11:29+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

Prevent macOS from locking the screen when connected to a specific Wi-Fi network.

<!-- more -->

## Story

I want my MacBook to stay awake while I'm at home, but still sleep and lock normally anywhere else.

`anti-locker` prevents idle sleep only when the Mac is connected to a Wi-Fi network I have explicitly allowed. On any other network (or when Wi-Fi is off) it does nothing. Manual screen lock (`Ctrl+Cmd+Q`) and display-off always work.

## Technologies

`anti-locker` is built with:

- [Go](https://go.dev).
- macOS `caffeinate` to block idle sleep.

## How it works

1. Every `interval` seconds, check the current Wi-Fi SSID.
2. If the SSID matches a configured network, run `caffeinate -i` to block idle sleep.
3. If the SSID stops matching (or Wi-Fi drops), stop `caffeinate`.

## Installation

```bash
git clone https://github.com/ansidev/anti-locker.git
cd anti-locker
go build -o anti-locker .
```

## Usage

```bash
anti-locker                                # use ~/.config/anti-locker.yaml
anti-locker --config /path/to/config.yaml  # custom config path
```

Configuration example:

```yaml
interval: 3600 # seconds, defaults to 3600
networks:
  - "Home Network 1"
  - "Home Network 2"
```

More details: https://github.com/ansidev/anti-locker/blob/main/README.md
