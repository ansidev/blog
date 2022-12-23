import { createI18n } from 'vue-i18n'
import type { UserModule } from '~/types'

// import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(11, -5), value.default]),
)

export const install: UserModule = ({ app }) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages,
  })

  app.use(i18n)
}
