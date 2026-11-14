<script setup lang="ts">
import { type Post, usePageLang, usePostDate, useSlug } from '@ansidev-oss/vitepress-theme-ansidev'
import { computed, type PropType } from 'vue'

const props = defineProps({
  posts: {
    type: Object as PropType<Post[]>,
    required: true,
  },
})

// Replaces the theme's global HomePage, which rendered "All posts" through the Page
// component as a second <h1> on the homepage (BLOG-4). Same list markup as the
// theme's PostList/PostItem (copied class strings, usePostDate/useSlug from the
// theme package), with the heading demoted to <h2> and post titles wrapped in <h3>.
const lang = usePageLang()
const allPosts = computed(() => (lang.value === 'vi' ? 'Tất cả bài viết' : 'All posts'))
const noPosts = computed(() => (lang.value === 'vi' ? 'Không có bài viết nào.' : 'No post.'))
const items = computed(() => props.posts.map((post) => ({ post, date: usePostDate(post.date) })))
const categoryHref = (category: string) => `/categories/${useSlug(category)}`
</script>

<template>
  <main class="main">
    <div v-if="posts.length === 0" class="mt-2 mb-2 mr-5">{{ noPosts }}</div>
    <template v-else>
      <div class="pt-6 pb-8 space-y-2 md:space-y-5">
        <h2
          class="mb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10"
        >
          {{ allPosts }}
        </h2>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <article v-for="item in items" :key="item.post?.url" class="flex p-4 component-border">
          <div class="text-center" style="min-width: 80px">
            <div class="text-6xl font-bold">{{ item.date?.day }}</div>
            <div>{{ item.date?.month }}, {{ item.date?.year }}</div>
          </div>
          <div class="pl-8">
            <div class="flex flex-wrap mb-3">
              <h3 class="text-2xl font-bold leading-8 tracking-tight">
                <a :href="item.post?.url" :title="item.post.title">{{ item.post.title }}</a>
              </h3>
            </div>
            <div class="flex flex-wrap mb-3">
              <a
                v-for="category in item.post.categories"
                :key="category"
                class="mr-2 text-sm font-medium uppercase link-alt"
                :href="categoryHref(category)"
                :aria-label="`View all posts in category ${category}`"
              >{{ category }}</a>
            </div>
            <div v-html="item.post?.excerpt" />
          </div>
        </article>
      </div>
    </template>
  </main>
</template>
