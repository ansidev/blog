# ansidev's Blog

Personal blog of Le Minh Tri (a.k.a ansidev), built with VitePress.

## Tech Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- [vitepress-theme-ansidev](https://github.com/ansidev/vitepress-theme-ansidev) - My own VitePress theme
- [Biome](https://biomejs.dev/) - Linter and formatter
- [pnpm](https://pnpm.io/) - Package manager

## Prerequisites

- Node.js
- pnpm

## Installation

```bash
pnpm install
```

## Usage

### Development

```bash
pnpm dev
# or
task dev
```

### Build

```bash
pnpm build
# or
task build
```

### Preview

```bash
pnpm preview
```

### Clean

```bash
task clean
```

## Project Structure

```
.
├── .vitepress/           # VitePress configuration
│   ├── config.ts         # Main config file
│   └── theme/            # Custom theme
├── content/              # Blog content (posts, pages)
│   ├── posts/            # Blog posts (Markdown)
│   ├── categories/       # Category pages
│   ├── projects-by-tech/ # Projects by technology
│   └── public/           # Static assets
├── loaders/              # Data loaders
├── package.json
├── tsconfig.json
└── Taskfile.yml          # Task automation
```

## Contact

Le Minh Tri (a.k.a [@ansidev](https://ansidev.xyz/about)).

## License

[MIT](./LICENSE)

Copyright © 2024-present Le Minh Tri.
