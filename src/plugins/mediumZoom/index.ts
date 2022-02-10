import mediumZoom from 'medium-zoom'
import type { UserModule } from '~/types'
import siteConfig from '~/site.config'
import { mediumZoomSymbol } from './hooks'

const selector = siteConfig.plugins.mediumZoom?.selector
const zoomOptions = siteConfig.plugins.mediumZoom?.zoomOptions
const delay = siteConfig.plugins.mediumZoom?.delay

export const install: UserModule = ({ app, router }) => {
  if (!selector) return

  // create zoom instance and provide it
  const zoom = mediumZoom(zoomOptions)
  zoom.refresh = (sel = selector) => {
    zoom.detach()
    zoom.attach(sel)
  }
  app.provide(mediumZoomSymbol, zoom)

  router.afterEach(() => {
    setTimeout(() => zoom.refresh(), delay)
  })
}
