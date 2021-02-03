---
title: Using TypeScript without TypeScript 😎
description: Wanna use TypeScript but don't want all the compiler and tooling overhead? Read on to know how.
date: 8 Feb 2021
published: true
series: 'Get to know TypeScript'
---

{{ series-links }}

Before starting, I wanna get this outta the way: If your reaction on reading the title was anywhere close to Hermione's 👇

![Hermione losing her mind](../../static/media/using-ts-without-ts-hermione-goes-crazy.gif)

Don't worry. I haven't gone crazy, and neither will you after reading this 😉

With that out of the way, let's begin.

Lemme break it down

# Best things about TypeScript

What are the best things about TypeScript. Some things that can be listed here:

- Static type Checking
- Seamless integration with <mark>VSCode</mark>
- Futuristic. Use any syntax that isn't even in JS and TS will convert it to something backwards-compatible.
- JS files can be converted to TS files seamlessly.
- Catches silly bugs in your code.
- Strict about code.

There can be more,

# Think again!

Are all of these really the best things about TypeScript? Sure these are all really good. But the problem that comes with them is the fact that you need an additional compile step. Also, you need tooling to watch your project as the files change. That adds a boatload of configuration, dependencies, and just more and more complexity.

# Duh, just use a boilerplate 🙄

Yeah, I got it dude/tte, I can use a boilerplate from npm that will set up the right config, and all I have to do is `npm start` for watching and `npm run build` for final bundle.

But it doesn't get rid of the added complexity that is the dependencies, watch step and build step.

For modern Web App development, it's all fine. You already have a dev server running. Throwing in a few more plugins won't make much difference. And tools like [Snowpack](https://www.snowpack.dev/) and [Vite](https://vitejs.dev/) completely get rid of complexities by collapsing layers(That is, they come with all the right **batteries included**, so you don't have to do any config work yourselves. If that piqued your interest, check out this amazing article by [Shawn "swyx" wang](https://twitter.com/swyx) about [Collapsing Layers](https://www.swyx.io/collapsing-layers/))

The problem comes when you're trying to build your own library to be published on npm. And by library here, I refer to a **non-UI library**(Not Component libraries, for example).

Why non-UI library? Because you aren't running any dev server on them by default. You have to test them everytime by reloading the page, or worse, again and again run `node index.js` if it's a NodeJS related library.

With libraries like these, if you include TypeScript in development process, there are some **heavy** drawbacks:

## Watch step

You have to keep a watcher running in one terminal, and use another one to test your code. You end up with a situation where you have 2 terminals open:

![Double terminals](../../static/media/using-ts-without-ts-double-terminals.png)

Split terminals. And good luck dealing with 2 terminal windows if your terminal doesn't split up.

## Build step

This one is probably worse than the watch step, for frontend libraries. In frontend, one of the most important thing is the bundle size you're sending to the user. The bundle size has to be kept as low as possible, so the site can load fast enough.

And this where one of TypeScript's best feature actually becomes a handicap: **TRANSPILING FOR OLDER BROWSERS**

Look at this 👇

```ts
const arr = [1, 2, 3, 4, 5];

const newArr = [...arr, 6, 7];
```

Looks simple enough. We're just trying to create a new array from an existing array and add some items to it using the <mark>Spread operator</mark>. But if your TSConfig's target is specified as less than `es2015`, you're gonna get a very weird result:

```js
'use strict';

var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };

var arr = [1, 2, 3, 4, 5];
var newArr = __spreadArrays(arr, [6, 7]);
```

Wohkay!! That's a tad too much. All we wanted to do was just concat an array with another. Effectively this 👇

```js
const arr = [1, 2, 3, 4, 5];

const newArr = arr.concat([6, 7]);
```

{{ series-links }}
