import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'vite-plugin-md'
import { VitePWA } from 'vite-plugin-pwa'
import { vueI18n } from '@intlify/vite-plugin-vue-i18n'
import Anchor from 'markdown-it-anchor'
import Prism from 'markdown-it-prism'
import { getPostMeta } from './src/helpers/post'
import siteConfig from './src/site.config'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(dirname(fileURLToPath(import.meta.url)), 'src')}/`,
      '~plugins/': `${resolve(dirname(fileURLToPath(import.meta.url)), 'plugins')}/`,
      '~configs/': `${resolve(dirname(fileURLToPath(import.meta.url)), 'configs')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
      extendRoute(route) {
        const postMeta = getPostMeta(route.component)
        return {
          ...route,
          meta: { ...postMeta },
        }
      },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      wrapperClasses: 'theme-ansidev-content',
      headEnabled: true,
      markdownItSetup(md) {
        md.use(Anchor)
        // https://prismjs.com/
        md.use(Prism)
      },
      wrapperComponent: 'Post',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [
        'src/components',
      ],

      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      dts: true,
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      manifest: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/vite-plugin-vue-i18n
    vueI18n({
      include: [resolve(dirname(fileURLToPath(import.meta.url)), 'locales/**')],
    }),
  ],
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
