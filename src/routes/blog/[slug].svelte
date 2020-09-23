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
  import { onDestroy, onMount } from "svelte";
  import EmoButtons from "../../components/EmoButtons.svelte";
  import { fadeIn, fadeOut } from "../../components/fade";
  import { formatDate } from "../../helpers/format-date";
  import type { IBlog } from "../../interfaces/blog.interface";
  import { readingProgress } from "../../stores/progress.store";

  export let blogData: IBlog;
  let {
    title,
    body,
    date,
    description,
    cover_image,
    id,
    reading_time,
  } = blogData;

  // let height: number = 0;

  function handleProgressBar() {
    let height =
      document.body.scrollHeight - document.documentElement.clientHeight;
    const currentY = document.body.scrollTop;
    // console.log({ currentY, height, sh: document.body.scrollHeight });

    $readingProgress = currentY / height;
  }

  onMount(async () => {
    document.body.classList.remove("background");
    await import("lazysizes");
  });

  onDestroy(() => {
    $readingProgress = 0;
  });
</script>

<style lang="scss">
  p {
    margin: 0;
    font-family: "Fira Code", monospace;
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--app-color-primary);

    text-align: center;
  }

  #blog-content {
    font-size: 1.3rem;
  }

  div.progress {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 21;

    margin: 0;

    width: 100%;
    height: 4px;

    .indicator {
      height: 100%;
      width: 100%;

      background-color: var(--app-color-primary);

      transform: scaleX(0);
      transform-origin: 0 0;
    }
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

<svelte:body on:scroll={handleProgressBar} />

<main in:fadeIn out:fadeOut>
  <div class="progress" aria-roledescription="progress">
    <div class="indicator" style="transform: scaleX({$readingProgress})" />
  </div>
  <h1>{title}</h1>
  <p>
    {formatDate(date)} &bull; <span>{Math.ceil(reading_time)} min read</span>
  </p>
  <article id="blog-content">
    {@html body}
  </article>

  <EmoButtons blogID={id} />
</main>
