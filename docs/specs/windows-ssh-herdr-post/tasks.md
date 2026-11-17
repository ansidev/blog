# Tasks: windows-ssh-herdr-post

_Boundary: the post file `content/posts/2026-11-18-ssh-from-non-admin-windows-to-macos-with-cloudflared-and-putty.md` — all content tasks edit only this file. No `(P)` markers: all tasks share the same file._

- [ ] 1.1 Create the post skeleton with frontmatter per the design's Frontmatter Contract
  - File: `content/posts/2026-11-18-ssh-from-non-admin-windows-to-macos-with-cloudflared-and-putty.md`, with `layout: doc`, `outline: deep`, `type: post`, title, date (+07:00), author/gravatar/twitter, permalink `/tips-and-tricks/ssh-from-non-admin-windows-to-macos-with-cloudflared-and-putty/`, categories (`Tips and Tricks`, `SSH`), tags (`SSH`, `PuTTY`, `cloudflared`, `Cloudflare Tunnel`, `herdr`), plus the mental-model diagram (prose/ASCII flow) at the top.
  - Done when: the file exists with valid frontmatter matching existing post conventions and all section headings (0–7) stubbed in order.
  - _Covers requirements: 9_

- [ ] 1.2 Write section 0 (Prerequisites) and section 1 (Why these tools)
  - Prerequisites lists all five items up front (Req 1). Section 1 gives explicit rejection reasons for Tailscale (commercial licensing cost) and self-hosted tunneling (running/maintenance cost), explains the Spectrum/free-TCP limitation and why a client-side `cloudflared access` proxy is required, why cloudflared + PuTTY was chosen, and why PuTTY over portable OpenSSH/Windows Terminal.
  - Done when: a reader can state, after reading section 1, why each tool was picked or rejected and no paid plan is presented as required.
  - _Covers requirements: 1, 2_

- [ ] 1.3 Write section 2 (Remote macOS setup)
  - Remote Login via `sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist` with the inline note about the `systemsetup` Full-Disk-Access trap (plus `sudo systemsetup -f -setremotelogin on` alternative); `brew install cloudflared`; `tunnel login`/`create`/`route dns`; `~/.cloudflared/config.yml` with `protocol: http2`, `ssh://localhost:22` ingress and catch-all; `sudo cloudflared service install --config /Users/<you>/.cloudflared/config.yml` with the explanation that the LaunchDaemon does not read the user config by default; verification commands (`cloudflared tunnel list`, service status).
  - Done when: every macOS command is copy-pasteable with clearly marked placeholders and both documented gotchas (`--config`, http2) are addressed inline.
  - _Covers requirements: 3_

- [ ] 1.4 Write section 3 (Windows setup without admin rights)
  - Download `putty.zip` (putty.exe, puttygen.exe) from chiark.greenend.org.uk and the standalone `cloudflared.exe` (Windows amd64) from the official Cloudflare releases page into a user folder; run `cloudflared access ssh --hostname ssh.example.com --url 127.0.0.1:2222`; configure a PuTTY session to `127.0.0.1` port `2222` and save it (per-user registry works unprivileged).
  - Done when: no step requires an installer, elevated prompt, or system-wide config, and the section ends with a saved PuTTY session targeting the localhost proxy.
  - _Covers requirements: 4_

- [ ] 1.5 Write section 4 (Authentication)
  - Password path; key path with PuTTYgen (Ed25519), saving the private key in the user folder, adding the public key line to `~/.ssh/authorized_keys` on macOS, and `chmod 700 ~/.ssh` / `chmod 600 authorized_keys`; loading the key in the PuTTY session.
  - Done when: both auth options are documented and the key path ends with a successful key-based login through the proxy.
  - _Covers requirements: 5_

- [ ] 1.6 Write section 5 (Attach to a herdr session)
  - Commands to start or attach to a herdr session over the SSH session; explanation that sessions persist across disconnects; explicit re-connection flow naming both steps: restart the local cloudflared proxy, then reopen the saved PuTTY session and re-attach.
  - Done when: the re-attach flow appears in observable step form and covers the Req 4 re-start-proxy criterion as well as Req 6 persistence.
  - _Covers requirements: 4, 6_

- [ ] 1.7 Write sections 6–7 (Optional hardening and Troubleshooting)
  - Section 6: Cloudflare Access on the hostname as an optional step (sidebar noting Access short-lived certs don't import into PuTTY/Pageant) and PuTTY saved-session best practices. Section 7: tunnel not reachable (`cloudflared tunnel list`, LaunchDaemon status, QUIC→http2), first-connect host key prompt explanation and safe handling, herdr session not found (list/create sessions), and the `systemsetup` FDA error.
  - Done when: all four troubleshooting scenarios have diagnostic commands and expected outcomes, and hardening steps are clearly marked optional.
  - _Covers requirements: 7, 8_

- [ ] 1.8 Audit pass over the completed post
  - _Depends: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  - No-admin audit (no installers/elevation/system paths on the Windows side), copy-paste audit (consistent placeholders: `ssh.example.com`, `<UUID>`, `2222` used throughout), accuracy check of every command against `docs/specs/windows-ssh-herdr-post/research.md` sources, and structural check that sections 0–7 cover every acceptance criterion in requirements 1–8.
  - Done when: the audit findings are fixed in the post file and a re-scan finds no violations.
  - _Covers requirements: 2, 3, 4, 9_

- [ ] 1.9 Build verification
  - _Depends: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  - Run the site build (`pnpm build`) with the post included; fix any frontmatter/loader errors.
  - Done when: the build succeeds and the new post renders at its permalink.
  - _Covers requirements: 9_
