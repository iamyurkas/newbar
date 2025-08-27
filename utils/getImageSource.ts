import { ImageSourcePropType } from 'react-native';
import assetMap from '../assets/assetMap';

export function getImageSource(photoUri?: string | null): ImageSourcePropType | undefined {
  if (!photoUri) {
    return undefined;
  }
  return assetMap[photoUri] ?? { uri: photoUri };
}
