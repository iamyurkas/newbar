import data from '@/assets/data/data.json';
import { addIngredient, getAllIngredients, type Ingredient } from '@/storage/ingredientsStorage';
import {
  addCocktail,
  getAllCocktails,
  type Cocktail,
  type CocktailIngredient,
} from '@/storage/cocktailsStorage';
import { addCocktailIngredient } from '@/storage/cocktailIngredientsStorage';
import fs from 'fs';
import path from 'path';

// Ensure static tables are populated
import '@/storage/ingredientTagsStorage';
import '@/storage/cocktailTagsStorage';
import '@/storage/glasswareStorage';
import '@/storage/measureUnitsStorage';

export async function initializeDatabase(): Promise<void> {
  const [existingIngredients, existingCocktails] = await Promise.all([
    getAllIngredients(),
    getAllCocktails(),
  ]);

  if (existingIngredients.length > 0 || existingCocktails.length > 0) {
    return;
  }

  // Map original ingredient IDs to numeric IDs for SQLite
  const ingredientIdMap = new Map<string, number>();
  data.ingredients.forEach((ing, index) => {
    ingredientIdMap.set(String(ing.id), index + 1);
  });

  // Collect assets to generate Metro-friendly map
  const assetMap: Record<string, any> = {};

  // Insert ingredients
  for (const ing of data.ingredients) {
    const newId = ingredientIdMap.get(String(ing.id))!;
    const baseId = ing.baseIngredientId
      ? ingredientIdMap.get(String(ing.baseIngredientId))
      : undefined;

    await addIngredient({
      id: newId,
      name: ing.name,
      description: ing.description,
      photoUri: ing.photoUri ?? undefined,
      tags: ing.tags,
      baseIngredientId: baseId,
      inBar: false,
      inShoppingList: false,
    } as Ingredient);

    if (ing.photoUri) {
      assetMap[ing.photoUri] = require(`@/${ing.photoUri}`);
    }
  }

  // Insert cocktails
  for (const cocktail of data.cocktails) {
    const ingredients: CocktailIngredient[] = cocktail.ingredients.map((ci: any) => ({
      order: ci.order,
      ingredientId: ingredientIdMap.get(String(ci.ingredientId))!,
      amount: ci.amount,
      unitId: ci.unitId,
      garnish: ci.garnish,
      optional: ci.optional,
      allowBaseSubstitution: ci.allowBaseSubstitution,
      allowBrandedSubstitutes: ci.allowBrandedSubstitutes,
      substitutes: ci.substitutes
        .map((s: string) => ingredientIdMap.get(String(s))!)
        .filter(Boolean),
    }));

    await addCocktail({
      id: cocktail.id,
      name: cocktail.name,
      glassId: cocktail.glassId,
      tags: cocktail.tags,
      description: cocktail.description,
      instructions: cocktail.instructions,
      ingredients,
      createdAt: cocktail.createdAt,
      updatedAt: cocktail.updatedAt,
      photoUri: cocktail.photoUri ?? null,
    } as Cocktail);

    if (cocktail.photoUri) {
      assetMap[cocktail.photoUri] = require(`@/${cocktail.photoUri}`);
    }

    for (const ci of ingredients) {
      await addCocktailIngredient(cocktail.id, ci.ingredientId);
    }
  }

  const assetMapEntries = Object.keys(assetMap)
    .map((uri) => `  "${uri}": require("@/${uri}"),`)
    .join('\n');

  const content = `export const assetMap: Record<string, any> = {\n${assetMapEntries}\n};\n`;
  const target = path.join(__dirname, '..', 'assets', 'assetMap.ts');
  fs.writeFileSync(target, content);
}
