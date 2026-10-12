import { useReducedMotion } from 'react-native-reanimated';

import { ANIMATIONS_ENABLED, motion } from '@/src/theme/motion';

export function useMotion() {
  const reducedMotion = useReducedMotion();
  const enabled = ANIMATIONS_ENABLED && !reducedMotion;

  return {
    enabled,
    reducedMotion: reducedMotion ?? false,
    durations: motion.durations,
    stagger: motion.stagger,
    springs: motion.springs,
  };
}
