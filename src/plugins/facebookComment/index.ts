import { defineAsyncComponent } from 'vue'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  const FacebookComment = defineAsyncComponent(() => import('./components/FacebookComment.vue'))
  app.component('FacebookComment', FacebookComment)
}
