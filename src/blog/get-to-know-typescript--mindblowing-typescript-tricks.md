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

```ts
type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
```

We're using TypeScript's `infer` here, which helps pick out specific types from a complex type.

Here's how to use it:

```ts
type A = ArrayElement<string[]>; // string
type B = ArrayElement<readonly string[]>; // string
type C = ArrayElement<[string, number]>; // string | number
type D = ArrayElement<['foo', 'bar']>; // "foo" | "bar"
type E = ArrayElement<(P | Q | R)[]>; // P | Q | R

type Error1 = ArrayElement<{ name: string }>;
//                         ^^^^^^^^^^^^^^^^
// Error: Type '{ name: string; }' does not satisfy the constraint 'readonly unknown[]'.
```

There's a bit simpler version to get the element type.

```ts
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
```

## Retrieve type from a promise

Ever wanted to retrieve type from a function that returns a promise? You might've tried this:

```ts
function returnsPromise(): Promise<number>;

let num: typeof returnsPromise;
//       ^^^^^^^^^^^^^^^^^^^^^
// num: () => Promise<number>
```

We want `num`'s type to be the returned type of the promise(in this case `number`), and the above solution definitely didn't work.

The solution is to once again use `infer` to retrieve the type from the promise:

```ts
type UnwrapPromise<T> = T extends (props: any) => PromiseLike<infer U>
  ? U
  : T extends PromiseLike<infer K>
  ? K
  : T;
```

usage:

```ts
function returnsPromise(props: any) {
  return Promise.resolve(6);
}

const num: UnwrapPromise<typeof returnsPromise> = 8;
//    num: number
```

Here we wrapped a function that returns a promise into this type. This works directly with a regular `Promise<unknown>` type too.

> **Why `PromiseLike` instead of `Promise`?** \
> <br/>
>
> `Promise` interface comes with lot of pre-built methods exclusive to promises. But sometimes, you wanna create functions that return a `.then` just like Promises, but not have all the properties that `Promise`s do. In that case, we use `PromiseLike`

## Turning a tuple into union types

This is a tuple:

```ts
const tuple = ['a', 'b', 'c', 'd'] as const;
```

> Note: Without `as const` at the end, typescript will interpret the type as `string[]`, not as a tuple

Now we want to use these specific strings as union types. Easy peasy.

```ts
type Alphabet = 'a' | 'b' | 'c' | 'd';
```

This will do. But let's assume that this type and the array above are gonna end up in different files, and the project grows quite big, then you come back a few months later, and add another value `e` to the `tuple` variable, and BOOM!!! The whole codebase breaks, because you forgot to add `e` in the `Alphabet` union type.

We can automate the `Alphabet` union type generation, in such a way that it pulls its members directly from `tuple` variable.

```ts
type Alphabet = typeof tuple[number];
```

And here's the universal type safe type:

```ts
type Unionify<Tup extends readonly (string | number | boolean)[]> = Tup[number];
```

{{ series-links }}
