<template>
  <div class="divide-y divide-gray-200">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-300 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ siteTitle }}
      </h1>
      <p class="text-lg leading-7 text-gray-500">
        {{ siteDescription }}
      </p>
    </div>
    <ul class="divide-y divide-gray-200">
      <li v-for="post of posts" class="py-3">
        <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
          <Date :date="post.date" />
          <div class="space-y-5 xl:col-span-3">
            <div class="space-y-6">
              <h2 class="text-2xl leading-8 font-bold tracking-tight">
                <a class="text-gray-900 dark:text-gray-300" :href="post.path">{{ post.title }}</a>
              </h2>
              <div v-if="post.excerpt" class="prose max-w-none text-gray-500" v-html="post.excerpt" />
            </div>
            <div class="text-base leading-6 font-medium">
              <a class="link" aria-label="read more" :href="post.path">{{ t('read_more') }} →</a>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import siteConfig from '~/site.config'

const { t } = useI18n()

const siteTitle = ref(siteConfig.title)
const siteDescription = ref(siteConfig.description)

const router = useRouter()
const routes = router.getRoutes().filter(route => route.path.startsWith('/posts'))
const posts = computed(() => routes.map(r => r.meta).filter(m => m.type === 'post'))
</script>

<route lang="yaml">
meta:
  layout: default
</route>
