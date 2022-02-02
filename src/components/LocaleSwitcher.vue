<template>
  <button
    :aria-label="t('button.toggle_locale')"
    type="button"
    class="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-2"
    @click="toggleLocale"
  >
    <Icon :icon="'bi:translate'" :width="size" :height="size" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { switchLocale } from '~/hooks'

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 16,
    },
  },
  setup() {
    const { t, availableLocales, locale } = useI18n()
    const toggleLocale = () => switchLocale(availableLocales, locale)

    return { t, toggleLocale }
  },
})
</script>
