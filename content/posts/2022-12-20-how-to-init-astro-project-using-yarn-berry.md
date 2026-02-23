---
type: post
title: How to init Astro project using yarn berry?
date: 2022-12-20T12:20:20+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-init-astro-project-using-yarn-berry
categories:
  - Tips and Tricks
  - Javascript
  - Astro
tags:
  - yarn berry
---

## Problem

At this moment, if you are trying to init a new Astro project, you will experience some technical problems and the Astro project does not run properly as expected.

GitHub issue: [#5637](https://github.com/withastro/astro/issues/5637).

## Workaround

1. Dependency modules was not installed.

   - cd into project root folder.
   - Create an empty `yarn.lock`.
   - Run `yarn install`.
   - Run `yarn dev`.

2. Astro page displays an error.

   - Add this line into `.yarnrc.yml`.

      ```yaml
      nodeLinker: node-modules
      ```

   - Run `yarn install`.
   - Run `yarn dev`
   - Refresh the Astro page.
