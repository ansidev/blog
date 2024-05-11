<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { DisqusConfig } from '../types'
import siteConfig from '~/site.config'

defineProps({
  /**
   * Page URL
   * { string }
   */
  pageUrl: String,
  /**
   * Page identifier
   * { string }
   */
  pageIdentifier: String,
})

const pluginConfig = computed(() => siteConfig.plugins.disqus)

const initDisqusPlugin = (pluginConfig: DisqusConfig) => {
  const externalScript = document.createElement('script');
  externalScript.setAttribute('src', `https://${pluginConfig.shortname}.disqus.com/embed.js`);
  externalScript.setAttribute('data-timestamp', (+new Date()).toString());
  (document.head || document.body).appendChild(externalScript);
}

const isLoaded = ref(false)

const loadPlugin = async () => {
  isLoaded.value = false
  initDisqusPlugin(pluginConfig?.value?.vendorConfig as DisqusConfig);
  await nextTick()
  isLoaded.value = true
}

onMounted(async () => {
  const config = pluginConfig.value
  if (config?.autoload === true) {
    loadPlugin()
  }
})
</script>

<template>
  <div id="disqus_thread" :class="{ 'bg-white': isLoaded }" :style="{ padding: isLoaded ? '15px' : 'none' }"></div>
  <div class="pt-6 pb-6 text-center text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-500">
    <button v-if="!isLoaded" type="button" @click="loadPlugin">
      Load comments
    </button>
  </div>
</template>
