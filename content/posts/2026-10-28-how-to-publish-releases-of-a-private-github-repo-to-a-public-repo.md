---
layout: doc
outline: deep
type: post
title: How to publish releases of a private GitHub repository to a public repository?
date: 2026-10-28T10:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-publish-releases-of-a-private-github-repository-to-a-public-repository/
categories:
  - Tips and Tricks
  - CI/CD
  - DevOps
tags:
  - GitHub Actions
  - GoReleaser
  - Homebrew
---

How I publish prebuilt binaries of a private repository to a separate public repository, using GitHub Actions and GoReleaser.

<!-- more -->

## Story

[resume-cli](https://github.com/ansidev/resume-cli) is a private repository, but I want people to be able to download and install it.

GitHub releases belong to the repository they are created in, so a release of a private repository is private too.

The solution is to keep the source in the private repository and publish only the binaries to another, public repository
(I call it `resume-cli-ce`, the Community Edition). The public repository contains no source code, just releases and a
Homebrew formula.

```text
resume-cli (private)                     resume-cli-ce (public)
  source code                              README, LICENSE
  CI, release workflows   --release-->     GitHub releases (binaries + checksums)
                                           Formula/resume-cli.rb (Homebrew)
```

## Prerequisites

- A private repository (`ansidev/resume-cli`) and an empty public repository (`ansidev/resume-cli-ce`).
- [GoReleaser](https://goreleaser.com) to build the binaries and create the release. The same idea works with any tool that
  can create a release in another repository (for example `gh release create --repo`).

## Step 1: Create a fine-grained personal access token

The built-in `GITHUB_TOKEN` is scoped to the repository running the workflow, so it cannot create a release in another
repository. You need a personal access token (PAT).

Create a [fine-grained token](https://github.com/settings/personal-access-tokens/new) with the least privilege possible:

- **Repository access**: only select repositories, choose the public repository (`resume-cli-ce`) only.
- **Permissions**: `Contents` with read and write.

Then save it as a secret of the **private** repository, for example `CE_RELEASE_TOKEN`.

This token can only write to the public repository, so even if it leaks, the private source code is not exposed.

## Step 2: Configure GoReleaser to release to the other repository

The important part is the `release.github` section, which tells GoReleaser where to create the release.

`.goreleaser.yaml`:

```yaml
version: 2

project_name: resume-cli

builds:
  - id: resume-cli
    main: .
    binary: resume-cli
    env:
      - CGO_ENABLED=0
    goos:
      - linux
      - darwin
      - windows
    goarch:
      - amd64
      - arm64
    flags:
      - -trimpath
    ldflags:
      - -s -w

archives:
  - id: resume-cli
    formats:
      - tar.gz
    name_template: "{{ .ProjectName }}_{{ .Version }}_{{ .Os }}_{{ .Arch }}"
    format_overrides:
      - goos: windows
        formats:
          - zip
    files:
      - LICENSE
      - README.md

checksum:
  name_template: "checksums.txt"

# Do not attach the source archive, the source code is private.
source:
  enabled: false

# Binaries and checksums are published to the public repository.
release:
  github:
    owner: ansidev
    name: resume-cli-ce

changelog:
  disable: true
```

Notes:

- `source.enabled: false`: by default GoReleaser can upload a source archive. Do not do this for a private repository.
- `changelog.disable: true`: the generated changelog is built from commit messages of the private repository, which may
  contain internal information. I provide the release notes myself (see step 3).
- `-trimpath` removes local file system paths from the binary.

## Step 3: Create the workflow

The workflow runs when a version tag is pushed, and runs GoReleaser with the token from step 1.

`.github/workflows/publish_ce.yaml`:

```yaml
name: publish_ce

on:
  push:
    tags:
      - v*

permissions:
  contents: read

jobs:
  publish_ce:
    name: Publish release to resume-cli-ce
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Set up Go
        uses: actions/setup-go@v6
        with:
          go-version: '1.27'

      - name: Select release notes
        id: notes
        run: |
          if [ -f ".changes/${GITHUB_REF_NAME}.md" ]; then
            echo "args=--release-notes=.changes/${GITHUB_REF_NAME}.md" >> "$GITHUB_OUTPUT"
          fi

      - name: Run GoReleaser
        uses: goreleaser/goreleaser-action@v7
        with:
          distribution: goreleaser
          version: '~> v2'
          args: release --clean ${{ steps.notes.outputs.args }}
        env:
          # Fine-grained PAT: Contents read/write on the public repository only.
          GITHUB_TOKEN: ${{ secrets.CE_RELEASE_TOKEN }}
```

How it works:

- `GITHUB_TOKEN` is overridden with the PAT, so GoReleaser creates the release in `ansidev/resume-cli-ce` instead of the
  current repository. The workflow's own permission stays `contents: read`.
- `fetch-depth: 0` fetches all tags, GoReleaser needs them to detect the current version.
- If a release notes file for the tag exists (I keep them in `.changes/v0.2.0.md`), it is used as the release notes.

### The tag must be pushed by a PAT

This one cost me some time. Events created by `GITHUB_TOKEN` do not trigger other workflows, so if another workflow
pushes the tag with `GITHUB_TOKEN`, `publish_ce` never runs.

In my setup the release workflow (a gitflow workflow that tags `main` when a release pull request is merged) uses another
PAT (`GH_TOKEN`) to push the tag, so the tag push triggers `publish_ce`. If you push tags by hand, you don't have this
problem.

## Step 4: Add a Homebrew formula to the public repository

Users should not need to download archives manually, so I added a Homebrew formula to the public repository. A repository
named `homebrew-*` is not required if you pass the URL when tapping.

`Formula/resume-cli.rb`:

```ruby
class ResumeCli < Formula
  desc "Generate resumes and PDFs from a config file (Community Edition)"
  homepage "https://github.com/ansidev/resume-cli-ce"
  license "AGPL-3.0-only"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/ansidev/resume-cli-ce/releases/download/v0.2.0/resume-cli_0.2.0_darwin_arm64.tar.gz"
      sha256 "<sha256 from checksums.txt>"
    else
      url "https://github.com/ansidev/resume-cli-ce/releases/download/v0.2.0/resume-cli_0.2.0_darwin_amd64.tar.gz"
      sha256 "<sha256 from checksums.txt>"
    end
  end

  on_linux do
    if Hardware::CPU.arm?
      url "https://github.com/ansidev/resume-cli-ce/releases/download/v0.2.0/resume-cli_0.2.0_linux_arm64.tar.gz"
      sha256 "<sha256 from checksums.txt>"
    else
      url "https://github.com/ansidev/resume-cli-ce/releases/download/v0.2.0/resume-cli_0.2.0_linux_amd64.tar.gz"
      sha256 "<sha256 from checksums.txt>"
    end
  end

  def install
    bin.install "resume-cli"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/resume-cli version")
  end
end
```

Users install it with:

```sh
brew tap ansidev/resume-cli-ce https://github.com/ansidev/resume-cli-ce
brew trust --formula ansidev/resume-cli-ce/resume-cli
brew install resume-cli
```

Currently I update the `url` and `sha256` values by hand after each release (copy them from `checksums.txt`). GoReleaser
can generate the formula for you with its Homebrew support, and push it to the public repository with the same token.

## Result

1. Merge the release pull request in the private repository, the tag `v0.2.0` is pushed.
2. `publish_ce` builds the binaries for Linux, macOS and Windows (amd64 and arm64).
3. The release `v0.2.0` with the archives, `checksums.txt` and the release notes appears in the public repository.
4. Users install it by Homebrew or download the archive from the public releases page.

## Security checklist

- The PAT is limited to the public repository and only has `Contents` read and write.
- The workflow has `contents: read` only.
- Source archive is disabled, changelog is not generated from private commit messages.
- Never run this workflow for pull requests from forks, secrets are not available there and it should not be triggered
  by untrusted code. A tag trigger avoids this.

## References

- [GoReleaser: GitHub releases](https://goreleaser.com/customization/release/)
- [GitHub: Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub: Triggering a workflow from a workflow](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)
- [Homebrew: How to create and maintain a tap](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap)
