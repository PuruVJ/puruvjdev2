---
title: The Zen of Preact's source code
description: Dive into Preact's source code and explore its simplicity
date: 23 April, 2021
cover_image: media/deep-dive-preact-source--cover.jpg
---

![Cover image](../../static/media/deep-dive-preact-source--cover.jpg)

> _Artwork by [Fernando Jorge](https://unsplash.com/photos/GxymWkdnl4Y)_

Preact is [web dev]household name at this point. Almost every web developer who's been in tis business for longer than 2 years has heard of it and maybe even tried it themselves. And probably reached the same conclusion as me: **It's awesome!! 😻**.

So today, I'm gonna do a deep dive into Preact's source code, and remark on interesting things I find there.

# What is Preact?

In case you're not familiar, Preact is the `3Kb` alternative to the `42KB` of React, by [Jason Miller](https://twitter.com/_developit). It's fully compatible with React's API and supports all packages that rely on React. Its awesome that way.

# Observations

Before we look at the code, I'll remark on some things about Preact.

## Written in TypeScript, but not quite...

Preact source code is written in TypeScript, but the main files themselves aren't. The main files with the functionality are written in plain JavaScript, but they use `JSDoc` to pull in Types from TypeScript Definition files (.d.ts).

An example:

This is the `.d.ts` file:

```ts
declare function sum(a: number, b: number): number;
```
