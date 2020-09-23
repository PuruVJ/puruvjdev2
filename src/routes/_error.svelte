<script>
  import { onMount } from "svelte";

  export let status;
  export let error;

  const dev = process.env.NODE_ENV === "development";

  import { fadeOut, fadeIn } from "../components/fade";
  import { theme } from "../stores/theme.store";

  onMount(() => void document.body.classList.add("background"));
</script>

<style lang="scss">
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    max-width: 40rem;
    height: auto;
  }

  @media screen and (min-width: 600px) {
    h1 {
      font-size: 2.618rem * 1.618;
    }
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<main in:fadeIn out:fadeOut>
  <h1>
    <span style="color: var(--app-color-primary)">{status}</span> - {error.message}
  </h1>
  <img src="art/not-found-{$theme}.svg" alt={error.message} />

  {#if dev && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</main>
