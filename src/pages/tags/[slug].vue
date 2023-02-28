<script setup lang="ts">
import { usePost } from '~/hooks'

const { t } = useI18n()

const { searchValue, setSearchValue } = useSearch()

const route = useRoute()
const slug = computed(() => route.params.slug)

const routes = usePost('/posts')

const postFilter = (m: any) => {
  const isPost = m.type === 'post'
  const hasTag = Array.isArray(m.tags) && m.tags.length > 0

  let hasMatchedTag = false
  if (hasTag) {
    const filteredTags = m.tags.filter((c: string) => slug.value === kebabCase(c))
    if (filteredTags.length > 0)
      hasMatchedTag = true
  }

  return isPost && hasTag && hasMatchedTag
}

const posts = computed(() => {
  if (searchValue.value.length === 0) {
    return routes
      .map(r => r.meta)
      .filter(postFilter)
      .sort((p1, p2) => Date.parse(p2.date) - Date.parse(p1.date))
  }

  return routes
    .map(r => r.meta)
    .filter((m) => {
      const searchContent = `${m.title} ${m.excerpt} ${Array.isArray(m.tags) && m.tags.length > 0 ? m.tags.join(' ') : ''} ${Array.isArray(m.tags) && m.tags.length > 0 ? m.tags.join(' ') : ''}`
      return postFilter(m) && searchContent.toLowerCase().includes(searchValue.value.toLowerCase())
    })
    .sort((p1, p2) => Date.parse(p2.date) - Date.parse(p1.date))
})
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl uppercase font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ slug }}
      </h1>
      <Search :value="searchValue" :placeholder="t('search_articles')" @change="(e) => setSearchValue(e.target.value)" />
    </div>
    <PostList :posts="posts" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
