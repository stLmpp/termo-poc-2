<script lang="ts">
  import { version } from '../package.json';
  import Icon from './Icon.svelte';
</script>

<nav class="navbar fixed-top navbar-light bg-primary navbar-dark">
  <div class="container">
    <span class="navbar-brand mb-0 h1">Termo predictions v{version}</span>
    <div class="d-flex">
      <a class="btn btn-primary" target="_blank" href="https://github.com/stLmpp/termo-predictions">
        <Icon icon="github" />
      </a>
    </div>
  </div>
</nav>
