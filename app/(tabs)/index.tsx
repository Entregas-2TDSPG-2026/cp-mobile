import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { Skeleton } from '@/src/components/Skeleton';
import { appColors } from '@/src/theme/colors';
import { Text } from '@/components/Themed';

export default function HomeScreen() {
  const products = useQuery({ queryKey: ['products'], queryFn: api.products });

  if (products.isLoading) {
    return <View style={styles.center}><Skeleton width="80%" height={28} /><Skeleton width="90%" height={90} /><Skeleton width="90%" height={90} /></View>;
  }
  if (products.isError) {
    return <View style={styles.center}><Text style={styles.error}>Não foi possível carregar os produtos.</Text><Text>{products.error.message}</Text></View>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={products.data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.heading}>Loja que responde</Text>}
      ListEmptyComponent={<Text>Nenhum produto disponível.</Text>}
      renderItem={({ item, index }) => (
        <Link href={{ pathname: '/product/[id]', params: { id: item.id } }} asChild>
          <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 45).duration(240)}>
          <PressableScale style={styles.card}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : <View style={styles.imagePlaceholder}><Text>Produto</Text></View>}
            <View style={styles.cardBody}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
              {item.rating ? <Text style={styles.rating}>★ {item.rating.average.toFixed(1)} ({item.rating.count})</Text> : null}
            </View>
          </PressableScale>
          </Animated.View>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, gap: 14, backgroundColor: appColors.background, flexGrow: 1 },
  center: { flex: 1, padding: 24, gap: 18, justifyContent: 'center', backgroundColor: appColors.background },
  heading: { fontSize: 28, fontWeight: '700', color: appColors.text, marginBottom: 8 },
  card: { backgroundColor: appColors.surface, borderRadius: 16, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: appColors.border },
  image: { width: 110, height: 110 },
  imagePlaceholder: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eaf4fb' },
  cardBody: { padding: 16, gap: 8, flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: appColors.text },
  price: { fontSize: 16, fontWeight: '700', color: appColors.primary },
  rating: { color: '#b54708' },
  error: { color: appColors.danger, fontWeight: '700' },
});
