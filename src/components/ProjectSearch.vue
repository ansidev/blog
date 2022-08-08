<template>
  <Search class="mx-auto" :value="searchValue" :placeholder="t('search_projects')" @change="onChangeSearchValue" />
  <div class="flex flex-row flex-wrap">
    <TwDismissableBadge
      v-for="(value, query) in filters"
      :key="`${query}:${value}`"
      v-bind="getRandomDismissableBadgeStyle()"
      class="mr-2"
      @removed="onFilterRemoved(query)"
    >
      {{ `${query}:${value}` }}
    </TwDismissableBadge>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRandomDismissableBadgeStyle } from '~/helpers'
import { useQuery, useSearch } from '~/hooks'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { searchValue, setSearchValue } = useSearch()
    const { queryParams, pushQuery } = useQuery()

    const filters = computed(() => {
      const f = queryParams.value
      if (Object.keys(f).includes('q')) {
        delete f.q
      }
      return f
    })

    const onFilterRemoved = (query: string) => pushQuery(query, undefined)

    const onChangeSearchValue = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setSearchValue(val)
    }

    return { t, onChangeSearchValue, searchValue, filters, getRandomDismissableBadgeStyle, onFilterRemoved }
  },
})
</script>
