---
type: post
title: Tip for rcmd macOS
date: 2023-04-18T11:48:40+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/rcmd-macos
categories:
  - Tips and Tricks
  - macOS
tags:
  - rcmd
---

Tip for rcmd macOS.

## Problem

[rcmd](https://lowtechguys.com/rcmd/) is a macOS application that help switching among applications instantly.

However, this is a shareware. The trial version has a limitation, it stops working after a few hours, you have to restart the app to resets the trial.

In this article, I will guide you how to restart rcmd automatically.

## Solution

We will create a macOS background service that run at start up. The service will restart rcmd each 30 minutes.

Steps:

1. Launch rcmd app. You should see its icon in the system tray menu.

2. Launch your favorite terminal app.

3. Run

```sh
cat << EOF > ~/Library/LaunchAgents/xyz.ansidev.rcmd.autorestart.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>RunAtLoad</key>
    <true />
    <key>Label</key>
    <string>xyz.ansidev.rcmd.autorestart</string>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/bin/osascript</string>
      <string>-e</string>
      <string>quit app "rcmd"</string>
      <string>-e</string>
      <string>delay 5</string>
      <string>-e</string>
      <string>launch app "rcmd"</string>
    </array>
    <key>StartInterval</key>
    <integer>1800</integer>
  </dict>
</plist>
EOF
```

4. Load service

```sh
launchctl load ~/Library/LaunchAgents/xyz.ansidev.rcmd.autorestart.plist
```

You should see the rcmd icon in the system tray menu was disappeared, then displayed again (because it was restarted successfully)

5. Check whether the service was started successfully

```sh
launchctl list | grep xyz.ansidev.rcmd.autorestart
```

The second column (exit code) should display 0 as the output value.

```sh
-	0	xyz.ansidev.rcmd.autorestart
```
