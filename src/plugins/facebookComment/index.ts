import { defineAsyncComponent } from 'vue'
import { UserModule } from '~/types'

export const config = {
  version: 'v9.0',
  appId: '392070091522876',
  nonce: '41HjKhHD',
  lang: 'vi_VN',
}

export const install: UserModule = ({ app }) => {
  const FacebookComment = defineAsyncComponent(() => import('./components/FacebookComment.vue'))
  app.component('FacebookComment', FacebookComment)
}
