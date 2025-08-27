import { openDatabaseSync } from 'expo-sqlite';
import type { IngredientTag } from './ingredientTagsStorage';

export type Ingredient = {
  id: number;
  name: string;
  description?: string;
  photoUri?: string | null;
  tags: IngredientTag[];
  baseIngredientId?: number | null;
  inBar?: boolean;
  inShoppingList?: boolean;
};

const db = openDatabaseSync('ingredients.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photoUri TEXT,
    tags TEXT,
    baseIngredientId INTEGER,
    inBar INTEGER,
    inShoppingList INTEGER
  );`
);

try {
  db.execSync('ALTER TABLE ingredients ADD COLUMN baseIngredientId INTEGER');
} catch {
  // ignore if column already exists
}

try {
  db.execSync('ALTER TABLE ingredients ADD COLUMN inBar INTEGER DEFAULT 0');
} catch {
  // ignore if column already exists
}

try {
  db.execSync('ALTER TABLE ingredients ADD COLUMN inShoppingList INTEGER DEFAULT 0');
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
  inBar: number | null;
  inShoppingList: number | null;
};

function mapRowToIngredient(row: IngredientRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    photoUri: row.photoUri ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as IngredientTag[]) : [],
    baseIngredientId: row.baseIngredientId ?? undefined,
    inBar: row.inBar === 1,
    inShoppingList: row.inShoppingList === 1,
  };
}

async function queryIngredients(whereClause?: string): Promise<Ingredient[]> {
  const query = `SELECT * FROM ingredients${whereClause ? ` ${whereClause}` : ''}`;
  const rows = await db.getAllAsync<IngredientRow>(query);
  return rows.map(mapRowToIngredient);
}

export async function addIngredient(ingredient: Ingredient): Promise<void> {
  await db.runAsync(
    'INSERT INTO ingredients (id, name, description, photoUri, tags, baseIngredientId, inBar, inShoppingList) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ingredient.id,
    ingredient.name,
    ingredient.description ?? null,
    ingredient.photoUri ?? null,
    JSON.stringify(ingredient.tags),
    ingredient.baseIngredientId ?? null,
    ingredient.inBar ? 1 : 0,
    ingredient.inShoppingList ? 1 : 0,
  );
}

export async function getAllIngredients(): Promise<Ingredient[]> {
  return queryIngredients();
}

export async function getBaseIngredients(): Promise<Ingredient[]> {
  return queryIngredients('WHERE baseIngredientId IS NULL');
}

export async function getShoppingListIngredients(): Promise<Ingredient[]> {
  return queryIngredients('WHERE inShoppingList = 1');
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

export async function getBrandedIngredients(
  baseIngredientId: number
): Promise<Ingredient[]> {
  const rows = await db.getAllAsync<IngredientRow>(
    'SELECT * FROM ingredients WHERE baseIngredientId = ?',
    baseIngredientId
  );
  return rows.map(mapRowToIngredient);
}

export async function unlinkBaseIngredient(ingredientId: number): Promise<void> {
  await db.runAsync(
    'UPDATE ingredients SET baseIngredientId = NULL WHERE id = ?',
    ingredientId
  );
}

export async function setIngredientInBar(
  ingredientId: number,
  inBar: boolean
): Promise<void> {
  await db.runAsync(
    'UPDATE ingredients SET inBar = ? WHERE id = ?',
    inBar ? 1 : 0,
    ingredientId
  );
}

export async function setIngredientInShoppingList(
  ingredientId: number,
  inShoppingList: boolean
): Promise<void> {
  await db.runAsync(
    'UPDATE ingredients SET inShoppingList = ? WHERE id = ?',
    inShoppingList ? 1 : 0,
    ingredientId
  );
}
