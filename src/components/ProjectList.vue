<template>
  <main class="relative mb-auto">
    <div class="">
      <div class="container py-12">
        <div v-if="Array.isArray(projects) && projects.length > 0" class="flex flex-wrap -m-4">
          <ProjectCard v-for="project of projects" :key="project.slug" :project="project" />
        </div>
        <p v-else class="pt-4">
          {{ t('no_post') }}
        </p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

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

    return { t }
  },
})
</script>
