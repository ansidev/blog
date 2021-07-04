---
type: post
title: Fix FontAwesome icons being huge on page load
date: 2021-04-30T16:44:15+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: '@ansidev'
permalink: /javascript/fix-font-awesome-icons-being-huge-on-page-load
categories:
  - Tips and Tricks
  - Javascript
tags:
  - FontAwesome
---

# Problem

If you are using FontAwesome in your project, you may face to this problem: FontAwesome icons being huge on page load

# Solution

1. Turn off autoAddCss

```js
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
```

2. Load in CSS directly in your SCSS file:

```js
@import 'node_modules/@fortawesome/fontawesome-svg-core/styles'
```

You can apply this solution if your project is using Javascript framework such as React, Vue, etc...

I hope this solution can help you! Thanks for reading!