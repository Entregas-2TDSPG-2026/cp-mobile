import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'expo-router';

import {
  configureNotifications,
  getLastNotificationProduct,
  subscribeToNotificationProducts,
} from '@/src/services/notifications';

const queryClient = new QueryClient();

export function AppProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    configureNotifications();
    const unsubscribe = subscribeToNotificationProducts((productId) => {
      router.push({ pathname: '/product/[id]', params: { id: productId } });
    });
    void getLastNotificationProduct().then((productId) => {
      if (productId) router.push({ pathname: '/product/[id]', params: { id: productId } });
    });
    return unsubscribe;
  }, [router]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
