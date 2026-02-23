---
type: post
title: Go Channel
date: 2022-11-10T13:44:27+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: "@ansidev"
permalink: /programming/go/channel
categories:
  - Programming
  - Go
tags:
  - channel
  - unbuffered channel
  - buffered channel
  - deadlock
---

My notes about Go channel.

<!-- more -->

> Channels are a typed conduit through which you can send and receive values with the channel operator, `<-`.

- Channel can only save homogeneous data type. So you must declare the type of the channel you want to create.
  ```go
  chan int // channel only accepts int
  chan string // channel only accepts string
  chan bool // channel only accepts bool
  ```

- You need to initialize a channel before using it with `make`, otherwise the channel is `nil` and not available to use.
  ```go
  // Syntax: {variable_name} := make(chan {type})
  ch := make(chan int) // works
  var ch2 chan int // don't work
  ```

- You need to initialize a channel before using it with `make`.
  ```go
  ch := make(chan int) // int is type of channel data
  ```

- Sending/Receiving data using channel:
  ```go
  x := <- ch // read data from channel ch into variable x
  ch <- y // send y to the channel ch
  ```

- Close a channel:
  ```go
  close(ch)
  ```

  Note: You **cannot** send data to a closed channel.

- Type of channels:
  - `unbuffered channel`: a channel is created with no capacity.
    ```go
    // Syntax: {variable_name} := make(chan {type})
    ch := make(chan int) // unbuffered channel
    ```
  - `buffered channel`: a channel is created with capacity.
    ```go
    // Syntax: {variable_name} := make(chan {type}, {capacity})
    ch := make(chan int, 5) // buffered channel, capacity = 5
    ```

- Channel blocking mechanism:
  - Unbuffered channel

    Sending and receiving are blocked until the other side is ready. This allows goroutines to synchronize without explicit locks or condition variables.
    ```go
    ch := make(chan int) // unbuffered channel
    ```

  - Buffered channel

    Sending data to a buffered channel are blocked only when the buffer is full.

    Receiving data from a buffered channel are blocked only when the buffer is empty.
    ```go
    ch := make(chan int, 5) // buffered channel
    ```

- Deadlock with channel

  A deadlock happens when a group of goroutines are waiting for each other and none of them is able to proceed. Examples:
  - The data which are sent into a channel cannot be received by any receiver anywhere in your code.
  - You try to read data from a channel but there is no data are sent to the channel anywhere in your code.
