import { useMemo } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import { CLOUDS } from './assets';
import { CLOUD_PARALLAX, SCREEN } from './constants';
import type { Cloud } from './types';

type UseCloudsResult = {
  clouds: readonly Cloud[];
  updateClouds: (dt: number, speed: SharedValue<number>) => void;
};

// ranges (tweak naar smaak)
const TOP_MIN = 40;
const TOP_MAX = 150;

const W_MIN = 130;
const W_MAX = 260;

// hoogte verhouding (wolken zijn vaak breder dan hoog)
const H_RATIO = 0.5;

// respawn spacing
const RESPAWN_MIN = 200;
const RESPAWN_MAX = 500;

export function useClouds(): UseCloudsResult {
  // x posities
  const c1 = useSharedValue(SCREEN.width + 60);
  const c2 = useSharedValue(SCREEN.width + 260);
  const c3 = useSharedValue(SCREEN.width + 520);
  const c4 = useSharedValue(SCREEN.width + 780);
  const c5 = useSharedValue(SCREEN.width + 1040);
  const c6 = useSharedValue(SCREEN.width + 1300);

  // random startwaarden (mag gewoon Math.random in JS thread)
  const t1 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));
  const t2 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));
  const t3 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));
  const t4 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));
  const t5 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));
  const t6 = useSharedValue(TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN));

  const w1 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));
  const w2 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));
  const w3 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));
  const w4 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));
  const w5 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));
  const w6 = useSharedValue(W_MIN + Math.random() * (W_MAX - W_MIN));

  const h1 = useSharedValue(w1.value * H_RATIO);
  const h2 = useSharedValue(w2.value * H_RATIO);
  const h3 = useSharedValue(w3.value * H_RATIO);
  const h4 = useSharedValue(w4.value * H_RATIO);
  const h5 = useSharedValue(w5.value * H_RATIO);
  const h6 = useSharedValue(w6.value * H_RATIO);

  // cloud objects (source blijft vast -> Android-safe)
  const clouds = useMemo<readonly Cloud[]>(
    () => [
      { x: c1, top: t1, w: w1, h: h1, opacity: 0.85, source: CLOUDS[0] },
      { x: c2, top: t2, w: w2, h: h2, opacity: 0.70, source: CLOUDS[1] },
      { x: c3, top: t3, w: w3, h: h3, opacity: 0.80, source: CLOUDS[2] },
      { x: c4, top: t4, w: w4, h: h4, opacity: 0.65, source: CLOUDS[3] },
      { x: c5, top: t5, w: w5, h: h5, opacity: 0.75, source: CLOUDS[4] },
      { x: c6, top: t6, w: w6, h: h6, opacity: 0.78, source: CLOUDS[5] },
    ],
    []
  );
  const updateClouds = (dt: number, speed: SharedValue<number>): void => {
    'worklet';

    const cloudSpeed = speed.value * CLOUD_PARALLAX;

        c1.value -= cloudSpeed * dt;
      c2.value -= cloudSpeed * dt;
      c3.value -= cloudSpeed * dt;
      c4.value -= cloudSpeed * dt;
      c5.value -= cloudSpeed * dt;
      c6.value -= cloudSpeed * dt;

    if (c1.value < -260) c1.value = SCREEN.width + 300;
    if (c2.value < -260) c2.value = SCREEN.width + 600;
    if (c3.value < -260) c3.value = SCREEN.width + 900;
  };

  return { clouds, updateClouds };
}
