import { differenceInMinutes, isValid } from 'date-fns';

const baseApiUrl = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'
const cacheKey = 'TERMO-PREDICTIONS-LAST-DATE-STATS'

class StatsService {

  constructor(private storage: Storage) {
  }

  private readonly _endPoint = `${baseApiUrl}/stats`;

  private async _isPostNecessary(): Promise<boolean> {
    const storageDate = this.storage.getItem(cacheKey);
    let lastDate = new Date();
    if (storageDate && isValid(new Date(storageDate))) {
      lastDate = new Date(storageDate);
    }
    const difference = differenceInMinutes(new Date(), lastDate);
    return difference > 15;
  }

  async post(): Promise<void> {
    if (await this._isPostNecessary()) {
      await fetch(this._endPoint, { method: 'POST' }).then(response => response.json());
      this.storage.setItem(cacheKey, new Date().toISOString());
    }
  }
}

export const statsService = new StatsService(localStorage);
