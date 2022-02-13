<script lang="ts">
  import Letter from './Letter.svelte';

  export let length = 5;
  export let disabled = false;
  export let values = Array.from({ length }, () => '');

  $: array = Array.from({ length });
</script>

<div class="row">
  {#each values as value}
    <Letter {disabled} {value} />
  {/each}
</div>

<style>
  .row {
    display: flex;
  }
</style>
