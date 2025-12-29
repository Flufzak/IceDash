import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  TapGesture,
} from 'react-native-gesture-handler';
import { PENGUIN_WALK_FRAMES } from '../penguinFrames';

const { height: H } = Dimensions.get('window');

const GROUND_Y = H * 0.72;
const PENGUIN_SIZE = 72;

const GRAVITY = 2400;       // px/s^2
const JUMP_VELOCITY = -900;
const WALK_FPS = 12;

export default function GameScene() {
  // physics state (Reanimated shared values)
  const y: SharedValue<number> = useSharedValue(
    GROUND_Y - PENGUIN_SIZE
  );
  const vy: SharedValue<number> = useSharedValue(0);
  const grounded: SharedValue<boolean> = useSharedValue(true);

  // sprite animation state
  const [frame, setFrame] = useState(0);
  const frameCount: number = PENGUIN_WALK_FRAMES.length;

  // timing accumulator
  const walkAccumulator: SharedValue<number> = useSharedValue(0);

  // tap = jump
  const tap: TapGesture = useMemo(() => {
    return Gesture.Tap().onEnd((): void => {
      if (grounded.value) {
        grounded.value = false;
        vy.value = JUMP_VELOCITY;
      }
    });
  }, []);

  // game loop
  useFrameCallback((frameInfo): void => {
    const dt: number = frameInfo.timeSincePreviousFrame ?? 16;
    const dtSec: number = dt / 1000;

    // physics
    vy.value += GRAVITY * dtSec;
    y.value += vy.value * dtSec;

    // ground collision
    const groundTop: number = GROUND_Y - PENGUIN_SIZE;
    if (y.value >= groundTop) {
      y.value = groundTop;
      vy.value = 0;
      grounded.value = true;
    }

    // walk animation
    if (grounded.value) {
      walkAccumulator.value += dtSec;
      const step: number = 1 / WALK_FPS;

      if (walkAccumulator.value >= step) {
        walkAccumulator.value -= step;
        runOnJS(setFrame)((prev: number): number =>
          (prev + 1) % frameCount
        );
      }
    }
  });

  const penguinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        {/* IJs / grond */}
        <View style={styles.ice} />

        {/* Pinguïn */}
        <Animated.View style={[styles.penguin, penguinStyle]}>
          <Image
            source={
              PENGUIN_WALK_FRAMES[frame] as ImageSourcePropType
            }
            style={{
              width: PENGUIN_SIZE,
              height: PENGUIN_SIZE,
              resizeMode: 'contain',
            }}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  ice: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: GROUND_Y,
    height: 200,
    backgroundColor: '#bfe9ff',
  },
  penguin: {
    position: 'absolute',
    left: 80,
  },
});
