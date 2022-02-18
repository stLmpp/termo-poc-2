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
    if (event.key === 'ArrowLeft' || (event.key === 'Backspace' && !input.value)) {
      event.preventDefault();
      dispatch('previous');
    }
    if (event.key === 'ArrowRight') {
      dispatch('next');
    }
  }

  function onClick(): void {
    if (!selectionMode) {
      return;
    }
    letter = { ...letter, hasLetter: true, sameIndex: true };
  }

  function onDblclick(): void {
    if (!selectionMode) {
      return;
    }
    letter = { ...letter, hasLetter: false, sameIndex: false };
  }

  function onContextmenu(event: Event): void {
    if (!selectionMode) {
      return;
    }
    event.preventDefault();
    letter = { ...letter, hasLetter: true, sameIndex: false };
  }

  afterUpdate(() => {
    if (input && hasFocus) {
      input.focus();
    }
  });
</script>

<input
  bind:this={input}
  bind:value={letter.value}
  class="letter form-control"
  class:has-letter={letter.hasLetter}
  class:same-index={letter.sameIndex}
  maxlength="1"
  {disabled}
  on:input={onInput}
  on:focus={onFocus}
  on:keyup={onKeyup}
  on:keydown={onKeydown}
  on:click={onClick}
  on:dblclick={onDblclick}
  on:contextmenu={onContextmenu}
  readonly={selectionMode && !disabled}
/>

<style>
  .letter {
    width: 40px;
    margin: 0.25rem 0.5rem;
    text-align: center;
  }

  .form-control.letter.has-letter[readonly],
  .form-control.letter.has-letter[disabled],
  .form-control.letter.has-letter:disabled {
    background-color: yellow;
  }

  .form-control.letter.has-letter.same-index[readonly],
  .form-control.letter.has-letter.same-index[disabled],
  .form-control.letter.has-letter.same-index:disabled {
    background-color: greenyellow;
  }

  .form-control.letter[readonly] {
    background-color: #fff;
  }
</style>
