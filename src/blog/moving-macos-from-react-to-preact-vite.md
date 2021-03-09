---
title: Moving Vite app from React to Preact ⚛ in 10 minutes
description: How I moved my 40+ components app from React to Preact in under 10 minutes
date: 12 Mar 2021
cover_image: media/moving-from-react-to-preact-vite--cover.jpg
---

![Cable car](../../static/media/moving-from-react-to-preact-vite--cover.jpg)

Heya you awesome dev!!Glad to see ya here 🙂. This post is just a recount of my experience when I moved a medium size React app(30+ components) to use Preact, in just <mark>10 minutes</mark>.

## Is it true?

You might be wondering if my claim of moving an app this big from one framework to other in just 10 minutes is true or just some clickbaity title, I assure you it isn't. It didn't take 10 minutes for this.

It took somewhere around <mark>8-9</mark> 😅😁

Yup. It took **less than 10 minutes** to move it.

# What is this app?

Alright, so the app in question is a fun side project I'm working on, [macOS Web](https://macos.now.sh), which is basically a MacOS Big Sur clone for Web(Don't tell Apple 🤫). As you can see in the screenshot below, it looks like MacOS Big Sur, just running in the browser.

![MacOS Web screenshot](../../static/media/moving-from-react-to-preact-vite--macos-screenshot.png)

I started making it in <mark>React</mark> and <mark>Snowpack</mark> (Think of it as Webpack that does everything you want it do, without telling it anything) boilerplate, then around 2 weeks back, I moved it from <mark>Snowpack</mark> to <mark>Vite</mark> (Similar to Snowpack, just more refined and with more features.), and got some really cool features out of it.

Then just a few days ago, I tried an experiment to move it to Preact. This wasn't any final decision. I just made a new branch, and started working on that. And surprisingly, this whole moving took less than 10 minutes.

# Process

## Installing right dependencies

This is parts of my `package.json` file before the transfer:

```json
{
  "dependencies": {
    "react": "^17.0.0",
    "react-dom": "^17.0.0"
  },
  "devDependencies": {
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    "@vitejs/plugin-react-refresh": "^1.3.1",
    "vite": "^2.0.5"
  }
}
```

As you can see, we have `react` and `react-dom` as dependencies, their respective TypeScript Typings as `devDependencies`, along with `vite` itself, and lastly the special package `@vitejs/plugin-react-refresh`. This last package is responsible for the <mark>Hot Module Reload</mark> magic of Vite with React.

> Note: The package.json above contains only the relevant code for this article. There are over 20 dependencies in the actual project.

So how do we move to Preact then? The answer lies in looking at the <mark>preact-ts</mark>(Preact starter with TypeScript) starter template of vite, and the only content here was 👇

```json
{
  "dependencies": {
    "preact": "^10.5.9"
  },
  "devDependencies": {
    "@prefresh/vite": "^2.0.0",
    "vite": "^2.0.5"
  }
}
```

Whoa!! That was drastic!! Notice that there's no `preact-dom` here, as `preact` has all the DOM stuff built in. Plus we have a different package <mark>@prefresh/vite</mark>. This I gathered was the HMR module for Preact with Vite.

So all I did was delete the `react` related packages, and installed these 2 packages(`preact` and `@prefresh/vite`).

## Modifying vite.config.ts

The `vite.config.ts` with React 👇

```ts
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
```

And the new config is:

```ts
import { defineConfig } from 'vite';
import prefresh from '@prefresh/vite';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'preact'`,
  },
  plugins: [prefresh()],
  alias: {
    react: 'preact/compat',
  },
});
```

1. Notice the `esbuild` property. Vite is built on top this super fast ES module bundler `esbuild`, here we are passing some options to it. `jsxFactory` and `jsxFragment` are exactly what they look like. The `jsxInject` here is a very magical✨ property, that automatically puts the statement passed to it in every single file, so it saves you the trouble of importing `h` from preact in every single file, or `React` for a `react` app.

2. In the `plugins` property, I have replaced `reactRefresh` with `prefresh`, and now our app supports HMR.

3. Lastly, `alias` is the most, MOST important property here. In this project, I'm using 15+ packages that import directly from `React`, and moving to preact would have broken them completely. So the alias property accepts a key value pair. In this case, I'm pointing `react` to `preact/compat`, which is `preact`'s compatibility layer to work with existing react apps.

## Fix tsconfig.json

We are using TypeScript with React, and we have to tell it that the JSX factory and fragments are now different, so let's do that small change.

```json
{
  ...
  "jsx": "preserve",
  "jsxFactory": "h",
  "jsxFragmentFactory": "Fragment"
  ...
}
```

## Modify index.tsx

The entrypoint of our app is the `index.tsx` app, which would need some modification to work with preact. Luckily the changes needed are **tiny**.

The code before 👇

```tsx
import ReactDOM from 'react-dom';
import { Desktop } from './views/desktop/Desktop';

ReactDOM.render(<Desktop />, document.getElementById('root'));
```

Here we are doing a `ReactDOM.render`. But preact itself has a `render` method. SO let's swap it out with.

```tsx
import { render } from 'preact';
import { Desktop } from './views/desktop/Desktop';

render(<Desktop />, document.getElementById('root'));
```

And BAM!! That's it. Only these 4 files needed to be changed. And this is how it all happened in less than 10 minutes.

I hope you got something good out of this article 😉.

Signing off!
