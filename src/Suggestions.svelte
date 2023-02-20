<script lang="ts">
  import { sample } from 'st-utils';
  import { createEventDispatcher } from 'svelte';

  export let row = 0;
  export let words: readonly string[] = [];
  export let disabled = false;

  const dispatcher = createEventDispatcher<{ selectedWord: string }>();

  $: wordsArray = !row ? Array.from({ length: 5 }, () => sample(words)!) : words;

  function onWordClick(word: string): void {
    dispatcher('selectedWord', word);
  }
</script>

<div class="suggestions" class:disabled>
  {#each wordsArray as word}
    <button class="suggestion" on:click={() => onWordClick(word)}>{word}</button>
  {/each}
</div>

<style>
  .suggestions {
    display: grid;
    grid-template-columns: repeat(auto-fit, 100px);
    grid-gap: 1rem;
  }

  .suggestion {
    all: unset;
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    transition: background-color 200ms ease;
    cursor: pointer;
  }

  .suggestion:hover {
    background-color: #dfdfdf;
  }

  .suggestions.disabled .suggestion {
    pointer-events: none;
    opacity: 0.6;
  }
</style>
