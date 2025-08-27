import type { IngredientTag } from './ingredientTagsStorage';

export type Ingredient = {
  id: number;
  name: string;
  description?: string;
  photoUri?: string | null;
  tags: IngredientTag[];
};

export async function addIngredient(ingredient: Ingredient): Promise<void> {
  // TODO: persist ingredient data
  console.log('Ingredient saved', ingredient);
}
