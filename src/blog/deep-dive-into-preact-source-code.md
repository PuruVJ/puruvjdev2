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

This is the `types.d.ts` file:

```js
export type RenamedType = number | null;
```

And here's the JS file

```js
/**
 * @param {import('./types').RenamedType} a
 * @param {import('./types').RenamedType} b
 * @returns
 */
function sum(a, b) {
  return a + b;
}
```

As you can see, the JavaScript code is just that: JavaScript. You won't see TypeScript style type specified in it. Rather all type information is specified in comments, which are ignored completely. There's a whole article about [Using TypeScript without TypeScript](https://puruvj.dev/blog/get-to-know-typescript--using-typescript-without-typescript), but the TLDR; here would be: Avoid development time tooling. if its just plain JS, you don't need to run a file watcher to transpile files as you change them. Just run what you got. And you already got a TypeScript compiler running all the time without you explicitly running it: Your VSCode.

This is a very interesting approach and I see more and more libraries take it up, especially non-UI libraries(For UI libraries, you already got a web server running, so adding in TypeScript in the tooling won't change much, go ahead and add TypeScript)

## Very well written code

I don't need to say this out loud really, but Preact's source code is very very well written and commented, as you'd expect from such a paramount framework.

## It reuses itself a lot

Yup. One of the reasons Preact is so small is that it reuses it's own exported function in its other exported functions. A LOTT!! I'll show you some places where this happens

# Disclaimer

This is not gonna be a complete breakdown, and won't be sequential. Preact is quite a big library to cover in a blog post, so I'll just cover the interesting parts

So, let's begin!! We'll look at some interesting things in the `core` module(i.e., the one when you type `import {} from 'preact'`), then we'll got to hooks

# Core module

## index.js

As is the tradition, lets start with the `index.js` file:

```js
export { render, hydrate } from './render';
export {
  createElement,
  createElement as h,
  Fragment,
  createRef,
  isValidElement,
} from './create-element';
export { Component } from './component';
export { cloneElement } from './clone-element';
export { createContext } from './create-context';
export { toChildArray } from './diff/children';
export { default as options } from './options';
```

Notable points: `h`, which is Preact's JSX factory, is actually named `createElement`. Just like `React.createElement`. But is exported as `h` because it allows you to write raw Preact(Without JSX) 👇

```js
h('div', { class: 'haha' }, h('span', { key: 34 }, h('h1', {}, h('span', {}, 'Whoa'))));
```

Also it is notable that it exports `createElement` as it is too, to maintain compatibility with `React.createElement`

## create-element.js

```js
import options from './options';

/**
 * Create an virtual node (used for JSX)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * constructor for this virtual node
 * @param {object | null | undefined} [props] The properties of the virtual node
 * @param {Array<import('.').ComponentChildren>} [children] The children of the virtual node
 * @returns {import('./internal').VNode}
 */
export function createElement(type, props, children) {
  /*...*/
}

/**
 * Create a VNode (used internally by Preact)
 * @param {import('./internal').VNode["type"]} type The node name or Component
 * Constructor for this virtual node
 * @param {object | string | number | null} props The properties of this virtual node.
 * If this virtual node represents a text node, this is the text of the node (string or number).
 * @param {string | number | null} key The key for this virtual node, used when
 * diffing it against its children
 * @param {import('./internal').VNode["ref"]} ref The ref property that will
 * receive a reference to its created child
 * @returns {import('./internal').VNode}
 */
export function createVNode(type, props, key, ref, original) {
  /*...*/
}

export function createRef() {
  return { current: null };
}

export function Fragment(props) {
  return props.children;
}

/**
 * Check if a the argument is a valid Preact VNode.
 * @param {*} vnode
 * @returns {vnode is import('./internal').VNode}
 */
export const isValidElement = (vnode) => vnode != null && vnode.constructor === undefined;
```

> Omitted `createElement` and `createVNode` as they're quite big.

### createRef

Let me blow your mind. `ref`s in P/React are basically used to encapsulate values that shouldn't trigger re-renders and are not re-created on every re-render. Lets see how Preact defines it:

```js
export function createRef() {
  return { current: null };
}
```

A ref is just an object with `current` property set to `null`. It's always advertised as that, but I never thought that it's **actually** an object internally too.

![Astonished](../../static/media/deep-dive-preact-source--astonished-cat.gif)

### Fragment

Next up, we have `Fragment`. Its also another astonishing thing.

```js
export function Fragment(props) {
  return props.children;
}
```

Fragment, just returns its `children`. That's all! 🤯🤯

I knew that's what it's **supposed** to do, but I always pictured some complex code. Didn't realise that it was just this super simple thing.

### isValidElement

```js
/**
 * Check if a the argument is a valid Preact VNode.
 * @param {*} vnode
 * @returns {vnode is import('./internal').VNode}
 */
export const isValidElement = (vnode) => vnode != null && vnode.constructor === undefined;
```

Simply checking if the current Virtual DOM Node passed to it is valid or not. Again, one liner, super small, but here's a pattern I found out by looking at this code only. Notice `@returns {vnode is import('./internal').VNode}` in JSDoc. The coe is basically using type assertions. Right in the JSDoc. I haven't seen this pattern before, which is all the more testimony to the old saying about reading code written by developers better than you.

## render.js

Remember the index.jsx file, where you initialize your preact app

```jsx
import { render, h } from 'preact';
import App from './App';

render(<App />, document.querySelector('#app'));
```

This is the `render` function 👇

```js
/**
 * Render a Preact virtual node into a DOM element
 * @param {import('./internal').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * render into
 * @param {import('./internal').PreactElement | object} [replaceNode] Optional: Attempt to re-use an
 * existing DOM tree rooted at `replaceNode`
 */
export function render(vnode, parentDom, replaceNode) {
  if (options._root) options._root(vnode, parentDom);

  // We abuse the `replaceNode` parameter in `hydrate()` to signal if we are in
  // hydration mode or not by passing the `hydrate` function instead of a DOM
  // element..
  let isHydrating = typeof replaceNode === 'function';

  // To be able to support calling `render()` multiple times on the same
  // DOM node, we need to obtain a reference to the previous tree. We do
  // this by assigning a new `_children` property to DOM nodes which points
  // to the last rendered tree. By default this property is not present, which
  // means that we are mounting a new tree for the first time.
  let oldVNode = isHydrating ? null : (replaceNode && replaceNode._children) || parentDom._children;

  vnode = ((!isHydrating && replaceNode) || parentDom)._children = createElement(Fragment, null, [
    vnode,
  ]);

  // List of effects that need to be called after diffing.
  let commitQueue = [];
  diff(
    parentDom,
    // Determine the new vnode tree and store it on the DOM element on
    // our custom `_children` property.
    vnode,
    oldVNode || EMPTY_OBJ,
    EMPTY_OBJ,
    parentDom.ownerSVGElement !== undefined,
    !isHydrating && replaceNode
      ? [replaceNode]
      : oldVNode
      ? null
      : parentDom.firstChild
      ? EMPTY_ARR.slice.call(parentDom.childNodes)
      : null,
    commitQueue,
    !isHydrating && replaceNode ? replaceNode : oldVNode ? oldVNode._dom : parentDom.firstChild,
    isHydrating
  );

  // Flush all queued effects
  commitRoot(commitQueue, vnode);
}

/**
 * Update an existing DOM element with data from a Preact virtual node
 * @param {import('./internal').ComponentChild} vnode The virtual node to render
 * @param {import('./internal').PreactElement} parentDom The DOM element to
 * update
 */
export function hydrate(vnode, parentDom) {
  render(vnode, parentDom, hydrate);
}
```

First off, **very well commented**.

From how well I can make sense of the situation here, `render` function is basically making a `commitQueue` to store all the changes needed to be done. next, the `diff` function is taking in the old VNode and the new VNode, making sense of situation and figuring out which DOM Nodes need to be updated, and populating `commitQueue`.

Then its basically `committing` these changes. Its just like how we do it in Database. We perform some operation in batch, the commit, so they all get applied one by one at the same time.

### hydrate

This function is very interesting, as it nothing but calling the `render` function. But something even more interesting, its passing along **itself** as the 3rd argument. And if you look again at `render` function, it actually has an if condition looking if the function passed to it is named `hydrate`

I'm probably exhausting my repeat limit, but darn!! Preact's reuse of itself is really, darn good!!!
