import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, TapGesture } from 'react-native-gesture-handler';

import { PENGUIN_WALK_FRAMES } from '../penguinFrames';

const { height: H } = Dimensions.get('window');

// “Grond” (bovenkant van je ijsvlak)
const GROUND_Y = H * 0.72;

// Sprite grootte
const PENGUIN_SIZE = 72;

// Simple physics
const GRAVITY = 2400;       // px/s^2
const JUMP_VELOCITY = -900; // px/s (negatief = omhoog)
const WALK_FPS = 12;        // frames per seconde voor walk animatie

type FrameImageProps = {
  src: ImageSourcePropType;
  index: number;
  currentFrame: SharedValue<number>;
  size: number;
};

/**
 * Render één frame (png) en toon het alleen als index == currentFrame.
 * We wisselen met opacity i.p.v. 'source' te updaten, want dat crasht op Android bij RCTImageView.
 */
function FrameImage({ src, index, currentFrame, size }: FrameImageProps) {
  const style = useAnimatedStyle(() => ({
    opacity: currentFrame.value === index ? 1 : 0,
  }));

  return (
    <Animated.Image
      source={src}
      style={[
        StyleSheet.absoluteFillObject,
        style,
        { width: size, height: size, resizeMode: 'contain' },
      ]}
    />
  );
}

export default function GameScene() {
  // ---- Physics state (UI thread) ----
  const y = useSharedValue(GROUND_Y - PENGUIN_SIZE); // pinguin y-positie (top-left)
  const vy = useSharedValue(0);                      // verticale snelheid
  const grounded = useSharedValue(true);             // staat hij op de grond?

  // ---- Sprite animatie state (UI thread) ----
  const frameIndex = useSharedValue(0);              // welk walk frame tonen we?
  const walkAccumulator = useSharedValue(0);         // tijd-accu om WALK_FPS te halen
  const frameCount = PENGUIN_WALK_FRAMES.length;

  // Tap gesture: springen als je op de grond staat
  const tap: TapGesture = useMemo(() => {
    return Gesture.Tap().onEnd((): void => {
      if (grounded.value) {
        grounded.value = false;
        vy.value = JUMP_VELOCITY;
      }
    });
  }, []);

  // Game loop: draait ± 60fps
  useFrameCallback((frameInfo): void => {
    const dtMs: number = frameInfo.timeSincePreviousFrame ?? 16;
    const dt: number = dtMs / 1000;

    // 1) Physics update
    vy.value += GRAVITY * dt;
    y.value += vy.value * dt;

    // 2) Collision met “grond”
    const groundTop = GROUND_Y - PENGUIN_SIZE;
    if (y.value >= groundTop) {
      y.value = groundTop;
      vy.value = 0;
      grounded.value = true;
    }

    // 3) Walk animatie (enkel als grounded)
    if (grounded.value && frameCount > 0) {
      walkAccumulator.value += dt;
      const step = 1 / WALK_FPS;

      if (walkAccumulator.value >= step) {
        walkAccumulator.value -= step;

        const next = frameIndex.value + 1;
        frameIndex.value = next >= frameCount ? 0 : next;
      }
    }
  });

  // Pinguin beweegt verticaal met translateY
  const penguinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        {/* “IJs” onderaan */}
        <View style={styles.ice} />

        {/* Pinguin container */}
        <Animated.View style={[styles.penguin, penguinStyle]}>
          {/* We stacken alle frames bovenop elkaar en wisselen met opacity */}
          <View style={{ width: PENGUIN_SIZE, height: PENGUIN_SIZE }}>
            {PENGUIN_WALK_FRAMES.map((src, i) => (
              <FrameImage
                key={i}
                src={src as ImageSourcePropType}
                index={i}
                currentFrame={frameIndex}
                size={PENGUIN_SIZE}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#68a2ddff' },
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
    left: 80, // vaste x-positie (runner gevoel)
  },
});
