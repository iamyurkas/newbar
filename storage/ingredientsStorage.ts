import { openDatabaseSync } from 'expo-sqlite';
import type { IngredientTag } from './ingredientTagsStorage';

export type Ingredient = {
  id: number;
  name: string;
  description?: string;
  photoUri?: string | null;
  tags: IngredientTag[];
};

const db = openDatabaseSync('ingredients.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photoUri TEXT,
    tags TEXT
  );`
);

export async function addIngredient(ingredient: Ingredient): Promise<void> {
  await db.runAsync(
    'INSERT INTO ingredients (id, name, description, photoUri, tags) VALUES (?, ?, ?, ?, ?)',
    ingredient.id,
    ingredient.name,
    ingredient.description ?? null,
    ingredient.photoUri ?? null,
    JSON.stringify(ingredient.tags),
  );
}

type IngredientRow = {
  id: number;
  name: string;
  description: string | null;
  photoUri: string | null;
  tags: string | null;
};

export async function getAllIngredients(): Promise<Ingredient[]> {
  const rows = await db.getAllAsync<IngredientRow>('SELECT * FROM ingredients');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    photoUri: row.photoUri ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as IngredientTag[]) : [],
  }));
}
