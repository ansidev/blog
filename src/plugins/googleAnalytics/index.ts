import VueGtag from 'vue-gtag'
import type { UserModule } from '~/types'
import siteConfig from '~/site.config'

export const install: UserModule = ({ app }) => {
  const config = siteConfig.plugins?.googleAnalytics

  if (process.env.NODE_ENV === 'production') {
    app.use(VueGtag, { config })
  }
}
