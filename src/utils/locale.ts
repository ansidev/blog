import { Locale } from 'vue-i18n'
import { WritableComputedRef } from 'vue'

export const switchLocale = (availableLocales: string[], locale: WritableComputedRef<Locale>) => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
