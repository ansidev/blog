<template>
  <router-view />
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import siteConfig from '~/site.config'

const route = useRoute()

const pageMeta = computed(() => {
    const title = route.meta.title as string || siteConfig.title
    const description = route.meta.excerpt as string || route.meta.title as string || siteConfig.description
    const image = route.meta.metaImage as string || `${import.meta.env.VITE_BASE_URL}/${siteConfig.defaultMetaImage}`

    return {
      url: route.path,
      title: title,
      description: description,
      image,
    }
})

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: computed(() => pageMeta.value.title),
  meta: [
    {
      name: 'description',
      content: computed(() => pageMeta.value.description)
    },
    {
      name: 'og:title',
      content: computed(() => pageMeta.value.title)
    },
    {
      name: 'og:url',
      content: computed(() => pageMeta.value.url)
    },
    {
      name: 'og:description',
      content: computed(() => pageMeta.value.description)
    },
    {
      name: 'og:image',
      content: computed(() => pageMeta.value.image)
    },
  ],
})
</script>
