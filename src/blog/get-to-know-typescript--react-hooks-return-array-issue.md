---
title: React TypeScript Hooks quirk when returning array
description: React and TypeScript make up a great pair. But when you're trying to make your own hooks, and returning an array, TypeScript yells at your. Find out why.
date: 19 Feb, 2021
series: 'Get to know TypeScript'
---

{{ series-links }}

![Batman and Robin's dance](../../static/media/segregate-array-return-types-react-batman-robin.gif)

React and TypeScript make for a mean pair. Combined, they can rule the whole world together. But sometimes, these two can get off on a tangent about some small details, and we the devs have to be the scapegoat in their battle of egos. One such problem is when we're making our own custom hooks, which return an array of a value and a function, just like `useState`.

```js
const [state, setState] = useState(null);
```

It's clearly visible that `state` is a value, and `setState` is a function. When you use this hook, everything works out fine, and these 2 have their own types on them.

But the issue happens when you're trying to make your own hook that returns an array, very similar in structure to `useState`. Let's see an example:

```js
import { useState, useEffect } from 'react';

type TTheme = 'light' | 'dark';

export function useTheme() {
  // Media query
  const systemTheme: TTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const localValue = localStorage.getItem('theme:type') as TTheme;

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(localValue || systemTheme);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;

    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
```

This hook here does very simple thing. Looks for stored theme in localStorage. If it's not there, it fall backs to device preference. When it has decided what theme to use, it sets local state variable `theme` to that value for future use in the first `useEffect` hook. The first `useEffect` has an empty array as the dependency list, so it basically acts like a `componentDidMount` in this case.

Our 2nd `useEffect` basically watches the `theme` variable, and reacts by appending `data-theme="{theme}"` on `<body>`, so that CSS can use that to change the actual theme. Lastly it stores the current preference in localStorage, so it can be picked off when user visits the site again.

Lastly we're returning an array of `[theme, setTheme]`, so we can utilise the theme and change it from anywhere. All fine.

**Until you try to use this hook 😈**

Let's say you're writing a component whose job is to switch the theme, and it uses our `useTheme` hook to do it.

You create a function to change the theme using `setTheme` exported from this hook:

```js
const [theme, setTheme] = useTheme();

const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
```

And you run into a weird error:

![Array type weird error](../../static/media/segregate-array-return-types-react-error-array-type.gif)

That's weird. Why is that happening?

If you see closely, the type of `setTheme` here is showed as

```ts
string | React.Dispatch<React.SetStateAction<string>>
```

But that's weird. We clearly know that `setTheme` is a function. If you hover over it in your editor, you can confirm it's type is `React.Dispatch<React.SetStateAction<string>>`, it doesn't have any `string` type as a constituent.

But wait, that's not it. If you hover over `theme`, it's type is the same as `setState` above.

And when you hover over `useTheme`, you find that it returns an Array of the type above 👇

```ts
(string | React.Dispatch<React.SetStateAction<string>>)[]
```

![What the hell is going on](../../static/media/segregate-array-return-types-react-confusion.gif)

This is weird. How can we have TypeScript separate the types for each item?

# (TLDR) Solution

Before I jump into the explanation, here's the final solution directly.

## Option 1

Make this function's return type a <mark>Tuple</mark>(See the section below for the explanation).

```diff
import { useState, useEffect } from 'react';

type TTheme = 'light' | 'dark';

- export function useTheme() {
+ export function useTheme(): [string, React.Dispatch<React.SetStateAction<string>>] {
  // Media query
  const systemTheme: TTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const localValue = localStorage.getItem('theme:type') as TTheme;

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(localValue || systemTheme);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;

    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
```

This will return a Tuple instead of an Array, so every element will have its own separate type. The error will be resolved

## Option 2

This is the less verbose way, and I prefer this one over the 1st one.

```diff
import { useState, useEffect } from 'react';

type TTheme = 'light' | 'dark';

export function useTheme() {
  // Media query
  const systemTheme: TTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const localValue = localStorage.getItem('theme:type') as TTheme;

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(localValue || systemTheme);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;

    localStorage.setItem('theme', theme);
  }, [theme]);

-  return [theme, setTheme];
+  return [theme, setTheme] as const;
}
```

{{ series-links }}
