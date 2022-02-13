<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import type { ILetter } from './model/letter';

  export let letter: ILetter = { hasLetter: false, value: '', sameIndex: false };
  export let disabled = false;
  export let hasFocus = false;
  export let selectionMode = false;

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher<{ next: void; focus: void; previous: void }>();

  const onlyLetterReg = /^[a-zA-Z]$/;

  function onInput(): void {
    input.value = (input.value ?? '').toUpperCase();
    if (!onlyLetterReg.test(input.value)) {
      input.value = '';
    }
    letter = { ...letter, value: input.value };
  }

  function onFocus(): void {
    input.select();
    dispatch('focus');
  }

  function onKeyup(event: KeyboardEvent): void {
    if (onlyLetterReg.test(event.key)) {
      dispatch('next');
    }
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !input.value) {
      dispatch('previous');
    }
  }

  afterUpdate(() => {
    if (input && hasFocus) {
      input.focus();
    }
  });
</script>

<input
  bind:this={input}
  class="letter form-control"
  maxlength="1"
  {disabled}
  on:input={onInput}
  on:focus={onFocus}
  on:keyup={onKeyup}
  on:keydown={onKeydown}
  readonly={selectionMode}
/>

<style>
  .letter {
    width: 40px;
    margin: 0.25rem 0.5rem;
    text-align: center;
  }

  .letter.form-control[readonly] {
    background-color: #fff;
  }
</style>
