<script>
  import { onMount } from "svelte";

  import { fadeIn, fadeOut } from "../components/fade";

  onMount(async () => {
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
  }

  img {
    max-width: 100%;
    height: auto;

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
  }

  mark {
    background-color: transparent;
    color: var(--app-color-primary);
  }

  @media screen and (max-width: 600px) {
    .puru-intro {
      flex-direction: column;
    }

    img {
      max-width: 90%;
    }

    #written {
      max-width: 100%;

      margin-top: 2rem;
    }
  }
</style>

<svelte:head>
  <title>Home</title>
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
        I am a <mark>self-taught fullstack web developer</mark> based in India. I
        make <mark>blazing fast and performant</mark> web apps. Like this blog.
      </h2>
    </div>
  </section>
</main>
