---
type: post
title: How to read environment variables in astro.config.mjs?
date: 2022-12-12T22:07:09+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /astro/how-to-read-environment-variables-in-astro-config
categories:
  - Programming
  - Javascript
  - Astro
tags:
  - environment variable
  - Astro config
---

## Problem

You want to read environment variables from env file (ex. `.env`) in `astro.config.mjs` for development purposes.

However, according to the official document, Astro does not support it official and the only way.

You can read about it [here](https://docs.astro.build/en/guides/configuring-astro/#environment-variables).

## Solution

In this article, I will guide you how to solve this issue.

Requirement:
- I have two sites in two languages: English and Vietnamese.
- Each site will display different region.
  - English: Region = `US`.
  - Vietnamese: Region = `VN`.

Steps:

1. Create a new Astro project
   ```
   pnpm create astro@latest
   ```

2. Create `.env.en.local`.
   ```
   VITE_REGION=US
   ```

3. Create `.env.vi.local`.
   ```
   VITE_REGION=VN
   ```

4. Install dependencies
   ```
   pnpm add -D dotenv cross-env
   ```

5. Add two scripts to `package.json`.
   ```json
   {
     "scripts": {
       "dev:en": "cross-env SITE_LANG=en astro dev",
       "dev:vi": "cross-env SITE_LANG=vi astro dev"
       // other scripts
     }
   }
   ```
6. Update `astro.config.mjs`
   ```ts
   import dotenv from 'dotenv'

   const lang = process.env.SITE_LANG

   const envPath = `.env.${lang}.local`
   dotenv.config({ path: envPath })
   ```
7. Now, you can read environment variables from env file anywhere in Astro app.
   ```ts
   const region = import.meta.env.VITE_REGION
   ```

You can checkout the demo source code [here](https://github.com/ansidev/astro-demo-loading-environment-variables).
