import { LanguageEnum } from './model/language.enum';
import type { ILanguage } from './model/language';

class LanguageService {
  private readonly _cache = new Map<string, readonly string[]>();

  async load(language: LanguageEnum): Promise<readonly string[]> {
    if (this._cache.has(language)) {
      return this._cache.get(language)!;
    }
    const words = await fetch(`./words/${language}.json`).then(response => response.json());
    this._cache.set(language, words);
    return words;
  }

  getLanguages(): readonly ILanguage[] {
    return [
      { key: LanguageEnum.ptBr, name: 'Portuguese' },
      { key: LanguageEnum.enUs, name: 'English' },
    ];
  }
}

export const languageService = new LanguageService();
