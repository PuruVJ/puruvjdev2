<script lang="ts">
  import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
  import { theme } from '../stores/theme.store';
  import { throttle } from 'throttle-debounce';
  import { onMount } from 'svelte';
  import SiteLogo from './SiteLogo.svelte';

  // The scroll from above
  let scrollY: number = 0;

  export let segment: string;

  function handleScroll() {
    scrollY = document.body.scrollTop;
  }

  onMount(() => {
    handleScroll();
  });
</script>

<svelte:body on:scroll={throttle(50, false, handleScroll)} />

<nav class:dark={$theme === 'dark'} class:shadow={scrollY > 2}>
  <div class="brand">
    <SiteLogo />
    <span>Puru Vijay</span>
  </div>
  <ul>
    <li><a rel="prefetch" aria-current={segment === undefined && 'page'} href="."> HOME </a></li>
    <li>
      <a rel="prefetch" aria-current={segment && segment.startsWith('blog') && 'page'} href="blog">
        BLOG
      </a>
    </li>
    <li><a aria-current={segment === 'works' && 'page'} href="works"> WORKS </a></li>
  </ul>
  <span class="flex" />
  <ThemeSwitcher />
</nav>

<style lang="scss">
  nav {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr 0 auto;

    font-family: 'Quicksand', monospace;
    font-size: 1.2rem;

    background: var(--app-color-shell);

    width: 61.8%;

    position: fixed;
    top: 0;
    z-index: 20;

    padding-right: 0.6rem;

    border-radius: 0 0 1rem 1rem;

    transition: box-shadow 150ms ease-out, background-color var(--transition-duration) ease-in;

    &.dark.shadow {
      background-color: #383a3e;
    }

    &.shadow {
      box-shadow: 0 3.4px 6.3px rgba(0, 0, 0, 0.099), 0 27px 50px rgba(0, 0, 0, 0.1);
    }
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: center;

    list-style: none;

    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.6rem 0.8rem;
  }

  a {
    --color: var(--app-color-primary);
    --color-rgb: var(--app-color-primary-rgb);

    font-weight: 600;
    color: var(--color);

    position: relative;

    // transition: color;

    &:hover,
    &:focus,
    &[aria-current='page'] {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  a::after {
    content: '';

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

  .brand {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    color: var(--app-color-primary);
    font-size: 1.5rem;

    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 0 0 0 0.75rem;

    height: 100%;

    :global(path, rect) {
      transition: fill 200ms ease-in;
      // transition-delay: -100ms;
    }

    & :global(svg) {
      --size: 2rem;
      height: var(--size);
      width: var(--size);

      margin-right: 0.75rem;
    }
  }

  @media screen and (max-width: 1100px) {
    nav {
      width: 95%;
    }
  }

  @media screen and (max-width: 600px) {
    .brand {
      display: none;
    }

    nav {
      grid-template-columns: auto 1fr auto;
    }
  }

  @media screen and (max-width: 405px) {
    li {
      margin: 0.6rem 0.4rem;
    }
  }
</style>
