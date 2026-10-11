import { Credentials, OrderDetails, TestUser } from '../types';

// ─── Credentials ──────────────────────────────────────────────────────────────
export const VALID_USER: Credentials = {
  username: process.env.VALID_USERNAME ?? 'admin',
  password: process.env.VALID_PASSWORD ?? 'admin',
};

export const INVALID_USERS: TestUser[] = [
  { username: 'wronguser',   password: 'wrongpass',   role: 'invalid' },
  { username: '',            password: 'somepass',     role: 'invalid' },
  { username: 'testuser123', password: '',             role: 'invalid' },
  { username: '',            password: '',             role: 'invalid' },
  { username: 'a'.repeat(200), password: 'pass',      role: 'invalid' },
  { username: '<script>alert(1)</script>', password: 'pass', role: 'invalid' },
  { username: "admin' OR '1'='1", password: "' OR '1'='1", role: 'invalid' },
];

// ─── Order Details ────────────────────────────────────────────────────────────
export const VALID_ORDER: OrderDetails = {
  name:       'John Doe',
  country:    'Indonesia',
  city:       'Jakarta',
  creditCard: '4111111111111111',
  month:      '12',
  year:       '2026',
};

export const INVALID_ORDERS: Partial<OrderDetails>[] = [
  { name: '', country: 'Indonesia', city: 'Jakarta', creditCard: '4111111111111111', month: '12', year: '2026' },
  { name: 'John', country: 'Indonesia', city: 'Jakarta', creditCard: '', month: '12', year: '2026' },
  { name: 'John', country: '', city: '', creditCard: '4111111111111111', month: '12', year: '2026' },
];

// ─── Product Catalog ──────────────────────────────────────────────────────────
export const PRODUCTS = {
  PHONE:   { name: 'Samsung galaxy s6',  category: 'phone',   expectedPrice: '$360' },
  LAPTOP:  { name: 'Sony vaio i5',       category: 'laptop',  expectedPrice: '$790' },
  MONITOR: { name: 'Apple monitor 24',   category: 'monitor', expectedPrice: '$400' },
  SAMSUNG_GALAXY_S7: { name: 'Samsung galaxy s7', category: 'phone', expectedPrice: '$800' },
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────
export const CATEGORIES = ['Phones', 'Laptops', 'Monitors'] as const;

export const NAV_LINKS = {
  HOME:       'Home',
  CART:       'Cart',
  LOGIN:      'Log in',
  SIGNUP:     'Sign up',
  CONTACT:    'Contact',
  ABOUT_US:   'About us',
} as const;

// ─── Performance Thresholds (ms) ─────────────────────────────────────────────
export const PERF_THRESHOLDS = {
  ttfb:     800,
  fcp:     2000,
  lcp:     3000,
  tti:     4000,
  cls:        0.25,
  domLoad:  3000,
  fullLoad: 5000,
} as const;

// ─── API Endpoints ────────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  LOGIN:    '/login',
  SIGNUP:   '/signup',
  ENTRIES:  '/entries',
  PRODUCTS: '/entries',
  VIEW:     '/view',
  ADD_TO_CART:  '/addtocart',
  VIEW_CART:    '/viewcart',
  DELETE_ITEM:  '/deleteitem',
  PLACE_ORDER:  '/placeorder',
} as const;
