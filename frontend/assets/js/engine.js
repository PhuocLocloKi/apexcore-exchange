/* ========================================================
   APEXCORE SOVEREIGN EXCHANGE — UNIFIED ENGINE (assets/js/engine.js)
   Bộ Điều Phối Khung Sàn Duy Nhất: Spot / Stocks / Margin / Bot
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class SovereignTerminalEngine {
  constructor() {
    this.currentPair = 'BTC/USDT';
    this.currentPrice = 85450.90;
    this.currentMode = 'spot'; // 'spot', 'stocks', 'margin', 'bot'
    this.currentMarginLeverage = 3;
    this.balanceUSDT = 25480.50;
    this.balanceBase = 0.8540;

    // Danh mục tài sản định chế
    this.markets = [
      { symbol: 'BTC/USDT', name: 'Bitcoin', category: 'crypto', price: 85450.90, change: '+2.45%', high: 86220.00, low: 83110.50, vol: '34,512 BTC' },
      { symbol: 'ETH/USDT', name: 'Ethereum', category: 'crypto', price: 2619.95, change: '-0.85%', high: 2680.00, low: 2590.20, vol: '124,190 ETH' },
      { symbol: 'BNB/USDT', name: 'Build N Build', category: 'crypto', price: 780.35, change: '+1.15%', high: 792.50, low: 765.00, vol: '89,450 BNB' },
      { symbol: 'SOL/USDT', name: 'Solana', category: 'crypto', price: 162.40, change: '+3.40%', high: 168.20, low: 157.80, vol: '450,120 SOL' },
      { symbol: 'FPT/VND', name: 'FPT Corporation (bStock)', category: 'stocks', price: 135200, change: '+1.65%', high: 136500, low: 133800, vol: '2.4M FPT' },
      { symbol: 'AAPL/USD', name: 'Apple Inc (bStock)', category: 'stocks', price: 232.80, change: '+0.95%', high: 235.40, low: 230.10, vol: '15.8M AAPL' },
      { symbol: 'NVDA/USD', name: 'NVIDIA (bStock)', category: 'stocks', price: 138.50, change: '+4.20%', high: 140.20, low: 132.80, vol: '32.1M NVDA' },
      { symbol: 'XAU/USD', name: 'Vàng Giao Ngay (Gold)', category: 'commodities', price: 2745.50, change: '+0.65%', high: 2758.00, low: 2732.40, vol: '1.8M OZ' }
    ];

    this.chart = null;
    this.orderbook = null;

    this.init();
  }

  init() {
    this.chart = new ApexChartRenderer('apex-interactive-canvas');
    this.orderbook = new SovereignOrderBook();
    window.ChartEngine = this.chart;
    window.OrderBook = this.orderbook;

    this.renderMarketList('all');
    this.initAdminSync();
    this.checkUrlParams();
  }

  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const pair = urlParams.get('pair');
    const mode = urlParams.get('mode');
    if (pair) {
      const match = this.markets.find(m => m.symbol.toLowerCase() === pair.toLowerCase() || m.symbol.replace('/', '_').toLowerCase() === pair.toLowerCase());
      if (match) this.selectPair(match.symbol);
    }
    if (mode) {
      this.switchMode(mode);
    }
  }

  // 1. Chuyển đổi mã giao dịch trong cùng 1 terminal (Crypto & Stocks)
  selectPair(symbol) {
    const asset = this.markets.find(m => m.symbol === symbol);
    if (!asset) return;

    this.currentPair = asset.symbol;
    this.currentPrice = asset.price;

    // Cập nhật Header Ticker Bar
    const txtPair = document.getElementById('txt-active-pair');
    const txtPrice = document.getElementById('txt-header-price');
    const txtChange = document.getElementById('txt-change-24h');
    const txtHigh = document.getElementById('txt-high-24h');
    const txtLow = document.getElementById('txt-low-24h');

    if (txtPair) txtPair.textContent = asset.symbol;
    if (txtPrice) {
      txtPrice.textContent = this.formatPriceWithCurrency(asset.price, asset.symbol);
      txtPrice.className = asset.change.startsWith('+') ? 'ticker-price-huge text-green' : 'ticker-price-huge text-red';
    }
    if (txtChange) {
      txtChange.textContent = asset.change;
      txtChange.className = asset.change.startsWith('+') ? 'stat-val text-green' : 'stat-val text-red';
    }
    if (txtHigh) txtHigh.textContent = this.formatNumber(asset.high);
    if (txtLow) txtLow.textContent = this.formatNumber(asset.low);

    // Cập nhật Form đặt lệnh
    this.fillPrice(asset.price);
    const baseUnit = asset.symbol.split('/')[0];
    const quoteUnit = asset.symbol.split('/')[1];

    document.querySelectorAll('.of-quote-unit').forEach(el => el.textContent = quoteUnit);
    document.querySelectorAll('.of-base-unit').forEach(el => el.textContent = baseUnit);
    const btnBuy = document.getElementById('btn-action-buy');
    const btnSell = document.getElementById('btn-action-sell');
    if (btnBuy) btnBuy.textContent = `MUA ${baseUnit}`;
    if (btnSell) btnSell.textContent = `BÁN ${baseUnit}`;

    // Cập nhật Biểu đồ & Sổ lệnh
    if (this.chart) {
      this.chart.symbol = asset.symbol;
      this.chart.setPrice(asset.price, true);
    }
    if (this.orderbook) {
      this.orderbook.updatePrice(asset.price);
    }

    if (window.HeaderController) {
      window.HeaderController.toast(`⚡ Đã chuyển sang mã: ${asset.symbol}`);
    }
  }

  // 2. Chuyển chế độ: Spot | Stocks | Margin | Bot ngay trên form mà không reload!
  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.ot-btn, .mode-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    const marginBar = document.getElementById('margin-leverage-bar');
    const botPanel = document.getElementById('grid-bot-panel');

    if (marginBar) {
      marginBar.style.display = (mode === 'margin') ? 'flex' : 'none';
    }
    if (botPanel) {
      botPanel.style.display = (mode === 'bot') ? 'grid' : 'none';
    }

    if (mode === 'stocks') {
      // Tự động gợi ý cặp cổ phiếu token hóa nếu đang ở crypto
      if (!this.currentPair.includes('FPT') && !this.currentPair.includes('AAPL')) {
        this.selectPair('FPT/VND');
      }
    } else if (mode === 'spot' && this.currentPair.includes('FPT')) {
      this.selectPair('BTC/USDT');
    }

    if (window.HeaderController) {
      const modeNames = {
        spot: 'Giao Ngay (Spot)',
        stocks: 'Chứng Khoán Token Hóa (bStocks)',
        margin: 'Ký Quỹ Đòn Bẩy (Margin)',
        bot: 'Bot Lưới Tự Động (Grid Bot)'
      };
      window.HeaderController.toast(`🎯 Chế độ: ${modeNames[mode] || mode}`);
    }
  }

  setMarginLeverage(lev) {
    this.currentMarginLeverage = lev;
    document.querySelectorAll('.lev-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.lev) === lev);
    });
    if (window.HeaderController) {
      window.HeaderController.toast(`⚖️ Đòn bẩy đã chọn: ${lev}x`);
    }
  }

  fillPrice(price) {
    const buyInp = document.getElementById('inp-buy-price');
    const sellInp = document.getElementById('inp-sell-price');
    if (buyInp) buyInp.value = price;
    if (sellInp) sellInp.value = price;
  }

  setOrderPercentage(side, pct) {
    const buyPrice = parseFloat(document.getElementById('inp-buy-price')?.value) || this.currentPrice;
    if (side === 'BUY') {
      const amountToSpend = (this.balanceUSDT * (pct / 100));
      const buyAmt = amountToSpend / buyPrice;
      const inp = document.getElementById('inp-buy-amount');
      if (inp) inp.value = buyAmt > 0 ? buyAmt.toFixed(4) : '0.00';
    } else {
      const sellAmt = (this.balanceBase * (pct / 100));
      const inp = document.getElementById('inp-sell-amount');
      if (inp) inp.value = sellAmt > 0 ? sellAmt.toFixed(4) : '0.00';
    }
  }

  handleOrderSubmit(side) {
    const priceInp = document.getElementById(side === 'BUY' ? 'inp-buy-price' : 'inp-sell-price');
    const amtInp = document.getElementById(side === 'BUY' ? 'inp-buy-amount' : 'inp-sell-amount');
    const price = parseFloat(priceInp?.value) || this.currentPrice;
    const amount = parseFloat(amtInp?.value);

    if (!amount || amount <= 0) {
      if (window.HeaderController) window.HeaderController.toast('⚠️ Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    const baseUnit = this.currentPair.split('/')[0];
    if (this.orderbook) {
      this.orderbook.pushTrade(price, side === 'BUY', amount);
    }

    if (window.HeaderController) {
      window.HeaderController.toast(`✅ Khớp lệnh thành công: ${side} ${amount} ${baseUnit} @ ${this.formatPrice(price)}`);
    }

    if (amtInp) amtInp.value = '';
  }

  renderMarketList(cat = 'all') {
    const listEl = document.getElementById('terminal-market-list');
    if (!listEl) return;

    const filtered = (cat === 'all') ? this.markets : this.markets.filter(m => m.category === cat);
    listEl.innerHTML = filtered.map(m => `
      <div class="mc-item-row" onclick="window.TerminalEngine.selectPair('${m.symbol}')">
        <div>
          <div style="font-weight:700; font-size:12px;">${m.symbol}</div>
          <div style="font-size:10px; color:#848e9c;">${m.name}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; font-size:12px;" class="font-mono">${this.formatPriceWithCurrency(m.price, m.symbol)}</div>
          <div class="${m.change.startsWith('+') ? 'text-green' : 'text-red'}" style="font-size:10px;">${m.change}</div>
        </div>
      </div>
    `).join('');
  }

  filterMarkets(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.mc-item-row').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
  }

  initAdminSync() {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('apex_market_channel');
      bc.onmessage = (e) => {
        if (e.data) this.applyAdminData(e.data);
      };
    }
    window.addEventListener('storage', (e) => {
      if (e.key === 'apex_god_signal' && e.newValue) {
        try { this.applyAdminData(JSON.parse(e.newValue)); } catch (err) {}
      }
    });
  }

  applyAdminData(data) {
    const newPrice = data.new_price || (data.prices && data.prices[this.currentPair]);
    if (newPrice) {
      this.currentPrice = newPrice;
      const priceEl = document.getElementById('txt-header-price');
      if (priceEl) priceEl.textContent = this.formatPriceWithCurrency(newPrice, this.currentPair);
      if (this.chart) this.chart.setPrice(newPrice);
      if (this.orderbook) this.orderbook.updatePrice(newPrice);
    }
  }

  formatPrice(p) {
    if (p >= 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 1) return p.toFixed(4);
    return p.toFixed(6);
  }

  formatPriceWithCurrency(p, sym) {
    if (sym.includes('VND')) return p.toLocaleString('vi-VN') + ' ₫';
    return '$' + this.formatPrice(p);
  }

  formatNumber(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2 });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.TerminalEngine = new SovereignTerminalEngine();
});
