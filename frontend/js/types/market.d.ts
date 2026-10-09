/**
 * APEXCORE SOVEREIGN FINANCIAL EXCHANGE — STRICT TYPESCRIPT CONTRACT
 * File: frontend/js/types/market.d.ts
 * Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 */

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'GRID_BOT';
export type TerminalMode = 'spot' | 'stocks' | 'margin' | 'bot';

export interface ApexOrder {
  id: string;
  symbol: string;         // e.g. "BTC/USDT", "FPT/VND"
  side: OrderSide;
  type: OrderType;
  price: number;
  amount: number;
  timestamp: number;
  leverage?: number;      // 3, 5, 10, 20
}

export interface CandleTick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  category: 'crypto' | 'stocks' | 'commodities';
  price: number;
  change24h: string;
  high24h: number;
  low24h: number;
  vol24h: string;
}

export interface SovereignUserAccount {
  uid: number;
  name: string;
  email: string;
  role: 'FOUNDER_GOD' | 'VIP_TRADER' | 'REGULAR_USER';
  verified: boolean;
  balances: {
    USDT: number;
    BTC: number;
    ETH: number;
    VND: number;
  };
}
