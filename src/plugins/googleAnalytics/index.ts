import VueGtag from "vue-gtag"
import { UserModule } from '~/types'
import siteConfig from '~/site.config'

export const install: UserModule = ({ app }) => {
  const config = siteConfig.plugins?.googleAnalytics

  if (process.env.NODE_ENV === 'production' && typeof config === 'object') {
    app.use(VueGtag, { config })
  }
}
