---
title: Zen of Preact source code
description: Dive into Preact's source code and explore its simplicity
date: 23 April, 2021
cover_image: media/deep-dive-preact-source--cover.jpg
---

![Cover image](../../static/media/deep-dive-preact-source--cover.jpg)

> _Artwork by [Fernando Jorge](https://unsplash.com/photos/GxymWkdnl4Y)_

Preact is [web dev]household name at this point. Almost every web developer who's been in this business for longer than 2 years has heard of it and maybe even tried it themselves. And probably reached the same conclusion as me: **It's awesome!! 😻**.

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

This is not gonna be a complete breakdown, and won't be sequential. Preact is quite a big library to cover in a blog post, so I'll just cover the interesting parts.

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

export function createElement(type, props, children) {
  /*...*/
}

export function createVNode(type, props, key, ref, original) {
  /*...*/
}

export function createRef() {
  return { current: null };
}

export function Fragment(props) {
  return props.children;
}

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

A little clip of me when I found this out 👇

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
export const isValidElement = (vnode) => vnode != null && vnode.constructor === undefined;
```

Simply checking if the current Virtual DOM Node passed to it is valid or not. Again, one liner, super small, but here's a pattern I found out by looking at this code only. Notice `@returns {vnode is import('./internal').VNode}` in JSDoc. The coe is basically using type assertions. Right in the JSDoc. I haven't seen this pattern before, which is all the more testimony to the old saying about reading code written by developers better than you.

## render.js

Remember the index.jsx file, where you initialize your preact app

```js
import { render, h } from 'preact';
import App from './App';

render(<App />, document.querySelector('#app'));
```

This is the `render` function 👇

```js
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

export function hydrate(vnode, parentDom) {
  render(vnode, parentDom, hydrate);
}
```

First off, **very well commented**.

From how well I can make sense of the situation here, `render` function is basically making a `commitQueue` to store all the changes needed to be done. next, the `diff` function is taking in the old VNode and the new VNode, making sense of situation and figuring out which DOM Nodes need to be updated, and populating `commitQueue`.

Then its basically `committing` these changes. Its just like how we do it in Database. We perform some operation in batch, the commit, so they all get applied one by one at the same time.

> I would love to cover `diff` in the blog post too, but its so big it has its own **500 lines** long file 😵. All you have to know, its job is to figure out which DOM Nodes need to be updated and which to keep the same.

### hydrate

This function is very interesting, as it nothing but calling the `render` function. But something even more interesting, its passing along **itself** as the 3rd argument. And if you look again at `render` function, it actually has an if condition looking if the function passed to it is named `hydrate`. Heck there's even a comment about `abusing` the 3rd argument 😂. These people are way too smart!!

I'm probably exhausting my repeat limit, but darn!! Preact's reuse of itself is really, darn good!!!

## create-context.js

This one will probably excite you, as Context is a very, very loved API by a majority of P/React developers. This wasn't always the case, but the `useContext` hooks made it very easy to use context. Way too easy!!

```ts
const { lemonsCount, setLemonsCount } = useContext(lemonsContext);
```

```ts
import { enqueueRender } from './component';

export let i = 0;

export function createContext(defaultValue, contextId) {
  contextId = '__cC' + i++;

  const context = {
    _id: contextId,
    _defaultValue: defaultValue,
    /** @type {import('./internal').FunctionComponent} */
    Consumer(props, contextValue) {
      return props.children(contextValue);
    },
    /** @type {import('./internal').FunctionComponent} */
    Provider(props) {
      if (!this.getChildContext) {
        let subs = [];
        let ctx = {};
        ctx[contextId] = this;

        this.getChildContext = () => ctx;

        this.shouldComponentUpdate = function (_props) {
          if (this.props.value !== _props.value) {
            subs.some(enqueueRender);
          }
        };

        this.sub = (c) => {
          subs.push(c);
          let old = c.componentWillUnmount;
          c.componentWillUnmount = () => {
            subs.splice(subs.indexOf(c), 1);
            if (old) old.call(c);
          };
        };
      }

      return props.children;
    },
  };

  // Devtools needs access to the context object when it
  // encounters a Provider. This is necessary to support
  // setting `displayName` on the context object instead
  // of on the component itself. See:
  // https://reactjs.org/docs/context.html#contextdisplayname

  return (context.Provider._contextRef = context.Consumer.contextType = context);
}
```

This file, this small file, is all there's to the core context API. These 42 lines do so much(Comments excluded).

So,let's inspect `Consumer`. Go back a long time back and remember we used to use `Consumer` to access context data.

(Hard to remember? Yeah, me too 😉)

Anyways, so this is how it looked

```js
<Consumer>{(data) => <div>Hello {data}</div>}</Consumer>
```

This looks pretty manageable, but it could get worse when your code grew.

So, if we look at the code of `Consumer`, it's just this:

```ts
Consumer(props, contextValue) {
  return props.children(contextValue);
},
```

That's it!! Its expecting its `children` to be a function, and it's simply calling it with the context data. Suddenly the `Consumer` pattern example above makes sense 🤯🤯.

As for `Provider`, what it's doing mostly is modifying its parent component's lifecycle hooks to watch for context state changes.

Lastly, there's the `return` statement at the bottom. The last line is big mutation trick that is used often while coding classical languages like C, C++, Java etc, that is, returning a variable and mutating it at the same time. Here, it is mutating it for the sake of Preact devtools, so as to show the `displayName` in devtools, as React Devtools do.

And now, its time for the section you probably came here for entirely: **HOOKS!!**

# Hooks

So, first off, Hooks are located in a separate directory. Unlike React, everything is opt-in in Preact, which makes the Minimalist in me rejoice. There's intentionality in every thing you do here. I 😍 that.

So, let's start off with the very, very first hook you ever encountered: `useState`

> But Beware, a twist lies here 😈

## useState

This, is `useState`:

```js
export function useState(initialState) {
  currentHook = 1;
  return useReducer(invokeOrReturn, initialState);
}
```

![Wait, what!?!?](../../static/media/deep-dive-preact-source--wait-what.gif)

Mindblown right? As you can see, useState is basically calling `useReducer`, which is another standard React hook. So basically, `useState` is just an alias of `useReducer`, you could say.

> The variables `invokeOrReturn` and `currentHook` are defined in the same file, in the module scope and managed by Preact.

And lemme give you another nugget. See the `currentHook = 1` expression? Guess what: It's not needed in the core functionality. It exists solely for <mark>Preact Devtools</mark>. That is, if Devtools weren't a consideration, this code might as well have been:

```ts
const useState = (initialState) => useReducer(invokeOrReturn, initialState);
```

Literally a one liner!! 🤯🤯🤯🤯

Again, intense focus on the whole self-reusing thing I keep repeating.

All the heavy lifting here is done by the `useReducer`, so let's look at it next.

## useReducer

```ts
export function useReducer(reducer, initialState, init) {
  /** @type {import('./internal').ReducerHookState} */
  const hookState = getHookState(currentIndex++, 2);
  hookState._reducer = reducer;
  if (!hookState._component) {
    hookState._value = [
      !init ? invokeOrReturn(undefined, initialState) : init(initialState),

      (action) => {
        const nextValue = hookState._reducer(hookState._value[0], action);
        if (hookState._value[0] !== nextValue) {
          hookState._value = [nextValue, hookState._value[1]];
          hookState._component.setState({});
        }
      },
    ];

    hookState._component = currentComponent;
  }

  return hookState._value;
}
```

I'll admit I don't fully understand what's going on here 😅, but something that caught my eye here: Look at the `hookState._value = [` declaration inside the `if` block. Its an array with 2 elements. 1st element is simply a value. 2nd one is a function.

Wait a sec. 1st element a value, 2nd element a function...

Holy smokes!!! Its the `[state, setState]` pair returned from `useState` 😵😵

```ts
const [state, setState] = useState(Infinity); // 😈
```

if that didn't blow your brains apart, I dunno what will.

Next up: The 2nd most famous hook!

## useEffect

```ts
export function useEffect(callback, args) {
  /** @type {import('./internal').EffectHookState} */
  const state = getHookState(currentIndex++, 3);
  if (!options._skipEffects && argsChanged(state._args, args)) {
    state._value = callback;
    state._args = args;

    currentComponent.__hooks._pendingEffects.push(state);
  }
}
```

Aha!!! Notice the `if` block here. We're checking for 2 things.

`!options._skipEffects` - Preact has an options config, where you can turn off all side effects from running. So to run this `useEffect`, we have to make sure its safe to run effects.

2. `argsChanged(state._args, args)`: This one is very interesting. Remember the 2nd argument you pass to `useEffect`?

```ts
useEffect(() => {
  /* Do epic shit */
}, [emojiUpdated]);
```

Guess what, `argsChanged` is the function responsible for checking if changes were made in the dependencies passed to `useEffect`. Here, we pass it `state._args`, the argument list maintained by Preact for this specific hook, and the 2nd argument is the new set of dependencies. If any changes are detected, this function returns true, and the effect is run again.

As for `argsChanged` function, its simply this 👇

```ts
function argsChanged(oldArgs, newArgs) {
  return (
    !oldArgs ||
    oldArgs.length !== newArgs.length ||
    newArgs.some((arg, index) => arg !== oldArgs[index])
  );
}
```

Its basically checking if oldArgs even exist or not at first. Why?

Cuz the dependency list passed to `useEffect` itself could be a state holding an array.

```ts
const [deps, setDeps] = useState([]);

useEffect(() => {
  /* Do epic shit */
}, deps);
```

OFC, a simple reason could be that you didn't pass the array. That is what most people would do rather than this above method 😅.

2nd, its checking if argument list length is different or not. This is a smart move, because if the array size itself is changed, you don't need to go through and check every value.

> The cheapest function call is the one you never make ~~ <mark>Jason Miller</mark>

And finally, when all these conditions are true, we finally check if the values match up using the `arr.some` method.

From what I can tell, this function is written in a way to stop as soon as it can. You could've written this same function in a way that it would do all these things, **and then** tell the result. Here, through some clever <mark>short circuiting </mark>, they made this function pretty efficient.

Next up, is another hook that will blow your mind and change the way you write your `Ref`s. Yepp, you guessed it right, its `useRef` 😎

## useRef 😎

> This hook's implementation is so cool that I can't help but put the Sunglasses emoji in front of it 😁

```ts
export function useRef(initialValue) {
  currentHook = 5;
  return useMemo(() => ({ current: initialValue }), []);
}
```

If you notice, `useRef` is just `useMemo` in disguise, with an object that has one property: `current` with value null.

So, effectively, you could write your refs as memos

```ts
const containerElementRef = useMemo(() => ({ current: null }), []);
```

Don't take this too seriously though. Its better if element refs are assigned to proper `useRef` values only, as it is cleaner, the syntax is built around it
