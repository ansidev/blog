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
            <div id="eop"></div>
            <FacebookComment v-if="isFacebookCommentPluginEnabled" :number-of-posts="5" width="100%" :post-url="postURL" />
          </div>
          <footer>
            <div class="text-sm font-medium leading-5 divide-gray-200 xl:divide-y dark:divide-gray-700 xl:col-start-1 xl:row-start-2">
              <div v-if="frontmatter.type === 'project' && Array.isArray(frontmatter.techs) && frontmatter.techs.length > 0" class="py-4 xl:py-8">
                <h2 v-if="frontmatter.license" class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-3">
                  {{ t('license') }}:
                  <Link v-if="frontmatter.licenseUrl" :href="frontmatter.licenseUrl" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">{{ frontmatter.license }}</Link>
                  <span v-else>{{ frontmatter.license }}</span>
                </h2>
                <div class="flex flex-col flex-wrap mb-3">
                  <h2 class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-1">{{ t('development_status.title') }}</h2>
                  <div class="flex flex-row my-2">
                    <TwBadge v-bind="getProjectBadgeStyle(frontmatter.developmentStatus)">{{ $t(`development_status.${frontmatter.developmentStatus}`) }}</TwBadge>
                  </div>
                </div>
                <h2 class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-2">
                  {{ t('technologies') }}
                </h2>
                <div class="flex flex-wrap">
                  <Technology v-for="tech in frontmatter.techs" :key="tech" :text="tech" />
                </div>
              </div>
              <div v-if="frontmatter.type === 'post' && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0" class="py-4 xl:py-8">
                <h2 class="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400 mb-2">
                  {{ t('tags') }}
                </h2>
                <div class="flex flex-wrap">
                  <Tag v-for="tag in frontmatter.tags" :key="tag" :text="tag" />
                </div>
              </div>
              <div v-if="isSharingPluginEnabled" class="py-4 xl:py-8">
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
import { isPluginEnabled, getProjectBadgeStyle } from '~/helpers'

export default defineComponent({
  name: 'PostPage',
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

    const isSharingPluginEnabled = computed(() => isPluginEnabled('sharing'))
    const postTitle = currentRoute.meta.title
    const postURL = computed(() => `${siteConfig.baseURL}${currentRoute.path}`)

    const isFacebookCommentPluginEnabled = computed(() => isPluginEnabled('facebookComment'))

    return { t, isSharingPluginEnabled, isFacebookCommentPluginEnabled, getProjectBadgeStyle, postTitle, postURL }
  },
})
</script>
