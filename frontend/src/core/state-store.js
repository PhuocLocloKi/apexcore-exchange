/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIV: KHO DỮ LIỆU TẬP TRUNG REACTIVE (STATE STORE)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class SovereignStateStore {
  constructor(initialState = {}) {
    this.state = {
      user: {
        uid: '1107519625',
        name: 'NguyenPhuocLoc',
        email: 'nguyenphuoclocSE200425@gmail.com',
        vipLevel: 'VIP 9 Sovereign',
        isLoggedIn: true
      },
      theme: 'dark',
      activeSymbol: 'BTC/USDT',
      activeTab: 'popular',
      userTrustCount: 332845671,
      tickers: {
        'BTC/USDT': { symbol: 'BTC', name: 'Bitcoin', price: 85447.74, change24h: 2.84, icon: '₿' },
        'ETH/USDT': { symbol: 'ETH', name: 'Ethereum', price: 2622.54, change24h: 3.12, icon: 'Ξ' },
        'BNB/USDT': { symbol: 'BNB', name: 'BNB', price: 767.44, change24h: 1.45, icon: '❖' },
        'SOL/USDT': { symbol: 'SOL', name: 'Solana', price: 188.65, change24h: 5.60, icon: '◎' },
        'NVDAB': { symbol: 'NVDAB', name: 'NVIDIA', price: 239.84, change24h: 0.17, icon: '⚡' }
      },
      pnl: {
        todayUsd: 1231.00,
        todayPercent: 0.25,
        totalBalance: 7281.43
      },
      ...initialState
    };
    this.subscribers = new Map();
  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...partialState };
    this.notifySubscribers(prevState, this.state);
  }

  updateTicker(symbol, data) {
    if (this.state.tickers[symbol]) {
      this.state.tickers[symbol] = { ...this.state.tickers[symbol], ...data };
      this.notifyKey(`ticker:${symbol}`, this.state.tickers[symbol]);
    }
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    return () => this.subscribers.get(key)?.delete(callback);
  }

  notifyKey(key, value) {
    const set = this.subscribers.get(key);
    if (set) {
      set.forEach(cb => cb(value));
    }
  }

  notifySubscribers(prev, next) {
    this.subscribers.forEach((cbs, key) => {
      if (key === '*') {
        cbs.forEach(cb => cb(next, prev));
      }
    });
  }
}

export const store = new SovereignStateStore();
