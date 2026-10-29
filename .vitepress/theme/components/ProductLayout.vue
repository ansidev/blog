<script setup lang="ts">
import AnsidevTheme from '@ansidev-oss/vitepress-theme-ansidev'
import { useData } from 'vitepress'
import { computed } from 'vue'

const ThemeLayout = AnsidevTheme.Layout
const { frontmatter } = useData()
// Pages under /products/<name> can replace the site title in the nav bar via `navTitle` front matter.
const navTitle = computed(() => frontmatter.value.navTitle as string | undefined)
</script>

<template>
  <div :class="{ 'has-nav-title': navTitle }" :style="navTitle ? { '--nav-title': JSON.stringify(navTitle) } : undefined">
    <ThemeLayout />
  </div>
</template>

<style>
.has-nav-title .VPNavBarTitle .title > span {
  font-size: 0;
}
.has-nav-title .VPNavBarTitle .title > span::after {
  content: var(--nav-title);
  font-size: 16px;
  font-weight: 600;
}
</style>
