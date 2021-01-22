<script>
  import { mdiDevTo, mdiGithub, mdiTwitter } from '@mdi/js';

  import Icon from './Icon.svelte';
</script>

<footer>
  <div class="copy-area">
    Made with&nbsp;<img src="emojis/love.svg" alt="❤" />&nbsp;by Puru Vijay
  </div>
  <div class="social-links">
    <a
      href="https://twitter.com/puruvjdev2"
      rel="noopener"
      target="_blank"
      id="twitter"
      aria-label="Puru Vijay's Twitter Profile">
      <Icon path={mdiTwitter} />
    </a>
    <a
      href="https://github.com/puruvj"
      rel="noopener"
      target="_blank"
      id="github"
      aria-label="Puru Vijay's Github Profile">
      <Icon path={mdiGithub} />
    </a>
    <a
      href="https://dev.to/puruvj"
      rel="noopener"
      target="_blank"
      id="devto"
      aria-label="Puru Vijay's Dev.to Profile">
      <Icon path={mdiDevTo} />
    </a>
  </div>
</footer>

<style lang="scss">
  footer {
    padding: 1rem;

    display: flex;

    font-family: 'Fira Code', monospace;

    font-size: 1rem;
  }

  img {
    height: 1em;
    vertical-align: middle;
  }

  .copy-area {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .social-links {
    display: flex;
    align-items: center;
  }

  .social-links a {
    fill: var(--app-color-dark);

    display: flex;
    align-items: center;

    transition: fill 120ms ease-out;

    margin: 0 4px;

    transition: transform 200ms ease-in;

    &:hover,
    &:focus-visible {
      transform: scale(1.2);
    }
  }
  @media screen and (max-width: 600px) {
    .copy-area {
      font-size: 0.7rem;
    }
  }
</style>
