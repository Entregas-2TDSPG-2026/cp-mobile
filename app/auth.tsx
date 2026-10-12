import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { saveSession } from '@/src/auth/session';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';

export default function AuthScreen() {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim() || password.length < 6 || (registering && !name.trim())) {
      Alert.alert('Confira os dados', registering ? 'Informe nome, e-mail e senha com pelo menos 6 caracteres.' : 'Informe e-mail e senha com pelo menos 6 caracteres.');
      return;
    }
    setBusy(true);
    try {
      const result = registering ? await api.register({ name: name.trim(), email: email.trim(), password }) : await api.login({ email: email.trim(), password });
      await saveSession(result.token, result.customer);
      router.replace('/(tabs)/two');
    } catch (error) {
      Alert.alert('Não foi possível entrar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.kicker}>LOJA QUE RESPONDE</Text>
    <Text style={styles.title}>{registering ? 'Crie sua conta.' : 'Bem-vindo de volta.'}</Text>
    <Text style={styles.subtitle}>Entre para acompanhar pedidos e avaliar produtos comprados.</Text>
    {registering ? <TextInput value={name} onChangeText={setName} placeholder="Nome completo" style={styles.input} /> : null}
    <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
    <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry style={styles.input} />
    <PressableScale style={styles.primary} disabled={busy} onPress={submit}><Text style={styles.primaryText}>{busy ? 'Aguarde...' : registering ? 'Criar conta' : 'Entrar'}</Text></PressableScale>
    <PressableScale style={styles.secondary} onPress={() => setRegistering((value) => !value)}><Text style={styles.secondaryText}>{registering ? 'Já tenho uma conta' : 'Criar uma conta'}</Text></PressableScale>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 14, backgroundColor: appColors.background, justifyContent: 'center' },
  kicker: { color: appColors.primary, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: appColors.text, fontSize: 32, fontWeight: '800' },
  subtitle: { color: appColors.muted, lineHeight: 21, marginBottom: 10 },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: appColors.border, padding: 15, fontSize: 16 },
  primary: { backgroundColor: appColors.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  primaryText: { color: '#fff', fontWeight: '800' },
  secondary: { borderColor: appColors.primary, borderWidth: 1, borderRadius: 14, padding: 15, alignItems: 'center' },
  secondaryText: { color: appColors.primary, fontWeight: '800' },
});
