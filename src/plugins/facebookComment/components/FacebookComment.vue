<template>
  <div v-show="isLoaded" class="fb-comments" :data-href="postURL" :data-width="width" :data-numposts="numberOfPosts" />
</template>

<script setup lang="ts">
import { defineProps, onMounted, nextTick, ref } from 'vue'
import { config as pluginConfig } from '../index'

interface FacebookCommentPluginConfig {
  version: string
  appId: string
  nonce: string
  lang: string
}

const initFacebookCommentPlugin = (pluginConfig: FacebookCommentPluginConfig) => {
  if (window.FB) {
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

const props = defineProps({
  /**
   * Post URL
   * { string }
   */
  postURL: String,
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

const isLoaded = ref(false)

onMounted(async() => {
  initFacebookCommentPlugin(pluginConfig)
  await nextTick()
  isLoaded.value = true
})
</script>
