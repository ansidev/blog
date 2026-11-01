import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineWithDefaultThemeConfig } from '@ansidev-oss/vitepress-theme-ansidev/config'
import { PurgeCSS } from 'purgecss'
import { createContentLoader, type HeadConfig } from 'vitepress'
import { type RSSOptions, RssPlugin } from 'vitepress-plugin-rss'

globalThis.__VUE_PROD_DEVTOOLS__ = process.env.NODE_ENV === 'development'
const siteURL = process.env.VITE_BASE_URL || 'http://localhost:5173'
const siteTitle: string = "ansidev's blog"
// Loading gtag during hydration creates ~230 ms of long tasks on mobile and hurts
// TBT. Defer it to the first pointer/key interaction instead (inline script in transformHead).
const gaId = process.env.VITE_GA_ID
const rssOptions: RSSOptions = {
  title: siteTitle,
  baseUrl: siteURL,
  copyright: 'Copyright © 2019-present Le Minh Tri (a.k.a ansidev)',
}

console.log('Site URL', siteURL)

const siteDescription = 'Personal blog of ansidev'
const authorName = 'Le Minh Tri'
const authorAlias = 'ansidev'
const authorSameAs = [
  'https://github.com/ansidev',
  'https://linkedin.com/in/ansidev/',
  'https://x.com/ansidev',
  'https://t.me/ansidev',
]
const ogImage = `${siteURL}/pwa-512x512.png`
// Thin listing pages: keep them crawlable for link discovery, but out of the index and sitemap.
const noindexPrefixes = ['tags/', 'projects-by-tech/']
const isNoindex = (relativePath: string) => noindexPrefixes.some((prefix) => relativePath.startsWith(prefix))

// relativePath -> clean path ('' for home, 'posts/foo' otherwise)
const toCleanPath = (relativePath: string) => relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
const toPageUrl = (relativePath: string) => `${siteURL}/${toCleanPath(relativePath)}`

const resumeCliIcons = [
  '<link rel="icon" href="/imgs/resume-cli/favicon.ico" sizes="48x48">',
  '<link rel="icon" href="/imgs/resume-cli/favicon.svg" type="image/svg+xml">',
  '<link rel="icon" href="/imgs/resume-cli/favicon-32.png" type="image/png" sizes="32x32">',
  '<link rel="apple-touch-icon" href="/imgs/resume-cli/apple-touch-icon.png">',
].join('')

const ogLocale = (lang: string) => (lang === 'vi' ? 'vi_VN' : lang.replace('-', '_'))

