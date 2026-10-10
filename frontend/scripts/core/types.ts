/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — STRICT TYPESCRIPT DEFINITIONS
 * (frontend/scripts/core/types.ts)
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * Security Clearance: LEVEL 9 GODMODE · SOVEREIGN SEED
 * ========================================================
 */

export type OrderSide = 'BUY' | 'SELL';
export type TerminalMode = 'GOD' | 'ECO';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';

/**
 * Lệnh khớp thực thi vi giây (Time & Sales)
 */
export interface TradeExecution {
  id: string;
  timestamp: number;
  timeStr: string;           // HH:mm:ss.SSS
  side: OrderSide;
  price: number;
  size: number;
  totalUsd: number;
  latencyMicroSec: number;   // < 0.5 µs
  isWhale: boolean;          // Khối lượng > 2.0 BTC
}

/**
 * Nến vi cấu trúc thị trường (Microstructure Candle)
 */
export interface MicroCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  deltaBuy: number;
  deltaSell: number;
}

/**
 * Bậc thang giá (Price Ladder Step)
 */
export interface PriceLadderStep {
  price: number;
  bidVolume: number;
  askVolume: number;
  depthRatio: number;        // 0.0 -> 1.0
  isMidPrice: boolean;
  deltaSpread: number;
}

/**
 * Gói tin đo đạc viễn trắc (Feed Latency & Wire Telemetry)
 */
export interface WireTelemetry {
  pingMs: number;            // 916ms or 0.42µs
  jitterMs: number;
  throughputKbPerSec: number;// 9.1 KB/s
  packetsPerSec: number;     // 151
  droppedPackets: number;    // 0
  hexDumpSample: string;     // 0x7b 0x22 0x73 0x79...
}

/**
 * Trạng thái PnL & Hiệu suất Buồng lái Định lượng
 */
export interface QuantumCockpitMetrics {
  netPnl: number;            // +$98,915.00
  pnlToday: number;          // +$3,420.12
  winRate: number;           // 82.2%
  settledTrades: number;     // 1,297
  avgProfitPerTrade: number; // $16.56
  computeNode: string;       // TESLA-04 / LIVE
  modelEdge: number;         // +5.5%
  orderFloat: number;        // 382
  alphaSpread: number;       // 8.543
  inputMetric: number;       // -$533.1
  buysRatio: number;         // 56.0%
}

/**
 * Cấu hình Khối 3D Tinh Thể Kim Cương & Torus
 */
export interface CrystalEngineConfig {
  mode: TerminalMode;
  particleCount: number;     // 1,200 - 1,800
  rotationSpeedX: number;
  rotationSpeedY: number;
  breathingAmplitude: number;
  royalGoldHex: string;      // #FFD700
  emeraldHex: string;        // #00FFA3
  drawCallBudget: number;    // 1 draw call duy nhất
}

/**
 * Phím tắt HFT Siêu tốc
 */
export type HftHotkey = 'B' | 'S' | 'Space' | 'Esc';

export interface HftCommandEvent {
  key: HftHotkey;
  action: 'INSTANT_BUY' | 'INSTANT_SELL' | 'CANCEL_ALL' | 'PANIC_CLOSE';
  timestamp: number;
  capitalPercent: number;    // 100%
}
