export default {
  baseURL: 'https://ansidev.xyz',
  title: 'ansidev\'s blog',
  author: 'ansidev',
  description: 'Blog of ansidev',
  headerNavigationItems: [
    { href: '/blog', title: 'Blog' },
    { href: '/categories', title: 'Categories' },
    { href: '/tags', title: 'Tags' },
    { href: '/categories/projects', title: 'Projects' },
    { href: '/about', title: 'About', icon: 'bi:person-square' },
    { href: '/feed.rss', title: 'RSS', icon: 'bi:rss-fill', disableRouterLink: true },
  ],
  socialNetworks: {
    email: 'ansidev@gmail.com',
    github: 'https://github.com/ansidev',
    facebook: 'https://facebook.com/leminhtri.py',
    telegram: 'https://t.me/ansidev',
    twitter: 'https://twitter.com/ansidev',
    linkedin: 'https://www.linkedin.com/in/ansi-dev-1b05bb51/',
    reddit: 'https://reddit.com/u/ansidev',
  },
  plugins: {
    googleAnalytics: {
      id: 'G-LQSQ92N2Q4'
    },
    sharing: true,
    facebookComment: {
      vendorConfig: {
        version: 'v9.0',
        appId: '392070091522876',
        nonce: '41HjKhHD',
        lang: 'vi_VN',
      },
      autoload: false
    },
    mediumZoom: {
      selector: '.medium-zoom',
    },
    substack: {
      username: 'ansidev',
      width: 400,
      height: 200,
      background: 'auto'
    }
  }
}
