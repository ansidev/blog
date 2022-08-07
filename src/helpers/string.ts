import GithubSlugger from 'github-slugger'

export const kebabCase = (s: string) => {
  const s1 = s
    .replace(/#/, '-sharp-')
    .replace(/\./, '-dot-')
    .replace(/-$/, '')
  const slugger = new GithubSlugger()
  return slugger.slug(s1)
}
