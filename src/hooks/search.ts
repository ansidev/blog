import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useSearch = () => {
  const router = useRouter()
  const route = useRoute()
  const searchValue = ref('')
  const setSearchValue = (val: string) => {
    searchValue.value = val
    router.push({path: route.fullPath, query: { ...route.query, q: val } })
  }

  return { searchValue, setSearchValue }
}
