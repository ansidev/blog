---
type: post
title: Java collection types comparison notes
date: 2022-03-14T19:00:00+07:00
author: ansidev
gravatar: a2ac3c4477e717c7fa15041d907e71fd
twitter: '@ansidev'
permalink: /java/collection-types-comparison-notes
categories:
  - Data Structure
  - Java
tags:
  - Java collection
---

My notes about Java collection types comparison.

---

# ArrayList vs. LinkedList

| #            | ArrayList                                                                                                                      | LinkedList                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Behavior     | Implement **List** interface, so it can act as a list.                                                                         | Implement **List** and **Dequeue** interface, so it can act as a list and queue both.                                              |
| Storing      | Data are stored in a **dynamic array**.                                                                                        | Data are stored in a **doubly-linked list**.                                                                                       |
| Manipulation | **Slow** because it internally uses an array. If any element is removed from the array, all the bits re shifted in the memory. | **Faster** because it uses a doubly-linked list, so no bit shifting is required in the memory, only the reference link is changed. |
| When to use? | ArrayList is **better for storing and accessing** data.                                                                        | LinkedList is **better for manipulating** data.                                                                                    |

# ArrayList vs. Vector

| #               | ArrayList                                                                                      | Vector                                                                                                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Synchronization | Non-synchronized, which means that multiple threads can operate on ArrayList at the same time. | **Synchronized**, which means that only one thread can access the code at a time.                                                                                                                        |
| Legacy          | ArrayList is **not legacy** class, it was introduced in JDK 1.2.                               | Vector is **legacy** class.                                                                                                                                                                              |
| Size            | ArrayList **increments 50%** of its current size if element added exceeds its capacity.        | Vector **increments 100%** of its current size if element added exceeds its capacity.                                                                                                                    |
| Speed           | ArrayList is **fast** because it is non-synchronized.                                          | Vector is **slow** because it is synchronized, i.e., in a multithreading environment, it holds the other threads in runnable or non-runnable state until current thread releases the lock of the object. |
| Iteration       | ArrayList uses **Iterator** interface to **traverse** through elements.                        | Vector can use both **Iterator or Enumerator** interface to **traverse** through elements.                                                                                                               |
| When to use?    | ArrayList is use mostly in **single-thread applications**.                                     | **Collections.synchronizedList()** is preferred to Vector nowadays.                                                                                                                                      |

# List vs. Set

| #            | List                                                                       | Set                                                                    |
| ------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Order        | Order sequence                                                             | Unorder sequence                                                       |
| Duplication  | Allowed                                                                    | Disallowed                                                             |
| Null element | It is possible to store several null elements.                             | A null element can only be stored once.                                |
| Accessing    | Elements can be accessed based on their position.                          | Access to items from a certain position is not permitted.              |
| When to use? | Use it when you want to frequently access the elements by using the index. | Set is used when you want to design a collection of distinct elements. |

# Set vs. Map

| #               | Set                                                                                                                               | Map                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Duplication     | Duplicate values are not permitted                                                                                                | Unique key, but repeatable values         |
| Traversing      | Use Using the keyset() and entryset() methods                                                                                     | Not possible, you must convert Map to Set |
| Insertion Order | Both Set and Map don't keep the insertion order, however, some of Set's classes, such as LinkedHashSet, keep the insertion order. |                                           |

# HashMap vs. TreeMap

| #                 | HashMap                                                                                                                                | TreeMap                                                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implementation    | The Java HashMap implementation of the Map interface is based on **hash tables**.                                                      | Java TreeMap is a Map interface implementation based on a **Red-Black Tree structure**, which is a self balancing binary search tree.             |
| Interface         | The **Map**, **Cloneable**, and **Serializable** interfaces are implemented by HashMap.                                                | **NavigableMap**, **Cloneable**, and **Serializable** interfaces are implemented by TreeMap.                                                      |
| Null Keys/ Values | null key: **allow only one null key**, null value: allow multiple.                                                                     | null key: **not permitted**, null value: allow multiple.                                                                                          |
| Data Types        | HashMap does not perform sorting on keys, so it allows for heterogeneous elements.                                                     | TreeMap allows homogeneous values as a key because of sorting.                                                                                    |
| Performance       | HashMap is faster than TreeMap because it provides constant time performance that is O(1) for the basic operation like get() and put() | TreeMap is slow in comparison to HaskMap because it provides the performance of O(log(n) for most operation like add(), remove(), and contains(). |
| Order of elements | HashMap does not maintains any order.                                                                                                  | TreeMap elements are sorted in natural ordering (ascending).                                                                                      |
| When to use?      | Use HashMap when we does not require key-value pair in sorted order                                                                    | Use TreeMap when we require key-value pair in ascending order.                                                                                          |
