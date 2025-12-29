import React, { useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const FLAKES = 80;

export function SnowOverlay() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: FLAKES }).map((_, i) => (
        <Flake key={i} seed={i} />
      ))}
    </View>
  );
}

const Flake = memo(function Flake({ seed }: { seed: number }) {
  const x = Math.floor(Math.random() * width);
  const size = 10 + (seed % 4) * 2; // zichtbaar
  const duration = 1800 + (seed % 10) * 200; // sneller = meer "sneeuw gevoel"

  // start overal op het scherm
  const y = useSharedValue(Math.random() * height);

  useEffect(() => {
    y.value = withRepeat(withTiming(height + 60, { duration }), -1, false);
  }, [duration, y]);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.Image
      source={require('../../assets/ui/snow.png')}
      style={[
        { position: 'absolute', left: x, width: size, height: size, opacity: 0.9 },
        aStyle,
      ]}
      resizeMode="stretch"
    />
  );
});
