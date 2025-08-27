import type { Cocktail } from '@/storage/cocktailsStorage';

export type IngredientUsage = {
  count: number;
  singleName?: string;
};

export function calculateIngredientUsage(
  cocktails: Cocktail[],
  barIds?: Set<number>
): Record<number, IngredientUsage> {
  const usage: Record<number, IngredientUsage> = {};
  for (const cocktail of cocktails) {
    if (barIds) {
      const requiredIds = cocktail.ingredients
        .filter((ci) => !ci.optional)
        .map((ci) => ci.ingredientId);
      const canMake = requiredIds.every((id) => barIds.has(id));
      if (!canMake) {
        continue;
      }
    }
    for (const ci of cocktail.ingredients) {
      if (barIds && !barIds.has(ci.ingredientId)) {
        continue;
      }
      const info = usage[ci.ingredientId] || { count: 0 };
      info.count += 1;
      if (info.count === 1) {
        info.singleName = cocktail.name;
      } else {
        delete info.singleName;
      }
      usage[ci.ingredientId] = info;
    }
  }
  return usage;
}
