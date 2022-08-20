<script setup lang="ts">
defineProps({
  username: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: false,
    default: 400,
  },
  height: {
    type: Number,
    required: false,
    default: 320,
  },
  style: {
    type: [String, Object],
    required: false,
    default: '',
  },
})
</script>

<template>
  <iframe :src="`https://${username}.substack.com/embed`" :width="width" :height="height" :style="style" frameborder="0" scrolling="no" />
</template>
