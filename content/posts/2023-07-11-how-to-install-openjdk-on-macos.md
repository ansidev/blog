---
layout: doc
outline: deep
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

Install OpenJDK with Homebrew and point `JAVA_HOME` at it, on both Apple Silicon and Intel Macs.

<!-- more -->

## Why not hard-code the path?

Homebrew installs into a different prefix depending on the CPU:

| Mac           | Homebrew prefix |
| ------------- | --------------- |
| Apple Silicon | `/opt/homebrew` |
| Intel         | `/usr/local`    |

The old version of this post used `/usr/local/opt/openjdk`, which only exists on Intel Macs. Use `brew --prefix openjdk`
instead, it prints the right path for your machine.

## Steps

1. Install OpenJDK using [brew](https://brew.sh)

   ```sh
   brew install openjdk
   ```

2. Check where Homebrew put it:

   ```sh
   brew --prefix openjdk
   # Apple Silicon: /opt/homebrew/opt/openjdk
   # Intel:         /usr/local/opt/openjdk
   ls "$(brew --prefix openjdk)/libexec/openjdk.jdk/Contents/Home"
   ```

   The `ls` must list `bin`, `lib`, etc. If it fails, the formula is not installed.

3. Configure the environment variable `JAVA_HOME`.

   Configure manually, add the line below to `~/.zshrc`:

   ```sh
   export JAVA_HOME="$(brew --prefix openjdk)/libexec/openjdk.jdk/Contents/Home"
   ```

   Then restart your terminal. Or run this command to do the same:

   ```sh
   echo -e "\nexport JAVA_HOME=\"\$(brew --prefix openjdk)/libexec/openjdk.jdk/Contents/Home\"" >> "${ZDOTDIR:-$HOME}/.zshrc" && exec zsh
   ```

   Note the `\$` in the command above: it keeps `$(brew --prefix openjdk)` in `~/.zshrc` so it is evaluated each time
   a shell starts, instead of being frozen to the path at install time.

4. Make `java` itself find this JDK.

   `openjdk` is _keg-only_, so Homebrew does not link it into its `bin` directory. Setting `JAVA_HOME` alone does not
   change which `java` runs from your `PATH`. Either symlink it for the macOS Java wrappers (this is what
   `brew info openjdk` recommends):

   ```sh
   sudo ln -sfn "$(brew --prefix openjdk)/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk.jdk
   ```

   or put it first on your `PATH` in `~/.zshrc`:

   ```sh
   export PATH="$JAVA_HOME/bin:$PATH"
   ```

## Verify

```sh
java -version
echo "$JAVA_HOME"
```

Both must point to the Homebrew installation, for example `JAVA_HOME` should start with the output of
`brew --prefix` (`/opt/homebrew` on Apple Silicon, `/usr/local` on Intel).

If `JAVA_HOME` is correct but `java -version` shows a different vendor (for example one installed by a version manager
such as [mise](https://mise.jdx.dev) or SDKMAN!), that tool is earlier on your `PATH`. Check with `which -a java`.

## Tested with

- Apple Silicon (arm64): macOS 27.0.1, Homebrew 7.0.11, formula `openjdk` 27.0.1.0.3. I checked
  that `brew --prefix openjdk` resolves to `/opt/homebrew/opt/openjdk` and read the formula caveats (keg-only, symlink
  command above).
- Intel: not tested on real hardware. The `/usr/local` prefix is Homebrew's documented default for Intel Macs, and the
  commands above contain no architecture-specific paths.
