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
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options?.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    let detail = message;
    try {
      const parsed = JSON.parse(message) as { error?: { message?: string }; message?: string };
      detail = parsed.error?.message ?? parsed.message ?? message;
    } catch {
      detail = message;
    }
    if (response.status === 401) {
      throw new Error('Autenticação ausente. Configure EXPO_PUBLIC_API_KEY no arquivo .env.');
    }
    throw new Error(detail || `Erro ${response.status} na API`);
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
