import { openDatabaseSync } from 'expo-sqlite';
import type { IngredientTag } from './ingredientTagsStorage';

export type Ingredient = {
  id: number;
  name: string;
  description?: string;
  photoUri?: string | null;
  tags: IngredientTag[];
  baseIngredientId?: number | null;
};

const db = openDatabaseSync('ingredients.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photoUri TEXT,
    tags TEXT,
    baseIngredientId INTEGER
  );`
);

try {
  db.execSync('ALTER TABLE ingredients ADD COLUMN baseIngredientId INTEGER');
} catch {
  // ignore if column already exists
}

export async function addIngredient(ingredient: Ingredient): Promise<void> {
  await db.runAsync(
    'INSERT INTO ingredients (id, name, description, photoUri, tags, baseIngredientId) VALUES (?, ?, ?, ?, ?, ?)',
    ingredient.id,
    ingredient.name,
    ingredient.description ?? null,
    ingredient.photoUri ?? null,
    JSON.stringify(ingredient.tags),
    ingredient.baseIngredientId ?? null,
  );
}

type IngredientRow = {
  id: number;
  name: string;
  description: string | null;
  photoUri: string | null;
  tags: string | null;
  baseIngredientId: number | null;
};

export async function getAllIngredients(): Promise<Ingredient[]> {
  const rows = await db.getAllAsync<IngredientRow>('SELECT * FROM ingredients');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    photoUri: row.photoUri ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as IngredientTag[]) : [],
    baseIngredientId: row.baseIngredientId ?? undefined,
  }));
}

export async function getBaseIngredients(): Promise<Ingredient[]> {
  const rows = await db.getAllAsync<IngredientRow>(
    'SELECT * FROM ingredients WHERE baseIngredientId IS NULL'
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    photoUri: row.photoUri ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as IngredientTag[]) : [],
    baseIngredientId: row.baseIngredientId ?? undefined,
  }));
}
