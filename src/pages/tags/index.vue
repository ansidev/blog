<script setup lang="ts">
import { usePost } from '~/hooks'

const { t } = useI18n()

const routes = usePost('/posts')

const tags = computed(() => {
  const tagCount: Record<string, number> = {}
  routes
    .map(r => r.meta)
    .filter(m => m.type === 'post')
    .forEach((m) => {
      if (Array.isArray(m.tags) && m.tags.length > 0) {
        m.tags.forEach((tag) => {
          const formattedTag = kebabCase(tag)
          if (formattedTag in tagCount)
            tagCount[formattedTag] += 1
          else
            tagCount[formattedTag] = 1
        })
      }
    })
  return tagCount
})

const sortedTags = computed(() => Object.keys(tags.value).sort((a, b) => tags.value[b] - tags.value[a]))
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ t('tags') }}
      </h1>
    </div>
    <div class="flex flex-wrap pt-4">
      <div v-if="Object.keys(tags).length === 0" class="mt-2 mb-2 mr-5">
        {{ t('no_tag') }}
      </div>
      <div v-for="tag in sortedTags" :key="tag" class="mt-2 mb-2 mr-2 px-2 py-1 border border-gray-500 rounded-sm">
        <Tag :text="tag" />
        <Link
          class="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
          :href="`/tags/${kebabCase(tag)}`"
        >
          {{ ` (${tags[tag]})` }}
        </Link>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
