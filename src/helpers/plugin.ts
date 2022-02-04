import siteConfig from '~/site.config'

export const getPluginConfigs: () => Record<string, boolean | object> = () => siteConfig.plugins

export const isPluginEnabled = (pluginId: string) => {
  const pluginConfigs = getPluginConfigs()
  const pluginConfig = pluginConfigs[pluginId]

  return typeof pluginConfig === 'object' || pluginConfig === true
}

export interface SiteConfig {
  baseURL: string
  plugins: object
}
