---
layout: doc
outline: deep
type: post
title: What I Learned Fixing Stale Production CSS
date: 2026-11-13T12:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/what-i-learned-fixing-stale-production-css/
categories:
  - CI/CD
  - DevOps
  - Tips and Tricks
tags:
  - CSS
  - VitePress
  - PurgeCSS
  - Cloudflare
  - CDN
---

A production CSS regression turned out to have two causes: PurgeCSS removed valid listing styles, then Cloudflare kept serving the old stylesheet after the first fix. The incident was a reminder to inspect the final build output and follow the request through the same domain and CDN that readers use.

<!-- more -->

## The styles disappeared in the production build

A change to the category, tag, and archive pages made their listing links look like chips. It worked in local development, but the production pages lost the padding, font size, and minimum height that gave those links their intended size.

The first diagnosis was in the build pipeline. VitePress development does not run the site's PurgeCSS step. A production build does: after Vite emits the CSS, `buildEnd` runs PurgeCSS against the generated HTML and JavaScript. That meant the local page and the deployed page did not exercise the same CSS path.

The missing rules used selectors such as `[href^='/categories/']`. PurgeCSS extracts tokens from the content it scans, but the generated URL prefix is not present as a literal token. PurgeCSS could not match those attribute values, so it removed all six category, tag, and archive rules, including their small-screen variants.

The first fix declared `href` as a dynamic attribute in PurgeCSS. This keeps selectors that depend on generated `href` values while leaving the rest of the purge in place:

```ts
const result = await new PurgeCSS().purge({
  content: [join(siteConfig.outDir, '**/*.html'), join(siteConfig.outDir, 'assets/**/*.js')],
  css: [cssPath],
  dynamicAttributes: ['href'],
  safelist: {
    standard: [/^vp-/, /^VP/, /medium-zoom/, /donation/, /sharing/, /^carbon/],
    greedy: [/data-v-/, /dark/],
  },
})
```

This runs in the existing `buildEnd` loop for each emitted CSS file. With `href` treated as dynamic, the production build retains the listing rules and still removes other unused CSS.

## The custom domain still served the old file

After that fix deployed, `ansidev.netlify.app` served the corrected CSS. `ansidev.xyz` still showed the old styles. The two hostnames went through different paths: Cloudflare proxies the custom domain in front of Netlify, and it had cached the old stylesheet.

The cached file was named `theme.BA-VsRnq.css` and had `cache-control: max-age=31536000, immutable`. Vite had chosen that name by hashing the CSS before the `buildEnd` hook ran. PurgeCSS changed the CSS bytes afterward, while the URL stayed the same. Cloudflare therefore treated the corrected file as the same immutable asset and returned the earlier bytes for that URL.

The follow-up fix runs after PurgeCSS. When the final CSS differs from Vite's original asset, the build computes a SHA-256 digest from the post-purge content, renames the file with an eight-character digest, and rewrites references in generated HTML and JavaScript. The new URL identifies the bytes that the build actually publishes. Any cached copy at the old URL can remain in a CDN, but the generated pages no longer request it.

The build first collects the generated HTML and JavaScript files that can refer to CSS assets:

```ts
const collectReferrers = (dir: string): string[] => {
  const found: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...collectReferrers(path))
    else if (entry.name.endsWith('.html') || entry.name.endsWith('.js')) found.push(path)
  }
  return found
}
const referrers = collectReferrers(siteConfig.outDir)
```

Inside the CSS loop, `originalCss` is read before the PurgeCSS call shown above. Immediately afterward, the build writes the result and renames changed files:

```ts
const css = result[0]?.css
if (!css) continue
writeFileSync(cssPath, css)
if (css === originalCss) continue

const hash = createHash('sha256').update(css).digest('hex').slice(0, 8)
const dot = file.lastIndexOf('.')
const renamed = `${file.slice(0, dot)}.${hash}${file.slice(dot)}`
if (renamed === file) continue
renameSync(cssPath, join(assetsDir, renamed))

for (const referrer of referrers) {
  const text = readFileSync(referrer, 'utf8')
  if (text.includes(file)) writeFileSync(referrer, text.replaceAll(file, renamed))
}
```

Here `file` is the original CSS filename, `cssPath` points to it in `assetsDir`, and `result` is the PurgeCSS output. The implementation imports `createHash` from `node:crypto`, the file operations from `node:fs`, and `join` from `node:path`. It appends the final-content digest to Vite's original filename, so a change made by PurgeCSS produces a different URL even if Vite's original hash stays the same.

## Checks that would have caught both stages

A few checks now belong in the routine for changes that touch built assets:

1. Build the production site and inspect the emitted CSS. Confirm the expected selector and declarations survived any purge or minification step. A development preview alone does not cover production-only transforms.
2. When a plugin or hook changes an emitted asset, compute its content hash after the final transformation. If that transformation changes the bytes, update the filename and every generated reference to match.
3. Check the generated HTML for the stylesheet URL, then fetch that URL and inspect its contents. Confirm that no page still references a previous filename after the rename.
4. Verify through the public hostname as well as the hosting provider's domain. Compare the HTML and CSS responses, and inspect CDN headers such as `cf-cache-status`, `age`, and `cache-control`. A successful origin deployment does not show what an intermediary cache is returning.
5. Check the affected category, tag, and archive routes through that same public path. For this incident, the HTML on `ansidev.xyz` was dynamic and revalidated, so after it referenced the new CSS filename the stale immutable object was no longer in use. Purging that old object was optional cleanup.

The first failure was a production-only CSS purge. The second was a CDN serving old bytes at an unchanged URL. Looking at both the final build artifacts and the actual custom-domain responses made the two causes visible.