<script>
  import { mdiDevTo, mdiGithub, mdiTwitter } from "@mdi/js";

  import Icon from "./Icon.svelte";
</script>

<style>
  footer {
    padding: 1rem;

    display: flex;

    font-family: "Fira Code", monospace;

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

    transition: fill 200ms ease-out;

    margin: 0 4px;
  }

  #twitter:hover,
  #twitter:focus {
    fill: #1da1f2;
  }

  #github:hover,
  #github:focus {
    fill: #333;
  }

  #devto:hover,
  #devto:focus {
    fill: black;
  }
</style>

<footer>
  <div class="copy-area">
    Made with&nbsp;<img src="emojis/love.svg" alt="❤" />&nbsp;by Puru Vijay
  </div>
  <div class="social-links">
    <a
      href="https://twitter.com/puruvjdev"
      rel="noopener"
      target="_blank"
      id="twitter"
      aria-label="Puru Vijay's Twitter Profile">
      <Icon path={mdiTwitter} />
    </a>
    <a
      href="https://github.com/PuruVJ"
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

<!-- Twitter -->
<!-- rgba(29,161,242,1.00) -->
