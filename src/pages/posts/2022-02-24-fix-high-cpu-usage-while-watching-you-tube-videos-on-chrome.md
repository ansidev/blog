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

1. Disable Skia API.

  - Go to `chrome://flags`.
  - Search for `Skia API for compositing`.
  - Change mode to Disabled.
  - Click Relaunch to restart Google Chrome.
  - Open a random YouTube videos/livestream and test again.

2. Switch to using Firefox.
