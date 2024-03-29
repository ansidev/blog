<script lang="ts">
import { buildUrlQueryParams } from '../utils/buildUrlQueryParams'

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    /**
     * URL to share
     * { string }
     */
    url: String,
    /**
     * Share text
     * { string }
     */
    text: String,
    /**
     * Share options
     * { object }
     */
    // shareOptions: Object,
    /**
     * Social network
     * { string }
     */
    network: String,
    /**
     * Button size
     * { number }
     */
    buttonSize: Number,
    /**
     * Icon style
     * { number }
     */
    iconStyle: String,
    /**
     * Icon size
     * { Number }
     */
    iconSize: {
      type: Number,
      required: false,
      default: 32,
    },
    /**
     * Display mode
     * { string }
     */
    displayMode: {
      type: String,
      required: false,
      default: 'icon',
    },
  },

  setup(props) {
    const provider = computed(() => {
      switch (props.network) {
        case 'email':
          return {
            name: 'E-mail',
            shareBaseURL: 'mailto:',
            icon: 'bi:envelope-fill',
            params: { subject: props.text, body: props.url },
            allowedParams: ['subject', 'body'],
          }
        case 'facebook':
          return {
            name: 'Facebook',
            shareBaseURL: 'https://facebook.com/sharer/sharer.php',
            icon: 'bi:facebook',
            params: { u: props.url },
            allowedParams: ['u', 'display', 'redirect_uri'],
          }
        case 'linkedin':
          return {
            name: 'LinkedIn',
            shareBaseURL: 'https://www.linkedin.com/sharing/share-offsite',
            icon: 'bi:linkedin',
            params: { url: props.url },
            allowedParams: ['url'],
          }
        case 'pinterest':
          return {
            name: 'Pinterest',
            shareBaseURL: 'https://pinterest.com/pin/create/button',
            icon: 'bi:pinterest',
            params: { posttype: 'link', title: props.text, url: props.url },
            allowedParams: ['posttype', 'tags', 'title', 'content', 'caption', 'show-via', 'canonicalUrl'],
          }
        case 'reddit':
          return {
            name: 'Reddit',
            shareBaseURL: 'https://www.reddit.com/submit',
            icon: 'bi:reddit',
            params: { title: props.text, url: props.url },
            allowedParams: ['title', 'url'],
          }
        case 'telegram':
          return {
            name: 'Telegram',
            shareBaseURL: 'https://telegram.me/share/url',
            icon: 'bi:telegram',
            params: { text: props.text, url: props.url },
            allowedParams: ['text', 'url'],
          }
        // case 'tumblr':
        //   return {
        //     name: 'Tumblr',
        //     shareBaseURL: 'https://www.tumblr.com/widgets/share/tool',
        //     icon: 'bi:tumblr',
        //     params: { posttype: 'link', title: props.text, url: props.url },
        //     allowedParams: ['posttype', 'tags', 'title', 'content', 'caption', 'show-via', 'canonicalUrl'],
        //   }
        case 'twitter':
          return {
            name: 'Twitter',
            shareBaseURL: 'https://twitter.com/intent/tweet',
            icon: 'bi:twitter',
            params: { text: props.text, url: props.url },
            allowedParams: ['text', 'url', 'hashtag', 'via'],
          }
        // case 'vk':
        //   return {
        //     name: 'VK',
        //     shareBaseURL: 'https://vk.com/share.php',
        //     icon: 'vk-icon',
        //     params: { title: props.text, url: props.url },
        //     allowedParams: ['title', 'url'],
        //   }
        case 'whatsapp':
          return {
            name: 'WhatsApp',
            shareBaseURL: 'whatsapp://send',
            icon: 'bi:whatsapp',
            params: { text: props.url },
            allowedParams: ['text'],
          }
        default:
          return {}
      }
    })

    const networkName = computed(() => provider.value.name)
    const networkIcon = computed(() => provider.value.icon)

    const shareURL = computed(() => {
      const url = provider.value.shareBaseURL
      const urlQueryParams = buildUrlQueryParams(provider.value.params)
      return `${url}${urlQueryParams}`
    })

    return { provider, networkName, networkIcon, shareURL }
  },
})
</script>

<template>
  <a
    :href="shareURL"
    target="_blank"
    rel="noopener"
    :aria-label="networkName"
    style="padding-left: 0.25rem; padding-right: 0.25rem;"
  >
    <Icon
      v-if="['icon', 'both'].includes(displayMode)"
      :icon="networkIcon"
      :width="iconSize"
      :height="iconSize"
      class="fill-current text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
    />
    <template v-if="['text', 'both'].includes(displayMode)">&nbsp;{{ networkName }}</template>
  </a>
</template>
