import CounterAnalytics from 'counter-analytics-vue'
import type { UserModule } from '~/types'
import siteConfig from '~/site.config'

export const install: UserModule = ({ app, isClient }) => {
  const config = siteConfig.plugins?.counterAnalytics

  if (process.env.NODE_ENV === 'production' && isClient) {
    app.use(CounterAnalytics, config)
  }
}
