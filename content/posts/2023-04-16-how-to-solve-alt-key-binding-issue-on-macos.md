---
type: post
title: How to solve Alt key binding issue on macOS?
date: 2023-04-16T09:40:48+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-solve-alt-key-binding-issue-on-macos
categories:
  - Tips and Tricks
tags:
  - alt
  - key binding
  - alacritty
---

Solution for binding Alt + {key} hotkeys.

## Problem

If you are using macOS, you can experience this issue each time you press any hotkey which contains `Options`.

For example, `Options` + `a` will print `å` in your text editor.

## Root cause

Those output characters is pre-defined by the keyboard input method.

Almost users use the `U.S` keyboard layout which cause this issue.

## Solution

1. All apps:

Change the keyboard input method. You can try this keyboard input method: `Unicode Hex Input`.

2. Alacritty 0.12+:

Add this option to your Alacritty config:

```yaml
window:
  option_as_alt: OnlyLeft # other values are None, OnlyRight, Both
```
