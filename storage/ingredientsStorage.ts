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

type IngredientRow = {
  id: number;
  name: string;
  description: string | null;
  photoUri: string | null;
  tags: string | null;
  baseIngredientId: number | null;
};

function mapRowToIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    photoUri: row.photoUri ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as IngredientTag[]) : [],
    baseIngredientId: row.baseIngredientId ?? undefined,
  };
}

async function queryIngredients(whereClause?: string): Promise<Ingredient[]> {
  const query = `SELECT * FROM ingredients${whereClause ? ` ${whereClause}` : ''}`;
  const rows = await db.getAllAsync<IngredientRow>(query);
  return rows.map(mapRowToIngredient);
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

export async function getAllIngredients(): Promise<Ingredient[]> {
  return queryIngredients();
}

export async function getBaseIngredients(): Promise<Ingredient[]> {
  return queryIngredients('WHERE baseIngredientId IS NULL');
}

export async function getIngredientById(id: number): Promise<Ingredient | null> {
  const rows = await db.getAllAsync<IngredientRow>(
    'SELECT * FROM ingredients WHERE id = ? LIMIT 1',
    id
  );
  if (rows.length === 0) {
    return null;
  }
  return mapRowToIngredient(rows[0]);
}
