<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';

  export let value = '';
  export let disabled = false;
  export let hasFocus = false;

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher<{ next: void; focus: void }>();

  function onInput(): void {
    input.value = (input.value ?? '').toUpperCase();
    value = input.value;
    dispatch('next');
  }

  function onFocus(): void {
    input.select();
    dispatch('focus');
  }

  afterUpdate(() => {
    if (input && hasFocus) {
      input.focus();
    }
  });
</script>

<input bind:this={input} class="letter form-control" maxlength="1" {disabled} on:input={onInput} on:focus={onFocus} />

<style>
  .letter {
    width: 40px;
    margin: 0.25rem 0.5rem;
    text-align: center;
  }
</style>
