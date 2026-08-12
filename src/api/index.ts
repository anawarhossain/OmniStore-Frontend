import { request } from './client';
import type {
  AuthResponse,
  Category,
  Order,
  OrderStatus,
  Product,
  ProductStatus,
  Review,
  Role,
  User,
} from '../types';

// ---------- Auth ----------
export const apiRegister = (body: {
  name: string;
  email: string;
  password: string;
  age?: number;
}) => request<AuthResponse>('/auth/register', { method: 'POST', body });

export const apiLogin = (body: { email: string; password: string }) =>
  request<AuthResponse>('/auth/login', { method: 'POST', body });

export const apiMe = () => request<User>('/auth/me', { auth: true });

// ---------- Users ----------
export const apiGetUsers = () => request<User[]>('/users');
export const apiGetUser = (id: string) => request<User>(`/users/${id}`);
export const apiCreateUser = (body: {
  name: string;
  email: string;
  password: string;
  age?: number;
  role?: Role;
}) => request<User>('/users', { method: 'POST', body, auth: true });

export const apiUpdateUser = (
  id: string,
  body: {
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    role?: Role;
  }
) => request<User>(`/users/${id}`, { method: 'PUT', body, auth: true });

export const apiDeleteUser = (id: string) =>
  request<null>(`/users/${id}`, { method: 'DELETE', auth: true });

// ---------- Categories ----------
export const apiGetCategories = () => request<Category[]>('/categories');
export const apiGetCategory = (id: string) =>
  request<Category>(`/categories/${id}`);
export const apiCreateCategory = (body: { name: string }) =>
  request<Category>('/categories', { method: 'POST', body, auth: true });
export const apiUpdateCategory = (id: string, body: { name: string }) =>
  request<Category>(`/categories/${id}`, { method: 'PUT', body, auth: true });
export const apiDeleteCategory = (id: string) =>
  request<null>(`/categories/${id}`, { method: 'DELETE', auth: true });

// ---------- Products ----------
export const apiGetProducts = () => request<Product[]>('/products');
export const apiGetProduct = (id: string) => request<Product>(`/products/${id}`);
export const apiCreateProduct = (body: {
  title: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: string;
  status?: ProductStatus;
}) => request<Product>('/products', { method: 'POST', body, auth: true });

export const apiUpdateProduct = (
  id: string,
  body: {
    title?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    status?: ProductStatus;
  }
) => request<Product>(`/products/${id}`, { method: 'PUT', body, auth: true });

export const apiDeleteProduct = (id: string) =>
  request<null>(`/products/${id}`, { method: 'DELETE', auth: true });

// ---------- Orders ----------
export const apiGetOrders = () => request<Order[]>('/orders');
export const apiGetOrder = (id: string) => request<Order>(`/orders/${id}`);
export const apiCreateOrder = (body: {
  userId: string;
  productId: string;
  quantity: number;
  status?: OrderStatus;
}) => request<Order>('/orders', { method: 'POST', body, auth: true });

export const apiUpdateOrder = (
  id: string,
  body: {
    userId?: string;
    productId?: string;
    quantity?: number;
    status?: OrderStatus;
  }
) => request<Order>(`/orders/${id}`, { method: 'PUT', body, auth: true });

export const apiDeleteOrder = (id: string) =>
  request<null>(`/orders/${id}`, { method: 'DELETE', auth: true });

// ---------- Reviews ----------
export const apiGetReviews = (productId?: string) =>
  request<Review[]>(`/reviews${productId ? `?productId=${productId}` : ''}`);
export const apiGetReview = (id: string) => request<Review>(`/reviews/${id}`);
export const apiCreateReview = (body: {
  rating: number;
  comment?: string;
  productId: string;
}) => request<Review>('/reviews', { method: 'POST', body, auth: true });

export const apiUpdateReview = (
  id: string,
  body: { rating?: number; comment?: string }
) => request<Review>(`/reviews/${id}`, { method: 'PUT', body, auth: true });

export const apiDeleteReview = (id: string) =>
  request<null>(`/reviews/${id}`, { method: 'DELETE', auth: true });