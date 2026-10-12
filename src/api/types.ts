export type Rating = {
  average: number;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  rating?: Rating;
  favorite?: boolean;
};

export type Review = {
  id: string;
  authorName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  media?: { id: string; url?: string }[];
};

export type CanReview = {
  allowed: boolean;
  reason?: string;
};

export type PickupPoint = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

export type StoreLocation = {
  latitude: number;
  longitude: number;
  name?: string;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  pickupPoint?: PickupPoint;
};

export type PushMessage = {
  id: string;
  title: string;
  body: string;
  data?: { productId?: string; [key: string]: string | undefined };
};
