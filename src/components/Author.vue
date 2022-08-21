<script setup lang="ts">
import type { PropType } from 'vue'
import type { MdFrontmatter } from '~/types'

defineProps({
  /**
   * Frontmatter
   *
   * @type { MdFrontmatter }
   */
  frontmatter: {
    type: Object as PropType<MdFrontmatter>,
    default: () => {},
  },
})

const { t } = useI18n()
</script>

<template>
  <dl class="pb-6 xl:border-b xl:border-gray-200 xl:dark:border-gray-700">
    <dt class="sr-only">
      {{ t('authors') }}
    </dt>
    <dd>
      <ul class="flex justify-center xl:block space-x-8 sm:space-x-12 xl:space-x-0 xl:space-y-8">
        <li class="flex items-center space-x-2">
          <img
            v-if="frontmatter.gravatar"
            :src="`https://gravatar.com/avatar/${frontmatter.gravatar}`"
            :alt="`${frontmatter.author}'s image`"
            class="w-10 h-10 rounded-full"
          >
          <dl class="text-sm font-medium leading-5 whitespace-nowrap">
            <dt class="sr-only">
              {{ t('name') }}
            </dt>
            <dd class="text-gray-900 dark:text-gray-50">
              {{ frontmatter.author }}
            </dd>
            <dt v-if="frontmatter.twitter" class="sr-only">
              Twitter
            </dt>
            <dd v-if="frontmatter.twitter">
              <a
                :href="`https://twitter.com/${frontmatter.twitter}`"
                target="_blank"
                rel="noopener noreferrer"
                class="link"
              >{{ frontmatter.twitter }}</a>
            </dd>
          </dl>
        </li>
      </ul>
    </dd>
  </dl>
</template>
