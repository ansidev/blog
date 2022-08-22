import Swetrix from 'swetrix-vue/dist'
import type { UserModule } from '~/types'
import siteConfig from '~/site.config'

export const install: UserModule = ({ app }) => {
  const config = siteConfig.plugins?.swetrix

  if (process.env.NODE_ENV === 'production') {
    app.use(Swetrix, config)
  }
}
