---
title: Why I moved from Styled Components to (S)CSS modules
description: A little writeup of my reasons behind moving from Styled Components to SCSS modules, and the benefits I got out of this.
date: 16 April, 2021
cover_image: media/why-move-styled-to-css-modules--cover.jpg
---

![Cover image - random colors splashing](../../static/media/why-move-styled-to-css-modules--cover.jpg)

> Artwork by [Lucas Benjamin](https://unsplash.com/photos/wQLAGv4_OYs)

This blog post will be about my reasons to move from Styled Components to SCSS Modules. Its gonna be a raw and non-technical one (i.e., you probably won't learn anything new from it).

# What is styled-components?

Styled Components is a radical, new way of writing CSS for your React components. You can simply create components out of your styles

```tsx
export const Main = () => {
  return <HelloWorld>Hello World</HelloWorld>;
};

const HelloWorld = styled.h1`
  font-weight: 700;
  line-height: 1.618;
`;
```

This is a very, very convenient way of wiring CSS. All your CSS lives in the same file as your main logic. Its ultimate [Colocation](https://kentcdodds.com/blog/colocation/). Plus if you're a freak about small components, this really enforces you to write smaller components, cuz the components grow large very quickly thanks to all 3 techs in a single file: HTML + CSS + TS(Yes, I'm one of those people who dream in TypeScript). So you kinda feel obligated to break your components into smaller pieces, which is ultimately good.

Its just like Svelte and Vue's SFCs. They figured it out correctly, while this makes me mad about React.

Anyways, rant aside, this way of writing is really good, I can't insist enough. Need dynamic prop based styles, no worries, just pass props over to your styled component, and use it in there

```tsx
export const Main = () => {
  return <HelloWorld weight={600}>Hello World</HelloWorld>;
};

const HelloWorld = styled.h1<{ weight: number }>`
  font-weight: ${({ weight }) => weight};
  line-height: 1.618;
`;
```

> Pardon the TypeScript code if you're not familiar with it or hate it. It can't be helped. Its part of my very being now 😇.

It makes stuff very very easy. But this is where it starts to go wrong if you don't fully understand how React and its rendering processes work.

And yes, it automatically does the scoping and vendor prefixing. vendor prefixing is runtime generated, that is it determines if the browser needs vendor prefixes, then it will churn out styles with vendor prefixes. Its like a sweet runtime PostCSS and Autoprefixer running in the browser.

![Here be dragons](../../static/media/why-move-styled-to-css-modules--here-be-dragons.gif)

# What are CSS Modules?

CSS Modules is a slightly-less radical way of writing CSS. Its basically separate CSS files, but only modular. Syntax remains the same mostly, but it's scoped to the components where it is used (By mangling class names). The general pattern of these is this:

```txt
|-HelloWorld
  |-HelloWorld.tsx
  |-HelloWorld.module.css
```

> Notice I use .css at the end. It could be .scss or .less or .styl too, you name it. I personally use SCSS modules

Notice that out CSS Module has in the name itself that its a module, `*.module.*`. Its a <mark>Convention over Configuration</mark> approach, very prevalent in futuristic bundlers like [ESBuilt](https://esbuild.github.io/), [Vite](https://vitejs.dev/), [Snowpack](https://www.snowpack.dev/), etc.

And to use them, you import the css file in JS, and refer to it like this.

```tsx
import css from './HelloWorld.module.css';

export const Main = () => {
  return <h1 className={css.helloWorld}>Hello World</h1>;
};
```

Meanwhile out CSS file:

```css
/* HelloWorld.module.css */

.helloWorld {
  font-weight: 700;
  line-height: 1.618;
}
```

The generated CSS is something like this:

```css
/* HelloWorld.module.css */

.__B56BLAH_helloWorld_4269BRUHBRUH {
  font-weight: 700;
  line-height: 1.618;
}
```

The className is mangled, and the value is substituted in place of `css.helloWorld` in out component.

> Alright I took some artistic liberty and added some weird Elon Musk-y stuff there. The actual mangled output would be much smaller and sane 😁

CSS modules are very handy for this. Plus you can add tooling like `autoprefixer` to add vendor prefixes, compile stuff back to old CSS for browser compatibility.

# The app in question

Now the intro is over, lets look at the app which I moved from Styled components to CSS modules.
