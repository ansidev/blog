---
type: post
title: How to gpgsign git commit using lazygit?
date: 2023-06-16T18:30:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-gpgsign-git-commit-using-lazygit/
categories:
  - Tips and Tricks
  - Git
tags:
  - Lazygit
  - GPG sign
  - commit
---

Sign git commits with GPG (or an SSH key) when committing from lazygit.

<!-- more -->

::: warning Update
The original version of this post suggested adding `ForwardAgent yes` to `~/.ssh/config`. That was wrong: agent
forwarding has nothing to do with signing commits locally, and enabling it widens your attack surface. See
[Is `ForwardAgent` needed?](#is-forwardagent-needed) below.
:::

## Issue

One of best practices in my opinion when using git is enabling signing for your commit.

And one of my favorite tools to commit my code in terminal environment is Lazygit. However, a commit made from lazygit
can fail when the signing key is protected by a passphrase.

- https://github.com/jesseduffield/lazygit/issues/30
- https://github.com/jesseduffield/lazygit/issues/1146

First, find out which kind of key you sign with:

```sh
git config --get gpg.format
```

- empty or `openpgp`: you sign with a **GPG key** (this post's main case).
- `ssh`: you sign with an **SSH key**, see [SSH signing](#signing-with-an-ssh-key).

### Reproduce (GPG)

Configuration:

```sh
git config --global user.signingkey <your-key-fingerprint>
git config --global commit.gpgsign true
```

with a passphrase-protected key and `pinentry-curses` as the pinentry program (`~/.gnupg/gpg-agent.conf`). Lazygit runs
`git commit` as a background process without a terminal, so pinentry cannot ask for the passphrase:

```
error: gpg failed to sign the data:
gpg: signing failed: Inappropriate ioctl for device
fatal: failed to write commit object
```

The same commit works from a normal shell, because there `GPG_TTY` / the terminal is available.

## Solution

Let lazygit run the commit in the foreground terminal, so GPG can prompt you. In
`~/.config/lazygit/config.yml` (on macOS: `~/Library/Application Support/lazygit/config.yml`):

```yaml
git:
  overrideGpg: true
```

From lazygit's documentation: `overrideGpg`: "If true, do not spawn a separate process when using GPG". With it,
lazygit suspends its UI, runs `git commit` attached to your terminal, and your pinentry prompt works.

Also make sure `GPG_TTY` is set in your shell (`~/.zshrc`):

```sh
export GPG_TTY=$(tty)
```

On macOS you can instead use a GUI pinentry (`brew install pinentry-mac`, then in `~/.gnupg/gpg-agent.conf`
`pinentry-program /opt/homebrew/bin/pinentry-mac`; use `/usr/local/bin/pinentry-mac` on Intel), which does not need a
terminal at all. Run `gpgconf --kill gpg-agent` after changing the file.

### Verify

Make a commit from lazygit, then in the repository:

```sh
git verify-commit HEAD
```

You should see `Good signature from ...` and the exit code should be `0` (`echo $?`).

## Is `ForwardAgent` needed?

No, not for signing on your own machine.

- GPG signing talks to the local `gpg-agent`. SSH is not involved at all.
- SSH-key signing talks to your local `ssh-agent` or reads the key file. It does not need agent forwarding either.
- `ForwardAgent yes` only matters when you SSH into a **remote** machine and want that machine to use your local agent,
  for example to commit or push from the remote host with your local key.

If you do need it for a remote host, never enable it globally (`Host *`): anyone with root on the remote can use your
agent while you are connected. Scope it to the one host you trust:

```
Host my-dev-server
  HostName dev.example.com
  User me
  IdentityFile ~/.ssh/id_ed25519
  ForwardAgent yes
```

Do not put it on the `github.com` entry: pushing to GitHub does not need it.

## Signing with an SSH key

```sh
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
# needed by `git verify-commit`:
echo "you@example.com $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
```

Check with `git verify-commit HEAD` (`Good "git" signature for ...`). If the key has a passphrase, load it with
`ssh-add` first.

## Tested with

macOS 27.0.1 (arm64), git 2.56.0, lazygit 0.66.2, GnuPG 2.5.22, OpenSSH 10.5p1, each in a throwaway `HOME`, repository
and keyring:

- GPG, ed25519 key without passphrase, no `ssh-agent`, no `ForwardAgent` (`ssh -G github.com` shows
  `forwardagent no`): commit signed and `git verify-commit HEAD` returned `Good signature`.
- GPG, ed25519 key with passphrase, `pinentry-curses`, `git commit` without a terminal: failed with
  `Inappropriate ioctl for device` (the issue above). With a terminal attached and `GPG_TTY` set: commit signed and
  `git verify-commit HEAD` returned `Good signature`.
- SSH signing, ed25519 key, `allowedSignersFile` set, no agent forwarding: commit signed and verified.

I verified the failure and the fix at the `git commit` level, not by clicking through the lazygit UI itself, and I did
not run `pinentry-mac`.

## Related posts

- [How to work with multiple git accounts on a single machine?](./2022-10-10-how-to-work-with-multiple-git-accounts-on-a-single-machine.md)
- [How to configure conventional commit for your project?](./2022-12-31-how-to-configure-conventional-commit-for-your-project.md)
