---
type: post
title: What is .PHONY in makefile?
date: 2022-04-06T21:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: '@ansidev'
permalink: /programming/what-is-dot-phony-in-makefile
categories:
  - Programming
tags:
  - makefile
---

## What is `.PHONY` in makefile?

> A phony target is one that is not really the name of a file; rather it is just a name for a recipe to be executed when you make an explicit request.

## Why `.PHONY`?

There are two benefits of using a phony target:

1. Avoid a conflict with a file of the same name.

```shell
clean:
    rm *.o temp
```

In this example, the clean target will not work properly if a file named clean is ever created in this directory. Since it has no prerequisites, clean would always be considered up to date and its recipe would not be executed. To avoid this problem you can explicitly declare the target to be phony by making it a prerequisite of the [special target](https://www.gnu.org/software/make/manual/html_node/Special-Targets.html#Special-Targets) `.PHONY` as follows:

```shell
.PHONY: clean
clean:
    rm *.o temp
```

Once this is done, `make clean` will run the recipe regardless of whether there is a file named `clean`.

2. Improve performance.

2.1 Recursive use of `make`

Suppose you have a sub-directory subdir which has its own makefile, and you would like the containing directory's makefile to run make on the sub-directory.

The solution are:

```shell
subsystem:
    cd subdir && $(MAKE)
```
or

```shell
subsystem:
    $(MAKE) -C subdir
```

**What is the right solution if we have many subsystems that need to be built?**

You might think of the below solution:

```shell
SUBDIRS = foo bar baz

subdirs:
    for dir in $(SUBDIRS); do \
        $(MAKE) -C $$dir; \
    done
```

There are problems with this method, however. First, any error detected in a sub-make is ignored by this rule, so it will continue to build the rest of the directories even when one fails. This can be overcome by adding shell commands to note the error and exit, but then it will do so even if make is invoked with the `-k` option, which is unfortunate. Second, and perhaps more importantly, you cannot take advantage of make's ability to build targets in [parallel](https://www.gnu.org/software/make/manual/html_node/Parallel.html#Parallel), since there is only one rule.

By declaring the sub-directories as `.PHONY` targets (you must do this as the sub-directory obviously always exists; otherwise it won't be built) you can remove these problems:

```shell
SUBDIRS = foo bar baz

.PHONY: subdirs $(SUBDIRS)

subdirs: $(SUBDIRS)

$(SUBDIRS):
    $(MAKE) -C $@

foo: baz
```

Here we have also declared that the `foo` sub-directory cannot be built until after the `baz` sub-directory is complete; this kind of relationship declaration is particularly important when attempting parallel builds.

The [implicit rule](https://www.gnu.org/software/make/manual/html_node/Implicit-Rules.html#Implicit-Rules) search is skipped for `.PHONY` targets. This is why declaring a target as `.PHONY` is good for performance, even if you are not worried about the actual file existing.

2.2 Phony target prerequisites

A phony target should not be a prerequisite of a real target file; if it is, its recipe will be run every time make goes to update that file. As long as a phony target is never a prerequisite of a real target, the phony target recipe will be executed only when the phony target is a [specified goal](https://www.gnu.org/software/make/manual/html_node/Goals.html#Goals).

Phony targets can have prerequisites. When one directory contains multiple programs, it is most convenient to describe all of the programs in one makefile ./Makefile. Since the target remade by default will be the first one in the makefile, it is common to make this a phony target named `all` and give it, as prerequisites, all the individual programs. For example:

```shell
all: app1 app2 app3
.PHONY: all

app1: app1.go
    go build -o dist/app1 app1.go

app2: app2.go
    go build -o dist/app2 app2.go

app3: app3.go
    go build -o dist/app3 app3.go
```

Now you can say just `make` to remake all three programs, or specify as arguments the ones to remake (as in `make app1 app3`). Phoniness is not inherited: the prerequisites of a phony target are not themselves phony, unless explicitly declared to be so.

<hr/>

Sources:
- [https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html).
- [https://www.gnu.org/software/make/manual/html_node/Recursion.html](https://www.gnu.org/software/make/manual/html_node/Recursion.html).
