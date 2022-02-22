<script lang="ts">
  import Row from './Row.svelte';
  import type { IRow } from './model/row';
  import { onMount } from 'svelte';
  import { languageService } from './language.service';
  import { LanguageEnum } from './model/language.enum';
  import { Words } from './model/words';
  import Suggestions from './Suggestions.svelte';

  let rows: IRow[] = [];

  const languages = languageService.getLanguages();
  let wordsArray: string[] = [];
  let words = new Words([]);
  let wordsDisplay: string[] = [];
  let language = LanguageEnum.ptBr;
  let selectedRowIndex = 0;

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
      selectionMode: index === selectedRowIndex ? false : row.selectionMode,
    }));
    wordsDisplay = words.unprocess(selectedRowIndex).getWordsSuggestionsShuffled(selectedRowIndex);
  }

  async function onSelectChange(): Promise<void> {
    wordsArray = await languageService.load(language);
    words = new Words(wordsArray);
    startRows();
    selectedRowIndex = 0;
    wordsDisplay = words.getWordsSuggestionsShuffled(selectedRowIndex);
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

  onMount(async () => {
    startRows();
    await onSelectChange();
  });

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
</script>

<main class="container">
  <h1>Termo predictions</h1>
  <div class="row">
    <div class="col-3">
      <select bind:value={language} class="form-select mb-3" on:change={onSelectChange}>
        {#each languages as language}
          <option value={language.key}>{language.name}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      {#each rows as row, index}
        <Row
          bind:letters={row.letters}
          disabled={row.disabled}
          bind:selectionMode={row.selectionMode}
          on:next={onNext}
          on:previous={onPrevious}
          rowIndex={index}
        />
      {/each}
    </div>
  </div>
  <hr />
  <h2 class="mb-3">Suggested words</h2>
  <Suggestions
    words={wordsDisplay}
    row={selectedRowIndex}
    on:selectedWord={onSelectedWord}
    disabled={!!rows[selectedRowIndex]?.selectionMode}
  />
</main>