const firstParagraph = (html: string, max = 160): string => {
  const match = html.match(/<p>([\s\S]*?)<\/p>/)
  if (!match) return ''
  const text = match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

const author = {
  '@type': 'Person',
  name: authorName,
  alternateName: authorAlias,
  url: `${siteURL}/about`,
  sameAs: authorSameAs,
}

// relativePath -> ISO date, filled while pages render and read by the sitemap.
const pageDates = new Map<string, string>()

// VitePress always emits a render-blocking <link> for vp-icons.css. This site
// uses inline SVGs for every social icon, so the file is empty (0 bytes) and
// the link only delays first paint — strip it when no vpi-social class is used.
const vpIconsUsed = new Set<string>()

const toDay = (value: unknown) => new Date(value as string | Date).toISOString().slice(0, 10)

const stripFrontmatter = (src: string) => src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim()

const generateLlmsFiles = async (outDir: string) => {
  const posts = (
    await createContentLoader('posts/**/!(index).md', { includeSrc: true, render: false, excerpt: false }).load()
  ).sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  const lines = [
    `# ${siteTitle}`,
    '',
    `> ${siteDescription}. Notes on code, tools and shipping software: tips and tricks, DevOps notes, and side projects by ${authorName} (${authorAlias}).`,
    '',
    '## Pages',
    '',
    `- [About](${siteURL}/about): who writes this blog and how to reach me`,
    `- [Projects](${siteURL}/projects): side projects and open-source work`,
    `- [Categories](${siteURL}/categories)`,
    `- [Archives](${siteURL}/archives)`,
    `- [RSS feed](${siteURL}/feed.rss)`,
    '',
    '## Posts',
    '',
    ...posts.map((post) => `- [${post.frontmatter.title}](${siteURL}${post.url}): ${toDay(post.frontmatter.date)}`),
    '',
  ]
  writeFileSync(join(outDir, 'llms.txt'), lines.join('\n'))

  const full = [
    `# ${siteTitle}`,
    '',
    `> ${siteDescription}`,
    '',
    ...posts.flatMap((post) => [
      `## ${post.frontmatter.title}`,
      '',
      `URL: ${siteURL}${post.url}`,
      `Date: ${toDay(post.frontmatter.date)}`,
      '',
      stripFrontmatter(post.src ?? ''),
      '',
    ]),
  ]
  writeFileSync(join(outDir, 'llms-full.txt'), full.join('\n'))
}

export default defineWithDefaultThemeConfig({
  srcDir: 'content',
  outDir: 'dist',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: false,
  appearance: 'dark',
  title: siteTitle,
  description: 'Personal blog of ansidev',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        media: 'print',
        onload: "this.media='all'",
      },
    ],
    [
      'noscript',
      {},
      "<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'>",
    ],
  ],
  themeConfig: {
    siteURL,
    // The theme's own GoogleAnalytics component loads gtag during hydration
    // (~230 ms of long main-thread tasks on mobile). mergeConfig only lets scalars
    // override objects, so `false` disables the theme's loader entirely; gtag is
    // instead injected after the first interaction via transformHead below.
    googleAnalytics: false,
    logo: '/pwa-192x192.png',
    nav: [
      { link: '/categories', text: 'Categories' },
      { link: '/tags', text: 'Tags' },
      { link: '/archives', text: 'Archives' },
      { link: '/projects', text: 'Projects' },
      { text: 'Products', items: [{ link: '/products/resume-cli', text: 'Resume CLI' }] },
      { link: '/about', text: 'About' },
      { link: '/feed.rss', text: 'RSS' },
    ],
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16"> <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671"/> <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791"/></svg>',
        },
        link: 'mailto:ansidev@gmail.com',
        ariaLabel: 'email',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"> <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/> </svg>',
        },
        link: 'https://github.com/ansidev',
        ariaLabel: 'github',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"> <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/> </svg>',
        },
        link: 'https://linkedin.com/in/ansidev/',
        ariaLabel: 'linkedin',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/> </svg>',
        },
        link: 'https://t.me/ansidev',
        ariaLabel: 'telegram',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"> <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/> </svg>',
        },
        link: 'https://facebook.com/leminhtri.py',
        ariaLabel: 'facebook',
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16"> <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/> </svg>',
        },
        link: 'https://x.com/ansidev',
        ariaLabel: 'x',
      },
    ],
    outline: 'deep' as const,
    donation: {
      paypal: 'ansidev',
      kofi: 'ansidev',
      buymeacoffee: 'ansidev',
      custom: {
        momo: {
          donationBaseUrl: 'https://me.momo.vn',
          donationId: 'ansidev',
          donationButtonImage: '/imgs/momo_icon_rectangle_pinkbg_RGB.png',
          donationButtonStyle: {
            height: '60px !important',
          },
        },
      },
    },
    sharing: {
      title: 'Share this post',
      networks: ['email', 'facebook', 'twitter', 'linkedin', 'telegram', 'whatsapp'],
      displayMode: 'icon',
    },
    footer: {
      copyright: 'Copyright © 2019-#{present} Le Minh Tri (a.k.a ansidev)',
    },
  },
  sitemap: {
    hostname: siteURL as string,
    lastmodDateOnly: false,
    transformItems: (items) =>
      items
        .filter((item) => !isNoindex(item.url))
        .map((item) => {
          const lastmod = pageDates.get(item.url.replace(/\.html$/, '').replace(/\/$/, ''))
          return lastmod ? { ...item, lastmod } : item
        }),
  },
  transformHead: ({ pageData, title, description, content }) => {
    if (pageData.isNotFound) return [['meta', { name: 'robots', content: 'noindex' }]] as HeadConfig[]

    const { relativePath, frontmatter } = pageData
    const url = toPageUrl(relativePath)
    const isPost = frontmatter.type === 'post'
    const isHome = relativePath === 'index.md'
    const pageDescription =
      (frontmatter.description as string | undefined) ||
      (isPost ? firstParagraph(content) : '') ||
      description ||
      siteDescription
    const date = frontmatter.date ? new Date(frontmatter.date as string).toISOString() : undefined
    if (date) pageDates.set(toCleanPath(relativePath).replace(/\/$/, ''), date)

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { name: 'description', content: pageDescription }],
      ['meta', { property: 'og:site_name', content: siteTitle }],
      ['meta', { property: 'og:locale', content: ogLocale((frontmatter.lang as string | undefined) || 'en-US') }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: pageDescription }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:site', content: '@ansidev' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: pageDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }],
    ]
    if (isPost && date) {
      head.push(['meta', { property: 'article:published_time', content: date }])
      head.push(['meta', { property: 'article:author', content: authorName }])
    }
    if (isNoindex(relativePath)) head.push(['meta', { name: 'robots', content: 'noindex,follow' }])

    let jsonLd: Record<string, unknown> | undefined
    if (isPost) {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: pageDescription,
        datePublished: date,
        dateModified: date,
        inLanguage: (frontmatter.lang as string | undefined) || 'en-US',
        mainEntityOfPage: url,
        url,
        image: ogImage,
        author,
        publisher: author,
        keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : undefined,
      }
    } else if (isHome) {
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteTitle,
        url: `${siteURL}/`,
        description: siteDescription,
        inLanguage: 'en-US',
        author,
      }
    } else if (relativePath === 'about.md') {
      jsonLd = { '@context': 'https://schema.org', ...author, '@id': `${siteURL}/about` }
    }
    if (jsonLd) head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

    // The theme loads gtag during hydration (~230 ms of long main-thread tasks on
    // mobile). Load it after the first pointer/key interaction instead.
    if (gaId) {
      head.push([
        'script',
        {},
        `(function(){var g=0;function l(){if(g)return;g=1;var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';s.async=true;document.head.appendChild(s);var i=document.createElement('script');i.textContent="window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}');";document.head.appendChild(i)}['pointerdown','keydown','touchstart'].forEach(function(e){addEventListener(e,l,{once:true,passive:true})})})();`,
      ])
    }

    return head
  },
  // VitePress renders <html lang> from the site-level lang; apply the per-page front matter lang to the static HTML.
  transformHtml: (code, _id, { pageData }) => {
    const lang = pageData.frontmatter.lang as string | undefined
    let html = lang ? code.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`) : code
    if (html.includes('vpi-social-')) vpIconsUsed.add(pageData.relativePath)
    else html = html.replace(/<link rel="preload stylesheet" href="\/vp-icons\.css" as="style">\n?/, '')
    // Resume CLI has its own brand: swap the blog favicon for its icons on this page only.
    if (pageData.relativePath === 'products/resume-cli.md')
      html = html.replace(/<link rel="icon" href="\/favicon\.ico">/, resumeCliIcons)
    return html
  },
  buildEnd: async (siteConfig) => {
    await generateLlmsFiles(siteConfig.outDir)
    if (vpIconsUsed.size === 0) rmSync(join(siteConfig.outDir, 'vp-icons.css'))
    const assetsDir = join(siteConfig.outDir, 'assets')
    if (existsSync(assetsDir)) {
      const files = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
      for (const file of files) {
        const cssPath = join(assetsDir, file)
        const result = await new PurgeCSS().purge({
          content: [join(siteConfig.outDir, '**/*.html'), join(siteConfig.outDir, 'assets/**/*.js')],
          css: [cssPath],
          safelist: {
            standard: [/^vp-/, /^VP/, /medium-zoom/, /donation/, /sharing/, /^carbon/],
            greedy: [/data-v-/, /dark/],
          },
        })
        if (result[0]?.css) writeFileSync(cssPath, result[0].css)
      }
    }
  },
  vite: {
    build: {
      target: 'es2022',
      cssTarget: 'es2022',
      cssCodeSplit: true,
      minify: 'esbuild',
      rollupOptions: {
        treeshake: { preset: 'recommended' },
      },
    },
    plugins: [RssPlugin(rssOptions)],
  },
})
