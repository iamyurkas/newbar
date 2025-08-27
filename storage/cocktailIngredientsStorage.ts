import { openDatabaseSync } from 'expo-sqlite';

export type CocktailIngredient = {
  cocktailId: number;
  ingredientId: number;
};

const db = openDatabaseSync('cocktails.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS cocktailIngredients (
    cocktailId INTEGER NOT NULL,
    ingredientId INTEGER NOT NULL,
    PRIMARY KEY (cocktailId, ingredientId)
  );`
);

type CocktailIngredientRow = {
  cocktailId: number;
  ingredientId: number;
};

function mapRow(row: CocktailIngredientRow): CocktailIngredient {
  return {
    cocktailId: row.cocktailId,
    ingredientId: row.ingredientId,
  };
}

export async function addCocktailIngredient(
  cocktailId: number,
  ingredientId: number
): Promise<void> {
  await db.runAsync(
    'INSERT OR IGNORE INTO cocktailIngredients (cocktailId, ingredientId) VALUES (?, ?)',
    cocktailId,
    ingredientId
  );
}

export async function getIngredientsForCocktail(
  cocktailId: number
): Promise<CocktailIngredient[]> {
  const rows = await db.getAllAsync<CocktailIngredientRow>(
    'SELECT * FROM cocktailIngredients WHERE cocktailId = ?',
    cocktailId
  );
  return rows.map(mapRow);
}

export async function getCocktailsForIngredient(
  ingredientId: number
): Promise<CocktailIngredient[]> {
  const rows = await db.getAllAsync<CocktailIngredientRow>(
    'SELECT * FROM cocktailIngredients WHERE ingredientId = ?',
    ingredientId
  );
  return rows.map(mapRow);
}

export async function removeCocktailIngredient(
  cocktailId: number,
  ingredientId: number
): Promise<void> {
  await db.runAsync(
    'DELETE FROM cocktailIngredients WHERE cocktailId = ? AND ingredientId = ?',
    cocktailId,
    ingredientId
  );
}
