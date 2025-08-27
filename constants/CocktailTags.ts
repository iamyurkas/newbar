import { TAG_COLORS } from './IngredientTags';
import type { CocktailTag } from '@/storage/cocktailTagsStorage';

export const COCKTAIL_TAGS: CocktailTag[] = [
  { id: 1, name: 'IBA Official', color: TAG_COLORS[9], base: true },
  { id: 2, name: 'Unforgettables', color: TAG_COLORS[3], base: true },
  { id: 3, name: 'Contemporary', color: TAG_COLORS[5], base: true },
  { id: 4, name: 'New Era', color: TAG_COLORS[7], base: true },
  { id: 5, name: 'strong', color: TAG_COLORS[0], base: true },
  { id: 6, name: 'moderate', color: TAG_COLORS[1], base: true },
  { id: 7, name: 'soft', color: TAG_COLORS[12], base: true },
  { id: 8, name: 'long', color: TAG_COLORS[13], base: true },
  { id: 9, name: 'shooter', color: TAG_COLORS[14], base: true },
  { id: 10, name: 'non-alcoholic', color: TAG_COLORS[11], base: true },
  { id: 11, name: 'custom', color: TAG_COLORS[15], base: false },
];

