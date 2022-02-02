<template>
  <router-link v-if="isInternalLink || isAnchorLink" :to="href" v-bind="$attrs">
    <slot />
  </router-link>
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
  },
  setup(props) {
    const isInternalLink = props.href && props.href.startsWith('/')
    const isAnchorLink = props.href && props.href.startsWith('#')

    return { isInternalLink, isAnchorLink }
  },
})
</script>
