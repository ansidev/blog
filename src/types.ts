import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export declare interface BreadcrumbItem {
  text: string
  path?: string
  active?: Boolean
}
