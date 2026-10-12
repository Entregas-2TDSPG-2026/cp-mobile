import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';
import { useState } from 'react';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useQuery({ queryKey: ['product', id], queryFn: () => api.product(id), enabled: Boolean(id) });
  const [favorite, setFavorite] = useState(false);

  if (product.isLoading) return <View style={styles.center}><Text>Carregando produto...</Text></View>;
  if (product.isError || !product.data) return <View style={styles.center}><Text style={styles.error}>Não foi possível carregar este produto.</Text></View>;
  const item = product.data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.hero} /> : null}
      <View style={styles.productTag}><Text style={styles.productTagText}>SELEÇÃO DA LOJA</Text></View>
      <Text style={styles.title}>{item.name}</Text>
      <PressableScale style={styles.favorite} onPress={() => { setFavorite((value) => !value); Alert.alert(favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos'); }}>
        <Text style={styles.favoriteText}>{favorite ? '♥ Favoritado' : '♡ Favoritar'}</Text>
      </PressableScale>
      <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
      {item.rating ? <Text style={styles.rating}>★ {item.rating.average.toFixed(1)} · {item.rating.count} avaliações</Text> : null}
      <Text style={styles.description}>{item.description ?? 'Produto disponível para compra.'}</Text>
      <Link href={{ pathname: '/checkout', params: { productId: item.id } }} asChild><PressableScale style={styles.primary}><Text style={styles.primaryText}>Comprar</Text></PressableScale></Link>
      <Link href={{ pathname: '/reviews/[id]', params: { id: item.id } }} asChild><PressableScale style={styles.secondary}><Text style={styles.secondaryText}>Ver avaliações e avaliar</Text></PressableScale></Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, backgroundColor: appColors.background, flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: appColors.background },
  hero: { width: '100%', height: 280, borderRadius: 24, backgroundColor: appColors.softPrimary },
  productTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: appColors.softAccent },
  productTagText: { color: appColors.accent, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', color: appColors.text },
  favorite: { alignSelf: 'flex-start', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, backgroundColor: appColors.softPrimary },
  favoriteText: { color: appColors.primary, fontWeight: '700' },
  price: { fontSize: 25, fontWeight: '800', color: appColors.primary },
  rating: { color: '#b54708', fontWeight: '600' },
  description: { color: appColors.muted, lineHeight: 22 },
  primary: { padding: 17, borderRadius: 16, backgroundColor: appColors.primary, alignItems: 'center', elevation: 4, shadowColor: appColors.primary, shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: appColors.primary, alignItems: 'center', backgroundColor: appColors.surface },
  secondaryText: { color: appColors.primary, fontWeight: '700' },
  error: { color: appColors.danger },
});
