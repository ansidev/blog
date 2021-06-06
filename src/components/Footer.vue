<template>
  <p class="py-5 text-center text-gray-900 dark:text-gray-300 font-medium">
    © 2019-present by Le Minh Tri (@ansidev).
  </p>
  <nav class="text-xl mt-6">
    <router-link :class="iconCssClass" to="/" :title="t('button.home')">
      <carbon-campsite />
    </router-link>

    <a :class="iconCssClass" :title="t('button.toggle_dark')" @click="toggleDark">
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </a>

    <a :class="iconCssClass" :title="t('button.toggle_langs')" @click="toggleLocale">
      <carbon-language />
    </a>

    <router-link :class="iconCssClass" to="/about" :title="t('button.about')">
      <carbon-dicom-overlay />
    </router-link>

    <a :class="iconCssClass" rel="noreferrer" :href="githubProfile" target="_blank" title="GitHub">
      <carbon-logo-github />
    </a>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark, switchLocale } from '~/utils'
import siteConfig from '~/site.config'

const { t, availableLocales, locale } = useI18n()

const toggleLocale = () => switchLocale(availableLocales, locale)

const githubProfile = siteConfig.socialNetworks.github

const iconCssClass = ref('icon-btn mx-2 text-gray-900 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200')

</script>
