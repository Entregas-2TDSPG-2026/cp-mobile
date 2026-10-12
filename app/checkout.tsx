import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';

export default function CheckoutScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const [pickupPointId, setPickupPointId] = useState<string>();
  const points = useQuery({ queryKey: ['pickup-points'], queryFn: () => api.pickupPoints() });
  const checkout = useMutation({ mutationFn: async () => {
    const product = await api.product(productId);
    if (!product.defaultVariantId) throw new Error('Este produto não possui uma variante comprável.');
    await api.addToCart(product.defaultVariantId);
    return api.checkout({ pickupPointId });
  }, onSuccess: (order) => router.replace({ pathname: '/orders', params: { created: order.id } }) });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar compra</Text>
      <Text>Escolha um ponto de retirada (opcional):</Text>
      {points.isLoading ? <Text>Carregando pontos...</Text> : null}
      {points.data?.map((point) => <PressableScale key={point.id} style={[styles.option, pickupPointId === point.id && styles.selected]} onPress={() => setPickupPointId(point.id)}><Text style={styles.name}>{point.name}</Text><Text>{point.address}</Text></PressableScale>)}
      <PressableScale style={styles.primary} disabled={checkout.isPending} onPress={() => checkout.mutate()}><Text style={styles.primaryText}>{checkout.isPending ? 'Processando...' : 'Confirmar pedido'}</Text></PressableScale>
      {checkout.isError ? <Text style={styles.error}>{checkout.error.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 14, backgroundColor: appColors.background },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  option: { padding: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: appColors.border, gap: 4 },
  selected: { borderColor: appColors.primary, borderWidth: 2 },
  name: { fontWeight: '700', color: appColors.text },
  primary: { padding: 16, borderRadius: 12, backgroundColor: appColors.primary, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  error: { color: appColors.danger },
  login: { padding: 14, borderRadius: 14, backgroundColor: appColors.softAccent, alignItems: 'center' },
  loginText: { color: appColors.accent, fontWeight: '800' },
});
