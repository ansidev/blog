<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ t('categories') }}
      </h1>
    </div>
    <div class="flex flex-wrap pt-4">
      <div v-if="Object.keys(categories).length === 0" class="mt-2 mb-2 mr-5">
        {{ t('no_categories') }}
      </div>
      <div v-for="category in sortedCategories" :key="category" class="mt-2 mb-2 mr-2 px-2 py-1 border border-gray-500 rounded">
        <Category :text="category" />
        <Link
          class="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
          :href="`/categories/${kebabCase(category)}`"
        >
          {{ ` (${categories[category]})` }}
        </Link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { kebabCase } from '~/helpers'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const router = useRouter()
    const routes = router.getRoutes().filter(route => route.path.startsWith('/posts'))

    const categories = computed(() => {
      const categoryCount: Record<string, number> = {}
      routes
        .map(r => r.meta)
        .filter(m => m.type === 'post')
        .forEach((m) => {
          if (Array.isArray(m.categories) && m.categories.length > 0) {
            m.categories.forEach((category) => {
              const formattedCategory = kebabCase(category)
              if (formattedCategory in categoryCount)
                categoryCount[formattedCategory] += 1
              else
                categoryCount[formattedCategory] = 1
            })
          }
        })
      return categoryCount
    })

    const sortedCategories = computed(() => Object.keys(categories.value).sort((a, b) => categories.value[b] - categories.value[a]))

    return { t, kebabCase, categories, sortedCategories }
  },
})
</script>

<route lang="yaml">
meta:
  layout: default
</route>
