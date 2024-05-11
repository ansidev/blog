import { defineAsyncComponent } from 'vue'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  const Disqus = defineAsyncComponent(() => import('./components/Disqus.vue'))
  app.component('Disqus', Disqus)
}
