import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

const queryClient = new QueryClient();

export function AppProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    function openNotificationProduct(response: Notifications.NotificationResponse | null) {
      const productId = response?.notification.request.content.data?.productId;
      if (typeof productId === 'string') {
        router.push({ pathname: '/product/[id]', params: { id: productId } });
      }
    }

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
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      openNotificationProduct(response);
    });
    void Notifications.getLastNotificationResponseAsync().then(openNotificationProduct);
    return () => subscription.remove();
  }, [router]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
