import axios from 'axios';
import { API_URL } from '../config';
import type { Snack, Sale, Stock, CreateSaleRequest, CreateStockRequest } from '../types';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Snacks API
export const snacksApi = {
  getAll: () => api.get<Snack[]>('/snacks/'),
  getOne: (barcode: string) => api.get<Snack>(`/snacks/${barcode}`),
  create: (snack: Omit<Snack, 'barcode'> & { barcode: string }) => api.post<Snack>('/snacks/', snack),
  update: (barcode: string, snack: Partial<Snack>) => api.put<Snack>(`/snacks/${barcode}`, snack),
  delete: (barcode: string) => api.delete(`/snacks/${barcode}`),
};

// Sales API
export const salesApi = {
  getAll: () => api.get<Sale[]>('/sales/'),
  getOne: (id: string) => api.get<Sale>(`/sales/${id}`),
  create: (sale: CreateSaleRequest) => api.post<Sale>('/sales/', sale),
  delete: (id: string) => api.delete(`/sales/${id}`),
};

// Stock API
export const stockApi = {
  getAll: () => api.get<Stock[]>('/stock/'),
  getOne: (id: string) => api.get<Stock>(`/stock/${id}`),
  create: (stock: CreateStockRequest) => api.post<Stock>('/stock/', stock),
  update: (id: string, stock: Partial<CreateStockRequest>) => api.put<Stock>(`/stock/${id}`, stock),
  delete: (id: string) => api.delete(`/stock/${id}`),
};

export default api;
