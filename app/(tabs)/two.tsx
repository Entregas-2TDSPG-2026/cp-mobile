import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';
import { Text } from '@/components/Themed';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profileHero}><View style={styles.avatar}><Text style={styles.avatarText}>V</Text></View><View><Text style={styles.greeting}>Olá, visitante</Text><Text style={styles.small}>Sua experiência, do seu jeito.</Text></View></View>
      <Text style={styles.title}>Minha conta</Text>
      <Text style={styles.subtitle}>Acompanhe pedidos, avisos e preferências.</Text>
      <Link href="/orders" asChild><PressableScale style={styles.button}><Text style={styles.icon}>▣</Text><View style={styles.buttonCopy}><Text style={styles.buttonText}>Meus pedidos</Text><Text style={styles.buttonSubtext}>Acompanhe suas compras</Text></View><Text style={styles.arrow}>›</Text></PressableScale></Link>
      <Link href="/profile" asChild><PressableScale style={styles.button}><Text style={styles.icon}>✦</Text><View style={styles.buttonCopy}><Text style={styles.buttonText}>Perfil e notificações</Text><Text style={styles.buttonSubtext}>Avisos e preferências</Text></View><Text style={styles.arrow}>›</Text></PressableScale></Link>
      <Link href="/pickup" asChild><PressableScale style={styles.button}><Text style={styles.icon}>⌖</Text><View style={styles.buttonCopy}><Text style={styles.buttonText}>Pontos de retirada</Text><Text style={styles.buttonSubtext}>Encontre o mais conveniente</Text></View><Text style={styles.arrow}>›</Text></PressableScale></Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, gap: 14, backgroundColor: appColors.background },
  profileHero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 22, backgroundColor: appColors.primary, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: appColors.primary },
  greeting: { color: '#fff', fontSize: 17, fontWeight: '800' },
  small: { color: '#e8e5ff', marginTop: 3 },
  title: { fontSize: 28, fontWeight: '800', color: appColors.text },
  subtitle: { color: appColors.muted, marginBottom: 8 },
  button: { padding: 16, borderRadius: 18, backgroundColor: appColors.surface, alignItems: 'center', flexDirection: 'row', gap: 13, borderWidth: 1, borderColor: appColors.border },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: appColors.softPrimary, color: appColors.primary, textAlign: 'center', textAlignVertical: 'center', fontSize: 20 },
  buttonCopy: { flex: 1, gap: 3 },
  buttonText: { color: appColors.text, fontWeight: '800', fontSize: 15 },
  buttonSubtext: { color: appColors.muted, fontSize: 12 },
  arrow: { color: appColors.primary, fontSize: 28, fontWeight: '300' },
});
