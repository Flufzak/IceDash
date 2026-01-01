import React, { useMemo, useState } from "react";
import { View, StyleSheet, ImageSourcePropType, Image } from "react-native";
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TapGesture,
} from "react-native-gesture-handler";

import { PENGUIN_WALK_FRAMES } from "../penguinFrames";

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
  PENGUIN_FOOT_OFFSET,
} from "../game/constants";

import { useObstacles } from "../game/useObstacles";
import { useClouds } from "../game/useClouds";
import { RenderObstacle } from "../game/renderObstacle";
import { RenderCloud } from "../game/renderCloud";
import { palette } from "../styles/palette";

const TAP_TO_PLAY = require("../assets/ui/tap.gif");

type FrameImageProps = {
  src: ImageSourcePropType;
  index: number;
  currentFrame: SharedValue<number>;
  size: number;
};

/**
 * Render één frame (png) en toon het alleen als index == currentFrame.
 * We wisselen met opacity i.p.v. 'source' te updaten (Android-safe).
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
        { width: size, height: size, resizeMode: "contain" },
      ]}
    />
  );
}

export default function GameScene() {
  // ✅ React state voor UI (overlay/obstacles tonen)
  const [startedUI, setStartedUI] = useState(false);

  // ---- Physics (UI thread) ----
  const y = useSharedValue(GROUND_Y - PENGUIN_SIZE);
  const vy = useSharedValue(0);
  const grounded = useSharedValue(true);

  // ---- Game state (UI thread) ----
  const started = useSharedValue(false);

  // vóór start: 0, bij start wordt dit BASE_SPEED
  const speed = useSharedValue(0);

  // wolken mogen al “leven” vóór start
  const idleCloudSpeed = useSharedValue(BASE_SPEED);

  // difficulty timers
  const elapsed = useSharedValue(0);
  const lastSpeedUp = useSharedValue(0);

  // ---- World ----
  const { obstacles, updateObstacles } = useObstacles();
  const { clouds, updateClouds } = useClouds();

  // ---- Sprite animatie ----
  const frameIndex = useSharedValue(0);
  const walkAccumulator = useSharedValue(0);
  const frameCount = PENGUIN_WALK_FRAMES.length;

  // Tap: eerst start, daarna jump
  const tap: TapGesture = useMemo(() => {
    return Gesture.Tap().onEnd((): void => {
      // eerste tap: start game
      if (!started.value) {
        started.value = true;
        speed.value = BASE_SPEED;

        // reset timers
        elapsed.value = 0;
        lastSpeedUp.value = 0;

        // ✅ UI re-renderen zodat overlay weg is + obstacles zichtbaar
        runOnJS(setStartedUI)(true);
        return;
      }

      // daarna: jump
      if (grounded.value) {
        grounded.value = false;
        vy.value = JUMP_VELOCITY;
      }
    });
  }, []);

  // Game loop
  useFrameCallback((frameInfo): void => {
    const dtMs: number = frameInfo.timeSincePreviousFrame ?? 16;
    const dt: number = dtMs / 1000;

    // physics
    vy.value += GRAVITY * dt;
    y.value += vy.value * dt;

    const groundTop = GROUND_Y - PENGUIN_SIZE + PENGUIN_FOOT_OFFSET;
    if (y.value >= groundTop) {
      y.value = groundTop;
      vy.value = 0;
      grounded.value = true;
    }

    // clouds altijd updaten
    updateClouds(dt, started.value ? speed : idleCloudSpeed);

    // obstacles + difficulty pas na start
    if (started.value) {
      elapsed.value += dt;

      if (
        elapsed.value - lastSpeedUp.value >= SPEED_INTERVAL &&
        speed.value < MAX_SPEED
      ) {
        speed.value += SPEED_INCREMENT;
        lastSpeedUp.value = elapsed.value;
      }

      updateObstacles(dt, speed);
    }

    // walk animatie (loopt altijd)
    if (grounded.value && frameCount > 0) {
      walkAccumulator.value += dt;
      const step = 1 / WALK_FPS;

      if (walkAccumulator.value >= step) {
        walkAccumulator.value -= step;
        frameIndex.value = (frameIndex.value + 1) % frameCount;
      }
    }
  });

  const penguinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        {/* Wolken */}
        {clouds.map((c, i) => (
          <RenderCloud key={i} cloud={c} />
        ))}

        {/* IJs */}
        <View style={styles.ice} />

        {/* Obstakels: enkel na start (React state!) */}
        {startedUI &&
          obstacles.map((o, i) => <RenderObstacle key={i} obstacle={o} />)}

        {/* Pinguïn */}
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

        {/* Tap overlay: enkel voor start (React state!) */}
        {!startedUI && (
          <View style={styles.tapOverlay} pointerEvents="none">
            <Image source={TAP_TO_PLAY} style={styles.tapImage} />
          </View>
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  ice: {
    position: "absolute",
    left: 0,
    right: 0,
    top: GROUND_Y,
    height: 300,
    backgroundColor: palette.ground,
  },
  penguin: {
    position: "absolute",
    left: 80,
  },
  tapOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tapImage: {
    width: 440,
    height: 240,
    resizeMode: "stretch",
  },
});
