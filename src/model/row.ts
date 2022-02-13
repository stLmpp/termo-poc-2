import type { ILetter } from './letter';

export interface IRow {
  letters: ILetter[];
  disabled: boolean;
  selectionMode: boolean;
}
