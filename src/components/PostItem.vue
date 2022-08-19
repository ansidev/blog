<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n()

    return { t }
  },
})
</script>

<template>
  <article>
    <div class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
      <Date :date="post.date" />
      <div class="space-y-5 xl:col-span-3">
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold leading-8 tracking-tight mb-2">
              <Link :href="post.path" class="text-gray-900 dark:text-gray-100">
                {{ post.title }}
              </Link>
            </h2>
            <div class="flex flex-wrap">
              <Category v-for="category in post.categories" :key="category" :text="category" />
            </div>
          </div>
          <div
            v-if="post.excerpt"
            class="prose text-gray-500 max-w-none dark:text-gray-400"
          >
            {{ post.excerpt }}
          </div>
        </div>
        <div class="text-base font-medium leading-6">
          <Link
            :href="post.path"
            class="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            :aria-label="`Read ${post.title}`"
          >
            {{ t('read_more') }} &rarr;
          </Link>
        </div>
      </div>
    </div>
  </article>
</template>
