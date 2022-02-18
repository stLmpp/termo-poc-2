<script lang="ts">
  import Row from './Row.svelte';
  import type { IRow } from './model/row';
  import { onMount } from 'svelte';
  import { languageService } from './language.service';
  import { LanguageEnum } from './model/language.enum';

  let rows: IRow[] = [];

  const languages = languageService.getLanguages();
  let words: string[] = [];
  let language = LanguageEnum.ptBr;

  function onNext(): void {
    rows = rows.map((row, index) => ({ ...row, disabled: selectedRowIndex + 1 !== index }));
    selectedRowIndex++;
  }

  let selectedRowIndex = 0;

  async function onSelectChange(): Promise<void> {
    words = await languageService.load(language);
    startRows();
  }

  function startRows(): void {
    rows = Array.from({ length: 6 }, (_, index) => ({
      letters: Array.from({ length: 5 }, () => ({ hasLetter: false, sameIndex: false, value: '' })),
      disabled: !!index,
      selectionMode: false,
    }));
  }

  onMount(async () => {
    startRows();
    await onSelectChange();
  });
</script>

<main class="container">
  <h1>Termo predictions</h1>
  <select bind:value={language} class="form-select mb-3" on:change={onSelectChange}>
    {#each languages as language}
      <option value={language.key}>{language.name}</option>
    {/each}
  </select>
  {#each rows as row, index}
    <Row bind:letters={row.letters} disabled={row.disabled} bind:selectionMode={row.selectionMode} on:next={onNext} />
  {/each}
  <hr />
  {JSON.stringify(rows)}
  <hr />
  {JSON.stringify(words)}
</main>
