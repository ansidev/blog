---
layout: doc
outline: deep
type: post
title: Bulk-import directories into zoxide with zx-import
date: 2026-10-31T16:30:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/bulk-import-directories-into-zoxide-with-zx-import/
categories:
  - Tips and Tricks
  - zsh
tags:
  - zsh
  - zoxide
  - CLI
---

A zsh function that walks a directory tree and registers every folder into zoxide in one shot, so `z` works on day one.

<!-- more -->

## Story

I use [zoxide](https://github.com/ajeetdsouza/zoxide) for jumping between directories. Its database learns from the
directories you `cd` into, which is great once you have been using a machine for months — and useless on a fresh one.

Every time I set up a new machine or clone a workspace, I have to `cd` into each project folder by hand so zoxide picks
it up. With dozens of projects across `~/projects/...`, that is a lot of typing for an algorithm to memorize what I
already know.

So I wrote `zx-import` for my [DotBS](https://github.com/ansidev/dotbs) dotfiles: give it a path, it recursively walks
the tree and registers every directory into zoxide in one shot.

## Result

```console
$ zx-import ~/projects
adding: /Users/ansidev/projects
adding: /Users/ansidev/projects/personal
adding: /Users/ansidev/projects/personal/blog
adding: /Users/ansidev/projects/personal/dotbs
...
```

Afterwards, `z blog` jumps straight to `~/projects/personal/blog`, and the same works for every other folder that was
imported.

## Usage

```console
zx-import [--dry-run] [--depth N] [-h | --help] PATH
```

The function lives in [dot_zsh_functions](https://github.com/ansidev/dotbs/blob/main/scripts/dot_zsh_functions) in my
dotfiles repo.

### `--dry-run`

By default the function prints `adding: <dir>` for each folder it registers. To preview without touching the zoxide
database:

```console
$ zx-import --dry-run ~/projects
[dry-run] would add: /Users/ansidev/projects
[dry-run] would add: /Users/ansidev/projects/personal
...
```

### `--depth N`

Only add directories at depth `N` or below, relative to `PATH`. Depth `0` includes only `PATH` itself, depth `1`
includes immediate children, and so on. Omit it and every directory is added.

This is what I use in practice. Importing a whole projects tree registers intermediate folders like `personal` or
`work` which I never want to jump to — the project roots I actually care about live one level deeper. Depth is relative
to `PATH`, so to import only the project roots:

```console
$ zx-import --depth 2 ~/projects
adding: /Users/ansidev/projects/personal/blog
adding: /Users/ansidev/projects/personal/dotbs
adding: /Users/ansidev/projects/work/acme
...
```

### Automatic exclusion of generated folders

Folders that were not created by a human are skipped, and the whole subtree under them is pruned:

- VCS and package managers: `.git`, `node_modules`, `vendor`
- Build outputs: `dist`, `build`, `out`, `target`, `bin`, `obj`
- Caches and tool state: `.cache`, `__pycache__`, `.venv`, `venv`, `.next`, `.turbo`, `.gradle`, `.terraform`, `coverage`

Without this, importing `~/projects` would register a few hundred `node_modules` folders, and `z <name>` would start
suggesting them.

## Implementation

The full function is about a hundred lines of zsh. Here are the parts worth explaining, in the order they matter.

### Parsing flags

The function accepts flags and a single positional argument. Instead of reaching for `getopts` (which handles single
character flags awkwardly for long options), it walks `argv` manually with a `case`:

```zsh
local i=1
while [[ $i -le $# ]]; do
  case ${argv[$i]} in
    --dry-run) DRY_RUN=true; ((i++)) ;;
    --depth)
      # ... validate the next argument is a non-negative integer ...
      MAX_DEPTH="${depth_value}"
      ((i += 2))
      ;;
    -*) print -r "Error: unknown option: ${argv[$i]}" >&2; return 1 ;;
    *)   POSARGS+=("${argv[$i]}"); ((i++)) ;;
  esac
done
```

`--depth` consumes two arguments, hence `((i += 2))`. Anything starting with `-` is rejected as an unknown option, and
everything else is collected in `POSARGS`. Afterwards the function checks that exactly one path was given, that it
exists, and that it is a directory. It also verifies `zoxide` is actually installed before doing any work.

### Walking the tree with `find -prune`

The core of the function builds one `find` invocation that skips the excluded subtrees entirely:

```zsh
local -a EXCLUDES=(.git node_modules __pycache__ .venv venv dist build out target vendor .cache .next .turbo .gradle bin obj .terraform coverage)

local -a FIND_ARGS=(find "${TARGET_DIR}" "(")
for EXCLUDE in "${EXCLUDES[@]}"; do
  FIND_ARGS+=(-name "${EXCLUDE}")
  [[ ${EXCLUDE} != ${EXCLUDES[-1]} ]] && FIND_ARGS+=(-o)
done
FIND_ARGS+=(")" -prune -o -type d -print)
DIRS=("${(f)$(command "${FIND_ARGS[@]}")}")
```

For a long exclusion list, building the array and executing `find` once is much cheaper than spawning a `find` per
directory, or walking in pure zsh with glob qualifiers (which visits `node_modules` before you can prune it).

The generated expression is equivalent to:

```console
find ~/projects ( -name .git -o -name node_modules -o ... ) -prune -o -type d -print
```

`-prune` is the key: it tells `find` *do not descend into this directory*. `-name node_modules -prune` skips not only
the `node_modules` folder itself but everything under it, so a deep `node_modules` tree never costs a traversal.

The result is captured into a zsh array with `"${(f)$(...)}"` — the `(f)` flag splits the output on newlines, one
directory per element.

### Depth calculation

`find` returns absolute paths, so depth has to be computed relative to the target directory:

```zsh
local relative_path="${DIR#${TARGET_DIR}/}"
if [[ "${relative_path}" == "${DIR}" ]]; then
  depth=0   # DIR is exactly TARGET_DIR
else
  # count the path separators, +1 because the first child is depth 1
  depth=$(($(echo "${relative_path}" | tr -cd '/' | wc -c) + 1))
fi
```

`${DIR#${TARGET_DIR}/}` strips the target prefix from the path. If nothing was stripped, the directory *is* the target
and its depth is 0. Otherwise the depth is the number of `/` characters in the remaining relative path.

### The import loop

The rest is a loop over the collected directories:

```zsh
for DIR in "${DIRS[@]}"; do
  # skip if depth exceeds MAX_DEPTH ...
  if [[ ${DRY_RUN} == true ]]; then
    print -r "[dry-run] would add: ${DIR}"
  else
    print -r "adding: ${DIR}"
    if ! zoxide add "${DIR}"; then
      print -r "Error: failed to add: ${DIR}" >&2
      FAILED=true
    fi
  fi
done
(( FAILED )) && return 1
```

Each `zoxide add` failure is remembered, and the function exits non-zero at the end if anything failed, so it can be
used safely in scripts.

## Notes

- zoxide stores a *rank* per directory, not just membership. Mass-imported entries start with a low rank, so your
  existing habits still win over the imported ones — the database just becomes usable instead of empty.
- `-prune` without `-print` after it: a common `find` mistake is to forget the `-o` after the prune group. With
  `-prune` alone, pruned directories would neither be printed nor descended into — the version above prints every
  non-pruned directory explicitly with `-type d -print`.
- `zx-import` resolves the target with `pwd -P` to the physical path, so symlinks in the target path do not confuse the
  depth calculation.
- The exclusion list is a plain array — adding a new tool's junk folder is a one-line change.

## References

- [zoxide — a smarter cd command](https://github.com/ajeetdsouza/zoxide)
- [find(1): the `-prune` primary](https://man.freebsd.org/cgi/man.cgi?find(1))
- [DotBS source — dot_zsh_functions](https://github.com/ansidev/dotbs/blob/main/scripts/dot_zsh_functions)
