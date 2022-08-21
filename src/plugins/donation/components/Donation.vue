<script setup lang="ts">
import { computed } from 'vue'
import { supportedDonationPlatforms } from '..'
import type { CustomDonationConfig } from '../types'
import siteConfig from '~/site.config'

const pluginConfig = computed(() => siteConfig.plugins.donation)
const computedDonationConfig = computed(() => {
  const cfg = pluginConfig.value
  const donationConfig: { [key: string]: CustomDonationConfig } = {}

  for (const donationPlatform: string in cfg) {
    if (donationPlatform === 'custom') {
      continue
    }
    const donationId: string = cfg[donationPlatform]
    donationConfig[donationPlatform] = {
      ...supportedDonationPlatforms[donationPlatform],
      donationId,
    }
  }
  return {
    ...donationConfig,
    ...pluginConfig.value?.custom,
  }
})
</script>

<template>
  <template v-for="(donationConfig, donationPlatform) in computedDonationConfig" :key="donationConfig?.name">
    <DonationButton v-bind="donationConfig" :donation-platform="donationPlatform" />
  </template>
</template>
