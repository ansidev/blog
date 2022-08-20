import { defineAsyncComponent } from 'vue'
import type { SharingPluginConfig } from './types'
import type { UserModule } from '~/types'

export const config: SharingPluginConfig = {
  networks: [
    'email',
    'facebook',
    'twitter',
    'linkedin',
    'telegram',
    'whatsapp',
  ],
  displayMode: 'icon',
}

export const install: UserModule = ({ app }) => {
  const SharingButton = defineAsyncComponent(() => import('./components/SharingButton.vue'))
  app.component('SharingButton', SharingButton)

  const Sharing = defineAsyncComponent(() => import('./components/Sharing.vue'))
  app.component('Sharing', Sharing)
}
