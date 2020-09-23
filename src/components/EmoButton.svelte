<script lang="ts">
import { API } from "../constants";

  import { emoStates } from "../stores/emos.store";

  // The kind of like button to put here
  export let type: "love" | "unicorn" | "starry";

  // The id of the blog post
  export let blogID: string;

  // Local data
  let currentEmos = $emoStates.find((emo) => emo.blogID === blogID);

  async function getEmos() {
    // Find the object corresponding to the current blog post
    let currentEmos = $emoStates.find((emo) => emo.blogID === blogID);

    if (!currentEmos?.pending) {
      // Return data
      return currentEmos;
    }

    if (!currentEmos) {
      // Fetch and return data
      currentEmos.pending = true;

      const res = await fetch(API.getEmos);
    }
  }
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
</style>

<button>
  {#if type === 'love'}😍{:else if type === 'unicorn'}🦄{:else}🤩{/if} &nbsp;
  {currentEmos ? currentEmos[type] : 0}
</button>
