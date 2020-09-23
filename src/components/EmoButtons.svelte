<script lang="ts">
  import { onMount } from "svelte";

  import { API } from "../constants";
  import type { IEmos } from "../interfaces/emos.interface";
  import { fadeIn } from "./fade";

  import { emoStates } from "../stores/emos.store";

  // The id of the blog post
  export let blogID: string;

  // Local data
  let currentEmos = $emoStates.find((emo) => emo.blogID === blogID);

  async function getEmos() {
    if (currentEmos) return;

    const res = await fetch(`${API.getEmos}?blogID=${blogID}`);
    const data: IEmos = await res.json();

    currentEmos = { ...data, blogID };

    $emoStates = [...$emoStates];
  }

  onMount(async () => {
    await getEmos();
  });
</script>

<style>
  button {
    background: transparent;

    border: none;
    border-radius: 30px;

    margin: 1rem;

    font-size: 1.3rem;

    cursor: pointer;
  }

  #emo-buttons {
    position: fixed;
    left: calc(61.8% + 19.1%);
    top: 0;
    z-index: 100;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100vh;
    width: calc((100% - 61.8%) / 2);
  }
</style>

{console.log(currentEmos)}
{#if typeof currentEmos !== 'undefined'}
  <div in:fadeIn id="emo-buttons">
    <button>😍 {currentEmos.love}</button>
    <button>🦄 {currentEmos.unicorn}</button>
    <button>🤩 {currentEmos.starry}</button>
  </div>
{/if}
