import { Thread } from 'react-native-threads';
import type { Cocktail } from '@/storage/cocktailsStorage';
import type { IngredientUsage } from '@/utils/ingredientUsage';

export function calculateIngredientUsageAsync(
  cocktails: Cocktail[],
  barIds?: Set<number>
): Promise<Record<number, IngredientUsage>> {
  return new Promise((resolve, reject) => {
    const worker = new Thread('../workers/ingredientUsage.worker.ts');

    worker.onmessage = (message) => {
      resolve(message as Record<number, IngredientUsage>);
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({
      cocktails,
      barIds: barIds ? Array.from(barIds) : undefined,
    });
  });
}
