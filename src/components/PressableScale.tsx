import { PropsWithChildren } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useMotion } from '@/src/hooks/useMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({ children, style, ...props }: PropsWithChildren<PressableProps>) {
  const scale = useSharedValue(1);
  const { enabled, springs } = useMotion();
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...props}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        scale.value = enabled ? withSpring(0.96, springs.press) : 0.98;
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = enabled ? withSpring(1, springs.press) : 1;
        props.onPressOut?.(event);
      }}>
      {children}
    </AnimatedPressable>
  );
}
