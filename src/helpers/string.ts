import GithubSlugger from 'github-slugger'

export const kebabCase = (s: string) => {
  const slugger = new GithubSlugger()
  return slugger.slug(s)
}
