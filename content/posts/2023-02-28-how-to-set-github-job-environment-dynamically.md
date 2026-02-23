---
type: post
title: How to set GitHub job environment dynamically?
date: 2023-02-28T17:13:57+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /github-actions/how-to-set-github-job-environment-dynamically
categories:
  - DevOps
  - CI/CD
  - GitHub Actions
tags:
  - job environment
---

This is how I set the GitHub Actions job environment dynamically.

## Solutions

```yaml
name: deploy

on:
  pull_request:
    branches:
      - main
      - develop
    types:
      - opened
      - synchronize
      - closed

jobs:
  set_job_environment:
    if: github.event.action != 'closed' ||
      github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Set job environment as pr-${{ github.event.number }}
        if: github.base_ref == 'develop' &&
          contains(fromJSON('["opened", "synchronize"]'), github.event.action)
        env:
          JOB_ENVIRONMENT: pr-${{ github.event.number }}
        run: |
          echo "JOB_ENVIRONMENT=$JOB_ENVIRONMENT" >> $GITHUB_ENV

      - name: Set job environment as preview
        if: github.base_ref == 'develop' &&
          github.event.action == 'closed' &&
          github.event.pull_request.merged == true
        run: |
          echo "JOB_ENVIRONMENT=preview" >> $GITHUB_ENV

      - name: Set job environment as staging
        if: github.base_ref == 'main' &&
          contains(fromJSON('["opened", "synchronize"]'), github.event.action)
        run: |
          echo "JOB_ENVIRONMENT=staging" >> $GITHUB_ENV

      - name: Set job environment as production
        if: github.base_ref == 'main' &&
          github.event.action == 'closed' &&
          github.event.pull_request.merged == true
        run: echo "JOB_ENVIRONMENT=production" >> $GITHUB_ENV

      - name: Set job environment output
        id: job_environment
        run: |
          echo "github_environment=$JOB_ENVIRONMENT" >> $GITHUB_OUTPUT

    outputs:
      github_environment: ${{ steps.job_environment.outputs.github_environment }}

  deploy:
    needs: set_job_environment
    environment:
      name: ${{ needs.set_job_environment.outputs.github_environment }}
  # Other configurations
```

## References

- [GitHub Actions Runner Issue](https://github.com/actions/runner/issues/998).
