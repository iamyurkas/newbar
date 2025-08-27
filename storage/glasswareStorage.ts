import { openDatabaseSync } from 'expo-sqlite';
import { GLASSWARE } from '@/constants/Glassware';

export type Glassware = {
  id: string;
  name: string;
  imagePath: string;
};

const db = openDatabaseSync('cocktails.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS glassware (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    image_path TEXT NOT NULL
  );`
);

void (async () => {
  for (const glass of GLASSWARE) {
    await db.runAsync(
      'INSERT OR IGNORE INTO glassware (id, name, image_path) VALUES (?, ?, ?)',
      glass.id,
      glass.name,
      glass.imagePath
    );
  }
})();

type GlasswareRow = {
  id: string;
  name: string;
  image_path: string;
};

function mapRow(row: GlasswareRow): Glassware {
  return {
    id: row.id,
    name: row.name,
    imagePath: row.image_path,
  };
}

export async function getAllGlassware(): Promise<Glassware[]> {
  const rows = await db.getAllAsync<GlasswareRow>('SELECT * FROM glassware');
  return rows.map(mapRow);
}
