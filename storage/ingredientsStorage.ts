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
