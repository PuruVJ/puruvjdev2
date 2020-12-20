<script>
  import { onMount } from "svelte";

  import { fadeIn, fadeOut } from "../components/fade";

  import smoothscroll from "smoothscroll-polyfill";

  onMount(async () => {
    smoothscroll.polyfill();

    await import("lazysizes");

    document.body.classList.add("background");
  });
</script>

<style lang="scss">
  img,
  figure {
    border-radius: 50%;

    margin: 0;
  }

  .photo-area,
  figure {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: flex-start;
  }

  img {
    width: 25vmax;
    height: 25vmax;
    min-height: 0;

    box-shadow: 0 0 0 1rem var(--app-color-primary);

    transition: box-shadow 200ms ease-out;
  }

  .puru-intro {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }

  #written {
    max-width: 50%;
  }

  #about-me {
    font-family: "Fira Code", monospace;
    font-weight: 550 !important;
  }

  mark {
    background-color: transparent;
    color: var(--app-color-primary);
  }

  h1,
  h2 {
    line-height: 1.618;
  }

  @media screen and (max-width: 600px) {
    .puru-intro {
      flex-direction: column;
    }

    img {
      width: 90%;
      height: auto;
    }

    #written {
      max-width: 100%;

      margin-top: 2rem;
    }
  }
</style>

<svelte:head>
  <title>Puru, Developer and Designer</title>
  <meta
    name="description"
    content="Read about web development, designing and programming on Puru Vijay's blog." />
  <meta property="og:title" content="Puru, Developer and Designer" />
  <meta
    property="og:description"
    content="Read about web development, designing and programming on Puru Vijay's blog." />
  <meta
    property="og:image"
    content="https://puruvj.dev/media/blog-social-intro.png" />
  <meta property="og:url" content="https://puruvj.dev" />

  <link rel="canonical" href="https://puruvj.dev/" />
</svelte:head>

<main in:fadeIn out:fadeOut>
  <br />
  <br /><br />
  <section class="puru-intro">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <div class="photo-area">
      <figure>
        <img src="./photos/puru-profile.jpg" alt="Puru Vijay Profile Photo" />
      </figure>
    </div>

    <div id="written">
      <h1>Hi, I'm <mark>Puru</mark></h1>
      <h2 id="about-me">
        I am a
        <mark>self-taught fullstack web developer</mark>
        based in India. I make
        <mark>blazing fast and performant</mark>
        web apps. Like this blog.
      </h2>
    </div>
  </section>
</main>
