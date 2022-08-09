<template>
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-center mb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ t('my_projects') }}
      </h1>
      <ProjectSearch />
    </div>
    <ProjectList :projects="projects" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSearch } from '~/hooks'
import { kebabCase } from '~/helpers'

export default defineComponent({
  name: 'ProjectPage',
  setup() {
    const { t } = useI18n()

    const { searchValue } = useSearch()

    const router = useRouter()
    const route = useRoute()
    const routes = router.getRoutes().filter(route => route.path.startsWith('/projects'))

    const isProjectPostType = p => p.type === 'project'

    const projects = computed(() => {
      let projectList = routes
          .map(r => r.meta)
          .filter(isProjectPostType)
          .sort((p1, p2) => Date.parse(p2.date) - Date.parse(p1.date))

      if (route.query.tech && route.query.tech.length > 0) {
        projectList = projectList
          .filter(p => Array.isArray(p.techs) && p.techs.length > 0 && p.techs.map(kebabCase).includes(route.query.tech))
      }

      if (route.query.q && route.query.q.length > 0) {
        const q = route.query.q.toLowerCase()
        return projectList.filter((p) => {
          let searchContent = `${p.title} ${p.excerpt}`
            if (Array.isArray(p.techs) && p.techs.length > 0) {
              searchContent += ` ${p.techs.join(' ')}`
              searchContent += ` ${p.techs.map(kebabCase).join(' ')}`
            }
            return isProjectPostType(p) && searchContent.toLowerCase().includes(q)
          })
      }

      return projectList
    })

    return { t, projects }
  },
})
</script>

<route lang="yaml">
meta:
  layout: default
</route>
