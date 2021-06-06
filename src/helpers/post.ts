import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const getPostMeta = (file: string) => {
  const postDir = path.resolve(__dirname, '../../')
  const src = fs.readFileSync(path.join(postDir, file), 'utf-8')
  const { data, excerpt } = matter(src, { excerpt: true })
  const post = {
    title: data.title,
    path: `${file.replace(/^\/src\/pages/, '').replace(/\.md$/, '')}`,
    date: data.date,
    type: 'post',
    excerpt
  }
  return post
}
