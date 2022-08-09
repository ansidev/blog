import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export const useQuery = () => {
  const router = useRouter()
  const route = useRoute()

  const queryParams = computed(() => route.query)

  const pushQuery = (k: string, v: string) => router.push({path: route.fullPath, query: { ...route.query, [k]: v } })

  return { queryParams, pushQuery }
}
