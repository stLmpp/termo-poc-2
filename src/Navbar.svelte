<script lang="ts">
  import { version } from '../package.json';
  import Icon from './Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ reset: void }>();

  function onClick(): void {
    dispatch('reset');
  }
</script>

<nav class="navbar fixed-top navbar-light bg-primary navbar-dark">
  <div class="container">
    <span class="navbar-brand mb-0 h1">Termo predictions v{version}</span>
    <div class="d-flex">
      <button class="btn btn-primary" on:click={onClick}>
        <Icon icon="arrow-clockwise" />
        <span class="visually-hidden">Reset</span>
      </button>
      <a class="btn btn-primary" target="_blank" rel="noreferrer" href="https://github.com/stLmpp/termo-predictions">
        <Icon icon="github" />
        <span class="visually-hidden">Github</span>
      </a>
    </div>
  </div>
</nav>
