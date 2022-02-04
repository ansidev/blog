<template>
  <router-link v-if="isInternalLink || isAnchorLink" :to="href" v-bind="$attrs">
    <slot />
  </router-link>
  <a v-else-if="disableRouterLink" target="_self" :href="href" v-bind="$attrs">
    <slot />
  </a>
  <a v-else target="_blank" rel="noopener noreferrer" :href="href" v-bind="$attrs">
    <slot />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    href: {
      type: String,
      required: true,
      default: '#',
    },
    disableRouterLink: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const isInternalLink = props.href && props.href.startsWith('/') && !props.disableRouterLink
    const isAnchorLink = props.href && props.href.startsWith('#')

    return { isInternalLink, isAnchorLink }
  },
})
</script>
