<script lang="ts">
  import Letter from './Letter.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { ILetter } from './model/letter';
  import Icon from './Icon.svelte';

  export let rowIndex: number;
  export let disabled = false;
  export let letters: ILetter[] = [];
  export let selectionMode = false;
  export let lastRow = false;

  let selectedIndex = 0;

  const dispatcher = createEventDispatcher<{ next: void; previous: void }>();

  function onNextLetter(): void {
    selectedIndex = Math.min(selectedIndex + 1, letters.length - 1);
  }

  function onFocusLetter(index: number): void {
    selectedIndex = index;
  }

  function onPrevious(): void {
    if (rowIndex) {
      dispatcher('previous');
    }
  }

  function onPreviousLetter(): void {
    selectedIndex = Math.max(selectedIndex - 1, 0);
  }

  function onClick(): void {
    if (selectionMode) {
      if (!lastRow) {
        dispatcher('next');
      }
    } else {
      selectionMode = true;
    }
  }

  function onEnter(): void {
    if (selectionMode) {
      if (!lastRow) {
        dispatcher('next');
      }
    } else if (letters.every(letter => letter.value)) {
      selectionMode = true;
    }
  }

  $: disabledEnterEditMode = letters.some(letter => !letter.value);
</script>

<div class="row-container" class:active={!disabled}>
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
        on:enter={onEnter}
        on:up={onPrevious}
      />
    {/each}
  </div>
  <div class="action">
    {#if !disabled}
      {#if !selectionMode}
        <button
          on:click={onClick}
          disabled={disabledEnterEditMode}
          class="btn btn-primary"
          title="Enter selection mode"
        >
          <Icon icon="check2" />
        </button>
      {:else}
        <button on:click={onClick} disabled={lastRow} class="btn btn-primary" title="Next">
          <Icon icon="arrow-return-left" />
        </button>
      {/if}
      {#if rowIndex}
        <button on:click={onPrevious} class="btn btn-primary" title="Go back">
          <Icon icon="arrow-counterclockwise" />
        </button>
      {/if}
    {/if}
  </div>
</div>

<style>
  .row {
    display: flex;
  }

  .row-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border: 2px solid transparent;
    border-radius: 4px;
    margin-right: 1rem;
    margin-left: 2rem;
  }

  .row-container.active {
    border-color: var(--bs-primary);
    padding: 0.5rem;
  }

  .action {
    margin-left: 1rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: center;
  }

  .action .btn:not(:first-of-type) {
    margin-left: 1rem;
  }
</style>
