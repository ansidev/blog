---
type: post
title: How to generate public key in other format from SSH private key?
date: 2022-11-12T15:45:13+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-generate-public-key-in-pem-format-from-ssh-private-key
categories:
  - Tips and Tricks
tags:
  - public key
  - PEM format
  - private key
---

## Problem

I want to generate public key in PEM/PKCS8 format from SSH private key.

## Solution

Update your code looks like this:

```sh
ssh-keygen -f {path_to_ssh_private_key} -e -m {output_format} > {path_to_output_key}
ssh-keygen -f id_rsa -e -m PEM > id_rsa.pem
ssh-keygen -f id_rsa -e -m PKCS8 > id_rsa.pem
```

For more information, you can read the manual:

```sh
man ssh-keygen
```
