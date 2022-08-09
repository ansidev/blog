<template>
  <main class="relative mb-auto">
    <div class="container py-6">
      <div class="flex flex-row flex-wrap pb-6">
        <TwDismissableBadge
          v-for="(value, query) in filters"
          :key="`${query}:${value}`"
          v-bind="getRandomDismissableBadgeStyle()"
          class="mr-2"
          @removed="onFilterRemoved(query)"
        >
          {{ `${query}:${value}` }}
        </TwDismissableBadge>
      </div>
      <div v-if="Array.isArray(projects) && projects.length > 0" class="flex flex-wrap -m-4">
        <ProjectCard v-for="project of projects" :key="project.slug" :project="project" />
      </div>
      <p v-else class="pt-4">
        {{ t('no_post') }}
      </p>
    </div>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRandomDismissableBadgeStyle } from '~/helpers'
import { useQuery } from '~/hooks'

export default defineComponent({
  props: {
    projects: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  setup() {
    const { t } = useI18n()
    const { queryParams, pushQuery } = useQuery()

    const filters = computed(() => {
      const f = queryParams.value
      if (Object.keys(f).includes('q')) {
        delete f.q
      }
      return f
    })

    const onFilterRemoved = (query: string) => pushQuery(query, undefined)

    return { t, filters, getRandomDismissableBadgeStyle, onFilterRemoved }
  },
})
</script>
