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

Don't believe me? You can check it out right here: [Demo](https://macos-web-svelte-dock-puruvj.vercel.app/).
And here's the original source code @ Github: [Source](https://github.com/PuruVJ/macos-web-svelte-dock)

Feel free to read the source code directly, if you feel like you can understand what is going on just from reading the source. And if you can't, no problem, that's what this article is for 😎

Let's dive into it!!

# Preliminary setup

Our demo won't look good without that slick background and the great CSS everywhere. So let's set up the basic shell of our application.

```svelte
<script lang="ts">
</script>
```
