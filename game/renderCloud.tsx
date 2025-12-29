import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { Cloud } from './types';

type Props = { cloud: Cloud };

export function RenderCloud({ cloud }: Props) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: cloud.x.value }],
    top: cloud.top.value,
    width: cloud.w.value,
    height: cloud.h.value,
  }));

  return (
    <Animated.Image
      source={cloud.source}
      style={[
        {
          position: 'absolute',
          left: 0,
          top: cloud.top,
          width: cloud.w,
          height: cloud.h,
          opacity: cloud.opacity,
          resizeMode: 'contain',
        },
        style,
      ]}
    />
  );
}
