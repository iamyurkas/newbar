import { openDatabaseSync } from 'expo-sqlite';
import type { CocktailTag } from './cocktailTagsStorage';

export type CocktailIngredient = {
  order: number;
  ingredientId: number;
  amount?: string;
  unitId?: number;
  garnish: boolean;
  optional: boolean;
  allowBaseSubstitution: boolean;
  allowBrandedSubstitutes: boolean;
  substitutes: number[];
};

export type Cocktail = {
  id: number;
  name: string;
  glassId: string;
  tags: CocktailTag[];
  description: string;
  instructions: string;
  ingredients: CocktailIngredient[];
  createdAt: number;
  updatedAt: number;
  photoUri?: string | null;
};

const db = openDatabaseSync('cocktails.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS cocktails (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    glassId TEXT,
    tags TEXT,
    description TEXT,
    instructions TEXT,
    ingredients TEXT,
    createdAt INTEGER,
    updatedAt INTEGER,
    photoUri TEXT
  );`
);

type CocktailRow = {
  id: number;
  name: string;
  glassId: string | null;
  tags: string | null;
  description: string | null;
  instructions: string | null;
  ingredients: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  photoUri: string | null;
};

function mapRow(row: CocktailRow): Cocktail {
  return {
    id: row.id,
    name: row.name,
    glassId: row.glassId ?? '',
    tags: row.tags ? (JSON.parse(row.tags) as CocktailTag[]) : [],
    description: row.description ?? '',
    instructions: row.instructions ?? '',
    ingredients: row.ingredients
      ? (JSON.parse(row.ingredients) as CocktailIngredient[])
      : [],
    createdAt: row.createdAt ?? Date.now(),
    updatedAt: row.updatedAt ?? Date.now(),
    photoUri: row.photoUri ?? undefined,
  };
}

export async function addCocktail(cocktail: Cocktail): Promise<void> {
  await db.runAsync(
    'INSERT INTO cocktails (id, name, glassId, tags, description, instructions, ingredients, createdAt, updatedAt, photoUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    cocktail.id,
    cocktail.name,
    cocktail.glassId,
    JSON.stringify(cocktail.tags),
    cocktail.description,
    cocktail.instructions,
    JSON.stringify(cocktail.ingredients),
    cocktail.createdAt,
    cocktail.updatedAt,
    cocktail.photoUri ?? null
  );
}

export async function getAllCocktails(): Promise<Cocktail[]> {
  const rows = await db.getAllAsync<CocktailRow>('SELECT * FROM cocktails');
  return rows.map(mapRow);
}
