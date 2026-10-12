import type { WithSpringConfig } from 'react-native-reanimated';

export const ANIMATIONS_ENABLED = true;

export const motion = {
  durations: {
    fast: 160,
    normal: 240,
    slow: 360,
  },
  stagger: {
    step: 45,
    maxItems: 6,
  },
  springs: {
    press: {
      damping: 16,
      stiffness: 240,
      mass: 0.7,
    } satisfies WithSpringConfig,
  },
} as const;
