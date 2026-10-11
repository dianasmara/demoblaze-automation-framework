// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface Credentials {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  message?: string;
}

// ─── Product Types ────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  image?: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  title: string;
  price: string;
  quantity?: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ─── Order Types ──────────────────────────────────────────────────────────────
export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

export interface OrderResult {
  success: boolean;
  confirmationId?: string;
  amount?: string;
  message?: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export interface DemoBlazeCategoryResponse {
  Items: Array<{
    id: string;
    title: string;
    price: number;
    img: string;
    desc: string;
    cat: string;
  }>;
}

// ─── Performance Types ────────────────────────────────────────────────────────
export interface PerformanceMetrics {
  ttfb: number;          // Time to First Byte
  fcp: number;           // First Contentful Paint
  lcp: number;           // Largest Contentful Paint
  tti: number;           // Time to Interactive
  cls: number;           // Cumulative Layout Shift
  domLoad: number;       // DOM Content Loaded
  fullLoad: number;      // Full page load
}

export interface PerformanceThresholds {
  ttfb: number;
  fcp: number;
  lcp: number;
  tti: number;
  cls: number;
  domLoad: number;
  fullLoad: number;
}

// ─── Test Data Types ──────────────────────────────────────────────────────────
export interface TestUser {
  username: string;
  password: string;
  role: 'valid' | 'invalid' | 'locked' | 'admin';
}

export interface TestScenario {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}
