import mediumZoom from 'medium-zoom'
import { mediumZoomSymbol } from './hooks'
import type { MediumZoomPluginConfig } from './types'
import type { UserModule } from '~/types'
import siteConfig from '~/site.config'

const selector = (siteConfig.plugins.mediumZoom as MediumZoomPluginConfig)?.selector
const zoomOptions = (siteConfig.plugins.mediumZoom as MediumZoomPluginConfig)?.zoomOptions
const delay = (siteConfig.plugins.mediumZoom as MediumZoomPluginConfig)?.delay

export const install: UserModule = ({ app, router, isClient }) => {
  if (!isClient || !selector)
    return

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
