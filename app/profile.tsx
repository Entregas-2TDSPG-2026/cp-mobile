import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Não solicitado');
  useEffect(() => { void Notifications.getPermissionsAsync().then((permission) => setStatus(permission.granted ? 'Ativadas' : 'Desativadas')); }, []);

  async function enableNotifications() {
    const permission = await Notifications.requestPermissionsAsync();
    setStatus(permission.granted ? 'Ativadas' : 'Negadas');
    if (!permission.granted) await Linking.openSettings();
    if (!permission.granted) return;
    try {
      const messages = await api.pushMessages();
      await Promise.all(messages.map((message) => Notifications.scheduleNotificationAsync({ content: { title: message.title, body: message.body, data: message.data }, trigger: null })));
    } catch {
      setStatus('Ativadas, mas não foi possível buscar avisos');
    }
  }

  return <View style={styles.container}>
    <Text style={styles.title}>Perfil</Text>
    <Text style={styles.explanation}>Ative avisos para receber novidades e mensagens da loja. A permissão é opcional.</Text>
    <Text style={styles.status}>Notificações: {status}</Text>
    <PressableScale style={styles.primary} onPress={enableNotifications}><Text style={styles.primaryText}>Ativar notificações</Text></PressableScale>
    <PressableScale style={styles.secondary} onPress={() => router.push('/pickup')}><Text style={styles.secondaryText}>Configurar retirada</Text></PressableScale>
    {status === 'Negadas' ? <PressableScale onPress={() => void Linking.openSettings()}><Text style={styles.link}>Reativar nas configurações do sistema</Text></PressableScale> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, backgroundColor: appColors.background },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  explanation: { color: appColors.muted, lineHeight: 22 },
  status: { fontWeight: '700', color: appColors.text },
  primary: { padding: 16, borderRadius: 12, backgroundColor: appColors.primary, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: appColors.primary, alignItems: 'center' },
  secondaryText: { color: appColors.primary, fontWeight: '700' },
  link: { color: appColors.primary, textDecorationLine: 'underline' },
});
