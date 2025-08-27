import { openDatabaseSync } from 'expo-sqlite';
import { COCKTAIL_TAGS } from '@/constants/CocktailTags';

export type CocktailTag = {
  id: number;
  name: string;
  color: string;
  base: boolean;
};

const db = openDatabaseSync('cocktails.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS cocktailTags (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    base INTEGER NOT NULL
  );`
);

void (async () => {
  for (const tag of COCKTAIL_TAGS) {
    await db.runAsync(
      'INSERT OR IGNORE INTO cocktailTags (id, name, color, base) VALUES (?, ?, ?, ?)',
      tag.id,
      tag.name,
      tag.color,
      tag.base ? 1 : 0
    );
  }
})();

type CocktailTagRow = {
  id: number;
  name: string;
  color: string;
  base: number;
};

function mapRow(row: CocktailTagRow): CocktailTag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    base: row.base === 1,
  };
}

export async function getAllTags(): Promise<CocktailTag[]> {
  const rows = await db.getAllAsync<CocktailTagRow>('SELECT * FROM cocktailTags');
  return rows.map(mapRow);
}

export async function addTag(tag: CocktailTag): Promise<void> {
  await db.runAsync(
    'INSERT INTO cocktailTags (id, name, color, base) VALUES (?, ?, ?, ?)',
    tag.id,
    tag.name,
    tag.color,
    tag.base ? 1 : 0
  );
}

