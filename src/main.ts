import { ViteSSG } from 'vite-ssg'
import { Icon } from '@iconify/vue'
import { setupLayouts } from 'virtual:generated-layouts'
import type { UserModule } from './types'
import App from './App.vue'
import generatedRoutes from '~pages'

import './assets/css/main.css'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => {
    ctx.app.component('Icon', Icon)
    // install all plugins under `plugins/`
    Object.values(import.meta.glob<{ install: UserModule }>('./plugins/*.ts', { eager: true })).map(p => p.install?.(ctx))
    Object.values(import.meta.glob<{ install: UserModule }>('./plugins/**/index.ts', { eager: true })).map(p => p.install?.(ctx))
  },
)
