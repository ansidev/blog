# Design: windows-ssh-herdr-post

## Boundary Commitments

This spec owns exactly one deliverable: a single tutorial post in `content/posts/` that documents the full path from a non-admin Windows machine to a herdr session on a remote macOS machine using free tools (Cloudflare Tunnel + portable client-side cloudflared proxy + portable PuTTY). It owns the accuracy of every command in that post, verified against the sources in `research.md`.

## Out of Boundary

- No changes to site config, theme, loaders, `.vitepress/`, or any existing post.
- No changes to herdr itself or herdr's documentation.
- No screenshots/images (commands are copy-pasteable; visuals excluded).
- No paid Cloudflare features as required steps; no admin-requiring Windows steps.
- No infrastructure setup on the author's own machines beyond what the post documents.

## Allowed Dependencies

- Existing post frontmatter/build pipeline (VitePress) — read-only consumption.
- External tools documented in `research.md`: cloudflared (CLI current as of 2026-11-18), PuTTY 0.85, macOS sshd.

## Revalidation Triggers

- A PuTTY major release or a cloudflared CLI change that alters the documented commands.
- A Cloudflare policy change to Spectrum/free-tier TCP handling or locally-managed tunnels.

## Requirements Traceability

| Requirement | Design element |
| --- | --- |
| 1 Prerequisites | Post section 0 (Prerequisites) |
| 2 Tool rationale | Post section 1 (Why these tools) incl. Spectrum limitation + proxy rationale |
| 3 macOS setup | Post sections 2 (Remote Login, cloudflared install/tunnel/service) |
| 4 Windows non-admin setup | Post section 3 (portable cloudflared.exe proxy + PuTTY config to localhost) |
| 5 Authentication | Post section 4 (password; PuTTYgen key → authorized_keys) |
| 6 herdr attach | Post section 5 (herdr start/attach, persistence) |
| 7 Optional hardening | Post section 6 (Cloudflare Access sidebar, PuTTY saved sessions) |
| 8 Troubleshooting | Post section 7 (tunnel down, host key, herdr session not found) |
| 9 Accuracy & integration | Verification workflow + frontmatter conventions below |

## Content Architecture

The post is organized as a linear, copy-pasteable walkthrough with a running example (domain `ssh.example.com`, macOS user `you`, local proxy port `2222`). One Mermaid-free mental model is stated in prose at the top of the post:

```
PuTTY (Windows) → 127.0.0.1:2222 → cloudflared access proxy (Windows, portable)
  → Cloudflare edge (free tier) → cloudflared tunnel service (macOS LaunchDaemon)
  → sshd (127.0.0.1:22) → herdr session
```

### Section plan

0. **Prerequisites** — the five prerequisites (Req 1), with the note that the Windows machine needs no admin rights anywhere in the guide.
1. **Why these tools** — comparison table + rationale (Req 2): Tailscale (commercial licensing cost), self-hosted VPS (running/maintenance cost), the Spectrum/free-TCP limitation stated explicitly, why the client-side proxy keeps constraints intact, and why PuTTY over portable OpenSSH/Windows Terminal (familiar GUI for Windows users, per-user registry saved sessions, portable zip includes puttygen).
2. **Remote macOS setup** — Remote Login via `sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist` (with the `systemsetup` Full-Disk-Access caveat as a note); `brew install cloudflared`; tunnel login/create/route-dns; `~/.cloudflared/config.yml` with `protocol: http2` pin and `ssh://localhost:22` ingress; `sudo cloudflared service install --config /Users/you/.cloudflared/config.yml` (explicit `--config` since the LaunchDaemon does not read the user config by default); verify with `cloudflared tunnel list` / `sudo launchctl print` hints.
3. **Windows setup (no admin)** — download `putty.zip` and the standalone `cloudflared.exe` (Windows amd64) from official sources into a user folder (e.g. `%USERPROFILE%\Tools`); run `cloudflared access ssh --hostname ssh.example.com --url 127.0.0.1:2222`; configure PuTTY session to `127.0.0.1`, port `2222`; save the session (per-user registry, works unprivileged).
4. **Authentication** — password path first; key path: PuTTYgen (Ed25519), save private key in the user folder, copy the OpenSSH public key line into `~/.ssh/authorized_keys` on macOS with correct permissions (`chmod 700 ~/.ssh`, `chmod 600 authorized_keys`), load key in PuTTY session.
5. **Attach to herdr** — SSH in, run herdr to start or attach to a session; explain persistence across disconnects and re-attach after reconnecting (restart proxy, reopen PuTTY session).
6. **Optional hardening** — Cloudflare Access on the hostname (sidebar noting Access certs don't import into PuTTY; recommend Access self-managed keys path or leave as optional protection layer), plus PuTTY saved-session best practices.
7. **Troubleshooting** — tunnel not reachable (`cloudflared tunnel list`, `launchctl` status, QUIC→http2 note), host key prompt explanation and safe handling, herdr session not found (list sessions / create one), `systemsetup` FDA error.

## File Structure Plan

| File | Status | Responsibility |
| --- | --- | --- |
| `content/posts/2026-11-18-ssh-from-non-admin-windows-to-macos-with-cloudflared-and-putty.md` | create | The tutorial post (single deliverable) |

No other files are created or modified.

## Frontmatter Contract

Follows existing post conventions (verified against `content/posts/2026-10-31-bulk-import-directories-into-zoxide-with-zx-import.md`):

```yaml
layout: doc
outline: deep
type: post
title: SSH from a non-admin Windows machine to macOS with cloudflared and PuTTY
date: <ISO 8601 with +07:00 offset>
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/ssh-from-non-admin-windows-to-macos-with-cloudflared-and-putty/
categories:
  - Tips and Tricks
  - SSH
tags:
  - SSH
  - PuTTY
  - cloudflared
  - Cloudflare Tunnel
  - herdr
```

## Testing Strategy

Derived from requirements' acceptance criteria (documentation deliverable — validation is accuracy + build):

1. **Req 1–8 structural check**: every section 0–7 exists in the post, in order, covering each requirement's acceptance criteria (prerequisites up front; explicit rejection reasons for Tailscale/self-hosting; Spectrum-limitation explanation; portable-only Windows steps with the localhost proxy; both auth paths; herdr attach/persistence; hardening; troubleshooting trio).
2. **No-admin audit**: scan the Windows-side commands — no installer (`msiexec`, `setup.exe`), no elevation (`runas`, UAC prompts), no system paths; only user-folder extraction and per-user registry (PuTTY saved sessions).
3. **Copy-paste audit**: every command block uses explicit placeholders (`ssh.example.com`, `<UUID>`, `2222`) consistent throughout; macOS commands are sudo-annotated only where needed.
4. **Accuracy check**: commands match `research.md` verified sources (cloudflared current CLI, PuTTY 0.85 zip contents, LaunchDaemon `--config`, `launchctl load -w` Remote Login path, http2 fallback).
5. **Build check**: `pnpm build` (site build) succeeds with the new post; frontmatter passes the loaders' validation.

## E2E Critical Flow

Reader journey: read prerequisites → understand tool choice → set up macOS tunnel (persistent) → set up portable Windows tooling → connect via PuTTY to localhost proxy → authenticate → attach to herdr session → disconnect and re-attach later → recover from common failures.
