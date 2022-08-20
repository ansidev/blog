import { defineAsyncComponent } from 'vue'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  const SubstackNewsletter = defineAsyncComponent(() => import('./components/SubstackNewsletter.vue'))
  app.component('SubstackNewsletter', SubstackNewsletter)
}
