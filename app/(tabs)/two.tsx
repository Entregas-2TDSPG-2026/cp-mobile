import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';
import { Text } from '@/components/Themed';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha conta</Text>
      <Text style={styles.subtitle}>Acompanhe pedidos, avisos e preferências.</Text>
      <Link href="/orders" asChild><PressableScale style={styles.button}><Text style={styles.buttonText}>Meus pedidos</Text></PressableScale></Link>
      <Link href="/profile" asChild><PressableScale style={styles.button}><Text style={styles.buttonText}>Perfil e notificações</Text></PressableScale></Link>
      <Link href="/pickup" asChild><PressableScale style={styles.button}><Text style={styles.buttonText}>Pontos de retirada</Text></PressableScale></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, backgroundColor: appColors.background },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  subtitle: { color: appColors.muted, marginBottom: 12 },
  button: { padding: 16, borderRadius: 12, backgroundColor: appColors.primary, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
