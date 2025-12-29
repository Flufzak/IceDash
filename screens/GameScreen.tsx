import React, { useMemo } from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, TapGesture } from 'react-native-gesture-handler';

import { PENGUIN_WALK_FRAMES } from '../penguinFrames';

// game modules (hou GameScene klein)
import {
  GROUND_Y,
  PENGUIN_SIZE,
  GRAVITY,
  JUMP_VELOCITY,
  WALK_FPS,
  BASE_SPEED,
  SPEED_INCREMENT,
  SPEED_INTERVAL,
  MAX_SPEED,
} from '../game/constants';

import { useObstacles } from '../game/useObstacles';
import { useClouds } from '../game/useClouds';
import { RenderObstacle } from '../game/renderObstacle';
import { RenderCloud } from '../game/renderCloud';

type FrameImageProps = {
  src: ImageSourcePropType;
  index: number;
  currentFrame: SharedValue<number>;
  size: number;
};

/**
 * Render één frame (png) en toon het alleen als index == currentFrame.
 * We wisselen met opacity i.p.v. 'source' te updaten, want dat crasht op Android.
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

  // ---- Runner speed (difficulty scaling) ----
  const speed = useSharedValue(BASE_SPEED);

  // tijd bijhouden voor speed-up
  const elapsed = useSharedValue(0);     // totale speeltijd (sec)
  const lastSpeedUp = useSharedValue(0); // laatste tijdstip van speed-up (sec)

  // ---- Obstacles + clouds (apart beheerd) ----
  const { obstacles, updateObstacles } = useObstacles();
  const { clouds, updateClouds } = useClouds();

  // ---- Sprite animatie state (UI thread) ----
  const frameIndex = useSharedValue(0);      // welk walk frame tonen we?
  const walkAccumulator = useSharedValue(0); // tijd-accu om WALK_FPS te halen
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

    // 0) Difficulty scaling: elke SPEED_INTERVAL seconden gaat de speed omhoog
    elapsed.value += dt;

    if (
      elapsed.value - lastSpeedUp.value >= SPEED_INTERVAL &&
      speed.value < MAX_SPEED
    ) {
      speed.value += SPEED_INCREMENT;
      lastSpeedUp.value = elapsed.value;
    }

    // 1) Physics update (jump/fall)
    vy.value += GRAVITY * dt;
    y.value += vy.value * dt;

    // 2) Collision met “grond”
    const groundTop = GROUND_Y - PENGUIN_SIZE;
    if (y.value >= groundTop) {
      y.value = groundTop;
      vy.value = 0;
      grounded.value = true;
    }

    // 3) World update (clouds parallax + obstacles)
    updateClouds(dt, speed);
    updateObstacles(dt, speed);

    // 4) Walk animatie (enkel als grounded)
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
        {/* Wolken eerst renderen zodat ze achteraan zitten */}
        {clouds.map((c, i) => (
          <RenderCloud key={i} cloud={c} />
        ))}

        {/* “IJs” onderaan */}
        <View style={styles.ice} />

        {/* Obstakels op de grond */}
        {obstacles.map((o, i) => (
          <RenderObstacle key={i} obstacle={o} />
        ))}

        {/* Pinguin */}
        <Animated.View style={[styles.penguin, penguinStyle]}>
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
