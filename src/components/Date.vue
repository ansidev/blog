<template>
  <dl>
    <dt class="sr-only">
      Published on
    </dt>
    <dd class="text-base leading-6 font-medium text-gray-500">
      <time :datetime="getDateTime()">{{ dateObject.string }}</time>
    </dd>
  </dl>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  /**
   * { time, string }
   */
  date: [Object, String],
})

const dateObject = computed(() => {
  const date = new Date(props.date)

  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
})

function getDateTime() {
  return new Date().toISOString()
}
</script>
