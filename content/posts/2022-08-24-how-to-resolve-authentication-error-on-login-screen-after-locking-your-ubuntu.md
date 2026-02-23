---
type: post
title: How to resolve "Authentication error" on login screen after locking your Ubuntu?
date: 2022-08-24T15:41:10+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /ubuntu/how-to-resolve-authentication-error-on-login-screen-after-locking-your-ubuntu
categories:
  - Linux
  - Ubuntu
tags:
  - login screen
  - authentication error
  - lock
---

## Problem

After locking screen on Ubuntu, the next time you login, you see the message "Authentication error" on login screen and cannot type your password anymore to login.

<img class="medium-zoom mx-auto" src="/uploads/2022/08/24/authentication-error.webp" alt="Authentication Error" />

## Solution

> On the login screen, Press `Ctrl + Alt + F3` to open a terminal, or use SSH to access from another computer. To unlock all sessions, type `sudo loginctl unlock-sessions`. Then press `Ctrl + Alt + F2`, for example, to go back to your (now unlocked) session.

> This does not solve the underlying problem, but lets you quickly get back to your session to save your work and try configuration changes, without having to reboot.

## References

- https://askubuntu.com/questions/1032624/ubuntu-18-04-authentication-error-on-loging-after-lock
