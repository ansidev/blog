---
home: true
layout: home
title: "ansidev's blog – Notes on code, tools and shipping software"
# No site-title suffix on the homepage: the title already starts with the site name.
titleTemplate: false
---

<script setup>
import { data as posts } from '../loaders/post.data'
</script>

<div class="home-hero">
  <h1><span>Notes on code, tools and shipping software.</span></h1>
  <p>Hi, I'm ansidev: a developer, product crafter and open-source lover. This is where I share tips and tricks, DevOps notes, and the tools and side projects I build along the way.</p>
</div>

<HomePage :posts="posts" />
