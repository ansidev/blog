import siteConfig from '~/site.config'
import type { SitePlugins } from '~/types'

export const getPluginConfigs: () => SitePlugins = () => siteConfig.plugins

export const isPluginEnabled = (pluginId: string) => {
  const pluginConfigs = getPluginConfigs()
  const pluginConfig = pluginConfigs[pluginId]

  return typeof pluginConfig === 'object' || pluginConfig === true
}
