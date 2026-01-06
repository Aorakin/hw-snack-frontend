export interface Snack {
  barcode: string;
  name: string;
  price: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  snack_id: string;
  quantity: number;
  snack?: Snack;
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
