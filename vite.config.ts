import { defineConfig, loadEnv } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import { VitePluginFonts } from 'vite-plugin-fonts'
import Markdown from 'vite-plugin-md'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from 'markdown-it-shiki'
import generateSitemap from 'vite-ssg-sitemap'
import { getPostMeta } from './src/helpers/post'
import siteConfig from './src/site.config'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
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
          // https://prismjs.com/
          md.use(Shiki, {
            theme: {
              light: 'min-light',
              dark: 'min-dark',
            },
          })
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
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
        registerType: 'autoUpdate',
        includeAssets: [
          'sitemap.xml',
          'robots.txt',
          'feed.rss',
          'favicon.ico',
          'safari-pinned-tab.svg'
        ],
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
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                },
              }
            }
          ]
        }
      }),

      // https://github.com/intlify/vite-plugin-vue-i18n
      VueI18n({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), 'locales/**')],
      }),

      // https://github.com/stafyniaksacha/vite-plugin-fonts
      VitePluginFonts({
        google: {
          families: [{
            name: 'IBM Plex Mono',
            styles: 'ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700',
            defer: true,
          }],
        },
      }),
    ],
    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      onFinished() {
        generateSitemap({
          hostname: env.VITE_BASE_URL
        })
      },
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
  }
})
