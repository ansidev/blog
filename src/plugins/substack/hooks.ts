import { computed } from 'vue'
import type { SiteConfig } from '~/types'

export const useSubstackNewsletterConfig = (siteConfig: SiteConfig) => {
  const substackNewsletterConfig = computed(() => siteConfig.plugins?.substack)

  const isSubstackNewsletterPluginEnabled = computed(() => typeof substackNewsletterConfig.value === 'object')

  return { isSubstackNewsletterPluginEnabled, substackNewsletterConfig }
}
