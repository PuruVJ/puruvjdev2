<script>
  import { mdiGithub, mdiTwitter } from "@mdi/js";

  import Icon from "./Icon.svelte";
</script>

<style>
  footer {
    padding: 1rem;

    display: flex;

    font-family: "Fira Code", monospace;

    font-size: 1.2rem;
  }

  #copyright {
    font-size: 1.5rem;
    vertical-align: middle;

    margin-top: -2px;
  }

  .copy-area {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
  }

  .social-links a {
    fill: var(--app-color-dark);

    transition: fill 200ms ease-out;
  }

  #twitter:hover {
    fill: #1da1f2;
  }

  #github:hover {
    fill: #333;
  }
</style>

<footer>
  <div class="copy-area">
    <span id="copyright">&copy;</span> &nbsp; Puru Vijay
  </div>
  <div class="social-links">
    <a
      href="https://github.com/PuruVJ"
      rel="noopener"
      target="_blank"
      id="github">
      <Icon path={mdiGithub} />
    </a>
    <a
      href="https://twitter.com/puruvjdev"
      rel="noopener"
      target="_blank"
      id="twitter">
      <Icon path={mdiTwitter} />
    </a>
  </div>
</footer>

<!-- Twitter -->
<!-- rgba(29,161,242,1.00) -->
