import { self } from 'react-native-threads';
import { calculateIngredientUsage } from '@/utils/ingredientUsage';
import type { Cocktail } from '@/storage/cocktailsStorage';

type Message = {
  cocktails: Cocktail[];
  barIds?: number[];
};

self.onmessage = (message: Message) => {
  const { cocktails, barIds } = message;
  const usage = calculateIngredientUsage(cocktails, barIds ? new Set(barIds) : undefined);
  self.postMessage(usage);
};
