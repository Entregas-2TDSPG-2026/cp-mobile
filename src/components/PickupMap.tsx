import { StyleSheet, View } from 'react-native';

import type { PickupPoint, StoreLocation } from '@/src/api/types';
import { Text } from '@/components/Themed';

export function PickupMap({ store, points }: { store: StoreLocation; points: PickupPoint[] }) {
  return <View style={styles.fallback}><Text>Mapa disponível no Android/iOS.</Text><Text>{points.length} pontos próximos da loja.</Text></View>;
}

const styles = StyleSheet.create({ fallback: { height: 100, borderRadius: 16, backgroundColor: '#eaf4fb', alignItems: 'center', justifyContent: 'center', gap: 4 } });
