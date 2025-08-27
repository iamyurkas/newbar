export type IngredientTag = {
  id: number;
  name: string;
  color: string;
};

export async function getAllTags(): Promise<IngredientTag[]> {
  // In a full implementation this would load custom tags from persistent storage.
  // Currently, no custom tags are stored so we simply return an empty array.
  return [];
}
