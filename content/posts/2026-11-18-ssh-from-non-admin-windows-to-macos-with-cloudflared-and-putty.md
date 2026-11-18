---
layout: doc
outline: deep
type: post
title: SSH from a non-admin Windows machine to a remote Mac with cloudflared and PuTTY
date: 2026-11-18T09:00:00+07:00
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
---

How to reach a herdr session on your home Mac from a locked-down corporate Windows machine — no administrator rights required on the Windows side, and no monthly bills.

<!-- more -->

## 0. Prerequisites

Before starting, make sure you have:

- A [Cloudflare](https://www.cloudflare.com/) account with **a domain added to Cloudflare** — the free plan is enough.
- A remote macOS machine where you have **sudo access** and can enable **Remote Login (SSH)**.
- A Windows machine where you **do not have administrator rights** — everything on the Windows side in this guide is portable and runs from your user folder.
- **herdr** already installed on the macOS machine.
- Basic familiarity with SSH (you know what a hostname, a port, and a key pair are).

Throughout the guide, replace these placeholders with your own values:

| Placeholder | Meaning |
| --- | --- |
| `ssh.example.com` | The hostname you will route to your Mac through Cloudflare |
| `you` | Your macOS username |
| `2222` | The local port the Windows-side proxy listens on |

## 1. Why these tools (and not the obvious alternatives)

The constraints are unusual, and they eliminate the usual suspects:

- **Tailscale** — rejected. It's only free for personal use; using it to reach a machine you work on commercially means a paid plan per user. (It also needs admin rights to install its network adapter on Windows, which fails the second constraint.)
- **Self-hosted tunneling on a VPS** — rejected. A reverse-SSH or WireGuard relay on a cheap VPS works, but it's a monthly bill plus a service you now maintain, patch, and pay for even when you don't use it.
- **Cloudflare Tunnel (cloudflared)** — chosen. The free plan includes tunnels with unlimited traffic, and the tunnel is an *outbound* connection from your Mac, so no router ports are opened.
- **PuTTY** — chosen on the Windows side, because it is a single standalone executable that runs without installation or admin rights, with per-user saved sessions.

### The catch: why a client-side proxy is needed

Here is the part most tutorials gloss over. A Cloudflare Tunnel *can* forward SSH (`service: ssh://localhost:22`), but Cloudflare's free-tier edge only proxies **HTTP(S)** traffic on public hostnames. Forwarding arbitrary raw TCP — which is what a plain SSH client speaking to port 22 would need — is a **Spectrum** feature, sold as an Enterprise add-on. So connecting PuTTY directly to `ssh.example.com:22` will *not* work on the free plan, no matter how you configure the tunnel.

The supported free fix is small: run `cloudflared` on the **client side too**, as a tiny local proxy (`cloudflared access ssh`). It is a single portable `cloudflared.exe` — no installer, no admin rights — that listens on a localhost port and relays into the tunnel. PuTTY then talks to `127.0.0.1:2222` like any local SSH server. The full path:

```
PuTTY (Windows)
  → 127.0.0.1:2222
  → cloudflared access proxy (Windows, portable exe)
  → Cloudflare edge (free tier)
  → cloudflared tunnel service (macOS LaunchDaemon)
  → sshd (127.0.0.1:22)
  → herdr session
```

### Why PuTTY and not the built-in stuff

Windows 10/11 ships OpenSSH client (`ssh.exe`), which you could pair with a `ProxyCommand` to cloudflared. On a locked-down machine PuTTY is still the more practical choice:

- **Portable** — `putty.exe` and `puttygen.exe` are standalone binaries; nothing registers system-wide.
- **Saved sessions** — connection settings live in per-user registry, which standard (non-admin) users can write; you don't need to maintain a `.ssh/config` and argue about `ProxyCommand` quoting.
- **PuTTYgen** — a GUI for key generation that's friendlier than `ssh-keygen` if you don't live in a terminal.

If you're comfortable with `ssh.exe` and config files, the same tunnel works fine with it — see the `ProxyCommand` variant in step 3.4 below; the macOS side is identical.

## 2. Remote macOS setup

All commands in this section run on the **Mac**.

### 2.1 Enable Remote Login (SSH)

The GUI way is System Settings → General → Sharing → Remote Login. To do it from the terminal:

```sh
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist
```

> You may have seen `sudo systemsetup -setremotelogin on` recommended elsewhere. Since macOS Catalina it usually fails with *"setremotelogin: Turning Remote Login on or off requires Full Disk Access privileges"* unless the terminal app itself has Full Disk Access. The `launchctl` command above sidesteps that gate entirely. If you prefer `systemsetup`, `sudo systemsetup -f -setremotelogin on` forces past the interactive prompt on some setups.

Verify sshd is listening:

```sh
sudo launchctl list | grep ssh
nc -vz localhost 22
```

### 2.2 Install cloudflared

```sh
brew install cloudflared
```

### 2.3 Authenticate and create the tunnel

```sh
cloudflared tunnel login
```

This opens a browser to pick the domain in your Cloudflare account and stores a certificate at `~/.cloudflared/cert.pem`.

```sh
cloudflared tunnel create mac-ssh
```

Note the tunnel UUID it prints (it also writes `~/.cloudflared/<UUID>.json`). Then route a hostname to it — this creates a **proxied** (orange-cloud) CNAME, which is required for tunnel traffic:

```sh
cloudflared tunnel route dns mac-ssh ssh.example.com
```

### 2.4 Configure the tunnel

Create `~/.cloudflared/config.yml` (this is a *locally-managed* tunnel — the config lives on disk, not in the dashboard):

```yaml
tunnel: <UUID>
credentials-file: /Users/you/.cloudflared/<UUID>.json
protocol: http2
ingress:
  - hostname: ssh.example.com
    service: ssh://localhost:22
  - service: http_status:404
```

Two things worth calling out:

- `protocol: http2` — cloudflared defaults to QUIC (UDP 7844), which some corporate/home NATs and firewalls block. cloudflared normally falls back to http2 by itself, but pinning it removes a whole class of "tunnel randomly flaps" problems.
- `credentials-file` must be an **absolute path** — the service runs as root and won't resolve `~`.

Test it in the foreground first:

```sh
cloudflared tunnel run mac-ssh
```

Leave it running and check that the tunnel shows healthy in the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/) under Networks → Tunnels. Once it works, stop it with `Ctrl+C` and install it as a service.

