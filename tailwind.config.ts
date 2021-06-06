import { defineConfig } from 'vite-plugin-windicss'
import colors from 'windicss/colors'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  mode: 'jit',
  extract: {
    // include: [
    //   './vite.config.ts',
    //   './src/pages/posts/*.{md,vue}',
    //   './src/layout/*.{md,vue}',
    // ],
  },
  safelist: [
    'btn-facebook',
    'btn-twitter',
    'btn-tumblr',
    'btn-reddit',
    'btn-google',
    'btn-linkedin',
    'btn-email',
    'btn-whatsapp',
    'btn-vk',
    'btn-telegram',
    'dark:text-gray-50',
  ],
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  theme: {
    fontFamily: {
      sans: ['JetBrains Mono', 'monospace', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              opacity: 0.75,
              fontWeight: '500',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 1,
                color: colors.blue[500],
              },
            },
            b: { color: 'inherit' },
            strong: { color: 'inherit' },
            em: { color: 'inherit' },
            blockquote: { color: colors.indigo[500] },
            ol: { color: 'inherit' },
            ul: { color: 'inherit' },
            li: { color: 'inherit' },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            thead: { color: 'inherit' },
            th: { color: 'inherit' },
            td: { color: 'inherit' },
            tr: { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
})
