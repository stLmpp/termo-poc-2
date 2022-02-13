<script lang="ts">
  import Row from './Row.svelte';

  const rows = [
    {
      letters: ['', '', '', '', ''],
      disabled: false,
    },
  ];

  let selectedRowIndex = 0;
</script>

<main class="container">
  {#each rows as row}
    <Row bind:values={row.letters} disabled={row.disabled} />
  {/each}
  <hr />
  {JSON.stringify(rows)}
</main>