### 2.5 Run the tunnel as a service

```sh
sudo cloudflared service install --config /Users/you/.cloudflared/config.yml
```

The `--config` flag matters: the macOS LaunchDaemon (`/Library/LaunchDaemons/com.cloudflare.cloudflared.plist`) does **not** read `~/.cloudflared/config.yml` on its own, so without this flag the service starts but has no ingress rules and the hostname never resolves to SSH.

Verify:

```sh
sudo launchctl print system/com.cloudflare.cloudflared | head -20
cloudflared tunnel list
```

## 3. Windows setup (no admin rights)

All commands in this section run on the **Windows** machine, entirely from your user folder.

### 3.1 Get the portable tools

1. Download `putty.zip` (64-bit x86) from the official site — [chiark.greenend.org.uk/~sgtatham/putty/latest.html](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html). It contains standalone `putty.exe`, `puttygen.exe`, `pageant.exe`, and friends. Download only from that site; third-party mirrors have distributed tampered binaries in the past.
2. Download the standalone `cloudflared` Windows binary (`cloudflared-windows-amd64.exe`) from the [official releases page](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) and rename it to `cloudflared.exe`.

Put everything in a folder you can write to, for example `%USERPROFILE%\Tools`:

```powershell
mkdir "$env:USERPROFILE\Tools" -Force
# extract putty.zip into it, drop cloudflared.exe into it
cd "$env:USERPROFILE\Tools"
```

