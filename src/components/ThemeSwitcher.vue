<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { isDark, toggleDark } from '~/hooks'

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
    const { t } = useI18n()

    return { t, isDark, toggleDark }
  },
})
</script>

<template>
  <button
    :aria-label="t('button.toggle_dark')"
    type="button"
    class="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-2"
    @click="toggleDark()"
  >
    <Icon :icon="isDark ? 'bi:moon-fill' : 'bi:sun-fill'" :width="size" :height="size" />
  </button>
</template>
