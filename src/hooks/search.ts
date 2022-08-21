export const useSearch = () => {
  const router = useRouter()
  const route = useRoute()

  const searchValue = ref('')
  if (route.query.q && route.query.q.length > 0) {
    searchValue.value = route.query.q as string
  }

  const setSearchValue = (val: string) => {
    searchValue.value = val
    router.push({ path: route.fullPath, query: { ...route.query, q: val } })
  }

  return { searchValue, setSearchValue }
}
