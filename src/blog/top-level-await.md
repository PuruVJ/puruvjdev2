---
title: Top level Await is the GOAT 🥳
description: Top level await is literally the GOAT (Greatest of All Time). In every way. Read on to know why, how to use it, and its implications
date: 28 Dec, 2020 8:51 AM
cover_image: media/top-level-await-top-of-the-world.jpg
---

![Top of the world](../../static/media/top-level-await-top-of-the-world.jpg)

<mark>Top Level Await</mark> is literally awesome. It's the GOAT!!(**G**reatest **o**f **A**ll **T**ime, in case you couldn't guess 😉)

# The Dark Times...

There was an era, where if you tried to pull a stunt like this 👇 at the top of the document,

```js
const data = await fetch(URL);
```

JS would scream at you 👉 `SyntaxError: await is only valid in async function`

It was super frustrating. But what could you do then?

## The Hack

**Wrap it in IIFE**

> <mark>IIFE</mark>: Immediately Invoked Function expressions. [Flavio Copes has a really good article about it.](https://flaviocopes.com/javascript-iife/)

```js
(async () => {
  const data = await fetch(URL);
})();
```

> Not really a hack as far official spec is concerned, but to the code author, it definitely feels like one.

Just look at the code. So many brackets, so much boilerplate. The last line with `})();` makes me nauseous even after 5 years of JS development. So many weird brackets!!

But wait, it gets even better 😑

```js
(async () => {
  const response = await fetch(URL);
  const jsonData = await response.json();

  const finalData = await processJsonData(jsonData);

  if (finalData.propA.propB === 'who-cares') {
    // Do stuff
  }
})();
```

This code gets messier. And that code above is still very clean. Wait till you try to create your version of MacOS Desktop for Web (Shameless Plug! I'm working on it 😁 [macos.now.sh](https://macos.now.sh)). It's gonna get outright ugly, and you don't want ugly code. Nobody wants ugly code.

# A New Hope

> If you're wondering why I'm using Star Wars related words a lot, Mandalorian episode 16 dropped a few days ago, and literally, God appeared 😭. I'm still shaking from how good that episode was.

In comes Top Level await, ~~slashing his lightsaber into droids~~, taking the pains of IIFE hacks away.

Using it is as simple as the first code snippet on top:

```js
const data = await fetch(URL);
```

And it will work perfectly.

But, there certain requirements to use it.

# Requirements

It can be used only in an <mark>ES Modules</mark>.

That is, in scripts that are marked as modules in your HTML or in your package.json in Node

## Browser

In browser, JS alone is nothing. It needs to be linked to by the HTML file.

In your `index.html`:

```html
<script type="module" src="index.js" />
```

`type="module"` is necessary for it to be interpreted as an ES Module

## NodeJS

You need to have minimum of Node **13.9.0** for this feature to work. The current LTS is v14.15, and I recommend most users to always choose the LTS version. If you're reading this in 2025, and the LTS is v24, go for it, not 14.15. (I hope Node survives that long, what with Deno and Elsa being there now 😅)

> Note: I'm aware that you could use ES Modules long before 13.9.0 in NodeJS, but you had to pass the flag `--experimental-module`, as in `node index.js --experimental-module`, and these modules were highly experimental and unstable and subject to change then, so I didn't even bother with them.

These below are some steps to get ES Modules in Node working. Note that these aren't the only methods for that. There total of 2 or 3 right now, but I will explore the most common one only.

## Step 0

Have npm installed. If you already have node installed, you need not worry, you already have it.

Check Node version:

```bash
node -v
```

Check npm version:

```bash
npm -v
```

npm should be higher than `6.14.8` at this point of time.

But the Linux users might have some issues, as running `sudo apt install nodejs` downloads a super-old version of Node, and even without npm, that is (The Blasphemy 🥶).

In that case i recommend you to install nodeJS and npm using this [very good article](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04).

But beware, your problems won't be over because of the permissions issues. I recommend you to install `nvm` (Nope I didn't misspell `npm`), which will take care of all these problems for you. [Read how to install nvm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04).

After you have installed nvm, Run `nvm install --lts` to install the latest LTS version.

It's slightly longer method, but much less painful, both in short and long term

## Step 1

Create `package.json`
