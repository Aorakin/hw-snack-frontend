export interface Snack {
  barcode: string;
  name: string;
  price: number;
}

export interface SaleSnackItem {
  id: string;
  quantity: number;
  snack_name?: string;
  price: number;
}

export interface Sale {
  operator?: string;
  id: string;
  timestamp: string;
  total_price: number;
  sale_snacks: SaleSnackItem[];
}

export interface Stock {
  id: string;
  create_at: string;
  snack_id: string;
  quantity: number;
  quantity_now: number;
  snack?: Snack;
}

export interface CreateSaleRequest {
  snack_id: string;
  quantity: number;
}

export interface CreateStockRequest {
  snack_id: string;
  quantity: number;
  quantity_now: number;
}
