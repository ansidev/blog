<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-col items-start justify-start md:justify-center md:items-center md:flex-row md:space-x-6 md:mt-24"
  >
    <div class="pt-6 pb-8 space-x-2 md:space-y-5">
      <h1
        class="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl md:leading-14 md:border-r-2 md:px-6"
      >
        404
      </h1>
    </div>
    <div class="max-w-md">
      <p class="mb-4 text-xl font-bold leading-normal md:text-2xl">
        Sorry we couldn't find this page.
      </p>
      <p class="mb-8">
        But don't worry, you can find plenty of other things on our homepage.
      </p>
      <Link href="/">
        <button
          class="inline px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow focus:outline-none focus:shadow-outline-blue hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          {{ t('back_to_home') }}
        </button>
      </Link>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: 404
</route>
