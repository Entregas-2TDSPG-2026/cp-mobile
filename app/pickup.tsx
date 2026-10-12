import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';
import { PickupMap } from '@/src/components/PickupMap';

export default function PickupScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>();
  const [status, setStatus] = useState('Toque para localizar pontos próximos.');
  const [denied, setDenied] = useState(false);
  const points = useQuery({ queryKey: ['pickup-points', location], queryFn: () => api.pickupPoints(location) });
  const store = useQuery({ queryKey: ['store-location'], queryFn: api.storeLocation });

  async function locate() {
    setStatus('Obtendo localização...');
    setDenied(false);
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setDenied(true);
      setStatus('A localização foi negada. A lista está em ordem de cadastro.');
      return;
    }
    try {
      const current = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      setLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      setStatus('Pontos ordenados pela distância da sua localização.');
    } catch {
      setStatus('Não foi possível obter sua posição. A lista continua disponível em ordem de cadastro.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retirada</Text>
      <Text style={styles.status}>{status}</Text>
      <PressableScale style={styles.primary} onPress={locate}><Text style={styles.primaryText}>Tentar localizar</Text></PressableScale>
      {denied ? <Pressable onPress={() => Linking.openSettings()}><Text style={styles.link}>Abrir configurações do sistema</Text></Pressable> : null}
      {points.isLoading ? <Text>Carregando pontos...</Text> : null}
      {points.isError ? <Text style={styles.error}>Não foi possível carregar os pontos.</Text> : null}
      {!points.isLoading && !points.isError && points.data?.length === 0 ? <Text>Nenhum ponto cadastrado.</Text> : null}
      {points.data?.map((point) => <View key={point.id} style={styles.card}><Text style={styles.name}>{point.name}</Text><Text>{point.address}</Text>{point.distance != null ? <Text style={styles.distance}>{point.distance.toFixed(1)} km</Text> : null}</View>)}
      {store.data && points.data?.length ? <PickupMap store={store.data} points={points.data} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, backgroundColor: appColors.background },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  status: { color: appColors.muted },
  primary: { padding: 14, borderRadius: 12, backgroundColor: appColors.primary, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  link: { color: appColors.primary, textDecorationLine: 'underline' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 4, borderWidth: 1, borderColor: appColors.border },
  name: { fontWeight: '700', color: appColors.text },
  distance: { color: appColors.success, fontWeight: '600' },
  error: { color: appColors.danger },
});
