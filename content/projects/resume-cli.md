---
type: project
title: Resume CLI
repositoryUrl: https://github.com/ansidev/resume-cli-ce
showcaseUrl: https://resume-theme-default-demo.pages.dev/
license: AGPL-3.0
licenseUrl: https://github.com/ansidev/resume-cli-ce/blob/main/LICENSE
techs:
  - Go
  - Urfave CLI
  - Fiber
  - Handlebars
developmentStatus: active
date: 2022-04-19T18:12:17+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
---

CLI command to generate a beautiful resume.

<!-- more -->

## Story

I wanted to keep my resume as data and generate PDF/HTML from it with a theme, instead of editing a document by hand every time.

This project is inspired by [JSON Resume](https://jsonresume.org/).

## Technologies

`resume-cli` is built with:

- [Go](https://go.dev).
- [urfave/cli v2](https://github.com/urfave/cli).
- [Fiber](https://gofiber.io) for the development server.
- [raymond](https://github.com/mailgun/raymond) (Handlebars) for templates.
- [chromedp](https://github.com/chromedp/chromedp) to render PDF.
- [yaegi](https://github.com/traefik/yaegi) to run theme helpers.

## Themes

- [resume-theme-simple](https://github.com/ansidev/resume-theme-simple): a simple theme built with Bootstrap.
  - Demo: https://resume-theme-simple-demo.pages.dev/
- [resume-theme-default](https://github.com/ansidev/resume-theme-default): the default theme.
  - Demo: https://resume-theme-default-demo.pages.dev/

## Installation

```bash
brew tap ansidev/resume-cli-ce https://github.com/ansidev/resume-cli-ce
brew trust --formula ansidev/resume-cli-ce/resume-cli
brew install resume-cli
```

## Usage

- `resume-cli dev`: start a development server.
- `resume-cli generate`: generate the resume (PDF or HTML).

See the [README](https://github.com/ansidev/resume-cli-ce/blob/main/README.md) for more details.
