<template>
  <router-link :to="link" class="mr-2 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
    {{ computedText }}
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { kebabCase } from '~/helpers'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const computedText = computed(() => props.text.replace(/\s/, '-'))
    const slug = computed(() => kebabCase(props.text))
    const link = computed(() => `/projects?tech=${slug.value}`)

    return { computedText, slug, link }
  },
})
</script>