No installer runs, nothing is written outside your user profile, and nothing needs elevation.

### 3.2 Start the local proxy

```powershell
.\cloudflared.exe access ssh --hostname ssh.example.com --url 127.0.0.1:2222
```

Leave this window open while you work — it relays `127.0.0.1:2222` into the tunnel. A reconnect log line like `Connected to ... ssh.example.com` means the path to your Mac is live.

### 3.3 Configure PuTTY

Open `putty.exe` and create a session:

- **Host Name**: `127.0.0.1`
- **Port**: `2222`
- **Connection type**: SSH

Under **Connection → Data**, set **Auto-login username** to your macOS username (`you`). Go back to **Session**, name it (e.g. `mac-herdr`), and click **Save** — PuTTY stores saved sessions in per-user registry, which standard users can write to. Next time, just double-click the saved session.

### 3.4 Alternative: built-in OpenSSH with `ProxyCommand`

If you'd rather skip PuTTY entirely, Windows' bundled OpenSSH client can drive cloudflared directly through a `ProxyCommand` — same portable `cloudflared.exe`, no admin rights, no manual proxy window to keep open.

Create `%USERPROFILE%\.ssh\config` (create the `.ssh` folder first if it doesn't exist) with:

```ssh-config
Host mac-herdr
    HostName ssh.example.com
    User you
    Port 22
    IdentityFile ~/.ssh/mac-key
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 3
    ProxyCommand %USERPROFILE%\Tools\cloudflared.exe access ssh --hostname %h --stdio
```

Two things to know about this config:

- `%h` in the `ProxyCommand` expands to the `HostName` — so keep the hostname on the `HostName` line, not `Host`, or the alias (`mac-herdr`) would leak into cloudflared.
- `ProxyCommand` runs through `cmd.exe`, which expands `%USERPROFILE%`; some ssh builds handle quoting oddly, so if the path has spaces, use the short (`%USERPROFILE%\PROGRA~1\...`) form or move the binary somewhere space-free like `%USERPROFILE%\Tools`.
- `IdentityFile` + `IdentitiesOnly yes` pin the connection to exactly `mac-key` instead of trying every key in `%USERPROFILE%\.ssh\` first. Without it, corporate machines with several keys often burn through them and trip the server's `MaxAuthTries` — you'll see `Too many authentication failures` before the right key is ever offered.
- `ServerAliveInterval 30` + `ServerAliveCountMax 3` keep the connection from silently rotting: ssh sends a keepalive every 30 s and gives up after 3 misses (~90 s), instead of hanging on a dead TCP session until you type and nothing happens. This matters more than usual over a tunnel — intermediate Cloudflare edges and NAT devices drop idle connections aggressively. Note that the client-side keepalives travel over the tunnel, so they also keep the cloudflared relay path warm; if the connection does drop anyway, herdr's session survives on the Mac (section 5) and you simply reconnect.

Then connect — the proxy starts and stops with the connection automatically:

```powershell
ssh mac-herdr
```

For keys, use `ssh-keygen` (bundled with OpenSSH) instead of PuTTYgen:

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\mac-key"
type "$env:USERPROFILE\.ssh\mac-key.pub"
```

and paste that line into `~/.ssh/authorized_keys` on the Mac exactly as shown in section 4, option B. With this setup there's no `.ppk` conversion and no Pageant — `ssh.exe` picks up the key from `%USERPROFILE%\.ssh\` by itself.

The re-attach ritual from section 5 shrinks to a single command: `ssh mac-herdr`, then `herdr session attach work`.

## 4. Authentication

### Option A: password

Open the saved PuTTY session, log in with your macOS password. Done — but typing a password every time gets old, and it's the weaker option. Prefer keys.

### Option B: key-based (recommended)

On **Windows**, open `puttygen.exe`:

1. Choose **Ed25519**, click **Generate**, and wiggle the mouse.
2. Save the **private key** to your user folder (e.g. `%USERPROFILE%\Tools\mac-key.ppk`). A passphrase is optional; with one, consider running `pageant.exe` so you don't retype it.
3. Copy the **public key** line shown at the top (the OpenSSH-format `ssh-ed25519 AAAA...` one) — "Save public key" writes a slightly different format; the on-screen text is what you want.

On the **Mac**, add it to `~/.ssh/authorized_keys`:

```sh
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA... comment" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

The permissions are not cosmetic: macOS `sshd` refuses keys when `~/.ssh` or `authorized_keys` are group/world-writable or owned by anyone but you.

Back in PuTTY, under **Connection → SSH → Auth → Credentials**, browse to `mac-key.ppk`, and **Save** the session again. Connect — you should land on a shell without typing anything.

## 5. Attach to a herdr session

Once you have a shell on the Mac, everything herdr-related is just... herdr.

To start (or attach to) a named persistent session:

```sh
herdr --session work
```

The session runs under herdr's server on the Mac, not inside your SSH connection — so when the tunnel hiccups or you close PuTTY, the session keeps running. To see what sessions exist and attach to one:

```sh
herdr session list
herdr session attach work
```

### The re-attach ritual (next morning, from the office)

1. On Windows, start the proxy again:
   ```powershell
   .\cloudflared.exe access ssh --hostname ssh.example.com --url 127.0.0.1:2222
   ```
2. Open the saved PuTTY session `mac-herdr`.
3. Attach back:
   ```sh
   herdr session attach work
   ```

Everything — panes, agents, scrollback — is where you left it.

## 6. Optional hardening

- **Cloudflare Access on the hostname** — in the Zero Trust dashboard you can put an Access policy in front of `ssh.example.com`, so unauthenticated connections never even reach the tunnel. Note the trade-off for this setup: Access's short-lived SSH certificates don't import cleanly into PuTTY/Pageant, so PuTTY clients work best with Access in "service token" or service-auth mode, or with the browser-rendered terminal instead. Treat this as an optional extra layer on top of your SSH keys, not a replacement for them.
- **PuTTY saved sessions** — covered in step 3.3; keep one session per Mac (or per user) rather than editing Default Settings, so a bad experiment never breaks your daily session.

## 7. Troubleshooting

**Tunnel is up but PuTTY can't connect.** On the Mac, check the tunnel is actually registered and the service is healthy:

```sh
cloudflared tunnel list
sudo launchctl print system/com.cloudflare.cloudflared | head -20
```

If the tunnel shows but connections die instantly, the service is probably running *without* your config — reinstall it with `--config` (see step 2.5). If the tunnel itself flaps, you're likely behind a NAT that blocks QUIC; make sure `protocol: http2` is in the config. Also confirm the DNS record is **proxied** (orange cloud) — a DNS-only record doesn't route tunnel traffic.

**Unexpected host key prompt on first connect.** PuTTY will say the server's host key is not cached and ask you to trust it. This is normal for a first connection — it's your Mac's sshd introducing itself, coming through the tunnel exactly once per key. Verify the fingerprint on the Mac with `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` and accept if it matches. If the prompt *reappears* on every connection after you've accepted once, your Mac was reinstalled or sshd's keys were regenerated — investigate before clicking "yes".

**herdr says the session doesn't exist.** List what's actually there:

```sh
herdr session list
```

If the list is empty, the session was stopped (e.g. the Mac rebooted) — start it again with `herdr --session work`. If you get a server-not-running error, start herdr on the Mac first; over SSH the first `herdr` invocation boots the server for you.

**`setremotelogin: ... requires Full Disk Access`.** You tried `sudo systemsetup -setremotelogin on`. Use `sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist` instead (step 2.1), or enable Remote Login in System Settings → Sharing.
