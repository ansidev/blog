---
type: post
title: What is the maximum length of the multiplication of two integers?
date: 2022-10-06T22:43:15+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /math/what-is-the-maximum-length-of-the-multiplication-of-two-integers
categories:
  - Math
  - Arithmetic
tags:
  - multiplication
  - integer
---

## Question

Given two non-negative integers `m1` and `n1`, `m1` has `m` digits and `n1` has `n` digits.
`p1` is the product of `m1` and `n1` (`p1 = m1 x n1`), `p1` has `p` digits.

What is the maximum value of `p`?

## Answer

- 0 ≤ m1 ≤ 10<sup>m</sup> - 1
- 0 ≤ n1 ≤ 10<sup>n</sup> - 1
- 10<sup>k</sup> - 1 is an integer has k digits of 9

```
10^k - 1 = 9.....9
           |_____|
        k digits of 9
```

p1 = m1 x n1 ≤ (10<sup>m</sup> -1) x (10<sup>n</sup> -1)<br/>
&nbsp;&nbsp;   = 10<sup>m+n</sup> - 10<sup>m</sup> - 10<sup>m</sup> + 1<br/>
&nbsp;&nbsp;   = 10<sup>m+n</sup> - 1 - (10<sup>m</sup> - 1) - (10<sup>m</sup> - 1)<br/>
&nbsp;&nbsp;   ≤ 10<sup>m+n</sup> - 1

So, p1 can have maximum `m + n` digits.
