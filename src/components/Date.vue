<template>
  <dl>
    <dt class="sr-only">
      {{ t('posted_on') }}
    </dt>
    <dd class="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
      <time :datetime="getDateTime()">{{ dateObject.string }}</time>
    </dd>
  </dl>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    /**
    * { time, string }
    */
    date: [Object, String],
  },
  setup(props) {
    const { t } = useI18n()
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

    const getDateTime = () => new Date().toISOString()

    return { t, dateObject, getDateTime }
  },
})
</script>
