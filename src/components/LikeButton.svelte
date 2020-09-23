<script lang="ts">
  import { mdiHeart, mdiHeartOutline } from "@mdi/js";

  import { onMount } from "svelte";
  import { API } from "../constants";
  import { emoStates } from "../stores/emos.store";
  import { fadeIn } from "./fade";
  import Icon from "./Icon.svelte";

  // The ID of the blog
  export let blogID: string;

  // Whether this component is marked
  let marked: boolean;

  async function getLikes() {
    // Do nothing if it's already here
    if (blogID in $emoStates) {
      return;
    }

    // Fetch and conquer
    const req = await fetch(`${API.getEmos}?blogID=${blogID}`);

    const data = await req.json();

    $emoStates[blogID] = data;
  }

  async function toggleLikes() {
    const incrementer = marked ? -1 : 1;

    $emoStates[blogID].likes += incrementer;

    marked = !marked;

    try {
      // Make the request
      const req = await fetch(API.setEmos, {
        body: JSON.stringify({ ...$emoStates[blogID], blogID }),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      const res = await req.text();

      if (res === "fail") {
        $emoStates[blogID].likes -= incrementer;
        marked = !marked;
      }
    } catch (e) {
      $emoStates[blogID].likes -= incrementer;
      marked = !marked;
    }

    if (incrementer === 1) {
      localStorage.setItem(`like:${blogID}`, "true");
    } else {
      localStorage.removeItem(`like:${blogID}`);
    }
  }

  onMount(async () => {
    await getLikes();

    marked = !!localStorage.getItem(`like:${blogID}`);
  });
</script>

<style lang="scss">
  button {
    background: transparent;

    border: none;
    border-radius: 30px;

    cursor: pointer;

    display: flex;
    align-items: center;

    fill: #dd2e44;
  }

  #container {
    position: fixed;
    left: calc(61.8% + 19.1%);
    top: 0;
    z-index: 100;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    height: 100vh;
    width: calc((100% - 61.8%) / 2);

    font-size: 1.3rem;
    color: var(--app-color-dark);
    font-weight: 600;
    font-family: "Fira Code", monospace;
  }
</style>

{#if blogID in $emoStates}
  <div id="container" in:fadeIn>
    <button on:click={toggleLikes} class:marked>
      <Icon size={30} path={marked ? mdiHeart : mdiHeartOutline} />
    </button>
    <span>{$emoStates[blogID].likes}</span>
  </div>
{/if}
