import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const getPostMeta = (file: string) => {
  const postDir = path.resolve(__dirname, '../../')
  const src = fs.readFileSync(path.join(postDir, file), 'utf-8')
  const { data, excerpt } = matter(src, { excerpt: true, excerpt_separator: '<!-- more -->' })
  const post = {
    title: data.title,
    path: `${file.replace(/^\/src\/pages/, '').replace(/\.md$/, '')}`,
    date: data.date,
    type: data.type,
    categories: data.categories,
    tags: data.tags,
    excerpt: excerpt?.replace(/[\r\n]/gm, ''),
    repositoryUrl: undefined,
    showcaseUrl: undefined,
    licenseUrl: undefined,
    license: undefined,
    techs: undefined,
    developmentStatus: undefined,
  }

  if (data.type === 'project') {
    post.repositoryUrl = data.repositoryUrl
    post.showcaseUrl = data.showcaseUrl
    post.licenseUrl = data.licenseUrl
    post.license = data.license
    post.techs = data.techs
    post.developmentStatus = data.developmentStatus
  }

  return post
}
