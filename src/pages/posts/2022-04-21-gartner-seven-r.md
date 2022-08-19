---
type: post
title: Gartner 7R
date: 2022-04-21T18:38:34+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /software-development/gartner-seven-r
categories:
  - Software Development
tags:
  - gartner
  - 7R
  - migrating application strategy
---

## Gartner 7R

This is 7 steps you should practice if you want to modernize your legacy application, recommended by Gartner.

1. Retain

   Also known as "encapsulating," is used when it is best to leave the application running "as-is" rather than modernizing it. It usually applies to legacy applications with constraints preventing their migration to a cloud. A common practice is to encapsulate the retained system behind an API so that other systems can easily consume its capabilities as they are modernized and migrated to a cloud.

2. Rehost

   Also known as "lift-and-shift," rehosting means migrating applications "as is." It redeploys an application to cloud infrastructure without recompiling, altering its code, or modifying its features and functions.

   This "no-code" approach is an effective way to get to the cloud quickly with minimal effort and cost. Its use cases range from healthy applications that are essentially cloud-ready to large legacy systems that are not worth modernizing. Rehosting is a practical approach that can help build your teams' cloud skills and confidence.

3. Replatform

   Also known as "lift and reshape," replatforming is a relatively low-touch cloud migration approach that upgrades the application to a new runtime platform (i.e., operating system, middleware, shift to managed service database). Application code changes are limited to what is necessary to adapt to the new platform. It neither alters code structure nor the functions the application provides.

4. Refactor

   Refactoring involves optimizing existing code while retaining its external behavior. This strategy improves the design of existing code to better integrate with available cloud technologies and remove technical debt. However, as this approach requires significant non-functional code changes, they will add time, cost, and complexity to the migration effort.

5. Rearchitect

   Rearchitecting, also known as re-engineering, materially alters the application code. It is a significant body of work requiring time, money, and skilled and knowledgeable people. This approach allows to shift code to the new application architecture and fully exploit platform and cloud capabilities. As a result, it gives better scalability and performance due to overarching changes in applications.

6. Rebuild

   Rebuilding an application is rewriting it from scratch. This approach involves recreating the application using new technology to implement the existing application's functionality as defined by the original specification.

   Before moving forward with a Rebuild approach, you should take some time to analyze Replace options.

7. Replace

   Also known as "drop and shop," replacing entails eliminating the former application and sourcing an entirely new product as a solution. The Rebuild and Replace approaches share the same drivers and both result in creating a new way to deliver the required functionality. As opposed to rebuilding, replacing decreases the number of migration activities. Data migration is often simplified with a replacing approach, as many systems provide a dedicated import feature.
