<template>
  <SectionContainer>
    <div className="flex flex-col justify-between h-screen">
      <header className="flex items-center justify-between py-10">
        <Link href="/" :aria-label="siteConfig.title">
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {{ siteConfig.title }}
            </div>
          </div>
        </Link>
        <div className="flex items-center text-base leading-5">
          <div className="hidden md:flex">
            <Link v-for="hnItem in siteConfig.headerNavigationItems" :key="hnItem.title" :href="hnItem.href" :class="['p-1 font-medium text-gray-900 sm:p-4 dark:text-gray-100 flex items-center', typeof hnItem.icon === 'string' ? 'flex items-center' : '']">
              <Icon v-if="typeof hnItem.icon === 'string'" :icon="hnItem.icon" :class="[typeof hnItem.title === 'string' ? 'mr-2' : '']" /><span>{{ hnItem.title }}</span>
            </Link>
          </div>
          <ThemeSwitcher />
          <LocaleSwitcher />
          <MobileMenu />
        </div>
      </header>
      <main className="mb-auto">
        <router-view />
      </main>
      <Footer />
    </div>
  </SectionContainer>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
// import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import siteConfig from '~/site.config'

export default defineComponent({
  components: {
    Icon,
  },
  setup() {
    // const router = useRouter()
    // const currentRoute = router.currentRoute.value

    // const isIndex = computed(() => currentRoute.path === '/')

    return { siteConfig }
  },
})
</script>
