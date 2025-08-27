import type { Glassware } from '@/storage/glasswareStorage';

export const GLASSWARE: Glassware[] = [
  { id: 'bowl', name: 'Bowl', imagePath: 'assets/glassware/bowl.jpg' },
  { id: 'champagne_flute', name: 'Champagne Flute', imagePath: 'assets/glassware/champagne.jpg' },
  { id: 'cocktail_glass', name: 'Cocktail glass', imagePath: 'assets/glassware/cocktail.jpg' },
  { id: 'collins_glass', name: 'Collins glass', imagePath: 'assets/glassware/collins.jpg' },
  { id: 'copper_mug', name: 'Copper mug', imagePath: 'assets/glassware/copper.jpg' },
  { id: 'coupe', name: 'Coupe', imagePath: 'assets/glassware/coupe.jpg' },
  { id: 'cup', name: 'Cup', imagePath: 'assets/glassware/cup.jpg' },
  { id: 'goblet', name: 'Goblet', imagePath: 'assets/glassware/goblet.jpg' },
  { id: 'highball_glass', name: 'Highball glass', imagePath: 'assets/glassware/highball.jpg' },
  { id: 'hurricane_glass', name: 'Hurricane glass', imagePath: 'assets/glassware/hurricane.jpg' },
  { id: 'irish_coffee_glass', name: 'Irish Coffee glass', imagePath: 'assets/glassware/irish.jpg' },
  { id: 'margarita_glass', name: 'Margarita glass', imagePath: 'assets/glassware/margarita.jpg' },
  { id: 'nick_and_nora', name: 'Nick and Nora', imagePath: 'assets/glassware/nick.jpg' },
  { id: 'pitcher', name: 'Pitcher', imagePath: 'assets/glassware/pitcher.jpg' },
  { id: 'pub_glass', name: 'Pub glass', imagePath: 'assets/glassware/pub.jpg' },
  { id: 'rocks_glass', name: 'Rocks glass', imagePath: 'assets/glassware/rocks.jpg' },
  { id: 'shooter', name: 'Shooter', imagePath: 'assets/glassware/shooter.jpg' },
  { id: 'snifter', name: 'Snifter', imagePath: 'assets/glassware/snifter.jpg' },
  { id: 'tiki', name: 'Tiki', imagePath: 'assets/glassware/tiki.jpg' },
  { id: 'wine_glass', name: 'Wine glass', imagePath: 'assets/glassware/wine.jpg' },
];

export const getGlassById = (id: string): Glassware | null =>
  GLASSWARE.find((g) => g.id === id) ?? null;

export const searchGlass = (q: string): Glassware[] => {
  const s = q.trim().toLowerCase();
  if (!s) return GLASSWARE;
  return GLASSWARE.filter((g) => g.name.toLowerCase().includes(s));
};
