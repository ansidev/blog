# Brief: windows-ssh-herdr-post

## Problem
Users on locked-down corporate Windows machines (no administrator rights) cannot connect to their own remote macOS machines to resume herdr sessions outside office hours, because typical solutions (VPN mesh like Tailscale, self-hosted tunnels on a VPS) are either not free for commercial use or incur running/maintenance costs. There is no documented, fully free, no-admin workflow for this in the blog.

## Current State
The blog (`content/posts/`) has several macOS/CLI-oriented tips posts but nothing covering remote SSH access from a non-admin Windows machine, Cloudflare Tunnel for SSH, or attaching to a herdr session over SSH.

## Desired Outcome
A single blog post that walks a reader from zero to attaching to a running herdr session on a remote macOS machine from a non-admin Windows machine, using Cloudflare Tunnel (cloudflared) on the macOS side and portable PuTTY on the Windows side — all free-tier, all copy-pasteable commands, nothing requiring Windows admin rights.

## Approach
Write one tutorial post in `content/posts/` following the issue outline:
0. Prerequisites (Cloudflare account + domain on free plan; macOS with sudo + Remote Login; non-admin Windows; herdr installed; basic SSH familiarity).
1. Problem statement & tool-rationale comparison: why Tailscale rejected (commercial licensing cost), why self-hosted tunneling rejected (running/maintenance costs), why cloudflared + PuTTY chosen (free tier, no Windows admin rights, built-in TCP tunneling); also why PuTTY over portable OpenSSH/Windows Terminal.
2. macOS side: enable Remote Login; install & configure cloudflared tunnel pointing at local SSH (port 22); run as a service.
3. Windows side: portable PuTTY (no install/admin), configure session to tunnel hostname on port 22.
4. Auth: password and key-based (PuTTYgen → `~/.ssh/authorized_keys`).
5. Attach to a herdr session over SSH; sessions persist across disconnects.
6. Optional hardening: Cloudflare Access, PuTTY saved sessions.
7. Troubleshooting: tunnel not up, host key prompts, herdr session not found.

## Scope
- **In**: one new Markdown post in `content/posts/` with correct frontmatter (layout, type, title, date, author, permalink, categories, tags), complete commands for both machines, tool-decision rationale, troubleshooting section.
- **Out**: changes to site config, theme, loaders, or any other posts; changes to herdr itself; posts about other tunneling products; setting up the author's own infrastructure.

## Boundary Candidates
- The post itself (single deliverable, one file + optional images).
- Research subtask: verifying current (2026) Cloudflare Tunnel free-tier CLI steps (`cloudflared tunnel` commands, service install on macOS) — done during writing, not a separate deliverable.

## Out of Boundary
- No herdr product documentation changes.
- No CI/build pipeline changes beyond what `pnpm build` already covers.
- Not covering Windows SSH servers, admin-requiring installers, or paid Cloudflare plans.

## Upstream / Downstream
- **Upstream**: herdr must already be installed on the macOS machine (assumed per issue prerequisites); VitePress content pipeline (frontmatter conventions from existing posts).
- **Downstream**: potential follow-up posts (e.g., Cloudflare Access deep-dive) can link back to this one.

## Existing Spec Touchpoints
- **Extends**: none (first spec in this repo).
- **Adjacent**: none.

## Constraints
- Free-tier Cloudflare only; no admin rights on the Windows side (portable installs only: PuTTY .zip/standalone binaries + PuTTYgen).
- Steps must be accurate and current for cloudflared as of writing (verify via web research).
- Match existing post frontmatter/style conventions (see `content/posts/2026-10-31-bulk-import-directories-into-zoxide-with-zx-import.md`).
