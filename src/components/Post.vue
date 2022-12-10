<script setup lang="ts">
import type { PropType } from 'vue'
import { MdFrontmatter, ProjectFrontmatter } from '~/types'
import type { BreadcrumbItem, PostFrontmatter } from '~/types'

defineProps({
  /**
   * Frontmatter
   *
   * @type { PostFrontmatter | ProjectFrontmatter }
   */
  frontmatter: {
    type: Object as PropType<PostFrontmatter | ProjectFrontmatter | MdFrontmatter>,
    default: () => {},
  },
})

const baseURL = import.meta.env.VITE_BASE_URL
const { t } = useI18n()
const route = useRoute()
const postTitle = route.meta.title as string
const postURL = computed(() => `${baseURL}${route.path}`)
const isProjectDetailPage = computed(() => route.path.startsWith('/projects/'))
const isSharingPluginEnabled = computed(() => isPluginEnabled('sharing'))
const isFacebookCommentPluginEnabled = computed(() => isPluginEnabled('facebookComment'))
const breadcrumbItems = computed(() => {
  const v: BreadcrumbItem[] = [
    { text: isProjectDetailPage.value ? t('projects') : t('posts'), path: isProjectDetailPage.value ? '/projects' : '/blog', active: false },
    { text: postTitle, active: true },
  ]
  return v
})
</script>

<template>
  <SectionContainer>
    <article>
      <div class="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <header class="pt-6 xl:pb-6">
          <div class="space-y-6 text-center">
            <PageBreadcrumb :items="breadcrumbItems" />
            <PageTitle>{{ frontmatter.title }}</PageTitle>
            <PageSubtitle>{{ frontmatter.excerpt }}</PageSubtitle>
            <Date :date="(frontmatter as MdFrontmatter).date" />
          </div>
        </header>
        <div class="py-6 divide-y divide-gray-200 lg:divide-y-0 dark:divide-gray-700 lg:grid lg:grid-cols-5 lg:gap-x-4" style="grid-template-rows: auto auto auto auto;">
          <Author :frontmatter="frontmatter as MdFrontmatter" class="lg:border-b lg:mb-6 lg:col-span-5 xl:col-span-1 xl:row-span-1 xl:mr-4" />
          <div class="divide-y divide-gray-200 dark:divide-gray-700 lg:pb-0 lg:col-span-5 xl:row-span-3" :class="[(frontmatter as MdFrontmatter).toc?.length > 0 ? 'xl:col-span-3' : 'xl:col-span-4']">
            <div class="prose dark:prose-dark max-w-none">
              <slot />
            </div>
            <div id="eop" />
            <FacebookComment v-if="isFacebookCommentPluginEnabled" :number-of-posts="5" width="100%" :post-url="postURL" />
          </div>
          <div v-if="(frontmatter as MdFrontmatter).toc?.length > 0" class="hidden xl:block xl:row-span-3">
            <Toc :toc="(frontmatter as MdFrontmatter).toc" />
          </div>
          <footer class="space-y-6 xl:mr-4">
            <div class="mt-3 space-y-6 text-sm font-medium leading-5 divide-gray-200 xl:mt-0 xl:divide-y dark:divide-gray-700 xl:col-start-1 xl:row-start-2">
              <div v-if="frontmatter.type === 'project' && Array.isArray(frontmatter.techs) && frontmatter.techs.length > 0">
                <h2 v-if="frontmatter.repositoryUrl" class="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {{ t('source_code') }}:
                  <a
                    class="text-gray-500 transition hover:text-gray-600"
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="frontmatter.repositoryUrl as string"
                  >
                    <span class="sr-only">github</span>
                    <Icon icon="bi:github" class="inline mb-1 text-dark dark:text-white" />
                  </a>
                </h2>
                <h2 v-if="frontmatter.license" class="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {{ t('license') }}:
                  <Link v-if="frontmatter.licenseUrl" :href="(frontmatter as ProjectFrontmatter).licenseUrl" class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                    {{ frontmatter.license }}
                  </Link>
                  <span v-else>{{ frontmatter.license }}</span>
                </h2>
                <div class="flex flex-col flex-wrap mb-3">
                  <h2 class="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    {{ t('development_status.title') }}
                  </h2>
                  <div class="flex flex-row my-2">
                    <TwBadge v-bind="getProjectBadgeStyle((frontmatter as ProjectFrontmatter).developmentStatus)">
                      {{ $t(`development_status.${frontmatter.developmentStatus}`) }}
                    </TwBadge>
                  </div>
                </div>
                <h2 class="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {{ t('technologies') }}
                </h2>
                <div class="flex flex-wrap">
                  <Technology v-for="tech in frontmatter.techs" :key="tech" :text="tech" />
                </div>
              </div>
              <div v-if="frontmatter.type === 'post' && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0">
                <h2 class="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {{ t('tags') }}
                </h2>
                <div class="flex flex-wrap">
                  <Tag v-for="tag in frontmatter.tags" :key="tag" :text="tag" />
                </div>
              </div>
              <div v-if="isSharingPluginEnabled" class="xl:pt-6">
                <h2 class="mb-2 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                  {{ t('share') }}
                </h2>
                <div class="flex flex-wrap">
                  <Sharing :url="postURL" :text="postTitle" />
                </div>
              </div>
            </div>
            <div>
              <Link
                :href="isProjectDetailPage ? '/projects' : '/'"
                class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              >
                &larr; {{ t(isProjectDetailPage ? 'back_to_projects' : 'back_to_home') }}
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </article>
  </SectionContainer>
</template>
