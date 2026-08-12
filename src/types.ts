export type Role = 'CUSTOMER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  age?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
  status: ProductStatus;
  category: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  user: { id: string; name: string; email: string };
  product: { id: string; title: string; price: number };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  productId: string;
  user: { id: string; name: string; email: string };
  product: { id: string; title: string; price: number };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}