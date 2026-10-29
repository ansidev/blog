import AnsidevTheme from '@ansidev-oss/vitepress-theme-ansidev'
import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import { onMounted, watchEffect } from 'vue'
import '@ansidev-oss/vitepress-theme-ansidev/styles.css'
import './custom.css'
import ProductLayout from './components/ProductLayout.vue'
import ResumeCliLanding from './components/ResumeCliLanding.vue'

export default {
  extends: AnsidevTheme,
  Layout: ProductLayout,
  enhanceApp({ app }) {
    app.component('ResumeCliLanding', ResumeCliLanding)
  },
  setup() {
    const { frontmatter, lang } = useData()
    // VitePress resets <html lang> to the site-level lang on mount, which wipes the
    // per-page `lang` set at build time. Registered after VitePress's own onMounted,
    // so this runs last and re-applies the page's front matter lang.
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = (frontmatter.value.lang as string | undefined) || lang.value
      })
    })
  },
} satisfies Theme
