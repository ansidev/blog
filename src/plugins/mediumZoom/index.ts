import { defineAsyncComponent } from 'vue'
import { UserModule } from '~/types'

export const config = {
  selector: '.medium-zoom',
}

export const install: UserModule = ({ app }) => {
  const MediumZoom = defineAsyncComponent(() => import('./components/MediumZoom'))
  app.component('MediumZoom', MediumZoom)
}
