---
type: post
title: How to install OpenJDK on macOS?
date: 2023-07-11T19:43:28+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-install-openjdk-on-macos/
categories:
  - Tips and Tricks
  - macOS
  - Java
tags:
  - OpenJDK
---

Steps:

1. Install OpenJDK using [brew](https://brew.sh)
   ```sh
   brew install openjdk
   ```

2. Configure environment variable `JAVA_HOME`.

   Configure manually:

   - Add the below line to `~/.zshrc` (remember to replace `{OPENJDK_VERSION}` by the installed OpenJDK version).
     ```
     export JAVA_HOME="/usr/local/Cellar/openjdk/{OPENJDK_VERSION}/libexec/openjdk.jdk/Contents/Home"
     ```

   - Restart your terminal.

   Or you can run the below command:
   ```
   echo "export JAVA_HOME=\"/usr/local/Cellar/openjdk/${$(brew list --version openjdk)/openjdk\ /}/libexec/openjdk.jdk/Contents/Home\"" >> ~/.zshrc && exec zsh
   ```
