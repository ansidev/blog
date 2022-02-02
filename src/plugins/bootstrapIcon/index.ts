import { bootstrapIcons } from './icons'
import { getBootstrapIconComponentOptions } from './utils'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  bootstrapIcons.forEach(({ name, path }) => {
    app.component(`${name}-icon`, getBootstrapIconComponentOptions({ name, path }))
  })
}
