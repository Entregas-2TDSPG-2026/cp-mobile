import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { appColors } from '@/src/theme/colors';

export default function OrdersScreen() {
  const { created } = useLocalSearchParams<{ created?: string }>();
  const orders = useQuery({ queryKey: ['orders'], queryFn: api.orders });
  return <View style={styles.container}>
    {created ? <Text style={styles.success}>Pedido {created} criado com sucesso.</Text> : null}
    <Text style={styles.title}>Meus pedidos</Text>
    {orders.isLoading ? <Text>Carregando pedidos...</Text> : null}
    {orders.isError ? <Text style={styles.error}>Não foi possível carregar os pedidos.</Text> : null}
    {!orders.isLoading && !orders.isError && orders.data?.length === 0 ? <Text>Nenhum pedido encontrado.</Text> : null}
    {orders.data?.map((order) => <View key={order.id} style={styles.card}><Text style={styles.id}>Pedido {order.id}</Text><Text>Status: {order.status}</Text><Text>Total: R$ {order.total.toFixed(2)}</Text>{order.pickupPoint ? <Text>Retirada: {order.pickupPoint.name}</Text> : null}</View>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 14, backgroundColor: appColors.background },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: appColors.border, gap: 5 },
  id: { fontWeight: '700', color: appColors.text },
  success: { color: appColors.success, fontWeight: '700' },
  error: { color: appColors.danger },
});
