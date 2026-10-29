<script setup lang="ts">
import AnsidevTheme from '@ansidev-oss/vitepress-theme-ansidev'
import { useData } from 'vitepress'
import { computed, onMounted, watch } from 'vue'

const ThemeLayout = AnsidevTheme.Layout
const { frontmatter } = useData()
// Pages under /products/<name> can replace the site title in the nav bar via `navTitle` front matter.
const navTitle = computed(() => frontmatter.value.navTitle as string | undefined)
// ...and the nav bar logo via `navLogo` front matter.
const navLogo = computed(() => frontmatter.value.navLogo as string | undefined)
// ...and the favicon via `navFavicon` front matter (a folder holding favicon.ico/.svg, favicon-32.png, apple-touch-icon.png).
// transformHtml covers the first page load; this keeps the tab icon in sync during client-side navigation.
const navFavicon = computed(() => frontmatter.value.navFavicon as string | undefined)
const DEFAULT_ICON = '/favicon.ico'
const setIcons = (dir?: string) => {
  const links: Record<string, string>[] = dir
    ? [
        { rel: 'icon', href: `${dir}/favicon.ico`, sizes: '48x48' },
        { rel: 'icon', href: `${dir}/favicon.svg`, type: 'image/svg+xml' },
        { rel: 'icon', href: `${dir}/favicon-32.png`, type: 'image/png', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: `${dir}/apple-touch-icon.png` },
      ]
    : // A fresh query string makes browsers re-fetch instead of keeping the previous page's cached tab icon.
      [{ rel: 'icon', href: `${DEFAULT_ICON}?v=${Date.now()}` }]
  for (const el of document.head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')) el.remove()
  for (const attrs of links) {
    const el = document.createElement('link')
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
}
onMounted(() => {
  let current: string | undefined = navFavicon.value
  // Dev server and any unprocessed HTML: apply the page's icons on first load too.
  if (current) setIcons(current)
  watch(navFavicon, (dir) => {
    if (dir === current) return
    current = dir
    setIcons(dir)
  })
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
