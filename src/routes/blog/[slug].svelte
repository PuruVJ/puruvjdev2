<script context="module">
  export async function preload(page) {
    const { slug } = page.params;

    const res = await this.fetch(`../blog/${slug}.json`);

    if (res.status === 404) {
      console.log("Not found");
      this.error(404, "Not Found");
      return;
    }

    const data = await res.json();

    return { blogData: data };
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fadeIn, fadeOut } from "../../components/fade";
  import { formatDate } from "../../helpers/format-date";
  import type { IBlog } from "../../interfaces/blog.interface";

  export let blogData: IBlog;
  let { title, body, date } = blogData;

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
  <title>{title}</title>
</svelte:head>

<main in:fadeIn out:fadeOut>
  <h1>{title}</h1>
  <p>{formatDate(date)}</p>
  <article id="blog-content">
    {@html body}
  </article>
</main>
