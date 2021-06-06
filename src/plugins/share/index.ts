import { defineAsyncComponent } from 'vue'
import { UserModule } from '~/types'

export const config = {
  networks: [
    'email',
    'facebook',
    'linkedin',
    'telegram',
    'twitter',
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
