<script>
  import { onMount } from 'svelte';
  import { fadeIn, fadeOut } from '../components/fade';
  import NotFoundSvg from '../components/NotFoundSVG.svelte';

  const dev = process.env.NODE_ENV === 'development';

  export let status;
  export let error;

  onMount(() => void document.body.classList.add('background'));
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<main in:fadeIn out:fadeOut>
  <h1>
    <span style="color: var(--app-color-primary)">{status}</span> - {error.message}
  </h1>
  <NotFoundSvg />

  {#if dev && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }

  main :global(svg) {
    width: 100%;
    max-width: 40rem;
    height: auto;
  }

  main :global(path) {
    transition: fill var(--transition-duration) ease-in;
  }

  @media screen and (min-width: 600px) {
    h1 {
      font-size: 2.618rem * 1.618;
    }
  }
</style>
