import type { ImageSourcePropType } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type Obstacle = {
  x: SharedValue<number>;
  w: number;
  h: number;
  source: ImageSourcePropType;
};

export type Cloud = {
  x: SharedValue<number>;
  top: SharedValue<number>;
  w: SharedValue<number>;
  h: SharedValue<number>;
  opacity: number;
  source: ImageSourcePropType;
};

