<script>
  import { onMount } from "svelte";

  import { fadeIn, fadeOut } from "../../components/fade";

  onMount(() => {
    document.body.classList.add("background");
  });
</script>

<svelte:head>
  <title>Blog // Puru Vijay</title>
</svelte:head>

<main in:fadeIn out:fadeOut>
  <h1>Blog</h1>
</main>
