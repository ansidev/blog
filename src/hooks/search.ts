import { ref } from 'vue'

export const useSearch = () => {
  const searchValue = ref('')
  const setSearchValue = (val: string) => searchValue.value = val

  return { searchValue, setSearchValue }
}
