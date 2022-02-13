<script lang="ts">
  import Letter from './Letter.svelte';

  export let disabled = false;
  export let values = [];

  let selectedIndex = 0;

  function onNext(): void {
    selectedIndex = Math.min(values.length, selectedIndex + 1);
  }

  function onFocus(index: number): void {
    selectedIndex = index;
  }
</script>

<div class="row">
  {#each values as value, index}
    <Letter {disabled} bind:value hasFocus={selectedIndex === index} on:next={onNext} on:focus={() => onFocus(index)} />
  {/each}
</div>

<style>
  .row {
    display: flex;
  }
</style>
