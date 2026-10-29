<script setup lang="ts">
import AnsidevTheme from '@ansidev-oss/vitepress-theme-ansidev'
import { useData } from 'vitepress'
import { computed } from 'vue'

const ThemeLayout = AnsidevTheme.Layout
const { frontmatter } = useData()
// Pages under /products/<name> can replace the site title in the nav bar via `navTitle` front matter.
const navTitle = computed(() => frontmatter.value.navTitle as string | undefined)
// ...and the nav bar logo via `navLogo` front matter.
const navLogo = computed(() => frontmatter.value.navLogo as string | undefined)
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
