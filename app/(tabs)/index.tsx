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
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.eyebrow}><Text style={styles.eyebrowText}>●  novidades para você</Text></View>
          <Text style={styles.heading}>Escolhas que combinam com você.</Text>
          <Text style={styles.subtitle}>Produtos selecionados para deixar seu dia mais leve.</Text>
          <View style={styles.banner}><Text style={styles.bannerSmall}>OFERTAS DA SEMANA</Text><Text style={styles.bannerTitle}>Até 30% off</Text><Text style={styles.bannerText}>Descubra seus próximos favoritos.</Text></View>
          <Text style={styles.sectionTitle}>Em destaque</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Nenhum produto disponível.</Text>}
      renderItem={({ item, index }) => (
        <Link href={{ pathname: '/product/[id]', params: { id: item.id } }} asChild>
          <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 45).duration(240)}>
          <PressableScale style={styles.card}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : <View style={styles.imagePlaceholder}><Text style={styles.placeholderIcon}>✦</Text><Text style={styles.placeholderText}>Produto</Text></View>}
            <View style={styles.cardBody}>
              <Text style={styles.category}>EM DESTAQUE</Text>
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
  list: { padding: 20, paddingBottom: 32, gap: 14, backgroundColor: appColors.background, flexGrow: 1 },
  center: { flex: 1, padding: 24, gap: 18, justifyContent: 'center', backgroundColor: appColors.background },
  header: { gap: 8, marginBottom: 6 },
  eyebrow: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: appColors.softAccent },
  eyebrowText: { color: appColors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  heading: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: appColors.text, marginTop: 4 },
  subtitle: { fontSize: 15, color: appColors.muted, lineHeight: 21, marginBottom: 10 },
  banner: { backgroundColor: appColors.primary, borderRadius: 22, padding: 20, minHeight: 132, justifyContent: 'center', overflow: 'hidden' },
  bannerSmall: { color: '#dcd8ff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  bannerTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 3 },
  bannerText: { color: '#e8e5ff', fontSize: 13, marginTop: 3 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: appColors.text, marginTop: 12 },
  card: { backgroundColor: appColors.surface, borderRadius: 20, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: appColors.border, elevation: 2, shadowColor: '#1d164d', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  image: { width: 118, height: 128 },
  imagePlaceholder: { width: 118, height: 128, alignItems: 'center', justifyContent: 'center', backgroundColor: appColors.softPrimary },
  placeholderIcon: { color: appColors.primary, fontSize: 28 },
  placeholderText: { color: appColors.primary, fontWeight: '700', fontSize: 12 },
  cardBody: { padding: 16, gap: 7, flex: 1, justifyContent: 'center' },
  category: { color: appColors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  name: { fontSize: 17, fontWeight: '700', color: appColors.text },
  price: { fontSize: 17, fontWeight: '800', color: appColors.primary },
  rating: { color: '#b54708', fontSize: 13, fontWeight: '600' },
  empty: { color: appColors.muted, textAlign: 'center', padding: 24 },
  error: { color: appColors.danger, fontWeight: '700' },
});
