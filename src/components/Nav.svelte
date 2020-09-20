<script lang="ts">
  import ThemeSwitcher from "../components/ThemeSwitcher.svelte";
  import { theme } from "../stores/theme.store";

  const dev = process.env.NODE_ENV !== "PRODUCTION";

  export let segment: string;
</script>

<style lang="scss">
  nav {
    display: flex;
    align-items: center;

    font-family: "Quicksand", monospace;
    font-size: 1.2rem;

    background: var(--app-color-shell);

    position: sticky;
    top: 0;

    padding-right: 0.6rem;

    border-radius: 0 0 1rem 1rem;

    &.dark {
      background: #383a3e;
    }
  }

  ul {
    display: flex;
    align-items: center;

    list-style: none;

    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.6rem 0.8rem;
  }

  .flex {
    flex: 1 1 auto;
  }

  nav.dark a {
    --color: var(--app-color-dark);
    --color-rgb: var(--app-color-dark-rgb);
  }

  a {
    --color: var(--app-color-primary);
    --color-rgb: var(--app-color-primary-rgb);

    color: var(--color);

    position: relative;

    // transition: color;

    &:hover,
    &:focus,
    &[aria-current="page"] {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  a::after {
    content: "";

    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 6px;

    transform: scaleX(0);
    transform-origin: left;

    will-change: trasnform;
    transition: all 200ms ease-out;

    background-color: rgba(var(--color-rgb), 0.4);
  }
</style>

<svelte:head>
  <!-- As this component is omnipresent, the script for different favicons will live here -->

  {#if dev}
    <link rel="icon" href="./icons/favicon-dev.svg" />
  {:else}
    <link rel="icon" href="./icons/favicon.svg" />
  {/if}
</svelte:head>

<nav class:dark={$theme === 'dark'}>
  <ul>
    <li>
      <a aria-current={segment === undefined && 'page'} href="."> HOME </a>
    </li>
    <li>
      <a
        aria-current={segment && segment.startsWith('blog') && 'page'}
        href="blog">
        BLOG
      </a>
    </li>
    <li>
      <a aria-current={segment === 'work' && 'page'} href="work"> WORKS </a>
    </li>
  </ul>
  <span class="flex" />
  <ThemeSwitcher />
</nav>
