<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onUnmounted, ref } from 'vue'
import type { MarkdownItHeader } from '@mdit-vue/types'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  /**
   * Table of contents
   *
   * @type { MarkdownItHeader[] }
   */
  toc: {
    type: Array as PropType<MarkdownItHeader[]>,
    default: () => [],
  },
})
const hasHeadings = computed(() => props.toc.length > 0)

const { t } = useI18n()

const tocCssClass = ref('')
const tocAnchor = ref(null)
const tocContent = ref(null)
const handleScroll = () => {
  const e: HTMLElement = tocContent?.value
  const offsetTop = tocAnchor?.value?.offsetTop - 24

  if (window.scrollY > offsetTop) {
    e.classList.add('fixed')
    e.style.top = '1.5rem'
  }
  else {
    e.classList.remove('fixed')
    e.style.top = ''
  }
}

window.addEventListener('scroll', handleScroll)

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Ported from Nextra Docs Theme with customizations -->
  <div class="site-toc order-last hidden w-64 flex-shrink-0 px-4 text-sm xl:block">
    <div ref="tocAnchor" class="h-0 m-0 p-0" />
    <div
      ref="tocContent"
      class="max-h-[calc(100vh-4rem-env(safe-area-inset-bottom))] overflow-y-auto"
      :class="tocCssClass"
    >
      <ul v-if="hasHeadings">
        <p class="mb-4 font-semibold tracking-tight">
          {{ t('table_of_contents') }}
        </p>
        <TocItem v-for="heading in toc" :key="heading.slug" v-bind="heading" />
      </ul>
    </div>
  </div>
</template>
