---
type: post
title: Fix high CPU usage while watching YouTube videos on Google Chrome
date: 2022-02-24T00:59:45+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: '@ansidev'
permalink: /tips-and-tricks/fix-high-cpu-usage-while-watching-you-tube-videos-on-google-chrome
categories:
  - Tips and Tricks
tags:
  - Google Chrome
  - Skia API
  - YouTube
---

# Problem

High CPU usage while watching YouTube videos on Google Chrome.

# Solution

Disable Skia API.

1. Go to `chrome://flags`.
2. Search for `Skia API for compositing`.
3. Change mode to Disabled.
4. Click Relaunch to restart Google Chrome.
5. Open a random YouTube videos/livestream and test again.
