<script context="module">
  export async function preload() {
    const res = await this.fetch('./data/blogs-list.json');
    const data = await res.json();

    return { blogsList: data };
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import BlogList from '../../components/BlogList.svelte';
  import { fadeIn, fadeOut } from '../../components/fade';
  import type { IBlog } from '../../interfaces/blog.interface';

  onMount(() => {
    document.body.classList.add('background');
  });

  export let blogsList: IBlog[];
</script>

<svelte:head>
  <title>Blog // Puru Vijay</title>

  <meta
    name="description"
    content="Read about web development, designing and programming on Puru Vijay's blog."
  />

  <meta property="og:title" content="Blog // Puru Vijay" />
  <meta
    property="og:description"
    content="Read about web development, designing and programming on Puru Vijay's blog."
  />
  <meta property="og:image" content="https://puruvj.dev/media/blog-social-intro.png" />
  <meta property="og:url" content="https://puruvj.dev/blog/" />

  <link rel="canonical" href="https://puruvj.dev/blog/" />
</svelte:head>

<main tabindex="-1" in:fadeIn out:fadeOut>
  <h1>Blog</h1>

  <BlogList {blogsList} />
</main>
