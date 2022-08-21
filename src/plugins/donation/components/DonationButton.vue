<script setup lang="ts">import { computed } from 'vue';

// Workaround because Vue 3 doesn't support
interface CustomDonationConfig {
  donationPlatform: string
  donationBaseUrl: string
  donationId: string
  donationButtonImage: string
  donationButtonStyle?: Record<string, string>
}

const props = defineProps<CustomDonationConfig>()

const donationUrl = computed(() => `${props.donationBaseUrl}${props.donationBaseUrl.endsWith('/') ? '' : '/'}${props.donationId}`)
</script>

<template>
  <a :href="donationUrl" target="_blank"><img :src="donationButtonImage" :alt="donationPlatform" :style="donationButtonStyle"></a>
</template>
