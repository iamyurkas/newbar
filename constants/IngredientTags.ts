export const TAG_COLORS = [
  "#ec5a5a", // 0
  "#F06292", // 1
  "#BA68C8", // 2
  "#9575CD", // 3
  "#7986CB", // 4
  "#64B5F6", // 5
  "#4FC3F7", // 6
  "#4DD0E1", // 7
  "#4DB6AC", // 8
  "#81C784", // 9
  "#AED581", // 10
  "#DCE775", // 11
  "#FFD54F", // 12
  "#FFB74D", // 13
  "#FF8A65", // 14
  "#a8a8a8", // 15
];

import type { IngredientTag } from '@/storage/ingredientTagsStorage';

export const INGREDIENT_TAGS: IngredientTag[] = [
  { id: 1, name: 'strong alcohol', color: TAG_COLORS[0], base: true },
  { id: 2, name: 'soft alcohol', color: TAG_COLORS[1], base: true },
  { id: 3, name: 'beverage', color: TAG_COLORS[3], base: true },
  { id: 4, name: 'syrup', color: TAG_COLORS[13], base: true },
  { id: 5, name: 'juice', color: TAG_COLORS[10], base: true },
  { id: 6, name: 'fruit', color: TAG_COLORS[9], base: true },
  { id: 7, name: 'herb', color: TAG_COLORS[8], base: true },
  { id: 8, name: 'spice', color: TAG_COLORS[14], base: true },
  { id: 9, name: 'dairy', color: TAG_COLORS[6], base: true },
  { id: 10, name: 'other', color: TAG_COLORS[15], base: true },
];
