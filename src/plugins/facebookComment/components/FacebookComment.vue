<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { FacebookCommentConfig } from '../types'
import siteConfig from '~/site.config'

defineProps({
  /**
   * Post URL
   * { string }
   */
  postUrl: String,
  /**
   * Width of comment container
   * { number, string }
   */
  width: [Number, String],

  /**
   * { Number of posts to display }
   */
  numberOfPosts: Number,
})

const pluginConfig = computed(() => siteConfig.plugins.facebookComment)

const initFacebookCommentPlugin = (pluginConfig: FacebookCommentConfig) => {
  if (typeof window !== 'undefined' && typeof window.FB !== 'undefined') {
    window.FB.init({
      appId: pluginConfig.appId,
      status: true,
      xfbml: true,
      version: pluginConfig.version,
    })
  }
  const externalScript = document.createElement('script')
  externalScript.setAttribute('async', '')
  externalScript.setAttribute('defer', '')
  externalScript.setAttribute('crossorigin', 'anonymous')
  externalScript.setAttribute('src', `https://connect.facebook.net/${pluginConfig.lang}/sdk.js#xfbml=1&version=${pluginConfig.version}&appId=${pluginConfig.appId}`)
  externalScript.setAttribute('nonce', pluginConfig.nonce)
  document.head.appendChild(externalScript)
}

const isLoaded = ref(false)

const loadPlugin = async () => {
  isLoaded.value = false
  initFacebookCommentPlugin(pluginConfig.value.vendorConfig)
  await nextTick()
  isLoaded.value = true
}

onMounted(async () => {
  const config = pluginConfig.value
  if (config.autoload === true) {
    loadPlugin()
  }
})
</script>

<template>
  <div id="fb-root" />
  <div class="pt-6 pb-6 text-center text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-500">
    <button v-if="!isLoaded" type="button" @click="loadPlugin">
      Load comments
    </button>
    <div v-show="isLoaded" class="fb-comments" :data-href="postUrl" :data-width="width" :data-numposts="numberOfPosts" />
  </div>
</template>
