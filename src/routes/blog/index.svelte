<script context="module">
  export async function preload() {
    const res = await this.fetch("./data/blogs-list.json");
    const data = await res.json();

    return { blogsList: data };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fadeIn, fadeOut } from "../../components/fade";
  import { formatDate } from "../../helpers/format-date";
  import type { IBlog } from "../../interfaces/blog.interface";

  onMount(() => {
    document.body.classList.add("background");
  });

  export let blogsList: IBlog[];
</script>

<style lang="scss">
  .title {
    color: var(--app-color-primary);
  }

  .description {
    color: var(--app-color-dark);
    font-family: "Fira Code", monospace;
  }

  p {
    margin: 0;
  }

  p.date {
    text-align: end;
    font-family: "Fira Code", monospace;
    margin-top: 0.3rem;
    font-weight: bold;
  }

  .blog-link {
    display: block;

    transition: background-color 200ms ease-out;

    border-radius: 1rem;
    padding: 1rem 0.5rem;

    &:hover,
    &:focus {
      background-color: rgba(var(--app-color-primary-rgb), 0.1);
    }
  }
</style>

<svelte:head>
  <title>Blog // Puru Vijay</title>

  <meta
    name="description"
    content="Read about web development, designing and programming on Puru Vijay's blog." />

  <meta property="og:title" content="Blog // Puru Vijay" />
  <meta
    property="og:description"
    content="Read about web development, designing and programming on Puru Vijay's blog." />
  <meta
    property="og:image"
    content="https://puruvj.dev/media/blog-social-intro.png" />
  <meta property="og:url" content="https://puruvj.dev/blog/" />

  <link rel="canonical" href="https://puruvj.dev/blog/" />
</svelte:head>

<main tabindex="-1" in:fadeIn out:fadeOut>
  <h1>Blog</h1>

  {#each blogsList as { title, id, description, date }}
    <a class="blog-link" rel="prefetch" href="blog/{id}" aria-label={title}>
      <h2 class="title">{title}</h2>
      <p class="description">{description}</p>
      <p class="date">{formatDate(date)}</p>
    </a>
  {/each}
</main>
