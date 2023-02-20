import { Word } from './word';
import type { ILetter } from './letter';
import { shuffleArray } from '../util';

export class Words {
  constructor(wordsArray: readonly string[]) {
    this._rowWords[-1] = wordsArray.map(word => new Word(word));
    this._rowWords[0] = wordsArray.map(word => new Word(word));
  }

  private _rowWords: Word[][] = [];

  process(letters: ILetter[], row: number): this {
    if (!this._rowWords[row]) {
      this._rowWords[row] = this._rowWords[row - 1] ?? [];
    }
    for (const letter of letters) {
      this._rowWords[row] = this._rowWords[row].filter(word => {
        if (letter.hasLetter) {
          if (letter.sameIndex) {
            return word.hasLetterAtPosition(letter.value, letter.index);
          } else {
            return word.hasLetterNotAtPosition(letter.value, letter.index);
          }
        }
        if (letters.filter(_letter => _letter.hasLetter).some(_letter => _letter.value === letter.value)) {
          return word.hasLetterNotAtPosition(letter.value, letter.index);
        } else {
          return !word.hasLetter(letter.value);
        }
      });
    }
    return this;
  }

  undoProcess(row: number): this {
    this._rowWords[row] = this._rowWords[row - 1];
    return this;
  }

  getWordsSuggestions(row: number): readonly string[] {
    return this._rowWords[row].map(word => word.value);
  }

  getWordsSuggestionsShuffled(row: number): readonly string[] {
    return shuffleArray(this.getWordsSuggestions(row));
  }
}
