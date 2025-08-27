import { assetMap } from '@/assets/assetMap';

export function getAssetSource(uri?: string | null): any | undefined {
  if (!uri) return undefined;
  return assetMap[uri] ?? { uri };
}
