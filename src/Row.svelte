<script lang="ts">
  import Letter from './Letter.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { ILetter } from './model/letter';

  export let disabled = false;
  export let letters: ILetter[] = [];
  export let selectionMode = false;

  let selectedIndex = 0;

  const dispatcher = createEventDispatcher<{ next: void }>();

  function onNextLetter(): void {
    selectedIndex = Math.min(selectedIndex + 1, letters.length);
  }

  function onFocusLetter(index: number): void {
    selectedIndex = index;
  }

  function onPreviousLetter(): void {
    selectedIndex = Math.max(selectedIndex - 1, 0);
  }

  function onClick(): void {
    if (selectionMode) {
      dispatcher('next');
    } else {
      selectionMode = true;
    }
  }

  $: disabledEnterEditMode = letters.some(letter => !letter.value);
</script>

<div class="row-container">
  <div class="row">
    {#each letters as letter, index}
      <Letter
        {disabled}
        bind:letter
        hasFocus={selectedIndex === index}
        {selectionMode}
        on:next={onNextLetter}
        on:previous={onPreviousLetter}
        on:focus={() => onFocusLetter(index)}
      />
    {/each}
  </div>
  <div class="action">
    {#if !disabled}
      <button on:click={onClick} disabled={disabledEnterEditMode} class="btn btn-primary">
        {selectionMode ? 'Next' : 'Enter selection mode'}
      </button>
    {/if}
  </div>
</div>

<style>
  .row {
    display: flex;
  }

  .row-container {
    display: flex;
    align-items: center;
  }

  .action {
    margin-left: 1rem;
  }
</style>
