<script lang="ts">
  import { mdiMoonFull, mdiWhiteBalanceSunny } from '@mdi/js';
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme.store';
  import Icon from './Icon.svelte';
  import Moon from './Moon.svelte';

  // List of themes
  const themes: ('light' | 'midday' | 'dark')[] = ['light', 'midday', 'dark'];
  let currentThemeIndex = 0;

  function nextTheme() {
    const { length } = themes;

    currentThemeIndex = (currentThemeIndex + 1) % length;
  }

  onMount(() => {
    // Initialize with localstorage
    const localTheme = localStorage.getItem('theme');
    const browserPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    currentThemeIndex = !localTheme
      ? browserPrefersDark
        ? 2
        : 0
      : themes.indexOf(localTheme as any);
  });

  $: $theme = themes[currentThemeIndex];
</script>

<svelte:head>
  <meta
    name="theme-color"
    content={currentThemeIndex === 0 ? 'white' : currentThemeIndex === 1 ? '#f9dec9' : '#222428'}
  />
</svelte:head>

<button aria-label={themes[currentThemeIndex]} on:click={nextTheme}>
  {#if currentThemeIndex === 0}
    <Icon path={mdiWhiteBalanceSunny} />
  {:else if currentThemeIndex === 1}
    <Icon path={mdiMoonFull} />
  {:else}
    <Moon />
  {/if}
</button>

<style>
  button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    width: 2.3rem;
    height: 2.3rem;

    overflow: hidden;

    background: transparent;
    fill: var(--app-color-dark);

    border: none;
    border-radius: 50%;

    cursor: pointer;
  }

  button:hover,
  button:focus {
    background-color: rgba(var(--app-color-dark-rgb), 0.2);
  }
</style>
