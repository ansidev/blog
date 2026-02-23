---
type: post
title: How to work with multiple git accounts on a single machine?
date: 2022-10-10T15:29:35+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /tips-and-tricks/how-to-work-with-multiple-git-accounts-on-a-single-machine
categories:
  - Tips and Tricks
  - Git
tags:
  - GitHub
  - GitLab
  - BitBucket
---

## Problem

Assuming I have two Github accounts:
- `gh-user1` (email: gh-user1@github.com).
- `gh-user2` (email: gh-user2@github.com).

I am using gh-user1 as the global GitHub account on my local computer.

Now I want to setup my computer to commit and push as `gh-user2` on project X.

How can I setup the account `gh-user2` on my local computer?

## Solution

### Steps

1. [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).
2. [Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
3. [Generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).
4. [Adding a GPG key to your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account).
5. Open the terminal and cd into root folder of project X.
6. Run following commands:

```sh
# Setup user email
git config --local user.email 'gh-user2@github.com'.

# Setup user display name
git config --local user.name 'Your display name'

# Setup ssh command to forcing use the specific private key for this Git project only
git config --local core.sshCommand 'ssh -i /path/to/your-ssh-private-key'

# Setup local GPG signing key
git config --local user.signingkey {your_gpg_signing_key_id}

# Enable signing commit feature
git config --local commit.gpgsign true
```

You can add an alias to your shell command for easily applying.

```sh
alias git-gh-user-2="git config --local user.email 'gh-user2@github.com' && git config --local user.name 'Your display name' && git config --local user.signingkey {your_gpg_signing_key_id} && git config --local commit.gpgsign true && git config --local commit.gpgsign true"
```

For the future project, if you want to commit and push as gh-user2 on new projects, just cd into the project and run the alias command.

## Conclusion

You can find many other solutions on the Internet. If it works for you, just use them.

I am using 2 GitHub accounts for this solution but you can apply it for other Git hosting providers (GitLab, BitBucket, etc...).

If you find my articles and projects useful to you, consider donating to me at:

- [Paypal](https://paypal.me/ansidev)
- [Ko-fi](https://ko-fi.com/ansidev)
- [Buy me a coffee](https://buymeacoffee.com/ansidev)
- [Momo](https://me.momo.vn/ansidev)
