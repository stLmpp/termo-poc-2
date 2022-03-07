<script lang="ts">
  import Row from './Row.svelte';
  import type { IRow } from './model/row';
  import { onMount } from 'svelte';
  import { languageService } from './language.service';
  import { LanguageEnum } from './model/language.enum';
  import { Words } from './model/words';
  import Suggestions from './Suggestions.svelte';
  import Navbar from './Navbar.svelte';
  import { statsService } from './stats.service';

  let rows: IRow[] = [];

  const languages = languageService.getLanguages();
  const rowNumberOptions = [6, 7, 8, 9];
  let wordsArray: string[] = [];
  let words = new Words([]);
  let wordsDisplay: string[] = [];
  let language = LanguageEnum.ptBr;
  let selectedRowIndex = 0;
  let rowNumber = 6;

  function onNext(): void {
    wordsDisplay = words
      .process(rows[selectedRowIndex].letters, selectedRowIndex)
      .getWordsSuggestionsShuffled(selectedRowIndex);
    selectedRowIndex++;
    rows = rows.map((row, index) => ({ ...row, disabled: selectedRowIndex !== index }));
  }

  function onPrevious(): void {
    selectedRowIndex--;
    rows = rows.map((row, index) => ({
      ...row,
      disabled: selectedRowIndex !== index,
      selectionMode: index === selectedRowIndex || index === selectedRowIndex + 1 ? false : row.selectionMode,
    }));
    wordsDisplay = words.undoProcess(selectedRowIndex).getWordsSuggestionsShuffled(selectedRowIndex);
  }

  async function onSelectChange(): Promise<void> {
    wordsArray = await languageService.load(language);
    words = new Words(wordsArray);
    startRows();
    selectedRowIndex = 0;
    wordsDisplay = words.getWordsSuggestionsShuffled(selectedRowIndex);
  }

  function onRowNumberChange(): void {
    rows = Array.from(
      { length: rowNumber },
      (_, index) =>
        rows[index] ?? {
          selectionMode: false,
          disabled: true,
          letters: Array.from({ length: 5 }, (_, letterIndex) => ({
            hasLetter: false,
            sameIndex: false,
            value: '',
            index: letterIndex,
          })),
        }
    );
  }

  function startRows(): void {
    rows = Array.from({ length: 6 }, (_, index) => ({
      letters: Array.from({ length: 5 }, (_, letterIndex) => ({
        hasLetter: false,
        sameIndex: false,
        value: '',
        index: letterIndex,
      })),
      disabled: !!index,
      selectionMode: false,
    }));
  }

  function onSelectedWord(event: CustomEvent<string>): void {
    const letters = event.detail.split('');
    rows = rows.map((row, index) => {
      if (selectedRowIndex === index) {
        row = {
          ...row,
          letters: row.letters.map((letter, letterIndex) => ({ ...letter, value: letters[letterIndex] })),
        };
      }
      return row;
    });
  }

  function onReset(): void {
    startRows();
  }

  onMount(async () => {
    startRows();
    await onSelectChange();
    await statsService.post();
  });
</script>

<Navbar on:reset={onReset} />

<main class="container">
  <div class="form">
    <div class="form-floating">
      <select id="language" bind:value={language} class="form-select" on:change={onSelectChange}>
        {#each languages as language}
          <option value={language.key}>{language.name}</option>
        {/each}
      </select>
      <label for="language">Language</label>
    </div>
    <div class="form-floating">
      <select bind:value={rowNumber} id="row-number" class="form-select" on:change={onRowNumberChange}>
        {#each rowNumberOptions as rowNumberOption}
          <option value={rowNumberOption}>{rowNumberOption}</option>
        {/each}
      </select>
      <label for="row-number">Row number</label>
    </div>
  </div>
  {#each rows as row, index}
    <Row
      bind:letters={row.letters}
      disabled={row.disabled}
      bind:selectionMode={row.selectionMode}
      on:next={onNext}
      on:previous={onPrevious}
      rowIndex={index}
      lastRow={index === rows.length - 1}
    />
  {/each}
  <hr />
  <h2 class="mb-3">Suggested words</h2>
  <Suggestions
    words={wordsDisplay}
    row={selectedRowIndex}
    on:selectedWord={onSelectedWord}
    disabled={!!rows[selectedRowIndex]?.selectionMode}
  />
</main>

<style global>
  @import 'bootstrap/dist/css/bootstrap.css';

  main {
    padding-top: calc(50px + 1rem);
    padding-bottom: 2rem;
  }

  .form {
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1rem;
  }
</style>
