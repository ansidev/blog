---
layout: doc
outline: deep
type: post
title: Aligning Renovate with pnpm's minimumReleaseAge supply-chain policy
date: 2026-11-01T12:30:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/align-renovate-with-pnpm-minimum-release-age/
categories:
  - CI/CD
  - Tips and Tricks
tags:
  - renovate
  - pnpm
  - supply chain
  - CI
---

Make Renovate wait 24 hours after a package is published before opening an update PR, so its lockfile entries stop violating pnpm 12's `minimumReleaseAge` policy.

<!-- more -->

## Problem

pnpm 12 introduced a supply-chain protection: the `minimumReleaseAge` setting refuses to install packages published less than 24 hours ago. The idea is simple — if a package turns out to be malicious, it usually gets flagged quickly, so waiting a day before trusting a fresh release shrinks the exposure window.

The trouble is that [Renovate](https://docs.renovatebot.com/) doesn't know about that policy. It opens a dependency update PR the moment a new version hits the registry. pnpm then rejects the lockfile entry with:

```
ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION
```

So every brand-new dependency PR fails CI, sits red for up to 24 hours, and only turns green once the package ages past the threshold. That's exactly what happened in PR #619 on my theme repo.

## Fix

Renovate has a matching [`minimumReleaseAge`](https://docs.renovatebot.com/configuration-options/#minimumreleaseage) option (a general availability feature as of Renovate 40.x). One line in `renovate.json` makes Renovate hold back any update until the release is at least that old:

```json
{
  "minimumReleaseAge": "1 day"
}
```

With this in place, Renovate only opens a PR once the package is old enough for pnpm to accept it, so CI passes on the first run. The two policies stay in lockstep, and nobody stares at a red checkmark for a day.

## Notes

- If you use a different window in `package.json` (e.g. `"minimumReleaseAge": "1440"` minutes), keep the Renovate value equal to or greater than it.
- `minimumReleaseAge` also pairs nicely with Renovate's `stabilityDays`-style concepts from older versions — prefer the new option name if you're on Renovate 40+.
- This only helps for registry packages. Git dependencies and inline patches aren't covered by either policy.

## References

- [vitepress-theme-ansidev PR #620 — ci(renovate): enforce minimumReleaseAge to match pnpm supply-chain policy](https://github.com/ansidev/vitepress-theme-ansidev/pull/620)
- [pnpm settings — minimumReleaseAge](https://pnpm.io/settings#minimumreleaseage)
- [Renovate docs — minimumReleaseAge](https://docs.renovatebot.com/configuration-options/#minimumreleaseage)
