<script>
  import Footer from "../components/Footer.svelte";
  import Nav from "../components/Nav.svelte";
  import { BUILD } from "../constants";
  import { stores } from "@sapper/app";

  const { page } = stores();

  page.subscribe(() => {
    if (!BUILD.isBrowser) return;
    document.body.scrollTo({ top: 0, behavior: "smooth" });
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
    <link rel="icon" href="./icons/favicon.svg" />
  {/if}
</svelte:head>
<Nav {segment} />

<main>
  <slot />
</main>

<Footer />
