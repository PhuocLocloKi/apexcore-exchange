/* ========================================================
   APEXCORE PRO — CONFIG (js/config.js)
   MASTER v3.0 — Danh Sách Mã Giao Dịch & Cấu Hình Tập Trung
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

export const Config = {
  API_BASE: window.location.origin.includes('http') ? window.location.origin : 'http://127.0.0.1:5000',
  GOOGLE_CLIENT_ID: '987654321000-apexcoreapps.apps.googleusercontent.com',
  DEFAULT_SYMBOL: 'BNB_USDT',
  FOUNDER_EMAIL: 'nguyenphuocloc010306@gmail.com',
  FOUNDER_NAME: 'NGUYỄN PHƯỚC LỘC'
};

export const SYMBOLS = [
  // Crypto
  { id: 'BNB_USDT', symbol: 'BNB', quote: 'USDT', name: 'BNB', category: 'crypto', price: 780.35, change24h: -0.80, changeAmount: -6.29, high24h: 789.48, low24h: 778.06, volume24h: '85,594.93', volumeQuote: '67,177,821.78', precision: 2, tag: 'Layer 1' },
  { id: 'BTC_USDT', symbol: 'BTC', quote: 'USDT', name: 'Bitcoin', category: 'crypto', price: 68432.12, change24h: 2.41, changeAmount: 1612.30, high24h: 69412.36, low24h: 66732.18, volume24h: '1,932,467.21', volumeQuote: '132.2B', precision: 2, tag: 'Hot' },
  { id: 'ETH_USDT', symbol: 'ETH', quote: 'USDT', name: 'Ethereum', category: 'crypto', price: 3248.75, change24h: 1.82, changeAmount: 58.20, high24h: 3310.50, low24h: 3180.00, volume24h: '842,105.40', volumeQuote: '2.73B', precision: 2, tag: 'Vol' },
  { id: 'SOL_USDT', symbol: 'SOL', quote: 'USDT', name: 'Solana', category: 'crypto', price: 162.40, change24h: 3.29, changeAmount: 5.18, high24h: 168.00, low24h: 154.20, volume24h: '520,340.10', volumeQuote: '84.5M', precision: 2, tag: 'Solana' },
  { id: 'XRP_USDT', symbol: 'XRP', quote: 'USDT', name: 'Ripple', category: 'crypto', price: 0.5231, change24h: 2.17, changeAmount: 0.011, high24h: 0.5400, low24h: 0.5100, volume24h: '180,450.00', volumeQuote: '94.4M', precision: 4, tag: 'Payment' },
  { id: 'DOGE_USDT', symbol: 'DOGE', quote: 'USDT', name: 'Dogecoin', category: 'crypto', price: 0.1426, change24h: -2.56, changeAmount: -0.0037, high24h: 0.1510, low24h: 0.1390, volume24h: '245,670.00', volumeQuote: '35.0M', precision: 4, tag: 'Meme' },

  // Cổ phiếu (bStocks)
  { id: 'FPT_VND', symbol: 'FPT', quote: 'VND', name: 'FPT Corp', category: 'stocks', price: 132500, change24h: 2.80, changeAmount: 3600, high24h: 134000, low24h: 129000, volume24h: '3,450,200', volumeQuote: '457.1B', precision: 0, tag: 'Tech' },
  { id: 'VFS_USD', symbol: 'VFS', quote: 'USD', name: 'VinFast Auto', category: 'stocks', price: 4.85, change24h: 5.20, changeAmount: 0.24, high24h: 5.10, low24h: 4.55, volume24h: '8,920,000', volumeQuote: '43.2M', precision: 2, tag: 'EV' },
  { id: 'VCB_VND', symbol: 'VCB', quote: 'VND', name: 'Vietcombank', category: 'stocks', price: 91500, change24h: 1.10, changeAmount: 1000, high24h: 92000, low24h: 90500, volume24h: '1,420,000', volumeQuote: '129.9B', precision: 0, tag: 'Bank' },
  { id: 'AAPL_USD', symbol: 'AAPL', quote: 'USD', name: 'Apple Inc.', category: 'stocks', price: 232.80, change24h: 1.65, changeAmount: 3.80, high24h: 234.10, low24h: 228.50, volume24h: '48,200,000', volumeQuote: '11.2B', precision: 2, tag: 'Tech' },
  { id: 'TSLA_USD', symbol: 'TSLA', quote: 'USD', name: 'Tesla Inc.', category: 'stocks', price: 218.40, change24h: 3.40, changeAmount: 7.20, high24h: 222.00, low24h: 210.00, volume24h: '72,100,000', volumeQuote: '15.7B', precision: 2, tag: 'Auto' },
  { id: 'NVDA_USD', symbol: 'NVDA', quote: 'USD', name: 'Nvidia Corp', category: 'stocks', price: 128.50, change24h: 4.12, changeAmount: 5.08, high24h: 130.20, low24h: 124.00, volume24h: '95,400,000', volumeQuote: '12.2B', precision: 2, tag: 'AI' },

  // Forex & Vàng
  { id: 'XAU_USD', symbol: 'XAU/USD', quote: 'USD', name: 'Vàng Thế Giới (Gold Spot)', category: 'forex', price: 2735.40, change24h: 0.85, changeAmount: 23.10, high24h: 2742.10, low24h: 2718.50, volume24h: '128.5B', volumeQuote: '128.5B', precision: 2, tag: 'Metal' },
  { id: 'EUR_USD', symbol: 'EUR/USD', quote: 'USD', name: 'Euro / US Dollar', category: 'forex', price: 1.0842, change24h: 0.15, changeAmount: 0.0016, high24h: 1.0870, low24h: 1.0820, volume24h: '45.2B', volumeQuote: '45.2B', precision: 4, tag: 'Major' },
  { id: 'USOIL_USD', symbol: 'USOIL', quote: 'USD', name: 'Dầu Thô WTI (Crude Oil)', category: 'forex', price: 71.45, change24h: 1.80, changeAmount: 1.26, high24h: 72.30, low24h: 69.80, volume24h: '24.6B', volumeQuote: '24.6B', precision: 2, tag: 'Energy' }
];

export const AssetLogos = {
  BNB: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F0B90B"/><path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zm-6.116 1.597l2.26-2.26 2.26 2.26-2.26 2.26-2.26-2.26zm6.116 1.595L16 21.482l3.886-3.886 2.26 2.259L16 26l-6.144-6.145 2.26-2.26zm9.998-1.595l2.26-2.26 2.26 2.26-2.26 2.26-2.26-2.26zm-4.707 0L16 14.71l-2.69 2.69 2.69 2.692 2.69-2.692-.001-.001z"/></svg>`,
  BTC: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.792.41.018.025-1.256-.314-1.256-.314l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.432.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.537c-.535 2.146-4.152.986-5.325.694l.95-3.81c1.173.293 4.938.872 4.375 3.116zm.536-5.568c-.488 1.954-3.498.962-4.474.718l.861-3.45c.977.243 4.128.7 3.613 2.732z"/></svg>`,
  ETH: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path fill="#FFF" fill-opacity=".6" d="M16.498 4v8.87l7.497 3.35z"/><path fill="#FFF" d="M16.498 4L9 16.22l7.498-3.35z"/><path fill="#FFF" fill-opacity=".6" d="M16.498 21.968v6.027L24 17.616z"/><path fill="#FFF" d="M16.498 27.995v-6.028L9 17.616z"/><path fill="#FFF" fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.349z"/><path fill="#FFF" fill-opacity=".6" d="M9 16.22l7.498 4.353v-7.702z"/></svg>`,
  SOL: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#000"/><path fill="url(#sol-grad-cfg)" d="M8.5 21.75l2.5-2.5h12.5l-2.5 2.5H8.5zm0-6.25l2.5-2.5h12.5l-2.5 2.5H8.5zm2.5-8.75l-2.5 2.5h12.5l2.5-2.5H11z"/><defs><linearGradient id="sol-grad-cfg" x1="8" y1="6" x2="24" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#00FFA3"/><stop offset="1" stop-color="#DC1FFF"/></linearGradient></defs></svg>`,
  XRP: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#23292F"/><path fill="#FFF" d="M22.7 8h2.3l-5.6 5.5-2.7-2.7 4-4.1-1.6-1.5-2.4 2.4-2.4-2.4-1.6 1.5 4 4.1-2.7 2.7L9.3 8h-2.3l6.7 6.6-6.7 6.7h2.3l5.6-5.5 2.7 2.7-4 4.1 1.6 1.5 2.4-2.4 2.4 2.4 1.6-1.5-4-4.1 2.7-2.7L22.7 8z"/></svg>`,
  DOGE: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#C2A633"/><path fill="#FFF" d="M12 8h5.5c4.7 0 7.5 3.1 7.5 8s-2.8 8-7.5 8H12V8zm3.5 13.2h2c2.8 0 4.5-1.8 4.5-5.2s-1.7-5.2-4.5-5.2h-2v10.4zm-5-5.7h6v2h-6v-2z"/></svg>`,
  FPT: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#FFF"/><path d="M7 16a6 6 0 0 1 6-6h2a6 6 0 0 0-6 6v4h-2v-4z" fill="#F37021"/><path d="M13 16a6 6 0 0 1 6-6h2a6 6 0 0 0-6 6v4h-2v-4z" fill="#0054A6"/><path d="M19 16a6 6 0 0 1 6-6h2a6 6 0 0 0-6 6v4h-2v-4z" fill="#00A850"/></svg>`,
  VFS: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1B365D"/><path fill="#E2E8F0" d="M8 9l8 14 8-14h-3.8l-4.2 8.5L11.8 9H8zm4 0l4 8.5 4-8.5h-2l-2 4.5-2-4.5h-2z"/></svg>`,
  VCB: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#00733B"/><path fill="#FFF" d="M16 8l7 14H9l7-14zm0 4.5l-4 8h8l-4-8z"/></svg>`,
  AAPL: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1C1C1E"/><path fill="#FFF" d="M18.7 10.4c.8-1 1.4-2.4 1.2-3.8-1.2.1-2.6.8-3.4 1.8-.7.8-1.4 2.2-1.2 3.6 1.3.1 2.6-.6 3.4-1.6zm2.4 5.3c-.1-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.1-.9-1.6 0-3.1 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5.6 0 1.5-.7 2.9-.7s2.2.7 2.9.7c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1-.1-2.4-.9-2.5-3.6z"/></svg>`,
  TSLA: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#E82127"/><path fill="#FFF" d="M16 9.8c2.4 0 5.5.5 7.6 1.6l.8-2.1C21.7 8.1 18.2 7.5 16 7.5s-5.7.6-8.4 1.8l.8 2.1c2.1-1.1 5.2-1.6 7.6-1.6zm0 3.2c-2.8 0-4.6.4-6.3 1.2l.6 2c1.4-.6 3.2-1 5.7-1 2.5 0 4.3.4 5.7 1l.6-2c-1.7-.8-3.5-1.2-6.3-1.2zm1.2 4.2h-2.4v9h2.4v-9z"/></svg>`,
  NVDA: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#111"/><path fill="#76B900" d="M11.5 10c-3 1.5-4.5 4.5-4.5 7.5s1.8 5.7 4.8 6.5l1.2-2.2c-2-.5-3.2-2.3-3.2-4.3s1.2-3.7 3-4.5l-1.3-3zm4.5 2c-2.3 0-4.2 1.8-4.2 4s1.9 4 4.2 4c1.8 0 3.3-1.2 3.9-2.8H16v-2.2h6.5c.2.6.3 1.2.3 1.8 0 4-3.1 7.2-6.8 7.2-4.3 0-7.8-3.4-7.8-8s3.5-8 7.8-8c2.4 0 4.5 1 6 2.7l-1.8 1.8c-1.1-1.1-2.5-1.7-4.2-1.7z"/></svg>`,
  "XAU/USD": `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#E5A91A"/><path fill="#FFF" d="M9 11l3-3h8l3 3-2 12H11L9 11zm3.5-1l-1.5 1.5h10L19.5 10h-7zm6.5 10h-6l1-7h4l1 7z"/></svg>`,
  "EUR/USD": `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#003399"/><circle cx="16" cy="16" r="9" fill="none" stroke="#FFCC00" stroke-width="1.5" stroke-dasharray="2 3"/><path fill="#FFF" d="M17.5 12h-4c-1.5 0-2.5 1-2.5 2.5v3c0 1.5 1 2.5 2.5 2.5h4v-1.5h-3.5c-.8 0-1-.5-1-1h4.5v-1.5H13c0-.5.2-1 1-1h3.5V12z"/></svg>`,
  USOIL: `<svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1E2329"/><path fill="#E0A926" d="M12 9h8c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V11c0-1.1.9-2 2-2zm0 3v2h8v-2h-8zm0 5v2h8v-2h-8z"/></svg>`
};

export function getLogo(symbol) {
  const clean = symbol.replace('_USDT', '').replace('_VND', '').replace('_USD', '');
  return AssetLogos[clean] || AssetLogos[symbol] || `<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--panel-sub);font-size:10px;font-weight:700;">${clean.slice(0,2)}</span>`;
}
