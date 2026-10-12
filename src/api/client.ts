import type {
  CanReview,
  Order,
  PickupPoint,
  Product,
  PushMessage,
  Review,
  Customer,
} from './types';
import { getSession } from '@/src/auth/session';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.mockmerce.com.br/v1';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

type ProductListResponse = {
  data: {
    id: string;
    name: string;
    description?: string;
    priceFrom?: number;
    image?: string;
    rating?: { average: number; count: number };
  }[];
};

type ProductDetailResponse = {
  id: string;
  name: string;
  description?: string;
  rating?: { average: number; count: number };
  images?: { url?: string; src?: string }[];
  variants?: { id?: string; price?: number; active?: boolean; isDefault?: boolean; images?: { url?: string; src?: string }[] }[];
};

function normalizeProduct(product: ProductListResponse['data'][number] | ProductDetailResponse): Product {
  const detail = product as ProductDetailResponse;
  const variant = detail.variants?.find((item) => item.active !== false && item.isDefault) ?? detail.variants?.find((item) => item.active !== false);
  const image = detail.images?.[0] ?? variant?.images?.[0];
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: 'priceFrom' in product ? product.priceFrom ?? 0 : variant?.price ?? 0,
    imageUrl: 'image' in product ? product.image : image?.url ?? image?.src,
    rating: product.rating,
    defaultVariantId: variant?.id,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let headers: HeadersInit = {
    Accept: 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
    ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options?.headers,
  };
  const session = await getSession();
  if (session.token) headers = { ...headers, Authorization: `Bearer ${session.token}` };

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
      throw new Error(session.token ? 'Sua sessão expirou. Entre novamente para continuar.' : 'Autenticação ausente. Configure EXPO_PUBLIC_API_KEY ou entre na sua conta.');
    }
    throw new Error(detail || `Erro ${response.status} na API`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  products: async () => {
    const response = await request<ProductListResponse>('/products');
    return response.data.map(normalizeProduct);
  },
  product: async (id: string) => normalizeProduct(await request<ProductDetailResponse>(`/products/${id}`)),
  login: (payload: { email: string; password: string }) => request<{ token: string; customer: Customer }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload: { name: string; email: string; password: string }) => request<{ token: string; customer: Customer }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request<Customer>('/auth/me'),
  reviews: async (id: string) => {
    const response = await request<{ data: Review[] }>(`/products/${id}/reviews`);
    return response.data;
  },
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
  pickupPoints: async (location?: { latitude: number; longitude: number }) => {
    const query = location ? `?latitude=${location.latitude}&longitude=${location.longitude}` : '';
    const response = await request<{ data: { id: string; name: string; address?: string | Record<string, string | null>; coordinate?: { latitude: number; longitude: number }; distanceKm?: number; hours?: string }[] }>(`/pickup-points${query}`);
    return response.data.map((point): PickupPoint => ({
      id: point.id,
      name: point.name,
      address: typeof point.address === 'string' ? point.address : [point.address?.street, point.address?.number, point.address?.district, point.address?.city].filter(Boolean).join(', '),
      latitude: point.coordinate?.latitude ?? 0,
      longitude: point.coordinate?.longitude ?? 0,
      distance: point.distanceKm,
      hours: point.hours,
    }));
  },
  storeLocation: async () => {
    const settings = await request<{ latitude?: number; longitude?: number; storeName?: string; address?: Record<string, string> }>('/store/settings');
    if (settings.latitude == null || settings.longitude == null) throw new Error('A loja ainda não possui localização cadastrada no painel.');
    return { latitude: settings.latitude, longitude: settings.longitude, name: settings.storeName };
  },
  addToCart: (variantId: string, quantity = 1) => request('/cart/items', { method: 'POST', body: JSON.stringify({ variantId, quantity }) }),
  checkout: (payload: { pickupPointId?: string }) =>
    request<Order>('/orders/checkout', { method: 'POST', body: JSON.stringify(payload) }),
  orders: async () => {
    const response = await request<{ data?: Order[] } | Order[]>('/orders');
    return Array.isArray(response) ? response : response.data ?? [];
  },
  pushMessages: async () => {
    const response = await request<{ data: PushMessage[] }>('/push/messages');
    return response.data;
  },
};
