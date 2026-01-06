import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { snacksApi, salesApi, stockApi } from '../services/api';
import type { Snack, Sale, Stock, CreateSaleRequest, CreateStockRequest } from '../types';

interface AppContextType {
  snacks: Snack[];
  sales: Sale[];
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  fetchSnacks: () => Promise<void>;
  fetchSales: () => Promise<void>;
  fetchStocks: () => Promise<void>;
  createSnack: (snack: Omit<Snack, 'barcode'> & { barcode: string }) => Promise<void>;
  createSale: (sale: CreateSaleRequest) => Promise<void>;
  createStock: (stock: CreateStockRequest) => Promise<void>;
  deleteSnack: (barcode: string) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
  updateStock: (id: string, stock: Partial<CreateStockRequest>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSnacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await snacksApi.getAll();
      setSnacks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch snacks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesApi.getAll();
      setSales(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockApi.getAll();
      setStocks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSnack = useCallback(async (snack: Omit<Snack, 'barcode'> & { barcode: string }) => {
    setLoading(true);
    setError(null);
    try {
      await snacksApi.create(snack);
      await fetchSnacks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create snack');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSnacks]);

  const createSale = useCallback(async (sale: CreateSaleRequest) => {
    setLoading(true);
    setError(null);
    try {
      await salesApi.create(sale);
      await fetchSales();
      await fetchStocks(); // Refresh stocks as well
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create sale');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSales, fetchStocks]);

  const createStock = useCallback(async (stock: CreateStockRequest) => {
    setLoading(true);
    setError(null);
    try {
      await stockApi.create(stock);
      await fetchStocks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStocks]);

  const deleteSnack = useCallback(async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      await snacksApi.delete(barcode);
      await fetchSnacks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete snack');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSnacks]);

  const deleteSale = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await salesApi.delete(id);
      await fetchSales();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete sale');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSales]);

  const deleteStock = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await stockApi.delete(id);
      await fetchStocks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStocks]);

  const updateStock = useCallback(async (id: string, stock: Partial<CreateStockRequest>) => {
    setLoading(true);
    setError(null);
    try {
      await stockApi.update(id, stock);
      await fetchStocks();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStocks]);

  return (
    <AppContext.Provider
      value={{
        snacks,
        sales,
        stocks,
        loading,
        error,
        fetchSnacks,
        fetchSales,
        fetchStocks,
        createSnack,
        createSale,
        createStock,
        deleteSnack,
        deleteSale,
        deleteStock,
        updateStock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
