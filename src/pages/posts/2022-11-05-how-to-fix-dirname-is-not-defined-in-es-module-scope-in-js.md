---
type: post
title: How to fix "__dirname is not defined in ES module scope" in JS
date: 2022-11-05T00:45:15+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-fix-dirname-is-not-defined-in-es-module-scope-in-js
categories:
  - Tips and Tricks
  - Javascript
  - TypeScript
tags:
  - dirname is not defined
  - ES Module
---

## Problem

Lines of code looks like this

```js
import path from 'path'

path.join(__dirname, 'children')
```

will produce the error

```js
ReferenceError: __dirname is not defined in ES module scope
```

## Solution

Update your code looks like this

```js
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

path.join(__dirname, 'children')

```
