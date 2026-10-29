<script setup lang="ts">
import AnsidevTheme from '@ansidev-oss/vitepress-theme-ansidev'
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, watch } from 'vue'

const ThemeLayout = AnsidevTheme.Layout
const { frontmatter } = useData()
const route = useRoute()
// Pages under /products/<name> can replace the site title in the nav bar via `navTitle` front matter.
const navTitle = computed(() => frontmatter.value.navTitle as string | undefined)
// ...and the nav bar logo via `navLogo` front matter.
const navLogo = computed(() => frontmatter.value.navLogo as string | undefined)
// ...and the favicon via `navFavicon` front matter (a folder holding favicon.ico and apple-touch-icon.png).
// transformHtml covers the built HTML; this keeps the tab icon right on every route, in dev and during client-side navigation.
const navFavicon = computed(() => frontmatter.value.navFavicon as string | undefined)
const SITE_ICON = '/favicon.ico'
const upsertLink = (rel: string, href: string | undefined, extra: Record<string, string> = {}) => {
  const links = [...document.head.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`)]
  const [first, ...rest] = links
  for (const el of rest) el.remove()
  if (!href) return first?.remove()
  // One stable element, updated in place: browsers re-read the tab icon when its href changes.
  const el = first ?? document.head.appendChild(Object.assign(document.createElement('link'), { rel }))
  for (const name of ['type', 'sizes']) el.removeAttribute(name)
  for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v)
  if (el.getAttribute('href') !== href) el.setAttribute('href', href)
}
const syncIcons = () => {
  const dir = navFavicon.value
  const wantedIcon = dir ? `${dir}/favicon.ico` : SITE_ICON
  const wantedTouch = dir ? `${dir}/apple-touch-icon.png` : undefined
  const icons = document.head.querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
  const touch = document.head.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"]')
  const iconOk = icons.length === 1 && icons[0].getAttribute('href')?.split('?')[0] === wantedIcon
  const touchOk = wantedTouch ? touch.length === 1 && touch[0].getAttribute('href') === wantedTouch : touch.length === 0
  if (!iconOk) upsertLink('icon', `${wantedIcon}?v=${Date.now()}`, { type: 'image/x-icon' })
  if (!touchOk) upsertLink('apple-touch-icon', wantedTouch)
}
onMounted(() => {
  syncIcons()
  // post flush + a frame: VitePress rewrites <head> on navigation, so re-check after it has finished.
  watch(navFavicon, () => requestAnimationFrame(syncIcons), { flush: 'post' })
  watch(
    () => route.path,
    () => requestAnimationFrame(() => requestAnimationFrame(syncIcons)),
    { flush: 'post' },
  )
})
const navVars = computed(() => ({
  ...(navTitle.value ? { '--nav-title': JSON.stringify(navTitle.value) } : {}),
  ...(navLogo.value ? { '--nav-logo': `url(${JSON.stringify(navLogo.value)})` } : {}),
}))
</script>

<template>
  <div :class="{ 'has-nav-title': navTitle, 'has-nav-logo': navLogo }" :style="navVars">
    <ThemeLayout />
  </div>
</template>

<style>
.has-nav-title .VPNavBarTitle .title > span {
  font-size: 0;
  line-height: 0;
  display: flex;
  align-items: center;
}
.has-nav-title .VPNavBarTitle .title > span::after {
  content: var(--nav-title);
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}
.has-nav-logo .VPNavBarTitle img.logo {
  content: var(--nav-logo);
  border-radius: 6px;
}
</style>
