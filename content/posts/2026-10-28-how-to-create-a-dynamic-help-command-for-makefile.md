---
layout: doc
outline: deep
type: post
title: How to create a dynamic help command for Makefile?
date: 2026-10-28T11:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-create-a-dynamic-help-command-for-makefile/
categories:
  - Tips and Tricks
  - DevOps
tags:
  - Makefile
  - Make
---

How to generate the help output of a Makefile from comments, so you never have to update the help text by hand.

<!-- more -->

## Story

After a while, a project's Makefile has many targets and nobody remembers all of them (including me).

The naive solution is a `help` target that prints a hard-coded list with `echo`. It works for a week, then someone adds a
target and forgets to update the list.

A better solution is to write the description next to the target as a comment, and let `help` generate the list from the
Makefile itself. I use this in [resume-cli](https://github.com/ansidev/resume-cli).

## Result

```text
$ make
Usage: make <target>

Targets:
  help         List available commands and their usages
  prepare      Install golangci-lint, goimports, lefthook git hooks, git-chglog, and changie
  dependency   Download Go dependencies
  test         Run all tests
  coverage     Run all tests with coverage
  lint         Run golangci-lint
  build        Build resume-cli binary to bin/resume-cli
  install      Install resume-cli binary to GOPATH/bin
```

## Solution

Add a `## description` comment after each target you want to show in the help:

```makefile
.DEFAULT_GOAL := help

help: ## List available commands and their usages
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "} {printf "  %-12s %s\n", $$1, $$2}'

dependency: ## Download Go dependencies
	@go get -v ./...

test: dependency ## Run all tests
	@go test ./...

lint: ## Run golangci-lint
	@golangci-lint run ./...

build: ## Build resume-cli binary to bin/resume-cli
	@go build -o bin/resume-cli .

.PHONY: help dependency test lint build
```

Now `make help` (or just `make`) prints all targets that have a `##` comment. A new target appears in the help as soon as
you add the comment.

## How it works

### `.DEFAULT_GOAL := help`

When you run `make` without a target, Make runs the first target in the file. `.DEFAULT_GOAL` makes the default explicit,
so `help` can be placed anywhere, and running `make` by accident shows the help instead of building something.

### `$(MAKEFILE_LIST)`

A built-in variable which contains the list of Makefiles that Make has read, including the files loaded by `include`.
Using it instead of a hard-coded `Makefile` means the help also lists targets of included files, and works if you run
`make -f build.mk`.

### `grep -E '^[a-zA-Z_-]+:.*?## '`

Select lines which:

- start with a target name (`^[a-zA-Z_-]+`),
- followed by a colon, optionally the prerequisites (`:.*?`), so `test: dependency ## Run all tests` is matched,
- and contain `## ` (two hashes and a space).

Lines like `# a normal comment` or targets without `##` are ignored, that is how you hide internal targets.

### `awk 'BEGIN {FS = ":.*?## "} ...'`

`awk` splits each line using the regex `:.*?## ` as the field separator, so for the line

```makefile
test: dependency ## Run all tests
```

`$1` is `test` and `$2` is `Run all tests`. Then `printf "  %-12s %s\n"` prints the name padded to 12 characters, followed
by the description.

### `$$1` and `$$2`

In a Makefile, `$` starts a Make variable, so a literal `$` must be escaped as `$$`. Make turns `$$1` into `$1` before
passing it to the shell, and the shell passes it to `awk` because it is inside single quotes.

### The `@` prefix

By default Make prints every command before running it. `@` hides the command, so only the output is displayed.

## Improvements

The version above is what I use in resume-cli, and it has some limitations. I tested the following on macOS (GNU Make
3.81).

### Targets with digits in the name

The character class `[a-zA-Z_-]` has no digits, so targets like `build2` or `test-e2e` are silently ignored. Add `0-9` and
a dot:

```makefile
'^[a-zA-Z0-9_.-]+:.*?## '
```

### Long target names

`%-12s` only pads names up to 12 characters. A longer name pushes its description to the right and breaks the alignment:

```text
  build        Build the binary
  generate_changelog Generate changelog for the current version
```

Increase the width (for example `%-20s`), or pick a width from the longest target in your Makefile.

### Colors and sorting

Add color for the target name with ANSI escape codes, and use `sort` if you want the targets in alphabetical order instead
of the file order:

```makefile
help: ## Show this help
	@echo "Usage: make <target>"
	@echo ""
	@grep -hE '^[a-zA-Z0-9_.-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
```

`grep -h` removes the file name prefix. It is only needed when `$(MAKEFILE_LIST)` has more than one file, but it is
harmless otherwise.

## Notes

- Do not forget the `.PHONY` declaration for targets which are not files, including `help`.
- Targets with the same name defined in multiple included files will be listed more than once.
- The regex is intentionally simple: it does not support targets defined with variables (`$(BIN):`), pattern rules (`%.o:`)
  or multiple targets in one line (`a b: ## ...`). Write a small wrapper target for them if you want them in the help.
- It only needs `grep` and `awk`, which are available by default on macOS and Linux. It is written for GNU Make.

## References

- [GNU Make: Special Variables (`.DEFAULT_GOAL`, `MAKEFILE_LIST`)](https://www.gnu.org/software/make/manual/html_node/Special-Variables.html)
- [GNU Make: Phony Targets](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html)
- [The AWK Programming Language: Field separators](https://www.gnu.org/software/gawk/manual/html_node/Field-Separators.html)
