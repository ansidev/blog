---
type: post
title: Why shell commands in makefile usually start with at symbol?
date: 2022-04-02T21:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: '@ansidev'
permalink: /programming/why-shell-commands-in-makefile-usually-start-with-at-symbol
categories:
  - Programming
tags:
  - makefile
---

Answer:

> Normally make prints each command line before it is executed. We call this echoing because it gives the appearance that you are typing the commands yourself.
>
> **When a line starts with `@`, the echoing of that line is suppressed**. The `@` is discarded before the command is passed to the shell. Typically you would use this for a command whose only effect is to print something, such as an echo command to indicate progress through the makefile:

Source: [https://web.mit.edu/gnu/doc/html/make_5.html](https://web.mit.edu/gnu/doc/html/make_5.html).
