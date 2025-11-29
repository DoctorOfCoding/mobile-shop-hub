export interface User {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'accessories' | 'used_phone' | 'repair_service';
  variants?: ProductVariant[];
  costPrice: number;
  sellingPrice: number;
  barcode?: string;
  imei?: string;
  supplier?: string;
  quantity: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  color?: string;
  storage?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'easypaisa' | 'jazzcash';
  customerName?: string;
  customerPhone?: string;
  cashierId: string;
  cashierName: string;
  createdAt: Date;
}

export interface RepairJob {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  imei?: string;
  problemDescription: string;
  estimatedCost: number;
  advancePayment: number;
  technicianAssigned?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  deliveredAt?: Date;
}

export interface UsedPhone {
  id: string;
  model: string;
  imei: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchasePrice: number;
  expectedSellingPrice: number;
  actualSellingPrice?: number;
  purchasedFrom: string;
  purchasedAt: Date;
  soldAt?: Date;
  status: 'in_stock' | 'sold';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalPurchases: number;
  totalRepairs: number;
  createdAt: Date;
}

export interface DashboardStats {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  totalProfit: number;
  totalLoss: number;
  lowStockItems: number;
  pendingRepairs: number;
  completedRepairs: number;
}
