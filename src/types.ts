import type { MarkdownItHeader } from '@mdit-vue/plugin-headers'
import type { Frontmatter } from 'vite-plugin-md'
import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

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
