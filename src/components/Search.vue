<template>
  <div class="relative max-w-lg">
    <input
      class="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
      :aria-label="placeholder"
      type="text"
      :placeholder="placeholder"
      @change="onChange"
    >
    <svg
      class="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="{2}"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['change'],
  setup(_, { emit }) {
    const onChange = (e: any) => emit('change', e)

    return { onChange }
  },
})
</script>
