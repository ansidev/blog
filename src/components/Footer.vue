<script setup lang="ts">
import siteConfig from '~/site.config'
</script>

<template>
  <footer>
    <div class="flex flex-col items-center mt-16">
      <div class="flex items-center flex-wrap justify-center mb-3 space-x-4">
        <div class="mb-3">
          <Link href="/">
            <Icon icon="bi:house-heart-fill" :width="32" :height="32" />
          </Link>
        </div>
        <ThemeSwitcher :size="24" class="mb-3" />
        <LocaleSwitcher :size="24" class="mb-3" />
        <div class="hidden sm:block">
          {{ ` • ` }}
        </div>
        <SocialIcon v-for="(networkProfile, network) in siteConfig.socialNetworks" :key="network" :kind="network" :href="networkProfile" class="mb-3 hidden sm:block" />
      </div>
      <div class="flex items-center flex-wrap justify-center mb-3 space-x-4">
        <SocialIcon v-for="(networkProfile, network) in siteConfig.socialNetworks" :key="network" :kind="network" :href="networkProfile" class="mb-3 block sm:hidden" />
      </div>
      <div class="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <Link href="/">
            {{ siteConfig.title }}
          </Link>
        </div>
        <div>{{ ` • ` }}</div>
        <div>
          {{ `© 2019-${new Date().getFullYear()} by` }}
          <Link href="/">
            {{ siteConfig.author }}
          </Link>
        </div>
      </div>
    </div>
  </footer>
</template>
