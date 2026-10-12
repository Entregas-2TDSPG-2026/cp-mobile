import { StyleSheet } from 'react-native';
import Animated, { FadeIn, withRepeat, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';

export function Skeleton({ width = '100%', height = 18 }: { width?: number | `${number}%`; height?: number }) {
  const opacity = useSharedValue(0.45);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 700 }), -1, true);
  }, [opacity]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View entering={FadeIn.duration(160)} style={[styles.base, { width, height }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: '#e5e7eb', borderRadius: 8, opacity: 0.7 },
});
