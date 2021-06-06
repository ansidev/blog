import 'windi.css'
import './assets/css/main.scss'
import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'pages-generated'
import { setupLayouts } from 'layouts-generated'


import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes },
  (ctx) => {
    // install all plugins under `plugins/`
    Object.values(import.meta.globEager('./plugins/*.ts')).map(p => p.install?.(ctx))
    Object.values(import.meta.globEager('./plugins/**/index.ts')).map(p => p.install?.(ctx))
  },
)
