import type { Ingredient } from './ingredientsStorage';

export type IngredientListKey = 'all' | 'my' | 'shopping';

type CacheEntry = {
  data: Ingredient[];
  dirty: boolean;
};

const cache: Record<IngredientListKey, CacheEntry> = {
  all: { data: [], dirty: true },
  my: { data: [], dirty: true },
  shopping: { data: [], dirty: true },
};

export function getIngredientsCache(key: IngredientListKey): Ingredient[] | null {
  const entry = cache[key];
  return entry.dirty ? null : entry.data;
}

export function setIngredientsCache(key: IngredientListKey, data: Ingredient[]): void {
  cache[key] = { data, dirty: false };
}

export function markIngredientsCacheDirty(key?: IngredientListKey): void {
  if (key) {
    cache[key].dirty = true;
  } else {
    (Object.keys(cache) as IngredientListKey[]).forEach((k) => {
      cache[k].dirty = true;
    });
  }
}
