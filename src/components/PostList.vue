<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps({
  posts: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const { t } = useI18n()
</script>

<template>
  <ul v-if="Array.isArray(posts) && posts.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
    <li v-for="post of posts" :key="post.slug" class="py-4">
      <PostItem :post="post" />
    </li>
  </ul>
  <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700 pt-4">
    {{ t('no_post') }}
  </ul>
</template>
