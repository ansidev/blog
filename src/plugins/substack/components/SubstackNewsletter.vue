<template>
  <iframe :src="`https://${username}.substack.com/embed`" :width="width" :height="height" :style="style" frameborder="0" scrolling="no" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: false,
      default: 400
    },
    height: {
      type: Number,
      required: false,
      default: 320
    },
    style: {
      type: [String, Object],
      required: false,
      default: ''
    },
  }
})
</script>
