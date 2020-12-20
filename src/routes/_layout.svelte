<script>
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import { BUILD } from '../constants';
  import { stores } from '@sapper/app';
  import { theme } from '../stores/theme.store';
  import { onMount } from 'svelte';
  import { waitFor } from '../helpers/utils';

  const { page } = stores();

  let previousScrollTop = false;

  page.subscribe(() => {
    if (!BUILD.isBrowser) return;

    if (!previousScrollTop) {
      previousScrollTop = true;
      return;
    }

    return void document.body.scrollTo({ top: 0, behavior: 'smooth' });
  });

  onMount(async () => {
    await waitFor(200);

    document.body.style.setProperty('--transition-duration', '200ms');
  });

  export let segment;
</script>

<style>
  main {
    flex: 1 1 auto;
  }
</style>

<svelte:head>
  <!-- As this component is omnipresent, the script for different favicons will live here -->

  {#if BUILD.isDev}
    <link rel="icon" href="./icons/favicon-dev.svg" />
  {:else}
    <link rel="icon" href="./icons/favicon-{$theme}.svg" />
  {/if}
</svelte:head>

<Nav {segment} />

<main style="margin-top: 3.75rem">
  <slot />
</main>

<Footer />
