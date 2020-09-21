<script context="module">
  export async function preload(page) {
    const { slug } = page.params;

    try {
      const res = await this.fetch(`../blog/${slug}.json`);

      const data = await res.json();

      return { blogData: data };
    } catch {
      this.error(404, "Not Found");
      return;
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fadeIn, fadeOut } from "../../components/fade";
  import { formatDate } from "../../helpers/format-date";
  import type { IBlog } from "../../interfaces/blog.interface";

  export let blogData: IBlog;
  let { title, body, date, description, cover_image, id } = blogData;

  onMount(async () => {
    document.body.classList.remove("background");
    await import("lazysizes");
  });
</script>

<style lang="scss">
  p {
    margin: 0;
    font-family: "Fira Code", monospace;
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--app-color-primary);
  }

  #blog-content {
    font-size: 1.3rem;
  }
</style>

<svelte:head>
  <title>{title} // Puru Vijay</title>
  <meta name="description" content={description} />

  <meta property="og:title" content="{title} // Puru Vijay" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://puruvj.dev/{cover_image}" />
  <meta property="og:url" content="https://puruvj.dev/blog/{id}" />

  <link rel="canonical" href="https://puruvj.dev/blog/{id}" />
</svelte:head>

<main in:fadeIn out:fadeOut>
  <h1>{title}</h1>
  <p>{formatDate(date)}</p>
  <article id="blog-content">
    {@html body}
  </article>
</main>
