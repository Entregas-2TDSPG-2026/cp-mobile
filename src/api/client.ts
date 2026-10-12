import type {
  CanReview,
  Order,
  PickupPoint,
  Product,
  PushMessage,
  Review,
  StoreLocation,
} from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.mockmerce.com.br/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status} na API`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  products: () => request<Product[]>('/products'),
  product: (id: string) => request<Product>(`/products/${id}`),
  reviews: (id: string) => request<Review[]>(`/products/${id}/reviews`),
  canReview: (id: string) => request<CanReview>(`/products/${id}/reviews/can-review`),
  upload: async (uri: string) => {
    const form = new FormData();
    form.append('file', { uri, name: 'review-photo.jpg', type: 'image/jpeg' } as unknown as Blob);
    return request<{ mediaId: string }>('/uploads', { method: 'POST', body: form });
  },
  createReview: (id: string, payload: { rating: number; comment: string; mediaIds?: string[] }) =>
    request<Review>(`/products/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  pickupPoints: (location?: { latitude: number; longitude: number }) => {
    const query = location ? `?latitude=${location.latitude}&longitude=${location.longitude}` : '';
    return request<PickupPoint[]>(`/pickup-points${query}`);
  },
  storeLocation: () => request<StoreLocation>('/store/location'),
  checkout: (payload: { productId: string; quantity: number; pickupPointId?: string }) =>
    request<Order>('/orders/checkout', { method: 'POST', body: JSON.stringify(payload) }),
  orders: () => request<Order[]>('/orders'),
  pushMessages: () => request<PushMessage[]>('/push/messages'),
};
