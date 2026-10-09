/* ========================================================
   APEXCORE PRO — TRADE PAGE (js/pages/trade.js)
   MASTER v8.0 — Binance Pro Cockpit Benchmark
   Founder: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   - Dynamic Clamped Auto-Scale (Không Co Dẹp Nến)
   - Silent State Sync (Loại Bỏ Toast Tràn Màn Hình)
   - Multi-Timeframe Engine (1s, 15m, 1h, 4h, 1D, 1W)
   - Token Analysis Hub (Info, Data, Audit AI, Earn, News)
   ======================================================== */

import { SYMBOLS, getLogo } from '../config.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class TradePage {
  constructor(router) {
    this.router = router;
    this.currentSymbolId = 'BNB_USDT';
    this.currentSymbol = SYMBOLS.find(s => s.id === 'BNB_USDT') || SYMBOLS[0];
    this.currentPrice = this.currentSymbol.price;
    this.canvas = null;
    this.ctx = null;
    this.candles = [];
    this.currentTimeframe = '15m';
    this.timeframeStore = {};
    this.tickTimer = null;
    this.tradesList = [];
    this.activeAnalysisTab = 'info';
    this.adminChannel = null;
  }

  mount(container, params = {}) {
    if (params.symbol) {
      const found = SYMBOLS.find(s => s.id.toLowerCase() === params.symbol.toLowerCase() || s.symbol.toLowerCase() === params.symbol.toLowerCase());
      if (found) {
        this.currentSymbolId = found.id;
        this.currentSymbol = found;
        this.currentPrice = found.price;
      }
    }

    container.innerHTML = this.renderHTML();
    this.initDOM();
    this.initTimeframes();
    this.initChart();
    this.renderOrderBook();
    this.initTradesStream();
    this.initOrderForms();
    this.initMarketWatch();
    this.startLiveTickEngine();
    this.initSecretGodMode();
    this.initAnalysisTabs();
  }

  unmount() {
    if (this.tickTimer) clearInterval(this.tickTimer);
    if (this.adminChannel) {
      try { this.adminChannel.close(); } catch(e) {}
    }
  }

  renderHTML() {
    const s = this.currentSymbol;
    const isUp = s.change24h >= 0;
    const priceStr = this.formatPrice(this.currentPrice);

    return `
      <div class="page-container" style="display:flex; flex-direction:column;">
        <!-- Top Ticker Bar -->
        <section class="trade-ticker-bar">
          <div class="ticker-left-info">
            <button class="btn-star-fav" id="btn-star-fav" title="Thêm vào yêu thích">★</button>
            <div class="pair-title-box">
              <span class="active-pair-name" id="ticker-symbol-title">${s.symbol}/${s.quote}</span>
              <span class="active-pair-tag">${s.tag || 'Layer 1'}</span>
            </div>
            <div class="ticker-price-big">
              <span class="price-val num-tabular ${isUp ? 'text-up' : 'text-down'}" id="ticker-main-price">${priceStr}</span>
              <span class="price-usd text-muted" id="ticker-usd-equiv">$${priceStr}</span>
            </div>
          </div>

          <div class="ticker-metrics-row">
            <div class="metric-item">
              <span class="metric-lbl">Biến Động 24h</span>
              <span class="metric-val num-tabular ${isUp ? 'text-up' : 'text-down'}" id="ticker-change-val">
                ${s.changeAmount >= 0 ? '+' : ''}${s.changeAmount} ${s.change24h >= 0 ? '+' : ''}${s.change24h}%
              </span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">Giá Cao Nhất 24h</span>
              <span class="metric-val num-tabular" id="ticker-high-val">${this.formatPrice(s.high24h)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">Giá Thấp Nhất 24h</span>
              <span class="metric-val num-tabular" id="ticker-low-val">${this.formatPrice(s.low24h)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">24h Vol (${s.symbol})</span>
              <span class="metric-val num-tabular">${s.volume24h}</span>
            </div>
            <div class="metric-item">
              <span class="metric-lbl">24h Vol (${s.quote})</span>
              <span class="metric-val num-tabular">${s.volumeQuote}</span>
            </div>
          </div>
        </section>

        <!-- 3-Column Terminal Grid: LEFT (Order Book) | CENTER (Chart & Order & Analysis) | RIGHT (Market & Trades) -->
        <div class="terminal-cockpit-grid">
          <!-- LEFT: SỔ LỆNH (ORDER BOOK) -->
          <aside class="terminal-orderbook-col">
            <div class="col-header-bar">
              <span class="col-title">Sổ Lệnh (Order Book)</span>
              <div class="ob-filter-buttons">
                <button class="ob-filter-btn active" data-view="both" title="Hiện cả 2 bên"><span class="ico-bar red"></span><span class="ico-bar green"></span></button>
                <button class="ob-filter-btn" data-view="buy" title="Chỉ hiện Mua"><span class="ico-bar green"></span></button>
                <button class="ob-filter-btn" data-view="sell" title="Chỉ hiện Bán"><span class="ico-bar red"></span></button>
              </div>
            </div>

            <div class="ob-table-header">
              <span>Giá (${s.quote})</span>
              <span class="text-right">Số Lượng</span>
              <span class="text-right">Tổng</span>
            </div>

            <!-- 15 dòng Bán Đỏ -->
            <div class="ob-asks-container" id="ob-asks-list"></div>

            <!-- Vạch Giá Khớp Trung Tâm -->
            <div class="ob-mid-price-row">
              <div class="mid-price-num num-tabular ${isUp ? 'text-up' : 'text-down'}" id="ob-mid-price">
                ${priceStr} ${isUp ? '↑' : '↓'}
              </div>
              <span class="mid-usd-val text-muted" id="ob-mid-usd">${priceStr}</span>
            </div>

            <!-- 15 dòng Mua Xanh -->
            <div class="ob-bids-container" id="ob-bids-list"></div>
          </aside>

          <!-- CENTER: CHART & ORDER PANEL & ANALYSIS TABS -->
          <main class="terminal-center-col">
            <section class="terminal-chart-box">
              <div class="chart-toolbar-row">
                <div class="chart-tf-buttons" id="tf-buttons-container">
                  <button class="tf-btn" data-tf="1s">1s</button>
                  <button class="tf-btn active" data-tf="15m">15m</button>
                  <button class="tf-btn" data-tf="1h">1h</button>
                  <button class="tf-btn" data-tf="4h">4h</button>
                  <button class="tf-btn" data-tf="1D">1D</button>
                  <button class="tf-btn" data-tf="1W">1W</button>
                </div>
                <div class="chart-tf-buttons">
                  <button class="cv-mode-btn active">Original</button>
                  <button class="cv-mode-btn" onclick="alert('Đang kết nối TradingView Pro Feed...')">TradingView</button>
                  <button class="cv-mode-btn" onclick="alert('Đang tải biểu đồ độ sâu Depth Chart...')">Depth</button>
                </div>
              </div>

              <!-- OHLCV Status Line -->
              <div class="chart-ohlcv-status-line num-tabular">
                <span>Khung: <strong id="ohlcv-tf" class="text-accent">${this.currentTimeframe}</strong></span>
                <span>Open: <strong id="ohlcv-open">${this.formatPrice(s.price * 0.998)}</strong></span>
                <span>High: <strong id="ohlcv-high">${this.formatPrice(s.high24h)}</strong></span>
                <span>Low: <strong id="ohlcv-low">${this.formatPrice(s.low24h)}</strong></span>
                <span>Close: <strong id="ohlcv-close" class="${isUp ? 'text-up' : 'text-down'}">${priceStr}</strong></span>
                <span>Change: <strong id="ohlcv-change" class="${isUp ? 'text-up' : 'text-down'}">${s.change24h}%</strong></span>
              </div>

              <!-- Canvas Container -->
              <div class="canvas-wrapper">
                <canvas id="apex-candle-canvas"></canvas>
                <div class="live-price-flag" id="live-price-flag">
                  <span class="num-tabular font-bold" id="flag-price-val">${priceStr}</span>
                </div>
              </div>
            </section>

            <!-- Dual Parallel Order Form -->
            <section class="terminal-order-panel">
              <div class="order-panel-header">
                <div class="op-mode-tabs">
                  <button class="op-mode-tab active">Spot</button>
                  <button class="op-mode-tab">Cross 3x</button>
                  <button class="op-mode-tab">Isolated 10x</button>
                  <button class="op-mode-tab">Grid MM</button>
                </div>
                <div class="op-type-tabs">
                  <button class="op-type-tab active">Limit</button>
                  <button class="op-type-tab">Market</button>
                  <button class="op-type-tab">Stop Limit ˇ</button>
                </div>
              </div>

              <div class="order-dual-columns-grid">
                <!-- BUY (XANH) -->
                <div class="order-side-col">
                  <div class="order-field-group">
                    <label class="order-field-label">Giá Mua</label>
                    <div class="order-input-wrapper">
                      <input type="number" step="any" class="order-input num-tabular" id="buy-price-input" value="${this.currentPrice}">
                      <span class="order-unit-badge">${s.quote}</span>
                      <button class="btn-bbo-pill" id="btn-buy-bbo">BBO</button>
                    </div>
                  </div>

                  <div class="order-field-group">
                    <label class="order-field-label">Khối Lượng</label>
                    <div class="order-input-wrapper">
                      <input type="number" step="any" class="order-input num-tabular" id="buy-amount-input" placeholder="0.00">
                      <span class="order-unit-badge">${s.symbol}</span>
                    </div>
                  </div>

                  <div class="order-slider-box">
                    <input type="range" min="0" max="100" value="0" class="order-pct-range" id="buy-pct-range">
                    <div class="range-marks-row">
                      <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                    </div>
                  </div>

                  <div class="order-options-row">
                    <label class="order-checkbox-label">
                      <input type="checkbox" id="buy-tpsl"> <span>TP/SL</span>
                    </label>
                    <span class="text-sub">Khả dụng: <strong class="num-tabular" id="buy-avbl-text">12,458.32 USDT</strong></span>
                  </div>

                  <button class="btn-execute-order btn-buy-main" id="btn-submit-buy">
                    MUA ${s.symbol}
                  </button>
                </div>

                <!-- SELL (ĐỎ) -->
                <div class="order-side-col">
                  <div class="order-field-group">
                    <label class="order-field-label">Giá Bán</label>
                    <div class="order-input-wrapper">
                      <input type="number" step="any" class="order-input num-tabular" id="sell-price-input" value="${this.currentPrice}">
                      <span class="order-unit-badge">${s.quote}</span>
                      <button class="btn-bbo-pill" id="btn-sell-bbo">BBO</button>
                    </div>
                  </div>

                  <div class="order-field-group">
                    <label class="order-field-label">Khối Lượng</label>
                    <div class="order-input-wrapper">
                      <input type="number" step="any" class="order-input num-tabular" id="sell-amount-input" placeholder="0.00">
                      <span class="order-unit-badge">${s.symbol}</span>
                    </div>
                  </div>

                  <div class="order-slider-box">
                    <input type="range" min="0" max="100" value="0" class="order-pct-range" id="sell-pct-range">
                    <div class="range-marks-row">
                      <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                    </div>
                  </div>

                  <div class="order-options-row">
                    <label class="order-checkbox-label">
                      <input type="checkbox" id="sell-tpsl"> <span>TP/SL</span>
                    </label>
                    <span class="text-sub">Khả dụng: <strong class="num-tabular" id="sell-avbl-text">18.50 ${s.symbol}</strong></span>
                  </div>

                  <button class="btn-execute-order btn-sell-main" id="btn-submit-sell">
                    BÁN ${s.symbol}
                  </button>
                </div>
              </div>
            </section>

            <!-- ========================================================
                 TÍCH HỢP HỆ THỐNG PHÂN TÍCH TOKEN (INFO, DATA, AUDIT, EARN, NEWS)
                 ======================================================== -->
            <section class="terminal-analysis-section">
              <div class="analysis-tabs-bar">
                <button class="analysis-tab-btn active" data-tab="info" id="tab-btn-info">ℹ️ Thông Tin Cơ Bản</button>
                <button class="analysis-tab-btn" data-tab="data" id="tab-btn-data">📊 Phân Tích Dòng Tiền & Ký Quỹ</button>
                <button class="analysis-tab-btn" data-tab="audit" id="tab-btn-audit">🛡️ Kiểm Định Bảo Mật AI</button>
                <button class="analysis-tab-btn" data-tab="earn" id="tab-btn-earn">💰 Gói Sinh Lời Earn</button>
                <button class="analysis-tab-btn" data-tab="news" id="tab-btn-news">📰 Tin Tức Square Live</button>
              </div>

              <div class="analysis-panel-body" id="analysis-panel-container">
                <!-- Nội dung được cập nhật động bởi renderAnalysisTab() -->
              </div>
            </section>
          </main>

          <!-- RIGHT: MARKET WATCH & TRADES -->
          <aside class="terminal-market-col">
            <div class="market-col-search-box">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="trade-sym-search" placeholder="Tìm kiếm mã...">
            </div>

            <div class="market-col-subtabs">
              <span class="mc-tab active" data-cat="all">Tất Cả</span>
              <span class="mc-tab" data-cat="crypto">Crypto</span>
              <span class="mc-tab" data-cat="stocks">Cổ Phiếu</span>
              <span class="mc-tab" data-cat="forex">Forex</span>
            </div>

            <div class="market-col-list" id="trade-market-list"></div>

            <div class="market-trades-section">
              <div class="trades-header-row">
                <span class="trades-title">Market Trades</span>
                <span class="trades-title text-muted" style="font-weight:400;">Lệnh Của Tôi</span>
              </div>
              <div class="trades-table-head">
                <span>Giá (${s.quote})</span>
                <span class="text-right">Khối Lượng</span>
                <span class="text-right">Thời Gian</span>
              </div>
              <div class="trades-stream-container" id="trade-stream-list"></div>
            </div>
          </aside>
        </div>

        <!-- Dải Chân Trang -->
        <footer class="terminal-bottom-strip">
          <div class="tb-left">
            <span class="tb-status-dot"></span>
            <span class="text-sub">Kết nối máy chủ ổn định (12µs)</span>
          </div>
          <div class="tb-center-marquee">
            <span>BNB/USDT <strong class="text-down">-0.80% 780.35</strong></span>
            <span class="text-muted">|</span>
            <span>BTC/USDT <strong class="text-up">+2.41% 68,432.12</strong></span>
            <span class="text-muted">|</span>
            <span>ETH/USDT <strong class="text-up">+1.82% 3,248.75</strong></span>
            <span class="text-muted">|</span>
            <span>FPT/VND <strong class="text-up">+2.80% 132,500</strong></span>
            <span class="text-muted">|</span>
            <span>VFS/USD <strong class="text-up">+5.20% 4.85</strong></span>
            <span class="text-muted">|</span>
            <span>XAU/USD <strong class="text-up">+0.85% 2,735.40</strong></span>
          </div>
          <div class="text-sub">
            <span>Thông Báo</span> · <span>Hỗ Trợ 24/7</span>
          </div>
        </footer>

        <!-- Secret God-Mode Drawer (Ẩn hoàn toàn - Ctrl + NumPad 0) -->
        <div class="modal-backdrop" id="godmode-drawer-overlay" style="display:none; z-index:99999;">
          <div class="godmode-drawer-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="background:var(--gold); color:#000; font-size:10px; font-weight:800; padding:2px 6px; border-radius:3px;">⚡ GOD-MODE</span>
                <strong style="font-size:12px;">NGUYỄN PHƯỚC LỘC</strong>
              </div>
              <button class="modal-close-btn" id="godmode-close-btn">✕</button>
            </div>
            <p class="text-sub" style="font-size:11px; margin-bottom:12px;">Bảng điều khiển tối cao bí mật. Can thiệp giá tức thì, bơm nến kỹ thuật, kích hoạt bot volume.</p>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label">Chọn Mã Can Thiệp</label>
              <select class="form-input" id="god-select-sym">
                ${SYMBOLS.map(sym => `<option value="${sym.id}" ${sym.id === this.currentSymbolId ? 'selected' : ''}>${sym.symbol}/${sym.quote} (${sym.name})</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label">Giá Mục Tiêu (Target Price)</label>
              <input type="number" step="any" class="form-input num-tabular" id="god-target-price" value="${this.currentPrice}">
            </div>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:12px;">
              <button class="btn-trade-sm text-down" id="btn-god-nudge-down-5">-5%</button>
              <button class="btn-trade-sm text-down" id="btn-god-nudge-down-1">-1%</button>
              <button class="btn-trade-sm text-up" id="btn-god-nudge-up-1">+1%</button>
              <button class="btn-trade-sm text-up" id="btn-god-nudge-up-5">+5%</button>
            </div>

            <button class="btn-submit-main" id="btn-god-apply-price" style="background:linear-gradient(135deg, var(--gold), var(--accent)); margin-bottom:16px;">
              ⚡ Can Thiệp Giá Tức Thì
            </button>

            <label class="form-label">Bộ Nút Sóng Siêu Tốc</label>
            <div style="display:flex; flex-direction:column; gap:8px; margin:8px 0 16px;">
              <button class="btn-trade-sm text-up font-bold" id="btn-god-pump" style="padding:8px; text-align:left; border-color:var(--up);">
                🚀 Bơm Tăng +3% (Nến xanh giật đứng tạo FOMO)
              </button>
              <button class="btn-trade-sm text-down font-bold" id="btn-god-dump" style="padding:8px; text-align:left; border-color:var(--down);">
                💥 Xả Giảm -3% (Đạp nến đỏ cắm đầu bán tháo)
              </button>
              <button class="btn-trade-sm text-gold font-bold" id="btn-god-sweep" style="padding:8px; text-align:left; border-color:var(--gold);">
                ⚡ Quét Râu Thanh Lý (Wick Sweep rút chân 1s)
              </button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:var(--panel-sub); border-radius:6px;">
              <div>
                <strong style="font-size:12px;">Bot Khớp Lệnh Volume</strong>
                <p class="text-sub" style="font-size:10px;">Tự động thả bot mua bán ảo tạo thanh khoản</p>
              </div>
              <input type="checkbox" id="god-bot-toggle" checked style="width:18px; height:18px; accent-color:var(--accent);">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  formatPrice(p) {
    if (typeof p !== 'number') p = parseFloat(p) || 0;
    const prec = this.currentSymbol.precision !== undefined ? this.currentSymbol.precision : (p < 1 ? 4 : (p > 1000 ? 2 : 2));
    return p.toLocaleString('en-US', { minimumFractionDigits: prec, maximumFractionDigits: prec });
  }

  initDOM() {
    this.canvas = document.getElementById('apex-candle-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /* ----------------------------------------------------
     MULTI-TIMEFRAME GENERATOR & STORE
     ---------------------------------------------------- */
  initTimeframes() {
    const baseP = this.currentPrice;
    const now = Date.now();

    // 1s: 60 candles
    this.timeframeStore['1s'] = this.generateCandles(baseP, 60, 1000, 0.001);
    // 15m: 48 candles
    this.timeframeStore['15m'] = this.generateCandles(baseP, 48, 15 * 60 * 1000, 0.005);
    // 1h: 36 candles
    this.timeframeStore['1h'] = this.generateCandles(baseP, 36, 60 * 60 * 1000, 0.008);
    // 4h: 30 candles
    this.timeframeStore['4h'] = this.generateCandles(baseP, 30, 4 * 60 * 60 * 1000, 0.012);
    // 1D: 30 candles
    this.timeframeStore['1D'] = this.generateCandles(baseP, 30, 24 * 60 * 60 * 1000, 0.018);
    // 1W: 24 candles
    this.timeframeStore['1W'] = this.generateCandles(baseP, 24, 7 * 24 * 60 * 1000, 0.025);

    this.candles = this.timeframeStore[this.currentTimeframe] || this.timeframeStore['15m'];

    // Wire timeframe button events
    const tfContainer = document.getElementById('tf-buttons-container');
    tfContainer?.querySelectorAll('.tf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tf = btn.dataset.tf;
        this.switchTimeframe(tf);
      });
    });
  }

  generateCandles(startP, count, intervalMs, volScale) {
    const list = [];
    let p = startP * (1 - volScale * (count / 4));
    const now = Date.now();
    for (let i = count - 1; i >= 0; i--) {
      const open = p;
      const change = (Math.random() - 0.49) * (p * volScale);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (p * volScale * 0.5);
      const low = Math.min(open, close) - Math.random() * (p * volScale * 0.5);
      const vol = Math.floor(Math.random() * 800) + 120;
      list.push({ time: now - i * intervalMs, open, high, low, close, vol });
      p = close;
    }
    if (list.length > 0) {
      list[list.length - 1].close = this.currentPrice;
    }
    return list;
  }

  switchTimeframe(tf) {
    if (!this.timeframeStore[tf]) return;
    this.currentTimeframe = tf;
    this.candles = this.timeframeStore[tf];

    // Cập nhật trạng thái nút
    const tfContainer = document.getElementById('tf-buttons-container');
    tfContainer?.querySelectorAll('.tf-btn').forEach(b => {
      if (b.dataset.tf === tf) b.classList.add('active');
      else b.classList.remove('active');
    });

    const tfLabel = document.getElementById('ohlcv-tf');
    if (tfLabel) tfLabel.textContent = tf;

    this.renderCanvas();
  }

  initChart() {
    if (this.canvas && !this.ctx) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.renderCanvas();
    window.addEventListener('resize', () => this.renderCanvas());
  }

  /* ----------------------------------------------------
     DYNAMIC CLAMPED AUTO-SCALE (CHUẨN TRADINGVIEW)
     Không Bị Co Dẹp Nến Khi Admin Can Thiệp Giá
     ---------------------------------------------------- */
  calculateAdaptivePriceScale(visibleCandles, forcedNewPrice) {
    let min = Infinity;
    let max = -Infinity;
    let maxV = 0;

    visibleCandles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.vol > maxV) maxV = c.vol;
    });

    if (forcedNewPrice && forcedNewPrice > 0) {
      if (forcedNewPrice < min) min = forcedNewPrice;
      if (forcedNewPrice > max) max = forcedNewPrice;
    }

    // Thêm 15% khoảng đệm an toàn phía trên và dưới theo thuật toán quy hoạch
    const diff = max - min;
    const padding = (diff > 0 ? diff * 0.15 : min * 0.02) || 10;

    return {
      scaledMin: Math.max(0.0001, min - padding),
      scaledMax: max + padding,
      maxVol: maxV || 1
    };
  }

  renderCanvas() {
    if (!this.canvas || !this.ctx || this.candles.length === 0) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridCol = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
    const textCol = isLight ? '#707a8a' : '#848e9c';

    // Đọc bảng màu nến từ cài đặt (Standard vs Cyberpunk)
    const pal = localStorage.getItem('apex_candle_palette') || 'standard';
    const upCol = pal === 'cyberpunk' ? '#00ffcc' : '#0ecb81';
    const downCol = pal === 'cyberpunk' ? '#ff007f' : '#f6465d';

    this.ctx.clearRect(0, 0, w, h);

    const priceH = h * 0.78;
    const volH = h * 0.16;
    const rightMargin = 68;
    const chartW = Math.max(100, w - rightMargin);

    // Tính toán theo cửa sổ nến hiển thị trong tầm mắt (36 nến gần nhất)
    const visibleCount = Math.min(this.candles.length, 36);
    const visibleCandles = this.candles.slice(-visibleCount);

    const { scaledMin: minP, scaledMax: maxP, maxVol: maxV } = this.calculateAdaptivePriceScale(visibleCandles, this.currentPrice);
    const range = Math.max(0.0001, maxP - minP);

    // Grid & Axis
    this.ctx.strokeStyle = gridCol;
    this.ctx.lineWidth = 1;
    for (let r = 0; r <= 4; r++) {
      const y = (priceH / 4) * r;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(chartW, y);
      this.ctx.stroke();

      const pVal = maxP - (range / 4) * r;
      this.ctx.fillStyle = textCol;
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.fillText(this.formatPrice(pVal), chartW + 6, y + 3);
    }

    // Render Candles
    const slotW = chartW / visibleCount;
    const barW = Math.max(3.5, slotW * 0.68);

    visibleCandles.forEach((c, i) => {
      const x = i * slotW + slotW / 2;
      const isUp = c.close >= c.open;
      const col = isUp ? upCol : downCol;

      const yO = priceH - ((c.open - minP) / range) * priceH;
      const yC = priceH - ((c.close - minP) / range) * priceH;
      const yH = priceH - ((c.high - minP) / range) * priceH;
      const yL = priceH - ((c.low - minP) / range) * priceH;

      // Bóng nến (Wick)
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = 1.4;
      this.ctx.beginPath();
      this.ctx.moveTo(x, Math.max(0, Math.min(priceH, yH)));
      this.ctx.lineTo(x, Math.max(0, Math.min(priceH, yL)));
      this.ctx.stroke();

      // Thân nến (Body) - Đảm bảo luôn tối thiểu 2.5px không bao giờ bị bẹp
      this.ctx.fillStyle = col;
      const top = Math.min(yO, yC);
      const bH = Math.max(2.5, Math.abs(yC - yO));
      this.ctx.fillRect(x - barW / 2, top, barW, bH);

      // Volume bar
      const vHeight = (c.vol / maxV) * volH;
      this.ctx.fillStyle = isUp ? (pal === 'cyberpunk' ? 'rgba(0,255,204,0.3)' : 'rgba(14,203,129,0.3)') : (pal === 'cyberpunk' ? 'rgba(255,0,127,0.3)' : 'rgba(246,70,93,0.3)');
      this.ctx.fillRect(x - barW / 2, h - vHeight, barW, vHeight);
    });

    // Vạch Giá Hiện Tại Cắt Ngang
    const last = visibleCandles[visibleCandles.length - 1];
    const lastY = Math.max(8, Math.min(priceH - 8, priceH - ((last.close - minP) / range) * priceH));

    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeStyle = last.close >= last.open ? upCol : downCol;
    this.ctx.beginPath();
    this.ctx.moveTo(0, lastY);
    this.ctx.lineTo(chartW, lastY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    const flag = document.getElementById('live-price-flag');
    if (flag) {
      flag.style.top = `${lastY}px`;
      flag.style.background = last.close >= last.open ? upCol : downCol;
      const val = document.getElementById('flag-price-val');
      if (val) val.textContent = this.formatPrice(last.close);
    }
  }

  renderOrderBook() {
    const asksEl = document.getElementById('ob-asks-list');
    const bidsEl = document.getElementById('ob-bids-list');
    if (!asksEl || !bidsEl) return;

    const base = this.currentPrice;
    const step = base < 1 ? 0.0001 : (base > 1000 ? 1.0 : 0.05);

    let asksHtml = '', totalAsk = 0;
    for (let i = 15; i >= 1; i--) {
      const p = base + i * step;
      const amt = (Math.random() * 3.5 + 0.05).toFixed(3);
      totalAsk += parseFloat(amt);
      const depth = Math.min(100, Math.round((amt / 4) * 100));

      asksHtml += `
        <div class="ob-row ask-row" onclick="window.ApexRouter.currentView.fillPrice(${p})">
          <div class="ob-depth-bar" style="width:${depth}%;"></div>
          <span class="num-tabular text-down font-bold">${this.formatPrice(p)}</span>
          <span class="num-tabular text-right">${amt}</span>
          <span class="num-tabular text-right text-muted">${totalAsk.toFixed(2)}</span>
        </div>
      `;
    }
    asksEl.innerHTML = asksHtml;

    let bidsHtml = '', totalBid = 0;
    for (let i = 1; i <= 15; i++) {
      const p = base - i * step;
      const amt = (Math.random() * 3.5 + 0.05).toFixed(3);
      totalBid += parseFloat(amt);
      const depth = Math.min(100, Math.round((amt / 4) * 100));

      bidsHtml += `
        <div class="ob-row bid-row" onclick="window.ApexRouter.currentView.fillPrice(${p})">
          <div class="ob-depth-bar" style="width:${depth}%;"></div>
          <span class="num-tabular text-up font-bold">${this.formatPrice(p)}</span>
          <span class="num-tabular text-right">${amt}</span>
          <span class="num-tabular text-right text-muted">${totalBid.toFixed(2)}</span>
        </div>
      `;
    }
    bidsEl.innerHTML = bidsHtml;

    const mid = document.getElementById('ob-mid-price');
    const midUsd = document.getElementById('ob-mid-usd');
    if (mid) mid.textContent = this.formatPrice(base);
    if (midUsd) midUsd.textContent = '$' + this.formatPrice(base);
  }

  fillPrice(p) {
    const buyInp = document.getElementById('buy-price-input');
    const sellInp = document.getElementById('sell-price-input');
    if (buyInp) buyInp.value = p;
    if (sellInp) sellInp.value = p;
  }

  initTradesStream() {
    this.tradesList = [];
    const now = Date.now();
    for (let i = 0; i < 20; i++) {
      this.pushLiveTrade(this.currentPrice + (Math.random() - 0.5) * 2, Math.random() > 0.48);
    }
  }

  pushLiveTrade(price, isBuy, forcedAmt) {
    const listEl = document.getElementById('trade-stream-list');
    const amt = forcedAmt || (Math.random() * 1.8 + 0.02).toFixed(4);
    const d = new Date();
    const timeStr = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;

    const row = document.createElement('div');
    row.className = 'trade-stream-row';
    row.innerHTML = `
      <span class="num-tabular ${isBuy ? 'text-up' : 'text-down'} font-bold">${this.formatPrice(price)}</span>
      <span class="num-tabular text-right">${amt}</span>
      <span class="num-tabular text-right text-muted">${timeStr}</span>
    `;

    if (listEl) {
      listEl.insertBefore(row, listEl.firstChild);
      if (listEl.children.length > 28) {
        listEl.removeChild(listEl.lastChild);
      }
    }
  }

  initOrderForms() {
    const buyBtn = document.getElementById('btn-submit-buy');
    const sellBtn = document.getElementById('btn-submit-sell');

    buyBtn?.addEventListener('click', () => {
      const amt = document.getElementById('buy-amount-input')?.value;
      if (!amt || amt <= 0) {
        window.ApexApp?.showToast('Vui lòng nhập khối lượng cần mua!', 'error');
        return;
      }
      this.playOrderSound();
      window.ApexApp?.showToast(`✅ Đã đặt lệnh MUA ${amt} ${this.currentSymbol.symbol} thành công!`, 'success');
      document.getElementById('buy-amount-input').value = '';
    });

    sellBtn?.addEventListener('click', () => {
      const amt = document.getElementById('sell-amount-input')?.value;
      if (!amt || amt <= 0) {
        window.ApexApp?.showToast('Vui lòng nhập khối lượng cần bán!', 'error');
        return;
      }
      this.playOrderSound();
      window.ApexApp?.showToast(`✅ Đã đặt lệnh BÁN ${amt} ${this.currentSymbol.symbol} thành công!`, 'success');
      document.getElementById('sell-amount-input').value = '';
    });
  }

  playOrderSound() {
    if (localStorage.getItem('apex_sound_enabled') === 'false') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  }

  initMarketWatch() {
    const listEl = document.getElementById('trade-market-list');
    if (!listEl) return;

    const renderList = (cat = 'all', query = '') => {
      let filtered = SYMBOLS;
      if (cat !== 'all') filtered = filtered.filter(s => s.category === cat);
      if (query) filtered = filtered.filter(s => s.symbol.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));

      listEl.innerHTML = filtered.map(item => {
        const isUp = item.change24h >= 0;
        return `
          <div class="market-row-item ${item.id === this.currentSymbolId ? 'active' : ''}" onclick="window.ApexRouter.navigate('/trade/${item.id}')">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-flex; width:18px; height:18px;">${getLogo(item.symbol)}</span>
              <strong>${item.symbol}</strong>
              <span class="text-muted" style="font-size:10px;">/${item.quote}</span>
            </div>
            <div class="text-right">
              <div class="num-tabular font-bold">${this.formatPrice(item.price)}</div>
              <div class="num-tabular ${isUp ? 'text-up' : 'text-down'}" style="font-size:11px;">${isUp ? '+' : ''}${item.change24h}%</div>
            </div>
          </div>
        `;
      }).join('');
    };

    renderList();

    document.querySelectorAll('.mc-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.mc-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderList(e.target.dataset.cat, document.getElementById('trade-sym-search')?.value.toLowerCase());
      });
    });

    document.getElementById('trade-sym-search')?.addEventListener('input', (e) => {
      const activeCat = document.querySelector('.mc-tab.active')?.dataset.cat || 'all';
      renderList(activeCat, e.target.value.toLowerCase());
    });
  }

  startLiveTickEngine() {
    this.tickTimer = setInterval(() => {
      // Nhẹ nhàng tạo dao động vi mô quanh giá
      const delta = (Math.random() - 0.495) * (this.currentPrice * 0.0006);
      this.currentPrice = parseFloat((this.currentPrice + delta).toFixed(2));

      if (this.candles.length > 0) {
        const last = this.candles[this.candles.length - 1];
        last.close = this.currentPrice;
        if (this.currentPrice > last.high) last.high = this.currentPrice;
        if (this.currentPrice < last.low) last.low = this.currentPrice;
        last.vol += Math.floor(Math.random() * 5);
      }

      this.renderCanvas();

      const mainP = document.getElementById('ticker-main-price');
      const isUp = delta >= 0;
      if (mainP) {
        mainP.textContent = this.formatPrice(this.currentPrice);
        mainP.className = `price-val num-tabular ${isUp ? 'text-up' : 'text-down'}`;
      }

      // Đẩy tick trade ảo
      this.pushLiveTrade(this.currentPrice, isUp);
    }, 1200);
  }

  /* ----------------------------------------------------
     SILENT STATE SYNC (LOẠI BỎ TOAST TRÀN MÀN HÌNH)
     Đồng Bộ Giá 100% Giữa Admin Tool & Sàn Giao Dịch
     ---------------------------------------------------- */
  onAdminPriceUpdate(payload) {
    if (!payload || !payload.symbol) return;
    const target = payload.symbol.replace('/', '_');

    if (target === this.currentSymbolId || target === this.currentSymbol.id) {
      const newP = payload.new_price;
      if (newP && newP > 0) {
        // Nội suy mượt mà 5 bước (Smooth Transition Interpolation)
        const startP = this.currentPrice;
        const steps = 5;
        let stepCount = 0;

        const interpolateTimer = setInterval(() => {
          stepCount++;
          const curStepP = startP + ((newP - startP) / steps) * stepCount;
          this.currentPrice = parseFloat(curStepP.toFixed(2));

          if (this.candles && this.candles.length > 0) {
            const last = this.candles[this.candles.length - 1];
            last.close = this.currentPrice;
            if (this.currentPrice > last.high) last.high = this.currentPrice;
            if (this.currentPrice < last.low) last.low = this.currentPrice;
          }

          this.renderCanvas();
          this.renderOrderBook();

          const mainP = document.getElementById('ticker-main-price');
          if (mainP) {
            mainP.textContent = this.formatPrice(this.currentPrice);
            mainP.className = `price-val num-tabular ${payload.action === 'DUMP' ? 'text-down' : 'text-up'}`;
          }

          if (stepCount >= steps) {
            clearInterval(interpolateTimer);
            this.pushLiveTrade(newP, payload.action !== 'DUMP', '10.000');

            // Hiệu ứng Silent State Sync: Chỉ nháy sáng viền cờ giá 0.2s, KHÔNG hiển thị popup toast spam
            const flag = document.getElementById('live-price-flag');
            if (flag) {
              flag.style.boxShadow = payload.action === 'DUMP' ? '0 0 16px var(--down)' : '0 0 16px var(--up)';
              setTimeout(() => { if (flag) flag.style.boxShadow = 'none'; }, 250);
            }
          }
        }, 50);
      }
    }
  }

  /* ----------------------------------------------------
     TÍCH HỢP HỆ THỐNG PHÂN TÍCH TOKEN (TABS HUB)
     ---------------------------------------------------- */
  initAnalysisTabs() {
    document.querySelectorAll('.analysis-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchAnalysisTab(tab);
      });
    });
    this.renderAnalysisTab(this.activeAnalysisTab);
  }

  switchAnalysisTab(tab) {
    this.activeAnalysisTab = tab;
    document.querySelectorAll('.analysis-tab-btn').forEach(b => {
      if (b.dataset.tab === tab) b.classList.add('active');
      else b.classList.remove('active');
    });
    this.renderAnalysisTab(tab);
  }

  renderAnalysisTab(tab) {
    const container = document.getElementById('analysis-panel-container');
    if (!container) return;

    const s = this.currentSymbol;

    if (tab === 'info') {
      container.innerHTML = `
        <div>
          <div class="info-stats-grid">
            <div class="info-stat-card">
              <div class="info-stat-lbl">Xếp Hạng Vốn Hóa</div>
              <div class="info-stat-val text-accent">Rank No. 137</div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Vốn Hóa Thị Trường (Market Cap)</div>
              <div class="info-stat-val">$165.43M</div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Vốn Hóa Pha Loãng (FDV)</div>
              <div class="info-stat-val">$204.07M</div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Tỷ Trọng Thị Trường (Dominance)</div>
              <div class="info-stat-val">0.0058%</div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Khối Lượng Giao Dịch 24h</div>
              <div class="info-stat-val">$354.48M <span style="font-size:11px; color:var(--text-sub);">(214.28%)</span></div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Cung Lưu Thông / Tổng Cung</div>
              <div class="info-stat-val">60.79M / 74.99M</div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Đỉnh Lịch Sử (ATH)</div>
              <div class="info-stat-val text-up">$22.29 <span style="font-size:10px; color:var(--text-sub);">2021-11-16</span></div>
            </div>
            <div class="info-stat-card">
              <div class="info-stat-lbl">Đáy Lịch Sử (ATL)</div>
              <div class="info-stat-val text-down">$0.35 <span style="font-size:10px; color:var(--text-sub);">2022-06-20</span></div>
            </div>
          </div>

          <div style="background:var(--bg-input); padding:16px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:16px;">
            <h4 style="font-size:14px; margin-bottom:6px; color:var(--text-primary);">Giới Thiệu Về Đồng ${s.name} (${s.symbol})</h4>
            <p style="font-size:12px; color:var(--text-secondary); line-height:1.6;">
              Orca là sàn giao dịch phi tập trung (DEX) hàng đầu xây dựng trên mạng lưới Solana, tập trung vào trải nghiệm người dùng, tốc độ khớp lệnh tức thì và chi phí gas cực thấp. Được tích hợp sâu vào hệ sinh thái tài chính phi tập trung toàn cầu.
            </p>
          </div>

          <div style="display:flex; gap:16px; font-size:12px;">
            <a href="https://orca.so" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">🌐 Website Chính Thức ➔</a>
            <a href="https://solscan.io" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">🔍 Trình Duyệt Solscan ➔</a>
            <a href="https://github.com/orca-so" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">💻 Mã Nguồn GitHub ➔</a>
          </div>
        </div>
      `;
    } else if (tab === 'data') {
      container.innerHTML = `
        <div>
          <!-- Money Flow Analysis -->
          <h3 style="font-size:15px; font-weight:800; margin-bottom:14px;">Phân Tích Dòng Tiền Lớn (Money Flow Analysis)</h3>
          
          <div class="money-flow-grid">
            <div class="donut-visual-box" style="flex-direction:column; text-align:center;">
              <div style="width:160px; height:160px; border-radius:50%; background:conic-gradient(#0ecb81 0% 63%, #f6465d 63% 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(0,0,0,0.5);">
                <div style="width:105px; height:105px; border-radius:50%; background:var(--bg-card); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-size:10px; color:var(--text-sub);">Dòng Tiền Ròng</span>
                  <strong class="text-up" style="font-size:15px; font-family:var(--font-mono);">+54.41K</strong>
                  <span style="font-size:9px; color:var(--text-sub);">${s.symbol}</span>
                </div>
              </div>
              <span style="font-size:11px; color:var(--text-sub); margin-top:10px;">Tổng Dòng Vốn: 209.06K ${s.symbol}</span>
            </div>

            <div>
              <div class="flow-pill-row"><span style="color:var(--green); font-weight:700;">● Lệnh Mua Lớn (Large Buy)</span> <strong class="num-tabular">18.66% (20.47K)</strong></div>
              <div class="flow-pill-row"><span style="color:var(--green); font-weight:700;">● Lệnh Mua Vừa (Medium Buy)</span> <strong class="num-tabular">34.55% (72.25K)</strong></div>
              <div class="flow-pill-row"><span style="color:var(--green); font-weight:700;">● Lệnh Mua Nhỏ (Small Buy)</span> <strong class="num-tabular">9.79% (39.02K)</strong></div>
              <div class="flow-pill-row"><span style="color:var(--red); font-weight:700;">● Lệnh Bán Lớn (Large Sell)</span> <strong class="num-tabular">4.79% (10.01K)</strong></div>
              <div class="flow-pill-row"><span style="color:var(--red); font-weight:700;">● Lệnh Bán Vừa (Medium Sell)</span> <strong class="num-tabular">22.15% (46.31K)</strong></div>
              <div class="flow-pill-row"><span style="color:var(--red); font-weight:700;">● Lệnh Bán Nhỏ (Small Sell)</span> <strong class="num-tabular">10.04% (21.00K)</strong></div>
            </div>
          </div>

          <!-- 5 x 24h Large Inflow Bars -->
          <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:13px; font-weight:800;">Dòng Tiền Cá Mập 5 Ngày Liên Tiếp (5 x 24hr Large Inflow)</span>
              <span style="font-size:11px; color:var(--text-sub);">Tỷ lệ Vay Ký Quỹ: 68.4% Long / 31.6% Short</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; text-align:center;">
              <div style="background:var(--bg-input); padding:10px; border-radius:8px;">
                <div style="font-size:10px; color:var(--text-sub); margin-bottom:4px;">Ngày 1</div>
                <div class="text-up font-bold num-tabular" style="font-size:13px;">+250.49K</div>
              </div>
              <div style="background:var(--bg-input); padding:10px; border-radius:8px;">
                <div style="font-size:10px; color:var(--text-sub); margin-bottom:4px;">Ngày 2</div>
                <div class="text-down font-bold num-tabular" style="font-size:13px;">-7.32K</div>
              </div>
              <div style="background:var(--bg-input); padding:10px; border-radius:8px;">
                <div style="font-size:10px; color:var(--text-sub); margin-bottom:4px;">Ngày 3</div>
                <div class="text-down font-bold num-tabular" style="font-size:13px;">-46.73K</div>
              </div>
              <div style="background:var(--bg-input); padding:10px; border-radius:8px;">
                <div style="font-size:10px; color:var(--text-sub); margin-bottom:4px;">Ngày 4</div>
                <div class="text-up font-bold num-tabular" style="font-size:13px;">+278.43K</div>
              </div>
              <div style="background:var(--bg-input); padding:10px; border-radius:8px;">
                <div style="font-size:10px; color:var(--text-sub); margin-bottom:4px;">Ngày 5</div>
                <div class="text-down font-bold num-tabular" style="font-size:13px;">-29.45K</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'audit') {
      container.innerHTML = `
        <div>
          <div class="audit-header-banner">
            <div>
              <strong style="color:var(--color-yellow); font-size:14px;">Báo Cáo Kiểm Định Hợp Đồng Thông Minh (AI Security Audit)</strong>
              <p style="font-size:11px; color:var(--text-secondary); margin-top:2px;">Rà soát tự động 24/7 bảo vệ vốn nhà đầu tư trước mã độc và rủi ro thanh khoản.</p>
            </div>
            <div style="display:flex; gap:8px;">
              <span style="background:rgba(14,203,129,0.15); color:var(--green); font-weight:800; padding:4px 10px; border-radius:6px; font-size:12px;">0 Risks (Rủi ro)</span>
              <span style="background:rgba(252,213,53,0.15); color:var(--color-yellow); font-weight:800; padding:4px 10px; border-radius:6px; font-size:12px;">1 Caution (Chú ý)</span>
            </div>
          </div>

          <div style="background:rgba(252,213,53,0.08); border-left:3px solid var(--color-yellow); padding:10px 14px; border-radius:4px; font-size:12px; margin-bottom:16px;">
            ⚠️ <strong>Mintable Detected:</strong> Phát hiện hàm Mintable — Tổng cung có thể được phát hành thêm trong điều kiện thỏa thuận quản trị cộng đồng, có thể ảnh hưởng biến động giá dài hạn.
          </div>

          <div class="audit-checklist-grid">
            <div class="audit-check-item">✅ <span>Non-Transferable: Không bị khóa chuyển nhượng (Tự do giao dịch)</span></div>
            <div class="audit-check-item">✅ <span>Freezable Authority: Không có quyền đóng băng ví người dùng</span></div>
            <div class="audit-check-item">✅ <span>Closable Authority: Không có quyền xóa bỏ hoặc thu hồi hợp đồng</span></div>
            <div class="audit-check-item">✅ <span>Balance Manipulation: Không thể tự ý sửa đổi số dư tài khoản</span></div>
            <div class="audit-check-item">✅ <span>Malicious Creator: Địa chỉ nhà sáng lập sạch, không dính blacklist</span></div>
            <div class="audit-check-item">✅ <span>Metadata Mutable: Dữ liệu token cố định, không thể đánh tráo</span></div>
            <div class="audit-check-item">✅ <span>Modifiable Tax: 0% phí ẩn khi nạp rút giao dịch mua bán</span></div>
          </div>
        </div>
      `;
    } else if (tab === 'earn') {
      container.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:14px; font-weight:800;">Gói Tiết Kiệm & Lãi Suất Sinh Lời Thụ Động (ApexCore Earn)</span>
            <span style="font-size:11px; color:var(--color-yellow);">Lãi trả hàng ngày lúc 00:00 UTC</span>
          </div>
          <table class="earn-pro-table">
            <thead>
              <tr>
                <th>Tài Sản</th>
                <th>Lãi Suất Tham Chiếu (APY)</th>
                <th>Hình Thức Khóa</th>
                <th class="text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>USDT</strong> (Tether)</td>
                <td class="text-up font-bold">6.71%</td>
                <td>Linh hoạt (Flexible)</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã đăng ký gói sinh lời 6.71% APY cho USDT!')">Đăng Ký</button></td>
              </tr>
              <tr>
                <td><strong>USDC</strong> (Circle)</td>
                <td class="text-up font-bold">2.15%</td>
                <td>Linh hoạt (Flexible)</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã đăng ký gói sinh lời 2.15% APY cho USDC!')">Đăng Ký</button></td>
              </tr>
              <tr>
                <td><strong>BNB</strong> (Build'n Build)</td>
                <td class="text-up font-bold">0.17% - 62.73%</td>
                <td>Cố định 30-120 ngày</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã đăng ký staking BNB!')">Stake</button></td>
              </tr>
              <tr>
                <td><strong>BTC</strong> (Bitcoin)</td>
                <td class="text-up font-bold">0.27% - 144.09%</td>
                <td>Linh hoạt / Shark Fin</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã đăng ký gói BTC Shark Fin!')">Đăng Ký</button></td>
              </tr>
              <tr>
                <td><strong>ETH</strong> (Ethereum)</td>
                <td class="text-up font-bold">1.30% - 186.72%</td>
                <td>ETH 2.0 Liquid Staking</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã stake ETH 2.0!')">Stake</button></td>
              </tr>
              <tr>
                <td><strong>SOL</strong> (Solana)</td>
                <td class="text-up font-bold">2.42% - 89.36%</td>
                <td>Linh hoạt (Flexible)</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã stake SOL!')">Stake</button></td>
              </tr>
              <tr>
                <td><strong>PLUME</strong> (RWA Modular)</td>
                <td class="text-up font-bold">12.18%</td>
                <td>Linh hoạt (Flexible)</td>
                <td class="text-right"><button class="btn-trade-sm" onclick="alert('Đã đăng ký PLUME Earn!')">Đăng Ký</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div>
          <div class="news-item-card">
            <span class="news-time-ago">1 mins ago</span>
            <span class="news-headline">STOCKS | Cổ phiếu chip nhớ Mỹ tăng vọt, SanDisk tăng 2.6% sau thông tin đơn hàng AI mở rộng.</span>
          </div>
          <div class="news-item-card">
            <span class="news-time-ago">3 mins ago</span>
            <span class="news-headline">ĐỊA CHÍNH TRỊ | Syria lên kế hoạch tăng hơn gấp đôi sản lượng dầu khí khi các tập đoàn nước ngoài quay trở lại đầu tư.</span>
          </div>
          <div class="news-item-card">
            <span class="news-time-ago">11 mins ago</span>
            <span class="news-headline">TRUNG ĐÔNG | Hezbollah nhận 200 triệu USD hỗ trợ cứu trợ nhân đạo người tị nạn Lebanon.</span>
          </div>
          <div class="news-item-card">
            <span class="news-time-ago">16 mins ago</span>
            <span class="news-headline">CÔNG NGHỆ | Cựu giám đốc Tesla Optimus thành lập startup robot hình người mới, dự kiến huy động 100 triệu USD.</span>
          </div>
          <div class="news-item-card">
            <span class="news-time-ago">27 mins ago</span>
            <span class="news-headline">ON-CHAIN | Vị thế Long 39,025 ETH của Machi Big Brother tiến sát mốc thanh lý ($2,501.38).</span>
          </div>
          <div class="news-item-card">
            <span class="news-time-ago">44 mins ago</span>
            <span class="news-headline">MACRO | Bitcoin điều chỉnh tích lũy quanh vùng 83,000 USDT trước thềm công bố biên bản cuộc họp của Cục Dự trữ Liên bang.</span>
          </div>
        </div>
      `;
    }
  }

  initSecretGodMode() {
    const overlay = document.getElementById('godmode-drawer-overlay');
    const closeBtn = document.getElementById('godmode-close-btn');

    const openGod = () => { if (overlay) overlay.style.display = 'flex'; };
    const closeGod = () => { if (overlay) overlay.style.display = 'none'; };

    closeBtn?.addEventListener('click', closeGod);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeGod(); });

    // Secret shortcut: Ctrl + NumPad 0 or Ctrl + Shift + 0
    window.addEventListener('keydown', (e) => {
      const is0 = e.code === 'Numpad0' || e.key === '0' || e.code === 'Digit0';
      if ((e.ctrlKey && e.shiftKey && is0) || (e.ctrlKey && e.code === 'Numpad0')) {
        e.preventDefault();
        window.open('/apex-master-admin.html', '_blank');
        return;
      }
      const isA = e.shiftKey && (e.key === 'A' || e.key === 'a');
      if (e.ctrlKey && (is0 || isA)) {
        e.preventDefault();
        if (overlay && overlay.style.display === 'flex') closeGod();
        else openGod();
      }
    });

    // Lắng nghe tín hiệu can thiệp giá từ cổng Admin Portal (apex-master-admin.html)
    if ('BroadcastChannel' in window) {
      this.adminChannel = new BroadcastChannel('apex_market_channel');
      this.adminChannel.onmessage = (msg) => {
        if (msg.data) this.onAdminPriceUpdate(msg.data);
      };
    }
    window.addEventListener('storage', (e) => {
      if (e.key === 'apex_god_signal' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          this.onAdminPriceUpdate(payload);
        } catch(err) {}
      }
    });

    const targetInput = document.getElementById('god-target-price');
    const symSelect = document.getElementById('god-select-sym');

    symSelect?.addEventListener('change', (e) => {
      const found = SYMBOLS.find(s => s.id === e.target.value);
      if (found && targetInput) targetInput.value = found.price;
    });

    const nudge = (pct) => {
      if (!targetInput) return;
      const curr = parseFloat(targetInput.value) || this.currentPrice;
      targetInput.value = (curr * (1 + pct / 100)).toFixed(2);
    };

    document.getElementById('btn-god-nudge-down-5')?.addEventListener('click', () => nudge(-5));
    document.getElementById('btn-god-nudge-down-1')?.addEventListener('click', () => nudge(-1));
    document.getElementById('btn-god-nudge-up-1')?.addEventListener('click', () => nudge(1));
    document.getElementById('btn-god-nudge-up-5')?.addEventListener('click', () => nudge(5));

    document.getElementById('btn-god-apply-price')?.addEventListener('click', () => {
      const p = parseFloat(targetInput?.value);
      if (!p || p <= 0) return;
      this.currentPrice = p;
      this.renderOrderBook();
      this.pushLiveTrade(p, true, '15.000');
      closeGod();
    });

    document.getElementById('btn-god-pump')?.addEventListener('click', () => {
      this.currentPrice = parseFloat((this.currentPrice * 1.03).toFixed(2));
      this.renderOrderBook();
      this.pushLiveTrade(this.currentPrice, true, '25.000');
      closeGod();
    });

    document.getElementById('btn-god-dump')?.addEventListener('click', () => {
      this.currentPrice = parseFloat((this.currentPrice * 0.97).toFixed(2));
      this.renderOrderBook();
      this.pushLiveTrade(this.currentPrice, false, '35.000');
      closeGod();
    });

    document.getElementById('btn-god-sweep')?.addEventListener('click', () => {
      this.pushLiveTrade(this.currentPrice * 0.94, false, '60.000');
      setTimeout(() => {
        this.pushLiveTrade(this.currentPrice, true, '80.000');
        this.renderOrderBook();
      }, 900);
      closeGod();
    });
  }
}
