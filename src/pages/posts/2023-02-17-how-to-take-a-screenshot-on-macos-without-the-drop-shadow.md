---
type: post
title: How to take a screenshot on macOS without the drop shadow?
date: 2023-02-17T21:12:43+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-take-a-screenshot-on-macos-without-the-drop-shadow
categories:
  - Tips and Tricks
  - macOS
tags:
  - take screenshot
  - drop shadow
---

## Problem

You want to take a screenshots without drop shadows.

## Solutions

There are several methods:

#### Method 1

Press and hold the Option key <kbd>⌥</kbd> while taking screenshot.

#### Method 2

Disable the drop shadow globally

Run this command in the Terminal

```
defaults write com.apple.screencapture disable-shadow -bool true && killall SystemUIServer
```

If you want to re-enable the drop shadow, run this command in the Terminal

```
defaults write com.apple.screencapture disable-shadow -bool false && killall SystemUIServer
```
