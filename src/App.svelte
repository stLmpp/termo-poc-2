<script lang="ts">
  import Row from './Row.svelte';
  import type { IRow } from './model/row';

  let rows: IRow[] = Array.from({ length: 6 }, (_, index) => ({
    letters: Array.from({ length: 5 }, () => ({ hasLetter: false, sameIndex: false, value: '' })),
    disabled: !!index,
    selectionMode: false,
  }));

  function onNext(): void {
    rows = rows.map((row, index) => ({ ...row, disabled: selectedRowIndex + 1 !== index }));
    selectedRowIndex++;
  }

  let selectedRowIndex = 0;
</script>

<main class="container">
  <h1>Termo predictions</h1>
  {#each rows as row, index}
    <Row bind:letters={row.letters} disabled={row.disabled} bind:selectionMode={row.selectionMode} on:next={onNext} />
  {/each}
  <hr />
  {JSON.stringify(rows)}
</main>
