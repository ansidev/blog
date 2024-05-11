import type { SiteConfig } from './types'

const siteConfig: SiteConfig = {
  title: 'ansidev\'s blog',
  author: 'ansidev',
  description: 'Blog of ansidev',
  defaultMetaImage: 'imgs/default_meta_image.jpg',
  headerNavigationItems: [
    { href: '/blog', title: 'Blog' },
    { href: '/categories', title: 'Categories' },
    { href: '/tags', title: 'Tags' },
    { href: '/projects', title: 'Projects' },
    { href: '/about', title: 'About', icon: 'bi:person-square' },
    { href: '/feed.rss', title: 'RSS', icon: 'bi:rss-fill', disableRouterLink: true },
  ],
  socialNetworks: {
    email: 'ansidev@gmail.com',
    github: 'https://github.com/ansidev',
    facebook: 'https://facebook.com/leminhtri.py',
    telegram: 'https://t.me/ansidev',
    twitter: 'https://twitter.com/ansidev',
    linkedin: 'https://www.linkedin.com/in/tri-le-minh-1b05bb51/',
    reddit: 'https://reddit.com/u/ansidev',
  },
  plugins: {
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
    disqus: {
      vendorConfig: {
        shortname: 'ansidev',
      },
      autoload: true,
    },
    googleAnalytics: {
      id: 'G-LQSQ92N2Q4',
    },
    mediumZoom: {
      selector: '.medium-zoom',
    },
    sharing: true,
    substack: {
      username: 'ansidev',
      width: 400,
      height: 200,
      background: 'auto',
    },
    swetrix: {
      pid: '0n2j0kWAoVVs',
      initOptions: {
        debug: true,
      },
    },
    counterAnalytics: {
      id: '7fb87b1f-db15-4e04-974c-74ef92033d50',
      utcOffset: 7,
    },
  },
}

export default siteConfig
