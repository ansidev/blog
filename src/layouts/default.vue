<template>
  <SectionContainer>
    <div class="flex flex-col justify-between h-screen">
      <main class="mb-auto">
        <Header />
        <router-view />
      </main>
      <Footer />
    </div>
  </SectionContainer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
// import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'DefaultLayout',
  // setup() {
  //   const router = useRouter()
  //   const currentRoute = computed(() => router.currentRoute.value)

  //   const isIndex = computed(() => currentRoute.path === '/')
  // },
})
</script>
