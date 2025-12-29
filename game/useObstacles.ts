import { useMemo } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import { SCREEN, BASE_SPEED } from './constants';
import { OBSTACLE_ICE } from './assets';
import type { Obstacle } from './types';

type UseObstaclesResult = {
  obstacles: readonly Obstacle[];
  updateObstacles: (dt: number, speed: SharedValue<number>) => void;
};

const OB_W = 52;
const OB_H = 52;

// basis gaps (worden geschaald met speed)
const BASE_MIN_GAP = 200;
const BASE_MAX_GAP = 360;

// spawn net buiten rechts
const SPAWN_PAD = 40;

export function useObstacles(): UseObstaclesResult {
  // 4 obstacles => meer kans op meerdere tegelijk
  const x1 = useSharedValue(SCREEN.width + 120);
  const x2 = useSharedValue(SCREEN.width + 120 + 240);
  const x3 = useSharedValue(SCREEN.width + 120 + 480);
  const x4 = useSharedValue(SCREEN.width + 120 + 720);

  const obstacles = useMemo<readonly Obstacle[]>(
    () => [
      { x: x1, w: OB_W, h: OB_H, source: OBSTACLE_ICE },
      { x: x2, w: OB_W, h: OB_H, source: OBSTACLE_ICE },
      { x: x3, w: OB_W, h: OB_H, source: OBSTACLE_ICE },
      { x: x4, w: OB_W, h: OB_H, source: OBSTACLE_ICE },
    ],
    []
  );

  const updateObstacles = (dt: number, speed: SharedValue<number>): void => {
    'worklet';

    const rand = (min: number, max: number): number => {
      'worklet';
      return Math.random() * (max - min) + min;
    };

    // ---- fairness: gaps schalen mee met speed ----
    // speedFactor ~ 1 bij BASE_SPEED, groter als het sneller wordt
    const speedFactor = speed.value / BASE_SPEED;

    // schaal gaps mee, maar clamp zodat het niet extreem wordt
    const minGap = BASE_MIN_GAP * speedFactor;
    const maxGap = BASE_MAX_GAP * speedFactor;

    const clampedMinGap = Math.max(BASE_MIN_GAP, Math.min(minGap, 520));
    const clampedMaxGap = Math.max(clampedMinGap + 80, Math.min(maxGap, 900));

    // move all
    x1.value -= speed.value * dt;
    x2.value -= speed.value * dt;
    x3.value -= speed.value * dt;
    x4.value -= speed.value * dt;

    // helper: afstand tot de dichtstbijzijnde obstacle die rechts staat
    const nextRightDistance = (x: number): number => {
      'worklet';
      const xs = [x1.value, x2.value, x3.value, x4.value];
      let best = 1e9;

      for (let i = 0; i < xs.length; i++) {
        const d = xs[i] - x;
        if (d > 0 && d < best) best = d;
      }
      return best;
    };

    const respawn = (target: SharedValue<number>): void => {
      'worklet';

      // basis: net buiten het scherm rechts
      let candidate = SCREEN.width + SPAWN_PAD + rand(0, 80);

      // zorg dat hij niet te dicht bij de eerstvolgende obstacle rechts komt
      let tries = 0;
      while (tries < 8) {
        const gapToNext = nextRightDistance(candidate);
        if (gapToNext === 1e9 || gapToNext >= clampedMinGap) break;
        candidate += (clampedMinGap - gapToNext) + rand(20, 60);
        tries += 1;
      }

      // random gap toevoegen (ook geschaald)
      candidate += rand(clampedMinGap, clampedMaxGap);

      target.value = candidate;
    };

    if (x1.value < -OB_W) respawn(x1);
    if (x2.value < -OB_W) respawn(x2);
    if (x3.value < -OB_W) respawn(x3);
    if (x4.value < -OB_W) respawn(x4);
  };

  return { obstacles, updateObstacles };
}
