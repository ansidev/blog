<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearch } from '~/hooks'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { searchValue, setSearchValue } = useSearch()
    const onChangeSearchValue = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setSearchValue(val)
    }

    return { t, onChangeSearchValue, searchValue }
  },
})
</script>

<template>
  <Search class="mx-auto" :value="searchValue" :placeholder="t('search_projects')" @change="onChangeSearchValue" />
</template>
