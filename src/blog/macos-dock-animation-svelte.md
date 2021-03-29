---
title: Amazing macOS Dock animation in Svelte
description: Let's make the beautiful macOS Dock animation using Svelte
date: 2 April 2021
cover_image: media/macos-dock-animation-svelte--cover.png
---

![MacOS Big Sur dock when being animated](../../static/media/macos-dock-animation-svelte--cover.png)

macOS Dock, when you hover over it, has such a good feedback animation. The current icon your cursor is over becomes big, and the nearby icons become bigger too, but as you move your cursor, the icons' size changes based on distance from your cursor, kinda like this below 👇

![Dock animation preview as GIF](../../static/media/macos-dock-animation-svelte--animation-preview.gif)

Pardon the bad quality 😁. Pretty slick, right? So interactive, so playful, its just freaking good 😍

But here's a twist. **That isn't macOS**. There are no tooltips, no desktop icons, even the animation looks bouncier.

Ladies and Gentlemen, what you see above is the final product we're gonna make in this blog post using Svelte. **In less than 100 lines of logic 😎**

## That looks way too good for just 100 lines 🧐🧐

I know!! That's the beauty of Svelte 😌

Don't believe me? You can check it out right here: [Demo](https://macos-web-svelte-dock-puruvj.vercel.app/). \
And here's the original source code @ Github: [Source](https://github.com/PuruVJ/macos-web-svelte-dock)

Feel free to read the source code directly, if you feel like you can understand what is going on just from reading the source. And if you can't, no problem, that's what this article is for 😎

Let's dive into it!!

# Tech Stack

Here's what the tech stack is gonna be for this little demo:

- Svelte
- popmotion library
- Typescript 4
- Vite

## What's with Vite? 🤔

Vite is the new cool kid in the block 😎. Its basically a bundler and dev server like Webpack(With the Dev Server plugin), only it comes with everything pre-built and pre-configured, so you can jump into the code directly.

It won't change how we write the code, only the way we refer to our assets changes a bit, so you don't have to worry about it much.

## Popmotion?

Yeah, this is an animation library on which the utterly awesome <mark>Framer Motion</mark> library is build. We don't really need the animation related stuff from this library, only a small helper function that is essential for this demo. Install it beforehand

```bash
npm i popmotion
```

Or if you're a `Yarn` person

```bash
yarn add popmotion
```

# Preliminary setup

Our demo won't look good without that slick background and the great CSS everywhere. So let's set up the basic shell of our application.

So let's start with the root component.

```html
<!-- App.svelte -->

<script>
  import Dock from './lib/Dock.svelte';
</script>

<main>
  <Dock />
</main>

<style>
  main {
    max-width: 100vw;
    height: 100vh;

    background: url('/wallpaper.jpg');
    background-size: cover;
    background-position: center center;
  }
</style>
```

Let's break it down

1. We're importing the `Dock` component. It's not declared yet, so there will be red squiggles in there. We'll declare it in a moment.

2. We have a `main` tag enclosing the `Dock` element.

3. We have our styles here. These are simply set so that the beautiful macOS Big Sur wallpaper takes up all the space and adjusts to different viewport sizes gracefully.

So we end with this beautiful view 👇

![Basic MacOS colorful wallpaper](../../static/media/macos-dock-animation-svelte--scaffold-wallpaper.png)

> Notice we're referencing `wallpaper.jpg` as if its next to our current file, but it isn't. It's inside Vite's `public` folder. You can refer to those files as if you're current component in inside the `public` folder. This holds for `<link>`, `<img>`, `<a>` tags and what not. Go crazy 🤪!

# The Dock

So let's set up the actual `Dock.svelte` component.

Here it is 👇

```html
<script lang="ts">
  import DockItem from './DockItem.svelte';

  const apps: string[] = [
    'calendar',
    'facetime',
    'finder',
    'launchpad',
    'mail',
    'maps',
    'messages',
    'photos',
    'scared-cat',
    'safari',
    'system-preferences',
    'view-source',
  ];

  let mouseX: number | null = null;
</script>

<section class="dock-container">
  <div
    class="dock-el"
    on:mousemove="{(event) => (mouseX = event.x)}"
    on:mouseleave="{() => (mouseX = null)}"
  >
    {#each apps as appID}
    <DockItem {mouseX} {appID} />
    {/each}
  </div>
</section>

<style>
  .dock-container {
    margin-bottom: 0.3rem;
    left: 0;
    bottom: 0;
    z-index: 9900;
    position: fixed;

    width: 100%;
    height: 5rem;

    padding: 0.4rem;

    display: flex;
    justify-content: center;
  }

  .dock-el {
    backdrop-filter: blur(5px);
    background-color: hsla(240, 3%, 11%, 0.4);

    box-shadow: inset 0 0 0 0.2px rgb(245 245 245 / 70%), hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

    padding: 0.3rem;

    border-radius: 1.2rem;

    height: 100%;

    display: flex;
    align-items: flex-end;
  }
</style>
```

Ooh, there's a lot going on here!! Let's break it down.

```ts
import DockItem from './DockItem.svelte';

const apps: string[] = [
  'calendar',
  'facetime',
  'finder',
  'launchpad',
  'mail',
  'maps',
  'messages',
  'photos',
  'scared-cat',
  'safari',
  'system-preferences',
  'view-source',
];

let mouseX: number | null = null;
```

1. We're importing the `DockItem` component. It is the heart of the whole demo, as all the animation is handled within it. I'll show you how to write it soon.

2. Next up we have a list of all app IDs. Why are these needed? Because our app icons are stored by these names only, so we can easily `<img src=` them.

3. And here we have a `mouseX` variable, which we're gonna be tracking the current x-coordinate of our mouse (Distance of mouse from the left side of the screen). Notice we have defined its type as `number` or `null`. It will be `null` when the mouse isn't on the dock, so as to prevent any unintended resizing of elements. So we initialize it as `null`.

Now, analyzing the html part:

```html
<section class="dock-container">
  <div
    class="dock-el"
    on:mousemove="{(event) => (mouseX = event.x)}"
    on:mouseleave="{() => (mouseX = null)}"
  >
    {#each apps as appID}
    <DockItem {mouseX} {appID} />
    {/each}
  </div>
</section>
```

We have a `section.dock-container` as the container for the whole dock. This itself isn't the dock, it **contains** the dock. Its just an invisible container to center the dock.

Next here we have the `div.dock-el`, which is the dock itself.

![The Dock itself](../../static/media/macos-dock-animation-svelte--the-dock-itself.png)

Notice the event handlers we have put on this element.

```html
on:mousemove="{(event) => (mouseX = event.x)}"
```

This simply sets the value of the `mouseX` variable to the value of mouse's x-coordinate, or simply the distance from the left side of the screen.

```html
on:mouseleave="{() => (mouseX = null)}"
```

This simply sets the value of `mouseX` back to null, as a way of telling our components that dock isn;t being hovered over, so it can disable the animation.

How does this tie into the whole thing? I'll explain soon.

Next up we have this little section:

```html
{#each apps as appID}
<DockItem {mouseX} {appID} />
{/each}
```

We're looping through all the `apps`, which if you remember is the array of IDs of apps, by which name the app icons are stored in the `public` folder.

Next up is the `DockItem` taking in `mouseX` and current `appID` as props. We'll see how these are used within the component.

## The juicy stuff 😋

Let's do the `DockItem` element now.

I'll drop the whole code here. Its quite big. Try reading it before the explanation, then the explanation will make more sense.

```html
<script lang="ts">
  import { interpolate } from 'popmotion';
  import { spring } from 'svelte/motion';
  import ButtonBase from './ButtonBase.svelte';

  /** Block 1 */

  export let appID: string;
  export let mouseX: number | null;

  let el: HTMLImageElement;

  /** Block 2 */

  const baseWidth = 57.6;
  const distanceLimit = baseWidth * 6;
  const beyondTheDistanceLimit = distanceLimit + 1;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / 1.25,
    -distanceLimit / 2,
    0,
    distanceLimit / 2,
    distanceLimit / 1.25,
    distanceLimit,
  ];
  const widthOutput = [
    baseWidth,
    baseWidth * 1.1,
    baseWidth * 1.618,
    baseWidth * 2.618,
    baseWidth * 1.618,
    baseWidth * 1.1,
    baseWidth,
  ];

  let distance = beyondTheDistanceLimit;

  const widthPX = spring(baseWidth, {
    damping: 0.38,
    stiffness: 0.1,
  });

  $: $widthPX = interpolate(distanceInput, widthOutput)(distance);

  let width: string;
  $: width = `${$widthPX / 16}rem`;

  /** Block 3 */

  let raf: number;

  function animate(mouseX: number) {
    if (el && mouseX !== null) {
      const rect = el.getBoundingClientRect();

      // get the x coordinate of the img DOMElement's center
      // the left x coordinate plus the half of the width
      const imgCenterX = rect.left + rect.width / 2;

      // difference between the x coordinate value of the mouse pointer
      // and the img center x coordinate value
      const distanceDelta = mouseX - imgCenterX;
      distance = distanceDelta;
      return;
    }

    distance = beyondTheDistanceLimit;
  }

  $: raf = requestAnimationFrame(() => animate(mouseX));
</script>

<section>
  <ButtonBase>
    <img
      bind:this="{el}"
      class="app-icon"
      src="/app-icons/{appID}/256.png"
      alt=""
      style="width: {width};"
    />
  </ButtonBase>
</section>

<style>
  .app-icon {
    width: 57.6px;
    height: auto;
  }
</style>
```
