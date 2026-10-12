import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationPermission = {
  granted: boolean;
};

export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync('store-updates', {
      name: 'Atualizações da loja',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export function subscribeToNotificationProducts(onProduct: (productId: string) => void): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const productId = response.notification.request.content.data?.productId;
    if (typeof productId === 'string') onProduct(productId);
  });
  return () => subscription.remove();
}

export async function getLastNotificationProduct(): Promise<string | null> {
  const response = await Notifications.getLastNotificationResponseAsync();
  const productId = response?.notification.request.content.data?.productId;
  return typeof productId === 'string' ? productId : null;
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  return Notifications.getPermissionsAsync();
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return Notifications.requestPermissionsAsync();
}

export async function scheduleStoreNotification(message: { title: string; body: string; data?: Record<string, string | undefined> }): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title: message.title, body: message.body, data: message.data },
    trigger: null,
  });
}
