import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { GROUND_Y, OBSTACLE_FOOT_OFFSET } from "./constants";
import type { Obstacle } from "./types";

type Props = { obstacle: Obstacle };

export function RenderObstacle({ obstacle }: Props) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: obstacle.x.value }],
  }));

  return (
    <Animated.Image
      source={obstacle.source}
      style={[
        {
          position: "absolute",
          left: 0,
          top: GROUND_Y - obstacle.h + OBSTACLE_FOOT_OFFSET,
          width: obstacle.w,
          height: obstacle.h,
        },
        style,
      ]}
    />
  );
}
