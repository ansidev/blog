---
type: post
title: How to debug interactive Go CLI command using VSCode?
date: 2023-01-25T15:50:51+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-debug-interactive-go-cli-command-using-vscode
categories:
  - Tips and Tricks
  - Programming
  - Golang
tags:
  - VSCode
---

## Problem

> By default, if you use the generated launch configuration template for debugging Golang application, it won't work for debugging an interactive command.

Example launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/main.go"
    }
  ]
}
```

Error should contain this message: `open /dev/tty: device not configured`.

## Solutions

Add `"console": "integratedTerminal"` to your current launch configuration.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "program": "${workspaceFolder}/main.go",
      "console": "integratedTerminal"
    }
  ]
}
```

## References

- [Original answer](https://github.com/microsoft/vscode-cpptools/issues/3351#issuecomment-1073038774).
