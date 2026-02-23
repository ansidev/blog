---
type: post
title: Monolithic vs. Microservices Architecture
date: 2022-05-05T09:42:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /software-development/monolithic-vs-microservices-architecture
categories:
  - Software Development
tags:
  - monolithic
  - microservices
  - software architecture
---

My notes about monolithic and microservices architecture

<!-- more -->

## Monolithic architecture

### What is monolithic architecture?

> A monolithic architecture is the traditional unified model for the design of a software application.
>
> Monolithic application is designed to be self-contained and components of the application are interconnected and interdependent.
>
> Each component and its associated components must be present in order for code to be executed or compiled successfully.
>
> The monolithic application is packaged and deployed as a single unit.

### Benefits of Monolithic Architecture

- Simple to develop.
- Simple to debug and test.
  - For example you can implement end-to-end testing by simply launching the application and testing the UI with Selenium.
- Simple to deploy.
  - You just have to copy the packaged application to the server.
- Simple to scale horizontally by running multiple copies behind a load balancer.

### Drawbacks of Monolithic Architecture

- The size of the application keeps increasing as the codebase grows and changes.
- The size of the application can slow down the start-up time.
- Hard to understand and make changes fast and correctly as the code becomes complicated.
- It takes a lot of time to re-test, re-build and re-deploy the entire application on each update if the size of the application is large.
- Hard to scale

## Microservices architecture

### What is microservices architecture?

> Microservices architecture (often shortened to microservices) refers to an architectural style for developing applications. Microservices allow a large application to be separated into smaller independent parts, with each part having its own domain of responsibility. To serve a single user request, a microservices-based application can call on many internal microservices to compose its response.

### Benefits of Microservices Architecture

- **Independent components** - Firstly, all the services can be deployed and updated independently, which gives more flexibility. Secondly, a bug in one microservice has an impact only on a particular service and does not influence the entire application. Also, it is much easier to add new features to a microservice application than a monolithic one.
- **Easier understanding** - Split up into smaller and simpler components, a microservice application is easier to understand and manage. You just concentrate on a specific service that is related to a business goal you have.
- **Better scalability** - Another advantage of the microservices approach is that each element can be scaled independently. So the entire process is more cost- and time-effective than with monoliths when the whole application has to be scaled even if there is no need in it. In addition, every monolith has limits in terms of scalability, so the more users you acquire, the more problems you have with your monolith. Therefore, many companies, end up rebuilding their monolithic architectures.
- **Flexibility in choosing the technology** - The engineering teams are not limited by the technology chosen from the start. They are free to apply various technologies and frameworks for each microservice.
- **The higher level of agility** - Any fault in a microservices application affects only a particular service and not the whole solution. So all the changes and experiments are implemented with lower risks and fewer errors.

### Drawbacks of Microservices Architecture

- **Extra complexity** - Since a microservices architecture is a distributed system, you have to choose and set up the connections between all the modules and databases. Also, as long as such an application includes independent services, all of them have to be deployed independently.
- **Dealing with transactions is a challenge** - Microservices has the partitioned database architecture. Business transactions that update multiple business entities in a microservices-based application need to update multiple databases owned by different services. Using distributed transactions is usually not an option and you end up having to use an eventual consistency based approach, which is more challenging for developers.
- **Hard to test** - Testing a microservices application is also much more complex then in case of monolithic web application. For a similar test for a service you would need to launch that service and any services that it depends upon (or at least configure stubs for those services).
- It is more difficult to implement changes that span multiple services. In a monolithic application you could simply change the corresponding modules, integrate the changes, and deploy them in one go. In a Microservice architecture you need to carefully plan and coordinate the rollout of changes to each of the services.
- Deploying a microservices-based application is also more complex. A monolithic application is simply deployed on a set of identical servers behind a load balancer. In contrast, a microservice application typically consists of a large number of services. Each service will have multiple runtime instances. And each instance need to be configured, deployed, scaled, and monitored. In addition, you will also need to implement a service discovery mechanism. Manual approaches to operations cannot scale to this level of complexity and successful deployment a microservices application requires a high level of automation.

## Reference links

- https://articles.microservices.com/monolithic-vs-microservices-architecture-5c4848858f59
- https://cloud.google.com/learn/what-are-containers
- https://www.ibm.com/cloud/learn/containers
- https://opensource.com/resources/virtualization
- https://www.vmware.com/topics/glossary/content/virtual-machine.html
- https://azure.microsoft.com/en-us/overview/what-is-a-virtual-machine
