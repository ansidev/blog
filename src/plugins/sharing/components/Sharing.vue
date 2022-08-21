<script lang="ts">
import { computed, defineComponent } from 'vue'
import { config as pluginConfig } from '../index'
import SharingButton from './SharingButton.vue'

const defaultConfigs = {
  networks: [
    'email',
    'facebook',
    'twitter',
    'telegram',
    'reddit',
    'linkedin',
    'whatsapp',
    'pinterest',
    'tumblr',
    'vk',
  ],
  buttonSize: 18,
  iconSize: 20,
  iconStyle: 'solid',
  displayMode: 'both',
}

export default defineComponent({
  components: {
    SharingButton,
  },
  props: {
    /**
     * URL to share
     * { string }
     */
    url: {
      type: String,
      required: true,
    },
    /**
     * Share text
     * { string }
     */
    text: {
      type: String,
      required: true,
    },
    /**
     * Share options
     * { object }
     */
    // shareOptions: Object,
  },

  setup() {
    const hasPluginConfig = computed(() => typeof pluginConfig === 'object')

    const networks = computed(() => hasPluginConfig.value && Array.isArray(pluginConfig.networks) ? pluginConfig.networks : defaultConfigs.networks)
    const buttonSize = computed(() => hasPluginConfig.value && Number.isInteger(pluginConfig.buttonSize) && pluginConfig.buttonSize > 0 ? pluginConfig.buttonSize : defaultConfigs.buttonSize)
    const iconSize = computed(() => hasPluginConfig.value && Number.isInteger(pluginConfig.iconSize) && pluginConfig.iconSize > 0 ? pluginConfig.iconSize : defaultConfigs.iconSize)
    const iconStyle = computed(() => hasPluginConfig.value && typeof pluginConfig.iconStyle === 'string' ? pluginConfig.iconStyle : defaultConfigs.iconStyle)
    const displayMode = computed(() => hasPluginConfig.value && typeof pluginConfig.displayMode === 'string' ? pluginConfig.displayMode : defaultConfigs.displayMode)

    return { networks, buttonSize, iconSize, iconStyle, displayMode }
  },
})
</script>

<template>
  <template v-for="network in networks" :key="network">
    <SharingButton
      :url="url"
      :text="text"
      :network="network"
      :button-size="buttonSize"
      :icon-size="iconSize"
      :icon-style="iconStyle"
      :display-mode="displayMode"
    />
  </template>
</template>
