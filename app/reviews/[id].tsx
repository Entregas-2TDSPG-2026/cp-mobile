import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Themed';
import { api } from '@/src/api/client';
import { PressableScale } from '@/src/components/PressableScale';
import { appColors } from '@/src/theme/colors';

const reasons: Record<string, string> = {
  NO_PURCHASE: 'Você precisa comprar este produto antes de avaliá-lo.',
  ALREADY_REVIEWED: 'Você já avaliou este produto.',
  UNAUTHENTICATED: 'Entre na sua conta para avaliar este produto.',
};

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photoUri, setPhotoUri] = useState<string>();
  const reviews = useQuery({ queryKey: ['reviews', id], queryFn: () => api.reviews(id), enabled: Boolean(id) });
  const permission = useQuery({ queryKey: ['can-review', id], queryFn: () => api.canReview(id), enabled: Boolean(id) });
  const mutation = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) throw new Error('Escreva um comentário.');
      const mediaIds = photoUri ? [(await api.upload(photoUri)).mediaId] : undefined;
      return api.createReview(id, { rating, comment: comment.trim(), mediaIds });
    },
    onSuccess: async () => {
      await Promise.all([client.invalidateQueries({ queryKey: ['reviews', id] }), client.invalidateQueries({ queryKey: ['product', id] })]);
      setComment('');
      setPhotoUri(undefined);
      Alert.alert('Avaliação enviada', 'Obrigado por compartilhar sua experiência.');
    },
  });

  async function choosePhoto() {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      setPhotoUri(undefined);
      Alert.alert('Sem foto', 'A permissão da galeria foi negada. Você pode enviar a avaliação sem a foto.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!picked.canceled) setPhotoUri(picked.assets[0].uri);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Avaliações</Text>
      {reviews.isLoading ? <Text>Carregando avaliações...</Text> : null}
      {reviews.isError ? <Text style={styles.error}>Não foi possível carregar as avaliações.</Text> : null}
      {!reviews.isLoading && !reviews.isError && reviews.data?.length === 0 ? <Text>Ainda não há avaliações.</Text> : null}
      {reviews.data?.map((review) => <View key={review.id} style={styles.review}><Text style={styles.reviewTitle}>★ {review.rating} {review.authorName ? `· ${review.authorName}` : ''}</Text><Text>{review.comment}</Text></View>)}
      {permission.data && !permission.data.allowed ? <Text style={styles.notice}>{reasons[permission.data.reason ?? ''] ?? 'Este produto ainda não está disponível para sua avaliação.'}</Text> : null}
      {permission.data?.allowed ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Sua avaliação</Text>
          <View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setRating(value)}><Text style={[styles.star, value <= rating && styles.selected]}>★</Text></Pressable>)}</View>
          <TextInput value={comment} onChangeText={setComment} placeholder="Conte como foi sua experiência" multiline style={styles.input} />
          <PressableScale style={styles.secondary} onPress={choosePhoto}><Text style={styles.secondaryText}>{photoUri ? 'Foto selecionada' : 'Adicionar foto'}</Text></PressableScale>
          <Text style={styles.helper}>{photoUri ? 'A foto será anexada à avaliação.' : 'Sem foto? A avaliação continua disponível.'}</Text>
          <PressableScale style={styles.primary} disabled={mutation.isPending} onPress={() => mutation.mutate()}><Text style={styles.primaryText}>{mutation.isPending ? 'Enviando...' : 'Enviar avaliação'}</Text></PressableScale>
          {mutation.isError ? <Text style={styles.error}>{mutation.error.message}</Text> : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, backgroundColor: appColors.background, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: '700', color: appColors.text },
  review: { backgroundColor: appColors.surface, borderRadius: 12, padding: 14, gap: 6, borderWidth: 1, borderColor: appColors.border },
  reviewTitle: { fontWeight: '700', color: '#b54708' },
  form: { gap: 12, marginTop: 10 },
  formTitle: { fontSize: 20, fontWeight: '700', color: appColors.text },
  stars: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 34, color: '#d0d5dd' },
  selected: { color: '#f79009' },
  input: { minHeight: 110, backgroundColor: '#fff', borderRadius: 12, padding: 14, textAlignVertical: 'top', borderWidth: 1, borderColor: appColors.border },
  primary: { padding: 16, borderRadius: 12, backgroundColor: appColors.primary, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: { padding: 14, borderRadius: 12, borderWidth: 1, borderColor: appColors.primary, alignItems: 'center' },
  secondaryText: { color: appColors.primary, fontWeight: '700' },
  notice: { padding: 14, backgroundColor: '#fff3cd', color: '#7a4d00', borderRadius: 10 },
  helper: { color: appColors.muted, fontSize: 12 },
  error: { color: appColors.danger },
});
