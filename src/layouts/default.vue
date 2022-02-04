<template>
  <SectionContainer>
    <div class="flex flex-col justify-between h-screen">
      <header class="flex items-center justify-between py-10">
        <Link href="/" :aria-label="siteConfig.title">
          <div class="flex items-center justify-between">
            <div class="mr-3">
              <Logo />
            </div>
            <div class="hidden h-6 text-2xl font-semibold sm:block">
              {{ siteConfig.title }}
            </div>
          </div>
        </Link>
        <div class="flex items-center text-base leading-5">
          <div class="hidden md:flex">
            <Link v-for="hnItem in siteConfig.headerNavigationItems" :key="hnItem.title" :class="['p-1 font-medium text-gray-900 sm:p-4 dark:text-gray-100 flex items-center', typeof hnItem.icon === 'string' ? 'flex items-center' : '']" :href="hnItem.href" :disable-router-link="hnItem.disableRouterLink">
              <Icon v-if="typeof hnItem.icon === 'string'" :icon="hnItem.icon" :class="[typeof hnItem.title === 'string' ? 'mr-2' : '']" /><span>{{ hnItem.title }}</span>
            </Link>
          </div>
          <ThemeSwitcher />
          <LocaleSwitcher />
          <MobileMenu />
        </div>
      </header>
      <main class="mb-auto">
        <router-view />
      </main>
      <Footer />
    </div>
  </SectionContainer>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import siteConfig from '~/site.config'
import { useGA } from '~/plugins/googleAnalytics/hooks'

import { isPluginEnabled } from '~/helpers'
export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Icon,
  },
  setup() {
    const router = useRouter()
    // const currentRoute = computed(() => router.currentRoute.value)

    // const isIndex = computed(() => currentRoute.path === '/')

    const isGAPluginEnabled = computed(() => isPluginEnabled('googleAnalytics'))

    onMounted(() => {
      if (isGAPluginEnabled.value) {
        useGA(siteConfig, router)
      }
    })

    return { siteConfig }
  },
})
</script>
