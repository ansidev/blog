<script setup lang="ts">
import siteConfig from '~/site.config'

const { t } = useI18n()
const siteTitle = ref(siteConfig.title)
const siteDescription = ref(siteConfig.description)

const router = useRouter()
const routes = router.getRoutes().filter(route => route.name !== undefined && route.path.startsWith('/posts'))

const posts = computed(() => routes
  .map(r => r.meta)
  .filter(m => m.type === 'post')
  .sort((p1, p2) => Date.parse(p2.date as string) - Date.parse(p1.date as string))
  .slice(0, 10))
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ siteTitle }}
      </h1>
      <p class="text-lg leading-7 text-gray-500 dark:text-gray-400">
        {{ siteDescription }}
      </p>
    </div>
    <PostList :posts="posts" />
  </div>
  <div
    v-if="Array.isArray(posts) && posts.length > 0"
    class="flex justify-end text-base font-medium leading-6"
  >
    <Link
      href="/blog"
      class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      :aria-label="t('all_posts')"
    >
      {{ t('all_posts') }} &rarr;
    </Link>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
