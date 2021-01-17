<script lang="ts">
  import { mdiChevronRight } from '@mdi/js';
  import { formatDate } from '../helpers/format-date';
  import type { IBlog } from '../interfaces/blog.interface';
  import Icon from './Icon.svelte';

  export let blogsList: IBlog[];
  export let seeMore: boolean = false;
</script>

{#each blogsList as { title, id, description, date, series, seriesIndex }}
  <a class="blog-link" rel="prefetch" href="blog/{id}" aria-label={title}>
    <span class="series"
      >{#if series}<mark>SERIES</mark> {series}{/if}</span
    >
    <h2 class="title">{series ? `Part ${seriesIndex} - ` : ''}{title}</h2>
    <p class="description">{description}</p>
    <p class="more-info"><span /><span>{formatDate(date)}</span></p>
  </a>
{/each}

{#if seeMore}
  <br />
  <a class="blog-link show-more" rel="prefetch" href="blog" aria-label="See more blog posts">
    <h2 class="title end">See more <Icon size={40} path={mdiChevronRight} /></h2>
  </a>
{/if}

<style lang="scss">
  .title {
    color: var(--app-color-primary);
    fill: var(--app-color-primary);

    display: flex;
    align-items: center;
  }

  .end {
    justify-content: center;
  }

  .description {
    color: var(--app-color-dark);
    font-family: 'Fira Code', monospace;
  }

  p {
    margin: 0;
  }

  p.more-info {
    display: flex;
    justify-content: space-between;

    color: var(--app-color-primary);
    font-family: 'Fira Code', monospace;
    margin-top: 0.3rem;
    font-weight: bold;
  }

  .blog-link {
    display: block;

    transition: background-color var(--transition-duration) ease-out,
      box-shadow var(--transition-duration) ease-out;

    border-radius: 1rem;
    padding: 1rem 0.5rem;

    font-weight: 400;

    &.show-more {
      background-color: rgba(var(--app-color-primary-rgb), 0.075);
    }

    &:hover,
    &:focus {
      background-color: rgba(var(--app-color-primary-rgb), 0.1);
    }

    &:focus-visible {
      box-shadow: 0 0 0 0.25rem rgba(var(--app-color-primary-rgb), 0.75);
    }
  }

  h2 {
    line-height: 1.618;
  }

  .series {
    color: rgba(var(--app-color-dark-rgb), 0.6);

    letter-spacing: 1px;
    font-family: 'Fira Code', monospace;

    mark {
      font-family: 'Quicksand', sans-serif;
    }
  }
</style>