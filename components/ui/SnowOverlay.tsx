import React, { memo, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, type ImageStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const FLAKES = 80;

type FlakeConfig = {
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  startY: number;
  driftDuration: number;
};

export function SnowOverlay() {
  // 1x random configs genereren -> stable, ook bij rerenders in je game
  const flakes = useMemo<FlakeConfig[]>(
    () =>
      Array.from({ length: FLAKES }).map((_, i) => {
        const size = 6 + (i % 6) * 2; // 6..16
        const duration = 4500 + (i % 12) * 250; // const speed (distance/time), rustig
        return {
          x: Math.random() * width,
          size,
          duration,
          delay: Math.random() * 2500,
          drift: (Math.random() - 0.5) * 40, // -20..20 px
          startY: -Math.random() * height, // start boven/doorheen scherm
          driftDuration: 2500 + Math.random() * 2000,
        };
      }),
    []
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flakes.map((cfg, i) => (
        <Flake key={i} cfg={cfg} />
      ))}
    </View>
  );
}

const Flake = memo(function Flake({ cfg }: { cfg: FlakeConfig }) {
  const y = useSharedValue(cfg.startY);
  const x = useSharedValue(cfg.x);

  useEffect(() => {
    // VERTICAAL: altijd boven -> beneden, daarna "teleport" terug naar start (geen reverse)
    y.value = withDelay(
      cfg.delay,
      withRepeat(
        withTiming(height + 80, {
          duration: cfg.duration,
          easing: Easing.linear, // 🔑 constant speed
        }),
        -1,
        false // 🔑 geen reverse
      )
    );

    // HORIZONTAAL: zachte drift heen-en-weer (reverse mag hier wel)
    x.value = withDelay(
      cfg.delay,
      withRepeat(
        withTiming(cfg.x + cfg.drift, {
          duration: cfg.driftDuration,
          easing: Easing.linear,
        }),
        -1,
        true
      )
    );
  }, [cfg, x, y]);

  const aStyle = useAnimatedStyle<ImageStyle>(() => {
    const transform: ImageStyle['transform'] = [
      { translateX: x.value },
      { translateY: y.value },
    ];
    return { transform };
  });

  const baseStyle: ImageStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: cfg.size,
    height: cfg.size,
    opacity: 0.9,
  };

  return (
    <Animated.Image
      source={require('../../assets/ui/snow.png')}
      style={[baseStyle, aStyle] as const}
      resizeMode="contain"
    />
  );
});
