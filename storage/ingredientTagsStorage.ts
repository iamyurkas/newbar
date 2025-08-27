import { openDatabaseSync } from 'expo-sqlite';
import { INGREDIENT_TAGS } from '@/constants/IngredientTags';

export type IngredientTag = {
  id: number;
  name: string;
  color: string;
  base: boolean;
};

const db = openDatabaseSync('ingredients.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS ingredientTags (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    base INTEGER NOT NULL
  );`
);

void (async () => {
  for (const tag of INGREDIENT_TAGS) {
    await db.runAsync(
      'INSERT OR IGNORE INTO ingredientTags (id, name, color, base) VALUES (?, ?, ?, ?)',
      tag.id,
      tag.name,
      tag.color,
      tag.base ? 1 : 0
    );
  }
})();

type IngredientTagRow = {
  id: number;
  name: string;
  color: string;
  base: number;
};

function mapRow(row: IngredientTagRow): IngredientTag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    base: row.base === 1,
  };
}

export async function getAllTags(): Promise<IngredientTag[]> {
  const rows = await db.getAllAsync<IngredientTagRow>('SELECT * FROM ingredientTags');
  return rows.map(mapRow);
}

export async function addTag(tag: IngredientTag): Promise<void> {
  await db.runAsync(
    'INSERT INTO ingredientTags (id, name, color, base) VALUES (?, ?, ?, ?)',
    tag.id,
    tag.name,
    tag.color,
    tag.base ? 1 : 0
  );
}

