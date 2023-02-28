export const useQuery = () => {
  const router = useRouter()
  const route = useRoute()

  const queryParams = computed(() => route.query)

  const pushQuery = (k: string, v: string | undefined) => router.push({ path: route.fullPath, query: { ...route.query, [k]: v } })

  return { queryParams, pushQuery }
}

export const usePost = (pathPrefix: string) => {
  const router = useRouter()
  return router.getRoutes()
    .filter(route => route.name !== undefined
       && route.path.startsWith(pathPrefix))
}
