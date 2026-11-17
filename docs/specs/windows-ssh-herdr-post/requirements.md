# Requirements: windows-ssh-herdr-post

## Project Description

A reader on a locked-down corporate Windows machine (no administrator rights) wants to reconnect to a herdr session running on their own remote macOS machine (where they have sudo access). Today's common solutions fail their constraints: Tailscale is not free for commercial use, and self-hosted tunneling on a VPS costs money and maintenance time. This project delivers a single blog post that teaches the full workflow using free tools only — Cloudflare Tunnel (`cloudflared`) on the macOS side and portable PuTTY on the Windows side — from zero (prerequisites) through attaching to the herdr session, including tool-decision rationale, key-based authentication, optional hardening, and troubleshooting.

## Requirements

### 1. Prerequisites section

The blog post shall begin with a prerequisites section that lists, before any setup step: a Cloudflare account with a domain added to Cloudflare (free plan sufficient), a remote macOS machine with sudo access and Remote Login (SSH) enabled, a Windows machine without administrator rights, herdr already installed on the macOS machine, and basic SSH familiarity.

**Acceptance Criteria**
- When the reader reaches the first setup instruction, the blog post shall have already listed all five prerequisites above.

### 2. Problem statement and tool-decision rationale

The blog post shall explain why each tool was chosen, not only how to install it: why Tailscale was rejected (commercial licensing cost), why self-hosted tunneling options were rejected (running and maintenance costs), why cloudflared + PuTTY was chosen (free tier, no admin rights needed on Windows), and why PuTTY was chosen over portable OpenSSH/Windows Terminal alternatives. Because Cloudflare's free-tier edge cannot proxy raw TCP (port 22) directly to SSH clients (that is a paid Spectrum feature), the post shall also explain why a small client-side `cloudflared access` proxy is required on Windows and why this still satisfies the constraints (portable single exe, no installer, no admin rights).

**Acceptance Criteria**
- When the reader reads the tool-selection section, the blog post shall state an explicit reason for rejecting Tailscale and for rejecting self-hosted tunneling.
- When the reader reads the tool-selection section, the blog post shall state an explicit reason for choosing cloudflared and for choosing PuTTY over portable OpenSSH/Windows Terminal.
- When the reader reads the tool-selection section, the blog post shall explain why direct PuTTY-to-tunnel-hostname connections do not work on the free plan and why the client-side proxy is needed.
- The blog post shall not recommend any paid plan as a required step.

### 3. Remote macOS setup instructions

The blog post shall provide complete, copy-pasteable commands for the macOS side that: enable Remote Login (SSH), install cloudflared, create a Cloudflare Tunnel pointing at local SSH (port 22), and run the tunnel as a service that survives reboots.

**Acceptance Criteria**
- When the reader follows the macOS setup steps on a macOS machine with sudo access, the blog post shall present commands that can be copied and executed without edits other than values the post explicitly marks as placeholders (e.g., tunnel name, domain).
- When the reader completes the macOS setup steps, the blog post shall have covered: Remote Login enabled, cloudflared installed, tunnel created and routed to the domain, and tunnel running as a persistent service.
- While presenting macOS tunnel configuration, the blog post shall address the known gotchas: passing the config file path explicitly to the service install (the LaunchDaemon does not read `~/.cloudflared/config.yml` by default) and falling back to the http2 protocol when QUIC/UDP is blocked by restrictive NAT.
- If a macOS step requires an interactive Cloudflare browser login, then the blog post shall state what the reader should expect to see and do.

### 4. Windows non-admin setup instructions

The blog post shall provide Windows-side setup instructions that work without administrator rights, using only portable (non-installer) artifacts: standalone `putty.exe`/`puttygen.exe` and a standalone `cloudflared.exe`. The post shall configure a local `cloudflared access ssh` proxy (localhost port, e.g. 127.0.0.1:2222) that forwards to the tunnel hostname, and a PuTTY session targeting that localhost port.

**Acceptance Criteria**
- When the reader follows the Windows setup steps on a machine without admin rights, the blog post shall not instruct any step that requires an installer, elevated prompt, or system-wide configuration.
- When the reader completes the Windows setup steps, the blog post shall have produced: a running local cloudflared access proxy on a localhost port, and a configured PuTTY session targeting that localhost port.
- When the reader restarts or reconnects later, the blog post shall explain how to re-start the local proxy (manually or via a saved PuTTY/proxy workflow).

### 5. Authentication instructions

The blog post shall cover both password authentication and key-based authentication, including generating a key pair with PuTTYgen and adding the public key to `~/.ssh/authorized_keys` on the macOS machine.

**Acceptance Criteria**
- When the reader reaches the connection step, the blog post shall describe both password and key-based authentication options.
- When the reader follows the key-based path, the blog post shall present the steps to generate a key in PuTTYgen, save it without admin rights, and add the public key to `~/.ssh/authorized_keys` on the macOS machine.

### 6. Attach to a herdr session over SSH

The blog post shall show how to start or join a herdr session on the macOS machine over the SSH connection and explain that sessions persist across disconnects, so the reader can detach and re-attach later.

**Acceptance Criteria**
- When the reader completes the SSH connection, the blog post shall show the commands to start or attach to a herdr session.
- When the reader disconnects and reconnects later, the blog post shall explain that the herdr session state persists and how to re-attach to the existing session.

### 7. Optional hardening

The blog post shall include an optional hardening section covering Cloudflare Access protection for the tunnel and saving the connection settings as a PuTTY saved session for reuse.

**Acceptance Criteria**
- Where the reader wants extra protection, the blog post shall describe enabling Cloudflare Access for the tunnel hostname as an optional (not required) step.
- When the reader wants to reuse connection settings, the blog post shall describe creating a PuTTY saved session.

### 8. Troubleshooting section

The blog post shall include a troubleshooting section addressing at least: tunnel not running/connected, SSH host key prompts on first connect, and herdr session not found on attach.

**Acceptance Criteria**
- If the tunnel is not reachable, then the blog post shall provide diagnostic commands and expected outputs to identify the cause.
- If the reader sees an unexpected SSH host key prompt, then the blog post shall explain what it is and how to proceed safely.
- If herdr reports a missing session, then the blog post shall explain how to list sessions and create one if none exists.

### 9. Content accuracy and site integration

The blog post shall use current, free-tier-accurate Cloudflare Tunnel steps (verified against official documentation at time of writing) and shall be added as a valid post in this blog's content pipeline, following existing post frontmatter and permalink conventions so it builds successfully.

**Acceptance Criteria**
- While writing the Cloudflare Tunnel steps, the blog post author shall verify the commands against current official Cloudflare documentation and note any version-sensitive behavior.
- When the post is added to the repository, the site build shall succeed with the new post included (correct frontmatter, permalink, categories, and tags per existing post conventions).

## Boundary Notes

- **In scope**: one new Markdown post in `content/posts/` (+ optional images under the existing uploads directory).
- **Out of scope**: changes to site config, theme, loaders, other posts, or herdr itself; any step requiring Windows admin rights or a paid Cloudflare plan.
- **Adjacent expectations**: the macOS machine already has herdr installed (per prerequisites); the blog's VitePress build pipeline stays untouched.
