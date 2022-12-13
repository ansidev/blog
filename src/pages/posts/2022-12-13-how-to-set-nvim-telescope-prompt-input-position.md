---
type: post
title: How to set nvim telescope prompt input position?
date: 2022-12-13T17:37:16+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-set-nvim-telescope-prompt-input-position
categories:
  - Tips and Tricks
  - Neovim
tags:
  - neovim
  - nvim
  - telescope
  - prompt
---

## Problem

By default, the Telescope prompt input is at the bottom. I want to move it to the top.

## Solution

Add this options

```lua
{
  defaults = {
    layout_strategy = "horizontal",
    layout_config = {
      horizontal = {
        prompt_position = "top",
      },
    },
    sorting_strategy = "ascending",
    --- other configs
  },
}
```
