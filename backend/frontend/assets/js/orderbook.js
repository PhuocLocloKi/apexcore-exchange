/* ========================================================
   APEXCORE SOVEREIGN EXCHANGE — ORDERBOOK MODULE (assets/js/orderbook.js)
   Quản lý Sổ Lệnh Real-time L2, Depth Wall & Khớp Lệnh Lịch Sử
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class SovereignOrderBook {
  constructor() {
    this.currentPrice = 85450.90;
    this.asks = [];
    this.bids = [];
    this.trades = [];
    this.viewMode = 'all'; // 'all', 'buy', 'sell'
    this.asksContainer = document.getElementById('terminal-asks-rows');
    this.bidsContainer = document.getElementById('terminal-bids-rows');
    this.midPriceEl = document.getElementById('terminal-mid-price');
    this.tradesContainer = document.getElementById('terminal-recent-trades');

    this.init();
  }

  init() {
    this.generateBook(this.currentPrice);
    this.render();
    this.initRecentTrades();

    // Nhịp tim cập nhật sổ lệnh L2
    setInterval(() => {
      this.tick();
    }, 1000);
  }

  generateBook(basePrice) {
    this.currentPrice = basePrice;
    this.asks = [];
    this.bids = [];
    const step = basePrice * 0.00018;

    let cumAsk = 0;
    for (let i = 15; i >= 1; i--) {
      const p = parseFloat((basePrice + (i * step)).toFixed(2));
      const amount = parseFloat((Math.random() * 1.8 + 0.05).toFixed(4));
      cumAsk += amount;
      this.asks.unshift({ price: p, amount, total: parseFloat(cumAsk.toFixed(4)) });
    }

    let cumBid = 0;
    for (let i = 1; i <= 15; i++) {
      const p = parseFloat((basePrice - (i * step)).toFixed(2));
      const amount = parseFloat((Math.random() * 1.8 + 0.05).toFixed(4));
      cumBid += amount;
      this.bids.push({ price: p, amount, total: parseFloat(cumBid.toFixed(4)) });
    }
  }

  updatePrice(newPrice) {
    this.generateBook(newPrice);
    this.render();
  }

  tick() {
    if (this.asks.length === 0 || this.bids.length === 0) return;
    // Rung lắc ngẫu nhiên 1-2 dòng lệnh để tạo thanh khoản sống động
    const rIdx = Math.floor(Math.random() * Math.min(6, this.asks.length));
    this.asks[rIdx].amount = parseFloat((Math.random() * 2.2 + 0.08).toFixed(4));
    this.bids[rIdx].amount = parseFloat((Math.random() * 2.2 + 0.08).toFixed(4));
    this.render();
  }

  render() {
    if (!this.asksContainer || !this.bidsContainer) return;

    // Tìm max total để vẽ thanh depth bar
    const maxTotalAsk = this.asks.length > 0 ? this.asks[this.asks.length - 1].total : 1;
    const maxTotalBid = this.bids.length > 0 ? this.bids[this.bids.length - 1].total : 1;
    const maxTotal = Math.max(maxTotalAsk, maxTotalBid, 1);

    // 1. Render Asks (Bán - Đỏ)
    if (this.viewMode === 'buy') {
      this.asksContainer.style.display = 'none';
    } else {
      this.asksContainer.style.display = 'flex';
      const showCount = this.viewMode === 'sell' ? 24 : 12;
      const displayAsks = this.asks.slice(-showCount);

      this.asksContainer.innerHTML = displayAsks.map(item => {
        const pct = Math.min(100, (item.total / maxTotal) * 100);
        return `
          <div class="ob-row-item" onclick="window.TerminalEngine && window.TerminalEngine.fillPrice(${item.price})">
            <div class="ob-depth-bar ask" style="width: ${pct}%;"></div>
            <span class="text-red">${this.formatPrice(item.price)}</span>
            <span style="text-align:right;">${item.amount.toFixed(4)}</span>
            <span style="text-align:right; color:#848e9c;">${item.total.toFixed(4)}</span>
          </div>
        `;
      }).join('');
    }

    // 2. Render Mid Price
    if (this.midPriceEl) {
      this.midPriceEl.textContent = this.formatPrice(this.currentPrice);
    }

    // 3. Render Bids (Mua - Xanh)
    if (this.viewMode === 'sell') {
      this.bidsContainer.style.display = 'none';
    } else {
      this.bidsContainer.style.display = 'flex';
      const showCount = this.viewMode === 'buy' ? 24 : 12;
      const displayBids = this.bids.slice(0, showCount);

      this.bidsContainer.innerHTML = displayBids.map(item => {
        const pct = Math.min(100, (item.total / maxTotal) * 100);
        return `
          <div class="ob-row-item" onclick="window.TerminalEngine && window.TerminalEngine.fillPrice(${item.price})">
            <div class="ob-depth-bar bid" style="width: ${pct}%;"></div>
            <span class="text-green">${this.formatPrice(item.price)}</span>
            <span style="text-align:right;">${item.amount.toFixed(4)}</span>
            <span style="text-align:right; color:#848e9c;">${item.total.toFixed(4)}</span>
          </div>
        `;
      }).join('');
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  // Khởi tạo dòng lịch sử giao dịch gần đây (Market Trades)
  initRecentTrades() {
    this.trades = [];
    const now = new Date();
    for (let i = 0; i < 20; i++) {
      const isBuy = Math.random() > 0.48;
      const step = (Math.random() - 0.48) * (this.currentPrice * 0.0008);
      const p = parseFloat((this.currentPrice + step).toFixed(2));
      const amt = parseFloat((Math.random() * 0.95 + 0.02).toFixed(4));
      const d = new Date(now.getTime() - i * 3500);
      const timeStr = d.toTimeString().split(' ')[0];
      this.trades.push({ price: p, isBuy, amount: amt, time: timeStr });
    }
    this.renderTrades();
  }

  pushTrade(price, isBuy, amount = null) {
    const amt = amount ? parseFloat(amount) : parseFloat((Math.random() * 0.8 + 0.05).toFixed(4));
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.trades.unshift({ price, isBuy, amount: amt, time: timeStr });
    if (this.trades.length > 30) this.trades.pop();
    this.renderTrades();
  }

  renderTrades() {
    if (!this.tradesContainer) return;
    this.tradesContainer.innerHTML = this.trades.slice(0, 18).map(t => `
      <div class="trade-row-item">
        <span class="${t.isBuy ? 'text-green' : 'text-red'}">${this.formatPrice(t.price)}</span>
        <span style="text-align:right;">${t.amount.toFixed(4)}</span>
        <span style="text-align:right; color:#848e9c;">${t.time}</span>
      </div>
    `).join('');
  }

  formatPrice(p) {
    if (p >= 1000) {
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (p >= 1) {
      return p.toFixed(4);
    }
    return p.toFixed(6);
  }
}

window.SovereignOrderBook = SovereignOrderBook;
