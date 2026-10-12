export type NotificationPermission = {
  granted: boolean;
};

export function configureNotifications(): void {}

export function subscribeToNotificationProducts(_onProduct: (productId: string) => void): () => void {
  return () => {};
}

export async function getLastNotificationProduct(): Promise<string | null> {
  return null;
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  return { granted: false };
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return { granted: false };
}

export async function scheduleStoreNotification(_message: { title: string; body: string; data?: Record<string, string | undefined> }): Promise<void> {}
