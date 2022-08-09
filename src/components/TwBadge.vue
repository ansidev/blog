<template>
  <span
    :class="[
      `bg-${backgroundColor}`,
      `dark:bg-${darkBackgroundColor}`,
      `text-${textColor}`,
      `dark:text-${darkTextColor}`,
      `text-${fontSize}`,
      `font-${fontWeight}`,
      rounded ? 'rounded' : '',
      'px-2.5 py-0.5'
    ]"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    backgroundColor: {
      type: String,
      required: false,
      default: 'blue-100',
    },
    darkBackgroundColor: {
      type: String,
      required: false,
      default: 'blue-800',
    },
    textColor: {
      type: String,
      required: false,
      default: 'blue-800',
    },
    darkTextColor: {
      type: String,
      required: false,
      default: 'blue-100',
    },
    fontSize: {
      type: String,
      required: false,
      default: 'base',
    },
    fontWeight: {
      type: String,
      required: false,
      default: 'normal',
    },
    rounded: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
})
</script>
