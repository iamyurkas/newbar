import { openDatabaseSync } from 'expo-sqlite';
import { MEASURE_UNITS } from '@/constants/MeasureUnits';

export type MeasureUnit = {
  id: number;
  name: string;
  plural: string;
};

const db = openDatabaseSync('ingredients.db');

db.execSync(
  `CREATE TABLE IF NOT EXISTS measureUnits (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    plural TEXT NOT NULL
  );`
);

void (async () => {
  for (const unit of MEASURE_UNITS) {
    await db.runAsync(
      'INSERT OR IGNORE INTO measureUnits (id, name, plural) VALUES (?, ?, ?)',
      unit.id,
      unit.name,
      unit.plural
    );
  }
})();

type MeasureUnitRow = {
  id: number;
  name: string;
  plural: string;
};

export async function getAllMeasureUnits(): Promise<MeasureUnit[]> {
  const rows = await db.getAllAsync<MeasureUnitRow>('SELECT * FROM measureUnits');
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    plural: row.plural,
  }));
}
