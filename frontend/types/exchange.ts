/**
 * APEXCORE SOVEREIGN EXCHANGE — STRICT TYPESCRIPT DEFINITIONS
 * Strict Static Typing for Zero-Glitch Financial Interfaces
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 */

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'GRID_BOT';
export type MarketCategory = 'crypto' | 'stocks' | 'commodities' | 'forex';
export type TradingMode = 'spot' | 'stocks' | 'margin' | 'bot';

export interface ApexOrder {
  symbol: string;         // e.g. "BTC/USDT", "FPT/VND"
  side: OrderSide;
  type: OrderType;
  price: number;
  amount: number;
  timestamp: number;
  leverage?: number;      // e.g. 3, 5, 10
}

export interface CandleData {
  time: number;           // Unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface TradeTick {
  tradeId: string;
  symbol: string;
  price: number;
  amount: number;
  side: OrderSide;
  time: string;
}

export interface SovereignMarketAsset {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change24h: string;
  high24h: number;
  low24h: number;
  volume24h: string;
}

export interface SovereignUserAccount {
  uid: number;
  name: string;
  email: string;
  role: 'FOUNDER_GOD' | 'VIP_TRADER' | 'REGULAR_USER';
  isVerified: boolean;
  balances: Record<string, { available: number; locked: number }>;
}
