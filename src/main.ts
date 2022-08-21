import { ViteSSG } from 'vite-ssg'
import { Icon } from '@iconify/vue'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import generatedRoutes from '~pages'

import './tailwind.css'
import './assets/css/main.scss'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => {
    ctx.app.component('Icon', Icon)
    // install all plugins under `plugins/`
    Object.values(import.meta.globEager('./plugins/*.ts')).map(p => p.install?.(ctx))
    Object.values(import.meta.globEager('./plugins/**/index.ts')).map(p => p.install?.(ctx))
  },
)
