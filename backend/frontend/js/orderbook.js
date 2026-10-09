/* ========================================================
   APEXCORE PRO — ORDER BOOK MANAGER (js/orderbook.js)
   MASTER V9.0 — Sổ Lệnh Asks / Bids & Bão Khớp Lệnh HFT
   Founder & CTO: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class OrderBookManager {
  constructor() {
    this.asksContainer = document.getElementById('terminal-asks-rows');
    this.bidsContainer = document.getElementById('terminal-bids-rows');
    this.tradesContainer = document.getElementById('terminal-recent-trades');
    this.midPriceEl = document.getElementById('terminal-mid-price');
    this.currentPrice = 85450.90;
    this.audioCtx = null;
    this.isSoundEnabled = localStorage.getItem('apex_sound_enabled') !== 'false';

    this.asks = [];
    this.bids = [];
    this.trades = [];

    this.init();
  }

  init() {
    this.generateBook();
    this.render();
    this.startMicroTicks();
  }

  playMatchDing() {
    if (!this.isSoundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.audioCtx.currentTime); // B5 note
      osc.frequency.exponentialRampToValueAtTime(1318.51, this.audioCtx.currentTime + 0.08); // E6 note
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.22);
    } catch (e) {}
  }

  generateBook() {
    const baseP = this.currentPrice;
    this.asks = [];
    this.bids = [];

    // 15 Asks (Bán - Giá cao hơn)
    for (let i = 15; i >= 1; i--) {
      const p = baseP * (1 + (i * 0.0004));
      const amount = parseFloat((Math.random() * 2.8 + 0.05).toFixed(4));
      this.asks.push({ price: p, amount, total: 0 });
    }

    // 15 Bids (Mua - Giá thấp hơn)
    for (let i = 1; i <= 15; i++) {
      const p = baseP * (1 - (i * 0.0004));
      const amount = parseFloat((Math.random() * 2.8 + 0.05).toFixed(4));
      this.bids.push({ price: p, amount, total: 0 });
    }

    // Tính lũy kế
    let askTot = 0;
    this.asks.forEach(a => { askTot += a.amount; a.total = askTot; });
    let bidTot = 0;
    this.bids.forEach(b => { bidTot += b.amount; b.total = bidTot; });
  }

  injectWall(side, amount) {
    if (side === 'BUY') {
      if (this.bids.length > 0) {
        this.bids[0].amount += amount;
      }
    } else {
      if (this.asks.length > 0) {
        this.asks[this.asks.length - 1].amount += amount;
      }
    }
    this.render();
  }

  pushTrade(price, isBuy, amount = null) {
    const amt = amount || (Math.random() * 1.5 + 0.01).toFixed(4);
    const time = new Date().toLocaleTimeString('vi-VN');
    this.trades.unshift({ price, isBuy, amount: amt, time });
    if (this.trades.length > 30) this.trades.pop();

    this.renderTrades();
    this.playMatchDing();
  }

  render() {
    if (this.midPriceEl) {
      this.midPriceEl.textContent = this.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    if (this.asksContainer) {
      const maxTot = this.asks[this.asks.length - 1]?.total || 10;
      this.asksContainer.innerHTML = this.asks.map(a => {
        const pct = Math.min(100, (a.total / maxTot) * 100);
        return `
          <div class="ob-row text-red">
            <span style="font-weight:700;">${a.price.toFixed(2)}</span>
            <span style="text-align:right; color:var(--text-primary);">${a.amount.toFixed(4)}</span>
            <span style="text-align:right; color:var(--text-secondary);">${a.total.toFixed(4)}</span>
            <div class="ob-depth-bar ob-depth-ask" style="width:${pct}%;"></div>
          </div>
        `;
      }).join('');
    }

    if (this.bidsContainer) {
      const maxTot = this.bids[this.bids.length - 1]?.total || 10;
      this.bidsContainer.innerHTML = this.bids.map(b => {
        const pct = Math.min(100, (b.total / maxTot) * 100);
        return `
          <div class="ob-row text-green">
            <span style="font-weight:700;">${b.price.toFixed(2)}</span>
            <span style="text-align:right; color:var(--text-primary);">${b.amount.toFixed(4)}</span>
            <span style="text-align:right; color:var(--text-secondary);">${b.total.toFixed(4)}</span>
            <div class="ob-depth-bar ob-depth-bid" style="width:${pct}%;"></div>
          </div>
        `;
      }).join('');
    }
  }

  renderTrades() {
    if (!this.tradesContainer) return;
    this.tradesContainer.innerHTML = this.trades.map(t => `
      <div class="rt-row">
        <span class="${t.isBuy ? 'text-green' : 'text-red'} font-bold">${t.price.toFixed(2)}</span>
        <span style="text-align:right;">${t.amount}</span>
        <span style="text-align:right; color:var(--text-secondary);">${t.time}</span>
      </div>
    `).join('');
  }

  startMicroTicks() {
    setInterval(() => {
      // Nhấp nháy nhẹ ngẫu nhiên vài dòng sổ lệnh
      const askIdx = Math.floor(Math.random() * this.asks.length);
      const bidIdx = Math.floor(Math.random() * this.bids.length);
      if (this.asks[askIdx]) this.asks[askIdx].amount = parseFloat((Math.random() * 2.8 + 0.05).toFixed(4));
      if (this.bids[bidIdx]) this.bids[bidIdx].amount = parseFloat((Math.random() * 2.8 + 0.05).toFixed(4));

      // Lâu lâu sinh 1 trade
      if (Math.random() > 0.4) {
        const isBuy = Math.random() > 0.48;
        const delta = (Math.random() - 0.5) * (this.currentPrice * 0.0003);
        const p = parseFloat((this.currentPrice + delta).toFixed(2));
        this.pushTrade(p, isBuy);
      }
      this.render();
    }, 1200);
  }

  updatePrice(newP) {
    this.currentPrice = newP;
    this.generateBook();
    this.render();
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.OrderBookManager = OrderBookManager;
}
