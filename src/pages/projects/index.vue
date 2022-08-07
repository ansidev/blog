<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-center mb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ t('my_projects') }}
      </h1>
      <Search class="mx-auto" :placeholder="t('search_projects')" @change="(e) => setSearchValue(e.target.value)" />
    </div>
    <ProjectList :projects="projects" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSearch } from '~/hooks'

export default defineComponent({
  name: 'ProjectPage',
  setup() {
    const { t } = useI18n()

    const { searchValue, setSearchValue } = useSearch()

    const router = useRouter()
    const routes = router.getRoutes().filter(route => route.path.startsWith('/projects'))

    const projects = computed(() => {
      if (searchValue.value.length === 0) {
        return routes
          .map(r => r.meta)
          .filter(m => m.type === 'project')
          .sort((p1, p2) => Date.parse(p2.date) - Date.parse(p1.date))
      }

      return routes
        .map(r => r.meta)
        .filter((m) => {
          const searchContent = `${m.title} ${m.excerpt} ${Array.isArray(m.categories) && m.categories.length > 0 ? m.categories.join(' ') : ''} ${Array.isArray(m.tags) && m.tags.length > 0 ? m.tags.join(' ') : ''}`
          return m.type === 'post' && searchContent.toLowerCase().includes(searchValue.value.toLowerCase())
        })
        .sort((p1, p2) => Date.parse(p2.date) - Date.parse(p1.date))
    })

    return { t, setSearchValue, projects }
  },
})
</script>

<route lang="yaml">
meta:
  layout: default
</route>
