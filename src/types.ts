import type { MarkdownItHeader } from '@mdit-vue/plugin-headers'
import type { Frontmatter } from 'vite-plugin-md'
import type { ViteSSGContext } from 'vite-ssg'
import type { DomainConfig } from 'vue-gtag'
import type { FacebookCommentPluginConfig } from './plugins/facebookComment/types'
import type { MediumZoomPluginConfig } from './plugins/mediumZoom/types'
import type { SubstackPluginConfig } from './plugins/substack/types'

export type UserModule = (ctx: ViteSSGContext) => void

export declare interface SiteConfig {
  title: string
  author: string
  description: string
  defaultMetaImage: string
  headerNavigationItems: NavItem[]
  socialNetworks: Record<string, string>
  plugins: SitePlugins
}

export declare interface NavItem {
  title: string
  href: string
  icon?: string
  disableRouterLink?: boolean
}

export declare interface SitePlugins {
  facebookComment?: FacebookCommentPluginConfig
  googleAnalytics?: DomainConfig
  mediumZoom?: MediumZoomPluginConfig
  sharing?: boolean
  substack?: SubstackPluginConfig
}

export declare interface BreadcrumbItem {
  text: string
  path?: string
  active?: Boolean
}

export declare interface MdFrontmatter extends Frontmatter {
  type: string
  author: string
  gravatar: string
  twitter: string
  date: Date | string
  toc: MarkdownItHeader[]
}

export declare interface PostFrontmatter extends MdFrontmatter {
  categories: string[]
  tags: string[]
}

export declare interface ProjectFrontmatter extends Frontmatter {
  repositoryUrl?: string
  showcaseUrl?: string
  licenseUrl?: string
  license?: string
  techs: string[]
  developmentStatus: string
}
