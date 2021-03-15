---
title: Mindblowing 🤯 TypeScript tricks
description: There's a lot about TypeScript that most people don't know. I'll surface some of the "unknown" stuff in this blog post.
date: 19 Mar, 2021
cover_image: media/mindblowing-typescript-tricks--cover.jpg
series: 'Get to know TypeScript'
---

![Colorful](../../static/media/mindblowing-typescript-tricks--cover.jpg)

{{ series-links }}

Apologies for the clickbaity title 🙃. But it is in good faith, cuz I'm gonna introduce you to some TypeScript related tricks that are bound to blow your mind to pieces. And if you can read the whole post without feeling wonder at any trick, great for you!! You're TypeScript pro already 🥳

So let's cut to the chase.

# In-built types 🥱

These are some of the built-in helper types in TypeScript. I'll keep this section short, as you can read about these anywhere. A good starting point would be [TypeScript Docs](https://www.typescriptlang.org/docs/handbook/utility-types.html) Then we'll get to the juicy stuff 😋

## Pick

It allows to pick specific fields from a type/interface, along with their types and create a brand new type. Let's take a look at this 👇

```ts
type UserFields = {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dob: Date;
};

type NameAndGenderOnly = Pick<UserFields, 'name' | 'gender'>;

// This is equal to 👇
type NameAndGenderOnly = {
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
};
```

See!?! The same types, without any duplication.

## Partial

This is the most used type of mine. If you have a type/interface, and for some reason, you wanna make **all** its fields optional, this is it 👇

```ts
type UserFields = {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dob: Date;
};

type OptionalUserFields = Partial<UserFields>;

// This is equal to 👇
type OptionalUserFields = {
  id?: number;
  name?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dob?: Date;
};
```

## Readonly

This is very useful, when you wanna make sure that an object's properties can't be changed in your code. Think of it as a `const` for your object properties.

```ts
type UserFields = {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  dob: Date;
};

const userData: Readonly<UserFields> = {
  id: 100,
  name: 'Puru Vijay',
  gender: 'male',
  dob: new Date('12 Nov, 2001'),
};
```

Trying to modify any property like `userData.name = 'Hoolalala'` will result in error.

## Record

Now we are getting to the good stuff. I've had a new-found respect for `Record` recently, while working on my current project [macos.now.sh](https://macos.now.sh) (Shameless Plug: It's basically a macOS Big Sur clone written in Preact and Vite).

Take a look at this 👇

```ts
export type AppName =
  | 'finder'
  | 'launchpad'
  | 'safari'
  | 'messages'
  | 'mail'
  | 'maps'
  | 'photos'
  | 'facetime'
  | 'calendar';

/** Which apps are currently open */
export const openApps: Record<AppName, boolean> = {
  finder: false,
  launchpad: false,
  safari: false,
  messages: false,
  mail: false,
  maps: false,
  photos: false,
  facetime: false,
  calendar: false,
};
```

As you can see, this is just a simple key-value pair. But I wanted to enforce that this object contains all the apps listed in the `AppName` union type, and that all the values are boolean only. I also wanted to be presented with an error if I add a new app to the list, which would make me add that app's key value pair to this `openApps` object.

This is where `Record` comes in. It's simply a way to enforce the types of the keys as well as values. Another layer of safety that TypeScript adds.

# Juicy stuff 😋

Now the fun part begins.

## Retrieve element type from Array

Suppose you have an Array, and you wanna extract the type of each Element from an array

{{ series-links }}
