<template>
  <article class="xl:divide-y xl:divide-gray-200">
    <div id="fb-root" />
    <header class="pt-6 xl:pb-10 space-y-1 text-center">
      <Date :date="frontmatter.date" />
      <h1
        class="text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-50 tracking-tight sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
      >
        {{ frontmatter.title }}
      </h1>
    </header>

    <div
      class="divide-y xl:divide-y-0 divide-gray-200 xl:grid xl:grid-cols-4 xl:gap-x-6 pb-16 xl:pb-20"
      style="grid-template-rows: auto 1fr;"
    >
      <Author :frontmatter="frontmatter" />
      <div class="divide-y divide-gray-200 xl:pb-0 xl:col-span-3 xl:row-span-2 pt-10 pb-8">
        <slot />
        <FacebookComment :number-of-posts="5" width="100%" :post-url="postURL" />
        <MediumZoom />
      </div>

      <footer
        class="text-sm font-medium leading-5 divide-y divide-gray-200 xl:col-start-1 xl:row-start-2"
      >
        <!-- <div v-if="nextPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Next Article
          </h2>
          <div class="link">
            <a :href="nextPost.href">{{ nextPost.title }}</a>
          </div>
        </div>
        <div v-if="prevPost" class="py-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Previous Article
          </h2>
          <div class="link">
            <a :href="prevPost.href">{{ prevPost.title }}</a>
          </div>
        </div> -->
        <div class="pt-8">
          <h2 class="text-xs tracking-wide uppercase text-gray-500">
            Share
          </h2>
          <Sharing :url="postURL" :text="postTitle" />
        </div>
        <div class="pt-8">
          <a class="link" href="/">← Back to the blog</a>
        </div>
      </footer>
    </div>
  </article>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import siteConfig from '~/site.config'

export default {
  props: {
    /**
     * Frontmatter
     * { Object }
     */
    frontmatter: { type: Object, default: () => {} },
  },

  setup() {
    const router = useRouter()
    const currentRoute = router.currentRoute.value

    const postTitle = currentRoute.meta.title
    const postURL = computed(() => `${siteConfig.baseURL}${currentRoute.path}`)

    return { postTitle, postURL }
  },
}
</script>
