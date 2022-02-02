<template>
  <SectionContainer>
    <article>
      <div class="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <header class="pt-6 xl:pb-6">
          <div class="space-y-1 text-center">
            <Date class="space-y-10" :date="frontmatter.date" />
            <div>
              <PageTitle>{{ frontmatter.title }}</PageTitle>
            </div>
          </div>
        </header>
        <div
          class="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6"
          style="grid-template-rows: auto 1fr"
        >
          <Author :frontmatter="frontmatter" />
          <div class="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
            <div class="pt-10 pb-8 prose dark:prose-dark max-w-none">
              <slot />
            </div>
            <!-- <div class="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
              <Link href={discussUrl(slug)} rel="nofollow">
                {{ 'Discuss on Twitter' }}
              </Link>
              {` • `}
              <Link href={editUrl(fileName)}>{'View on GitHub'}</Link>
            </div>
            <Comments frontMatter={frontMatter} /> -->
          </div>
          <footer>
            <div class="text-sm font-medium leading-5 divide-gray-200 xl:divide-y dark:divide-gray-700 xl:col-start-1 xl:row-start-2">
              <div v-if="Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0" class="py-4 xl:py-8">
                <h2 class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-2">
                  {{ t('tags') }}
                </h2>
                <div class="flex flex-wrap">
                  <Tag v-for="tag in frontmatter.tags" :key="tag" :text="tag" />
                </div>
              </div>
              <div class="py-4 xl:py-8">
                <h2 class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-2">
                  {{ t('share') }}
                </h2>
                <div class="flex flex-wrap">
                  <Sharing :url="postURL" :text="postTitle" />
                </div>
              </div>
            </div>
            <div class="pt-4 xl:pt-8">
              <Link
                href="/"
                class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                &larr; {{ t('back_to_home') }}
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </article>
  </SectionContainer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import siteConfig from '~/site.config'

export default defineComponent({
  props: {
    /**
     * Frontmatter
     * { Object }
     */
    frontmatter: { type: Object, default: () => { } },
  },

  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const currentRoute = router.currentRoute.value

    const postTitle = currentRoute.meta.title
    const postURL = computed(() => `${siteConfig.baseURL}${currentRoute.path}`)

    return { t, postTitle, postURL }
  },
})
</script>
