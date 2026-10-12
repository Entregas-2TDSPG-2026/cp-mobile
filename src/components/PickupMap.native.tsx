import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import type { PickupPoint, StoreLocation } from '@/src/api/types';
import { appColors } from '@/src/theme/colors';

export function PickupMap({ store, points }: { store: StoreLocation; points: PickupPoint[] }) {
  return (
    <MapView style={styles.map} initialRegion={{ latitude: store.latitude, longitude: store.longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }}>
      <Marker coordinate={store} title={store.name ?? 'Loja'} pinColor={appColors.primary} />
      {points.map((point) => <Marker key={point.id} coordinate={point} title={point.name} description={point.address} />)}
    </MapView>
  );
}

const styles = StyleSheet.create({ map: { height: 220, borderRadius: 16, marginTop: 4 } });
