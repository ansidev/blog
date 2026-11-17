# Research Log: windows-ssh-herdr-post

## Summary

Web research (2026-11-18) verified the current state of Cloudflare Tunnel SSH access, portable PuTTY on Windows, macOS Remote Login CLI, and known gotchas. One critical finding reshaped the design: **direct PuTTY → tunnel hostname on port 22 does not work on Cloudflare's free plan**. The approved design adds a portable client-side `cloudflared access` proxy on Windows; PuTTY connects to a localhost port instead.

## Research Log

### Cloudflare Tunnel SSH reachability (critical)

- **Finding**: Cloudflare's edge proxies only HTTP(S) on proxied hostnames. Raw TCP (SSH, port 22) on a public hostname is a **Spectrum** feature (paid, Enterprise add-on). Official SSH docs list four client methods — client-side `cloudflared access ssh`, Access for Infrastructure (WARP/One client), self-managed keys (still needs WARP on-ramp), and browser-rendered terminal — none allow a vanilla SSH client with zero client software.
- **Implication**: The issue's original premise (PuTTY directly to `ssh.example.com:22`) is not achievable free. Approved fix: run standalone `cloudflared.exe` on Windows as a local proxy (`cloudflared access ssh --hostname ssh.example.com --url 127.0.0.1:2222`); PuTTY connects to `127.0.0.1:2222`. Still free, still admin-free, still PuTTY.
- **Sources**: developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/; community.cloudflare.com/t/is-port-22-blocked-by-cloudflare-by-default/361981

### macOS cloudflared commands (verified current)

- `brew install cloudflared`, `cloudflared tunnel login`, `cloudflared tunnel create <name>`, `cloudflared tunnel route dns <name> ssh.example.com` — all unchanged.
- Locally-managed config: `~/.cloudflared/config.yml` with `tunnel: <UUID>`, `credentials-file`, ingress `hostname: ssh.example.com` → `service: ssh://localhost:22`, catch-all `service: http_status:404`.
- Persistence: `sudo cloudflared service install` creates a root LaunchDaemon; **it does not read `~/.cloudflared/config.yml` by default** — pass `--config /Users/<you>/.cloudflared/config.yml` explicitly.
- Note: Cloudflare now positions locally-managed tunnels as legacy/testing (dashboard-managed preferred), but local management still works and is CLI-scriptable — right fit for a copy-paste tutorial.
- **Sources**: developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/

### QUIC/NAT gotcha

- cloudflared defaults to QUIC (UDP 7844); some NATs block it. cloudflared auto-falls back to `http2`, but pinning `protocol: http2` in config.yml is the reliable recipe for the post.

### Portable PuTTY on Windows (verified)

- Latest: **PuTTY 0.85** (2026-08-16). `putty.zip` from chiark.greenend.org.uk contains standalone putty.exe, puttygen.exe, pscp, psftp, plink, pageant — extract anywhere user-writable, no installer, no admin. Per-user registry settings work for standard users (saved sessions).
- Download only from chiark.greenend.org.uk (mirrors can be tampered).
- **Source**: chiark.greenend.org.uk/~sgtatham/putty/latest.html

### Client-side cloudflared.exe (design decision)

- Standalone `cloudflared.exe` Windows binary runs per-user without installation or admin — same pageant-style portability as PuTTY. This is the one extra artifact the approved approach adds on Windows.
- Cloudflare Access short-lived SSH certs do not import cleanly into PuTTY/Pageant; the post will use plain user/key auth through the proxy, not Access-issued certs.

### macOS Remote Login via CLI

- `sudo systemsetup -setremotelogin on` fails since Catalina unless the calling terminal has Full Disk Access ("setremotelogin: ... requires Full Disk Access"). `sudo systemsetup -f -setremotelogin on` forces past some prompts.
- Reliable alternative: `sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist`.
- authorized_keys: `~/.ssh/authorized_keys` with `chmod 700 ~/.ssh`, `chmod 600 authorized_keys` (macOS sshd enforces user ownership).
- **Sources**: discussions.apple.com/thread/250721721-equivalent (Apple Discussions); Der Flounder PPPC writeup

### Rejected alternatives

- Tailscale: not free for commercial use (also needs admin to install the adapter on Windows).
- Self-hosted VPS relay: running/maintenance cost.
- Cloudflare browser SSH terminal: zero client install but not PuTTY, not a terminal workflow.

## Architecture / Approach Evaluation

- Chosen approach: cloudflared tunnel (macOS, locally-managed) + client-side `cloudflared access` proxy + portable PuTTY on Windows. Single responsibility seam: one tutorial deliverable, one file.
- Risk: Cloudflare may deprecate locally-managed tunnels — mitigated by noting dashboard-managed setup as an alternative sidebar.
- Revalidation triggers: PuTTY major release, cloudflared CLI changes, Cloudflare policy changes on Spectrum/free TCP.

## Synthesis Outcomes

- Build-vs-adopt: no code to build; deliverable is documentation verified against official sources above.
- Simplification: one post, no images required (commands are copy-pasteable); optional screenshots excluded from scope.
