<script setup lang="ts">
import siteConfig from '~/site.config'

const route = useRoute()

const pageMeta = computed(() => {
  const baseURL = import.meta.env.VITE_BASE_URL
  const url = `${baseURL}${route.path}`
  const title = route.meta.title as string || siteConfig.title
  const description = route.meta.excerpt as string || route.meta.title as string || siteConfig.description
  const image = route.meta.metaImage as string || `${import.meta.env.VITE_BASE_URL}/${siteConfig.defaultMetaImage}`

  return {
    url,
    title,
    description,
    image,
  }
})

useServerHead({
  title: computed(() => pageMeta.value.title).value,
  meta: [
    {
      name: 'description',
      content: computed(() => pageMeta.value.description).value,
    },
    {
      name: 'og:title',
      content: computed(() => pageMeta.value.title).value,
    },
    {
      name: 'og:url',
      content: computed(() => pageMeta.value.url).value,
    },
    {
      name: 'og:description',
      content: computed(() => pageMeta.value.description).value,
    },
    {
      name: 'og:image',
      content: computed(() => pageMeta.value.image).value,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => pageMeta.value.url).value,
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
