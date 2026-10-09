/* ========================================================
   APEXCORE PRO EXCHANGE — MASTER CONTROLLER (app.js)
   Chuẩn Thiết Kế: Binance Pro Terminal Benchmark
   Owner & Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   Ultra-Minimalist Zero-Distraction + Full Dark/Light Theme
   ======================================================== */

import { SiteConfig } from '../config/site-config.js';
import { MarketData, getAssetLogo } from '../config/market-symbols.js';
import { CandleChartEngine } from './chart-engine.js';

class ApexCoreApp {
  constructor() {
    this.chartEngine = null;
    this.activeTab = 'home';
    this.currentSymbol = 'BNB';
    this.currentPair = 'BNB/USDT';
    this.currentPrice = 780.35;
    this.currentCategory = 'crypto';
    this.marketFilter = 'all';

    // Account Balances
    this.userBalanceUSDT = 12458.32;
    this.userBalanceBNB = 18.50;
    this.currentUser = null;

    // Automation Engines
    this.autoWaveInterval = null;
    this.botRunnerInterval = null;
    this.isBotRunning = true;
    this.botSpeed = 15;

    this.init();
  }

  init() {
    this.initThemeToggle();
    this.initSpaTabs();
    this.initHomeWatchlist();
    this.initMarketsTab();
    this.initProTerminalCockpit();
    this.initAutoMarketWavesEngine();
    this.initSecretGodMode();
    this.initFuturesCockpit();
    this.initEarnTab();
    this.initWalletFeatures();
    this.initUniversalAuthAndGoogleChooser();
    this.initLanguageSwitch();
    this.checkStoredUserSession();

    // Init Candlestick Engine
    try {
      this.chartEngine = new CandleChartEngine('apex-candle-canvas');
      if (this.chartEngine) {
        this.chartEngine.setSymbol('BNB/USDT', 780.35);
      }
    } catch (e) {
      console.warn('CandleChartEngine init warning:', e);
    }
  }

  /* ----------------------------------------------------
     1. THEME TOGGLE (DARK / LIGHT MODE ZERO-DISTRACTION)
     ---------------------------------------------------- */
  initThemeToggle() {
    const toggleBtn = document.getElementById('btn-theme-toggle');
    const sunIcon = toggleBtn?.querySelector('.theme-icon-sun');
    const moonIcon = toggleBtn?.querySelector('.theme-icon-moon');

    const savedTheme = localStorage.getItem('apex_theme') || 'dark';
    this.applyTheme(savedTheme, sunIcon, moonIcon);

    toggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next, sunIcon, moonIcon);
      localStorage.setItem('apex_theme', next);
    });
  }

  applyTheme(theme, sunIcon, moonIcon) {
    document.documentElement.setAttribute('data-theme', theme);
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  /* ----------------------------------------------------
     2. SPA TAB CONTROLLER (7 TABS ĐỘC LẬP TỨC THÌ)
     ---------------------------------------------------- */
  initSpaTabs() {
    document.querySelectorAll('.spa-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        if (tab) this.switchSpaTab(tab);
      });
    });

    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'markets', 'trade', 'futures', 'earn', 'square', 'wallet'];
    if (validTabs.includes(hash)) {
      this.switchSpaTab(hash);
    }
  }

  switchSpaTab(tabName) {
    this.activeTab = tabName;
    window.location.hash = tabName;

    const allTabs = ['home', 'markets', 'trade', 'futures', 'earn', 'square', 'wallet'];
    allTabs.forEach(name => {
      const pane = document.getElementById(`tab-view-${name}`);
      if (pane) {
        if (name === tabName) {
          pane.classList.add('active');
          pane.style.display = 'block';
        } else {
          pane.classList.remove('active');
          pane.style.display = 'none';
        }
      }
    });

    // Update active tab buttons in header navbar
    document.querySelectorAll('.spa-nav-link').forEach(link => {
      if (link.getAttribute('data-tab') === tabName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (tabName === 'trade') {
      setTimeout(() => {
        if (this.chartEngine) this.chartEngine.resizeCanvas();
      }, 50);
    } else if (tabName === 'markets') {
      this.renderMarketsTable();
    } else if (tabName === 'wallet') {
      this.renderWalletTable();
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  selectSymbolAndTrade(symbol) {
    this.switchSpaTab('trade');
    this.selectSymbol(symbol);
  }

  /* ----------------------------------------------------
     3. TAB 1: HOME TOP WATCHLIST WITH VECTOR LOGOS
     ---------------------------------------------------- */
  initHomeWatchlist() {
    const tbody = document.getElementById('home-top-watchlist-tbody');
    if (!tbody) return;

    const featured = [
      MarketData.crypto.find(c => c.symbol === 'BNB'),
      MarketData.crypto.find(c => c.symbol === 'BTC'),
      MarketData.crypto.find(c => c.symbol === 'ETH'),
      MarketData.crypto.find(c => c.symbol === 'SOL'),
      MarketData.stocks.find(s => s.symbol === 'FPT'),
      MarketData.stocks.find(s => s.symbol === 'VFS'),
      MarketData.stocks.find(s => s.symbol === 'AAPL'),
      MarketData.forex.find(f => f.symbol === 'XAU/USD')
    ].filter(Boolean);

    tbody.innerHTML = featured.map(item => {
      const isUp = item.change24h >= 0;
      const changeClass = isUp ? 'text-buy' : 'text-sell';
      const changeSign = isUp ? '+' : '';
      const priceDecimals = item.price < 1 ? 4 : 2;
      const formattedPrice = item.price.toLocaleString('en-US', {
        minimumFractionDigits: priceDecimals,
        maximumFractionDigits: priceDecimals
      });

      return `
        <tr>
          <td>
            <div class="table-asset-badge">
              <span class="asset-vector-logo">${getAssetLogo(item.symbol)}</span>
              <div>
                <strong>${item.symbol}</strong>
                <span class="text-muted" style="font-size:0.75rem;">/${item.quote || 'USDT'}</span>
              </div>
            </div>
          </td>
          <td class="text-secondary">${item.name}</td>
          <td class="text-right num-tabular font-bold">$${formattedPrice}</td>
          <td class="text-right num-tabular ${changeClass}">${changeSign}${item.change24h}%</td>
          <td class="text-right num-tabular text-secondary">${item.volume24h}</td>
          <td class="text-center">
            <button class="btn-trade-sm" onclick="window.ApexApp.selectSymbolAndTrade('${item.symbol}')">Giao Dịch</button>
          </td>
        </tr>
      `;
    }).join('');

    // Quick Google CTA on Home
    document.getElementById('hero-btn-quick-google')?.addEventListener('click', () => {
      this.openGoogleChooser();
    });
  }

  /* ----------------------------------------------------
     4. TAB 2: MARKETS SCANNER (BINANCE PRO STYLE)
     ---------------------------------------------------- */
  initMarketsTab() {
    // Filter Pills
    document.querySelectorAll('.mfilter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.mfilter-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.marketFilter = e.currentTarget.getAttribute('data-filter') || 'all';
        this.renderMarketsTable();
      });
    });

    // Search Input
    document.getElementById('markets-search-input')?.addEventListener('input', () => {
      this.renderMarketsTable();
    });

    this.renderMarketsHighlightCards();
    this.renderMarketsTable();
  }

  renderMarketsHighlightCards() {
    const hotList = document.getElementById('m-hot-list');
    const gainersList = document.getElementById('m-gainers-list');
    const volList = document.getElementById('m-vol-list');
    const newList = document.getElementById('m-new-list');

    const all = [...MarketData.crypto, ...MarketData.stocks, ...MarketData.forex];

    // Hot
    if (hotList) {
      const items = [all[0], all[1], all[2]]; // BNB, BTC, ETH
      hotList.innerHTML = items.map(i => this.renderMiniListRow(i)).join('');
    }

    // Top Gainers
    if (gainersList) {
      const sortedGainers = [...all].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
      gainersList.innerHTML = sortedGainers.map(i => this.renderMiniListRow(i)).join('');
    }

    // Top Volume
    if (volList) {
      const items = [all[1], all[0], all[3]]; // BTC, BNB, SOL
      volList.innerHTML = items.map(i => this.renderMiniListRow(i)).join('');
    }

    // New Listing
    if (newList) {
      const items = [MarketData.stocks[1], MarketData.stocks[0], MarketData.crypto[3]]; // VFS, FPT, SOL
      newList.innerHTML = items.map(i => this.renderMiniListRow(i)).join('');
    }
  }

  renderMiniListRow(item) {
    const isUp = item.change24h >= 0;
    const changeClass = isUp ? 'text-buy' : 'text-sell';
    const changeSign = isUp ? '+' : '';
    const formattedPrice = item.price.toLocaleString('en-US', { minimumFractionDigits: item.price < 1 ? 4 : 2 });

    return `
      <div class="m-list-row" onclick="window.ApexApp.selectSymbolAndTrade('${item.symbol}')">
        <div class="m-row-left">
          <span class="asset-vector-logo" style="width:18px;height:18px;">${getAssetLogo(item.symbol)}</span>
          <strong>${item.symbol}</strong>
        </div>
        <div>
          <span class="num-tabular" style="font-size:0.78rem; margin-right:8px;">$${formattedPrice}</span>
          <span class="num-tabular ${changeClass}" style="font-weight:700;">${changeSign}${item.change24h}%</span>
        </div>
      </div>
    `;
  }

  renderMarketsTable() {
    const tbody = document.getElementById('markets-tbody');
    if (!tbody) return;

    let items = [];
    if (this.marketFilter === 'all') {
      items = [...MarketData.crypto, ...MarketData.stocks, ...MarketData.forex, ...MarketData.indices];
    } else {
      items = MarketData[this.marketFilter] || [];
    }

    const query = (document.getElementById('markets-search-input')?.value || '').toLowerCase().trim();
    if (query) {
      items = items.filter(i => i.symbol.toLowerCase().includes(query) || i.name.toLowerCase().includes(query));
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 24px; color: var(--text-muted);">Không tìm thấy mã phù hợp với "${query}"</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const isUp = item.change24h >= 0;
      const changeClass = isUp ? 'text-buy' : 'text-sell';
      const changeSign = isUp ? '+' : '';
      const priceDecimals = item.price < 1 ? 4 : 2;
      const formattedPrice = item.price.toLocaleString('en-US', {
        minimumFractionDigits: priceDecimals,
        maximumFractionDigits: priceDecimals
      });
      const highP = (item.high24h || item.price * 1.02).toLocaleString('en-US', { minimumFractionDigits: priceDecimals });
      const lowP = (item.low24h || item.price * 0.98).toLocaleString('en-US', { minimumFractionDigits: priceDecimals });

      return `
        <tr>
          <td>
            <div class="table-asset-badge">
              <span class="asset-vector-logo">${getAssetLogo(item.symbol)}</span>
              <div>
                <strong>${item.symbol}</strong>
                <span class="text-muted" style="font-size:0.75rem;">/${item.quote || 'USDT'}</span>
              </div>
            </div>
          </td>
          <td class="text-secondary">${item.name}</td>
          <td class="text-right num-tabular font-bold">$${formattedPrice}</td>
          <td class="text-right num-tabular ${changeClass}">${changeSign}${item.change24h}%</td>
          <td class="text-right num-tabular text-secondary">${highP}</td>
          <td class="text-right num-tabular text-secondary">${lowP}</td>
          <td class="text-right num-tabular text-secondary">${item.volume24h}</td>
          <td class="text-center">
            <button class="btn-trade-sm" onclick="window.ApexApp.selectSymbolAndTrade('${item.symbol}')">Giao Dịch</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* ----------------------------------------------------
     5. TAB 3: PRO TERMINAL COCKPIT (BINANCE BENCHMARK 100%)
     ---------------------------------------------------- */
  initProTerminalCockpit() {
    this.renderOrderBook();
    this.renderRightMarketList();
    this.initLiveTradesStream();
    this.initDualOrderForm();

    // Favorite button
    document.getElementById('btn-toggle-fav')?.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
    });

    // Timeframe buttons
    document.querySelectorAll('.tf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        if (this.chartEngine) this.chartEngine.initData();
      });
    });

    // Chart mode buttons
    document.querySelectorAll('.cv-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cv-mode-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Orderbook filter buttons
    document.querySelectorAll('.ob-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.ob-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const view = e.currentTarget.getAttribute('data-view');
        const asks = document.getElementById('ob-asks-list');
        const bids = document.getElementById('ob-bids-list');
        if (view === 'buy') {
          if (asks) asks.style.display = 'none';
          if (bids) bids.style.display = 'flex';
        } else if (view === 'sell') {
          if (asks) asks.style.display = 'flex';
          if (bids) bids.style.display = 'none';
        } else {
          if (asks) asks.style.display = 'flex';
          if (bids) bids.style.display = 'flex';
        }
      });
    });
  }

  renderOrderBook() {
    const asksEl = document.getElementById('ob-asks-list');
    const bidsEl = document.getElementById('ob-bids-list');
    if (!asksEl || !bidsEl) return;

    const basePrice = this.currentPrice;
    const step = basePrice < 1 ? 0.0001 : 0.05;

    // 15 Asks (Red) descending
    let asksHtml = '';
    let totalAsk = 0;
    for (let i = 15; i >= 1; i--) {
      const price = basePrice + i * step;
      const amount = (Math.random() * 4.5 + 0.1).toFixed(3);
      totalAsk += parseFloat(amount);
      const depthPct = Math.min(100, Math.round((amount / 5) * 100));

      asksHtml += `
        <div class="ob-row ask-row" onclick="window.ApexApp.fillOrderPrice(${price.toFixed(2)})">
          <div class="ob-depth-bar" style="width: ${depthPct}%;"></div>
          <span class="num-tabular text-sell font-bold">${price.toFixed(2)}</span>
          <span class="num-tabular text-right">${amount}</span>
          <span class="num-tabular text-right text-muted">${totalAsk.toFixed(2)}</span>
        </div>
      `;
    }
    asksEl.innerHTML = asksHtml;

    // 15 Bids (Green) descending
    let bidsHtml = '';
    let totalBid = 0;
    for (let i = 1; i <= 15; i++) {
      const price = basePrice - i * step;
      const amount = (Math.random() * 4.5 + 0.1).toFixed(3);
      totalBid += parseFloat(amount);
      const depthPct = Math.min(100, Math.round((amount / 5) * 100));

      bidsHtml += `
        <div class="ob-row bid-row" onclick="window.ApexApp.fillOrderPrice(${price.toFixed(2)})">
          <div class="ob-depth-bar" style="width: ${depthPct}%;"></div>
          <span class="num-tabular text-buy font-bold">${price.toFixed(2)}</span>
          <span class="num-tabular text-right">${amount}</span>
          <span class="num-tabular text-right text-muted">${totalBid.toFixed(2)}</span>
        </div>
      `;
    }
    bidsEl.innerHTML = bidsHtml;
  }

  fillOrderPrice(price) {
    const buyP = document.getElementById('buy-order-price');
    const sellP = document.getElementById('sell-order-price');
    if (buyP) buyP.value = price;
    if (sellP) sellP.value = price;
  }

  renderRightMarketList() {
    const container = document.getElementById('terminal-market-list');
    const search = document.getElementById('terminal-sym-search');
    if (!container) return;

    let cat = 'all';
    document.querySelectorAll('.mc-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.mc-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        cat = e.currentTarget.getAttribute('data-mccat') || 'all';
        renderRows();
      });
    });

    search?.addEventListener('input', () => renderRows());

    const renderRows = () => {
      let items = [];
      if (cat === 'all') items = [...MarketData.crypto, ...MarketData.stocks, ...MarketData.forex];
      else items = MarketData[cat] || MarketData.crypto;

      const q = (search?.value || '').toLowerCase().trim();
      if (q) items = items.filter(i => i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));

      container.innerHTML = items.map(item => {
        const isUp = item.change24h >= 0;
        const changeClass = isUp ? 'text-buy' : 'text-sell';
        const changeSign = isUp ? '+' : '';
        const pFormatted = item.price.toLocaleString('en-US', { minimumFractionDigits: item.price < 1 ? 4 : 2 });

        return `
          <div class="market-compact-row ${item.symbol === this.currentSymbol ? 'active' : ''}" onclick="window.ApexApp.selectSymbol('${item.symbol}')">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="asset-vector-logo" style="width:16px;height:16px;">${getAssetLogo(item.symbol)}</span>
              <strong>${item.symbol}</strong>
            </div>
            <div style="display:flex; gap:8px;">
              <span class="num-tabular">$${pFormatted}</span>
              <span class="num-tabular ${changeClass}">${changeSign}${item.change24h}%</span>
            </div>
          </div>
        `;
      }).join('');
    };

    renderRows();
  }

  selectSymbol(symbol) {
    this.currentSymbol = symbol;
    const all = [...MarketData.crypto, ...MarketData.stocks, ...MarketData.forex, ...MarketData.indices];
    const found = all.find(s => s.symbol === symbol);

    if (found) {
      this.currentPrice = found.price;
      this.currentPair = `${found.symbol}/${found.quote || 'USDT'}`;

      // Update Ticker Bar
      const pairNameEl = document.getElementById('ticker-pair-name');
      if (pairNameEl) pairNameEl.textContent = this.currentPair;

      const mainPriceEl = document.getElementById('ticker-main-price');
      if (mainPriceEl) mainPriceEl.textContent = found.price.toLocaleString('en-US', { minimumFractionDigits: found.price < 1 ? 4 : 2 });

      const usdEquiv = document.getElementById('ticker-usd-equiv');
      if (usdEquiv) usdEquiv.textContent = `$${found.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      const changeVal = document.getElementById('ticker-change-val');
      if (changeVal) {
        changeVal.textContent = `${found.changeAmount || (found.change24h * found.price / 100).toFixed(2)} ${found.change24h >= 0 ? '+' : ''}${found.change24h}%`;
        changeVal.className = `metric-val num-tabular ${found.change24h >= 0 ? 'text-buy' : 'text-sell'}`;
      }

      const highEl = document.getElementById('ticker-high-val');
      if (highEl) highEl.textContent = (found.high24h || found.price * 1.02).toLocaleString('en-US');

      const lowEl = document.getElementById('ticker-low-val');
      if (lowEl) lowEl.textContent = (found.low24h || found.price * 0.98).toLocaleString('en-US');

      const volBase = document.getElementById('ticker-vol-base');
      if (volBase) volBase.textContent = found.volume24h;

      // Update Unit Badges on Order Pad
      const buyUnit = document.getElementById('buy-unit-badge');
      const sellUnit = document.getElementById('sell-unit-badge');
      if (buyUnit) buyUnit.textContent = found.symbol;
      if (sellUnit) sellUnit.textContent = found.symbol;

      const btnExecBuy = document.getElementById('btn-exec-buy');
      const btnExecSell = document.getElementById('btn-exec-sell');
      if (btnExecBuy) btnExecBuy.textContent = `MUA ${found.symbol}`;
      if (btnExecSell) btnExecSell.textContent = `BÁN ${found.symbol}`;

      // Update Order Form Price
      this.fillOrderPrice(found.price);

      // Update Order Book & Chart
      this.renderOrderBook();
      if (this.chartEngine) {
        this.chartEngine.setSymbol(this.currentPair, found.price);
      }
    }
  }

  initLiveTradesStream() {
    const stream = document.getElementById('market-trades-stream');
    if (!stream) return;

    const basePrice = this.currentPrice;
    let initialTicks = '';
    const now = new Date();

    for (let i = 15; i >= 0; i--) {
      const tickTime = new Date(now.getTime() - i * 1200);
      const timeStr = tickTime.toTimeString().split(' ')[0];
      const isBuy = Math.random() > 0.48;
      const delta = (Math.random() - 0.49) * 0.4;
      const price = (basePrice + delta).toFixed(2);
      const amount = (Math.random() * 2.2 + 0.01).toFixed(3);

      initialTicks += `
        <div class="trade-tick-row">
          <span class="num-tabular ${isBuy ? 'text-buy' : 'text-sell'} font-bold">${price}</span>
          <span class="num-tabular text-right">${amount}</span>
          <span class="num-tabular text-right text-muted">${timeStr}</span>
        </div>
      `;
    }
    stream.innerHTML = initialTicks;
  }

  emitLiveTradeTick(price, isBuy, amount = null) {
    const stream = document.getElementById('market-trades-stream');
    if (!stream) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const amt = amount || (Math.random() * 1.8 + 0.05).toFixed(3);

    const row = document.createElement('div');
    row.className = 'trade-tick-row';
    row.innerHTML = `
      <span class="num-tabular ${isBuy ? 'text-buy' : 'text-sell'} font-bold">${price.toFixed(2)}</span>
      <span class="num-tabular text-right">${amt}</span>
      <span class="num-tabular text-right text-muted">${timeStr}</span>
    `;

    stream.insertBefore(row, stream.firstChild);
    if (stream.children.length > 30) {
      stream.removeChild(stream.lastChild);
    }
  }

  initDualOrderForm() {
    // Mode tabs (Spot, Cross, Isolated, Grid)
    document.querySelectorAll('.op-mode-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.op-mode-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Type tabs (Limit, Market, Stop Limit)
    document.querySelectorAll('.op-type-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.op-type-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // BBO Buttons
    document.getElementById('btn-buy-bbo')?.addEventListener('click', () => {
      const p = (this.currentPrice * 1.0002).toFixed(2);
      const input = document.getElementById('buy-order-price');
      if (input) input.value = p;
    });

    document.getElementById('btn-sell-bbo')?.addEventListener('click', () => {
      const p = (this.currentPrice * 0.9998).toFixed(2);
      const input = document.getElementById('sell-order-price');
      if (input) input.value = p;
    });

    // Buy Slider & Amount Calculation
    const buySlider = document.getElementById('buy-order-range');
    const buyAmount = document.getElementById('buy-order-amount');
    const buyPrice = document.getElementById('buy-order-price');

    buySlider?.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      const p = parseFloat(buyPrice?.value) || this.currentPrice;
      const maxBnb = this.userBalanceUSDT / p;
      const bnbAmt = (maxBnb * pct) / 100;
      if (buyAmount) buyAmount.value = bnbAmt > 0 ? bnbAmt.toFixed(4) : '';
    });

    // Sell Slider & Amount Calculation
    const sellSlider = document.getElementById('sell-order-range');
    const sellAmount = document.getElementById('sell-order-amount');

    sellSlider?.addEventListener('input', (e) => {
      const pct = Number(e.target.value);
      const bnbAmt = (this.userBalanceBNB * pct) / 100;
      if (sellAmount) sellAmount.value = bnbAmt > 0 ? bnbAmt.toFixed(4) : '';
    });

    // Execute Buy Order
    document.getElementById('btn-exec-buy')?.addEventListener('click', () => {
      const amt = parseFloat(buyAmount?.value);
      const p = parseFloat(buyPrice?.value) || this.currentPrice;
      if (!amt || amt <= 0) {
        this.showToast('Vui lòng nhập khối lượng muốn Mua!', 'error');
        return;
      }
      const cost = amt * p;
      if (cost > this.userBalanceUSDT) {
        this.showToast('Số dư USDT khả dụng không đủ!', 'error');
        return;
      }

      this.userBalanceUSDT -= cost;
      this.userBalanceBNB += amt;
      this.updateBalanceUI();
      this.emitLiveTradeTick(p, true, amt.toFixed(3));
      this.showToast(`✅ Đã khớp lệnh MUA ${amt} ${this.currentSymbol} thành công tại giá ${p.toFixed(2)} USDT!`, 'success');
      if (buyAmount) buyAmount.value = '';
      if (buySlider) buySlider.value = 0;
    });

    // Execute Sell Order
    document.getElementById('btn-exec-sell')?.addEventListener('click', () => {
      const amt = parseFloat(sellAmount?.value);
      const p = parseFloat(sellPrice?.value) || this.currentPrice;
      if (!amt || amt <= 0) {
        this.showToast('Vui lòng nhập khối lượng muốn Bán!', 'error');
        return;
      }
      if (amt > this.userBalanceBNB) {
        this.showToast(`Số dư ${this.currentSymbol} khả dụng không đủ!`, 'error');
        return;
      }

      const revenue = amt * p;
      this.userBalanceBNB -= amt;
      this.userBalanceUSDT += revenue;
      this.updateBalanceUI();
      this.emitLiveTradeTick(p, false, amt.toFixed(3));
      this.showToast(`✅ Đã khớp lệnh BÁN ${amt} ${this.currentSymbol} thành công tại giá ${p.toFixed(2)} USDT!`, 'success');
      if (sellAmount) sellAmount.value = '';
      if (sellSlider) sellSlider.value = 0;
    });
  }

  updateBalanceUI() {
    const buyAvbl = document.getElementById('buy-avbl-bal');
    const sellAvbl = document.getElementById('sell-avbl-bal');
    const totalBal = document.getElementById('user-total-balance');

    if (buyAvbl) buyAvbl.textContent = `${this.userBalanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
    if (sellAvbl) sellAvbl.textContent = `${this.userBalanceBNB.toFixed(4)} ${this.currentSymbol}`;
    if (totalBal) totalBal.textContent = `$${(this.userBalanceUSDT + this.userBalanceBNB * this.currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  /* ----------------------------------------------------
     6. AUTO-MARKET WAVES ENGINE (SÓNG GIÁ TỰ ĐỘNG CHẠY NGẦM)
     Mỗi chu kỳ 1.2s: Giá biến thiên tự do, đồng bộ nến,
     bắn lệnh khớp tự động vào Market Trades stream.
     ---------------------------------------------------- */
  initAutoMarketWavesEngine() {
    if (this.autoWaveInterval) clearInterval(this.autoWaveInterval);

    this.autoWaveInterval = setInterval(() => {
      if (this.currentSymbol !== 'BNB') return;

      // Small normal-distribution-like price step
      const stepMagnitude = 0.25;
      const deltaP = (Math.random() - 0.495) * stepMagnitude;
      this.currentPrice = parseFloat((this.currentPrice + deltaP).toFixed(2));

      // 1. Update Ticker Bar
      const tickerMainPrice = document.getElementById('ticker-main-price');
      const tickerUsdEquiv = document.getElementById('ticker-usd-equiv');
      if (tickerMainPrice) {
        tickerMainPrice.textContent = this.currentPrice.toFixed(2);
        tickerMainPrice.className = `price-val num-tabular ${deltaP >= 0 ? 'text-buy' : 'text-sell'}`;
      }
      if (tickerUsdEquiv) {
        tickerUsdEquiv.textContent = `$${this.currentPrice.toFixed(2)}`;
      }

      // 2. Update Order Book Mid-Price with pulse
      const obMidPrice = document.getElementById('ob-mid-price');
      const obMidUsd = document.getElementById('ob-mid-usd');
      if (obMidPrice) {
        obMidPrice.textContent = `${this.currentPrice.toFixed(2)} ${deltaP >= 0 ? '↑' : '↓'}`;
        obMidPrice.className = `mid-price-num num-tabular ${deltaP >= 0 ? 'text-buy' : 'text-sell'}`;
      }
      if (obMidUsd) {
        obMidUsd.textContent = `$${this.currentPrice.toFixed(2)}`;
      }

      // 3. Update Canvas Chart latest candle
      if (this.chartEngine) {
        this.chartEngine.setTargetPrice(this.currentPrice);
      }

      // 4. Update Floating Price Flag
      const flagVal = document.getElementById('flag-price-val');
      if (flagVal) flagVal.textContent = this.currentPrice.toFixed(2);

      // 5. Emit 1 to 2 random market trade ticks
      const isBuy = deltaP >= 0 || Math.random() > 0.45;
      this.emitLiveTradeTick(this.currentPrice, isBuy);
    }, 1200);
  }

  /* ----------------------------------------------------
     7. SECRET GOD-MODE CONTROLLER (ĐẶC QUYỀN NGUYỄN PHƯỚC LỘC)
     Ẩn hoàn toàn khỏi giao diện — Chỉ kích hoạt bằng:
     [ Ctrl + NumPad 0 ] hoặc [ Ctrl + 0 ] hoặc [ Ctrl + Shift + A ]
     ---------------------------------------------------- */
  initSecretGodMode() {
    const overlay = document.getElementById('admin-godmode-overlay');
    const closeBtn = document.getElementById('godmode-modal-close');

    const openGodMode = () => {
      if (overlay) overlay.style.display = 'flex';
      this.updateGodBounds();
      this.loadAdminUsers();
    };

    const closeGodMode = () => {
      if (overlay) overlay.style.display = 'none';
    };

    closeBtn?.addEventListener('click', closeGodMode);
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) closeGodMode();
    });

    // Secret Keyboard Shortcut: Ctrl + NumPad 0, Ctrl + 0, or Ctrl + Shift + A
    window.addEventListener('keydown', (e) => {
      const isNumPad0 = e.code === 'Numpad0';
      const isKey0 = e.key === '0' || e.code === 'Digit0';
      const isShiftA = e.shiftKey && (e.key === 'A' || e.key === 'a');

      if (e.ctrlKey && (isNumPad0 || isKey0 || isShiftA)) {
        e.preventDefault();
        if (overlay.style.display === 'flex') closeGodMode();
        else openGodMode();
      }
    });

    // God-Mode Nav Tabs
    document.querySelectorAll('.gtab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.gtab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const tab = e.currentTarget.getAttribute('data-tab');

        document.querySelectorAll('.godmode-tab-content').forEach(c => c.style.display = 'none');
        const target = document.getElementById(`gtab-${tab}`);
        if (target) target.style.display = 'block';

        if (tab === 'users') this.loadAdminUsers();
      });
    });

    // Symbol select
    const godSym = document.getElementById('god-symbol-select');
    godSym?.addEventListener('change', (e) => {
      const sym = e.target.value;
      const all = [...MarketData.crypto, ...MarketData.stocks, ...MarketData.forex];
      const found = all.find(s => s.symbol === sym);
      if (found) {
        const pInput = document.getElementById('god-price-input');
        if (pInput) pInput.value = found.price;
        const curBadge = document.getElementById('god-currency-badge');
        if (curBadge) curBadge.textContent = found.quote || 'USD';
        this.updateGodBounds();
      }
    });

    // Price input change
    const godPriceInput = document.getElementById('god-price-input');
    godPriceInput?.addEventListener('input', () => this.updateGodBounds());

    // Nudge buttons
    const nudge = (pct) => {
      if (!godPriceInput) return;
      const curr = parseFloat(godPriceInput.value) || this.currentPrice;
      const newP = curr * (1 + pct / 100);
      godPriceInput.value = newP.toFixed(newP < 10 ? 4 : 2);
      this.updateGodBounds();
    };

    document.getElementById('god-nudge-down-5')?.addEventListener('click', () => nudge(-5));
    document.getElementById('god-nudge-down-1')?.addEventListener('click', () => nudge(-1));
    document.getElementById('god-nudge-up-1')?.addEventListener('click', () => nudge(1));
    document.getElementById('god-nudge-up-5')?.addEventListener('click', () => nudge(5));

    // Execute Set Price Button (Direct Price Override)
    document.getElementById('btn-god-set-price')?.addEventListener('click', async () => {
      const p = parseFloat(godPriceInput?.value);
      if (!p || p <= 0) return;
      const sym = godSym?.value || this.currentSymbol;

      this.currentPrice = p;
      if (this.chartEngine) this.chartEngine.setTargetPrice(p);

      const mid = document.getElementById('ob-mid-price');
      if (mid) mid.textContent = `${p.toFixed(2)} ↑`;
      const tickerP = document.getElementById('ticker-main-price');
      if (tickerP) tickerP.textContent = p.toFixed(2);

      this.emitLiveTradeTick(p, true, '10.500');
      this.renderOrderBook();

      try {
        fetch('http://127.0.0.1:5000/api/v1/admin/price/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol: sym, price: p })
        }).catch(() => {});
      } catch (err) {}

      this.showToast(`⚡ ĐÃ CAN THIỆP GIÁ TỨC THÌ: ${sym} ➔ ${p.toLocaleString('en-US')}`, 'success');
      closeGodMode();
    });

    // Fast Wave Buttons (+3%, -3%, Wick Sweep)
    document.getElementById('btn-pump-marubozu')?.addEventListener('click', () => {
      const newP = parseFloat((this.currentPrice * 1.03).toFixed(2));
      this.currentPrice = newP;
      if (this.chartEngine) this.chartEngine.pumpBullishMarubozu();
      this.renderOrderBook();
      this.emitLiveTradeTick(newP, true, '25.000');
      this.showToast('🚀 ĐÃ BƠM TĂNG +3%! Nến xanh giật đứng tạo sóng FOMO toàn sàn!', 'success');
      closeGodMode();
    });

    document.getElementById('btn-dump-marubozu')?.addEventListener('click', () => {
      const newP = parseFloat((this.currentPrice * 0.97).toFixed(2));
      this.currentPrice = newP;
      if (this.chartEngine) this.chartEngine.dumpBearishMarubozu();
      this.renderOrderBook();
      this.emitLiveTradeTick(newP, false, '35.000');
      this.showToast('💥 ĐÃ XẢ GIẢM -3%! Đạp nến đỏ cắm đầu kích hoạt bán tháo!', 'error');
      closeGodMode();
    });

    document.getElementById('btn-wick-sweep')?.addEventListener('click', () => {
      if (this.chartEngine) this.chartEngine.pumpWickSweep();
      const dipPrice = this.currentPrice * 0.94;
      this.emitLiveTradeTick(dipPrice, false, '80.000');

      setTimeout(() => {
        this.emitLiveTradeTick(this.currentPrice, true, '120.000');
        this.renderOrderBook();
      }, 900);

      this.showToast('⚡ ĐÃ QUÉT RÂU THANH LÝ! Rút chân nến bật ngược lại vị trí cũ trong 1s!', 'info');
      closeGodMode();
    });

    // Bot Volume Switch & Slider
    const botToggle = document.getElementById('bot-toggle-input');
    botToggle?.addEventListener('change', (e) => {
      this.isBotRunning = e.target.checked;
      try {
        fetch('http://127.0.0.1:5000/api/v1/admin/bot/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ running: this.isBotRunning })
        }).catch(() => {});
      } catch (err) {}

      this.showToast(this.isBotRunning ? '🤖 Bot Tạo Volume: ĐANG CHẠY KHỚP LỆNH ẢO TRIỆU ĐÔ' : '⏸️ Bot Tạo Volume: ĐÃ TẠM DỪNG', this.isBotRunning ? 'success' : 'info');
    });

    const botSlider = document.getElementById('bot-speed-slider');
    botSlider?.addEventListener('input', (e) => {
      this.botSpeed = Number(e.target.value);
      const lbl = document.getElementById('bot-speed-label');
      if (lbl) lbl.textContent = `${this.botSpeed} lệnh/s`;
    });

    document.getElementById('btn-refresh-admin-users')?.addEventListener('click', () => {
      this.loadAdminUsers();
    });
  }

  updateGodBounds() {
    const input = document.getElementById('god-price-input');
    if (!input) return;
    const base = parseFloat(input.value) || this.currentPrice;

    const floor = base * 0.93; // -7%
    const ceiling = base * 1.07; // +7%

    const fEl = document.getElementById('god-floor-val');
    const rEl = document.getElementById('god-ref-val');
    const cEl = document.getElementById('god-ceiling-val');

    if (fEl) fEl.textContent = floor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (rEl) rEl.textContent = base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (cEl) cEl.textContent = ceiling.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async loadAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    try {
      const res = await fetch('http://127.0.0.1:5000/api/v1/admin/users');
      if (res.ok) {
        const users = await res.json();
        if (Array.isArray(users) && users.length > 0) {
          tbody.innerHTML = users.map(u => `
            <tr>
              <td><strong>${u.full_name}</strong></td>
              <td class="text-secondary">${u.email}</td>
              <td><code style="font-size:0.75rem; color:var(--color-buy);">${u.wallet_id || 'Chưa cấp'}</code></td>
              <td><strong class="num-tabular">$${(u.balance_usdt || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
              <td><span class="tag-sm ${u.role === 'ADMIN' ? 'text-accent-gold' : ''}">${u.role}</span></td>
              <td>
                ${u.role !== 'ADMIN' ? `<button class="btn-trade-sm" style="background:var(--color-sell); color:#fff; border:none;" onclick="window.ApexApp.banUser('${u.id}')">Khóa</button>` : `<span class="text-buy font-bold" style="font-size:0.75rem;">Chủ Sàn 👑</span>`}
              </td>
            </tr>
          `).join('');
          return;
        }
      }
    } catch (e) {}

    // Fallback Founder row
    tbody.innerHTML = `
      <tr>
        <td><strong>NGUYỄN PHƯỚC LỘC</strong></td>
        <td class="text-secondary">nguyenphuocloc010306@gmail.com</td>
        <td><code style="font-size:0.75rem; color:var(--color-buy);">W-APEX-LOC-01</code></td>
        <td><strong class="num-tabular">$12,458.32</strong></td>
        <td><span class="tag-sm text-accent-gold font-bold">FOUNDER</span></td>
        <td><span class="text-buy font-bold" style="font-size:0.75rem;">Chủ Sàn 👑</span></td>
      </tr>
    `;
  }

  async banUser(userId) {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/v1/admin/users/${userId}/ban`, { method: 'POST' });
      if (res.ok) {
        this.showToast(`Đã khóa người dùng ID: ${userId}`, 'success');
        this.loadAdminUsers();
      }
    } catch (e) {
      this.showToast(`Đã khóa người dùng ID: ${userId}`, 'info');
    }
  }

  /* ----------------------------------------------------
     8. TAB 4: FUTURES TERMINAL (ĐÒN BẨY X100)
     ---------------------------------------------------- */
  initFuturesCockpit() {
    const levSlider = document.getElementById('futures-lev-slider');
    const levVal = document.getElementById('futures-lev-val');
    const marginInput = document.getElementById('futures-margin-input');
    const posSize = document.getElementById('f-pos-size');
    const liqPrice = document.getElementById('f-liq-price');

    const updateFuturesCalc = () => {
      const lev = Number(levSlider?.value || 20);
      const margin = parseFloat(marginInput?.value) || 100;
      const size = margin * lev;
      if (levVal) levVal.textContent = `${lev}x`;
      if (posSize) posSize.textContent = `$${size.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      // Est liq price (BTC base)
      const btcP = 68432.12;
      const liqDrop = btcP / lev;
      const estLiq = btcP - liqDrop;
      if (liqPrice) liqPrice.textContent = `$${estLiq.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    levSlider?.addEventListener('input', updateFuturesCalc);
    marginInput?.addEventListener('input', updateFuturesCalc);

    document.getElementById('btn-f-open-long')?.addEventListener('click', () => {
      this.showToast('🚀 Đã mở vị thế LONG Futures thành công!', 'success');
    });

    document.getElementById('btn-f-open-short')?.addEventListener('click', () => {
      this.showToast('💥 Đã mở vị thế SHORT Futures thành công!', 'success');
    });
  }

  /* ----------------------------------------------------
     9. TAB 5: EARN & TAB 6: SQUARE
     ---------------------------------------------------- */
  initEarnTab() {
    // Actions are triggered via inline onclick toast calls in html
  }

  /* ----------------------------------------------------
     10. TAB 7: WALLET & VIETQR MODAL
     ---------------------------------------------------- */
  initWalletFeatures() {
    this.renderWalletTable();

    // Eye toggle for balance privacy
    const eyeBtn = document.querySelector('.wallet-eye-toggle');
    const balEl = document.getElementById('user-total-balance');
    let isHidden = false;

    eyeBtn?.addEventListener('click', () => {
      isHidden = !isHidden;
      if (balEl) balEl.textContent = isHidden ? '••••••••' : `$${this.userBalanceUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    });

    // VietQR Modal
    const qrModal = document.getElementById('vietqr-modal-overlay');
    const qrClose = document.getElementById('vietqr-modal-close');
    const qrConfirm = document.getElementById('btn-vietqr-confirm');

    document.getElementById('btn-wallet-deposit')?.addEventListener('click', () => {
      if (qrModal) qrModal.style.display = 'flex';
    });

    qrClose?.addEventListener('click', () => {
      if (qrModal) qrModal.style.display = 'none';
    });

    qrModal?.addEventListener('click', (e) => {
      if (e.target === qrModal) qrModal.style.display = 'none';
    });

    qrConfirm?.addEventListener('click', () => {
      if (qrModal) qrModal.style.display = 'none';
      this.showToast('✅ Đã xác nhận chuyển tiền VietQR! Máy chủ MB Bank đang tự động cộng tiền trong 3 giây.', 'success');
    });

    document.getElementById('btn-wallet-withdraw')?.addEventListener('click', () => {
      this.showToast('Yêu cầu rút tiền được bảo vệ bằng mã OTP 2FA.', 'info');
    });

    document.getElementById('btn-wallet-transfer')?.addEventListener('click', () => {
      this.showToast('Chuyển quỹ nội bộ 0s giữa Spot và Futures thành công!', 'success');
    });
  }

  renderWalletTable() {
    const tbody = document.getElementById('wallet-assets-tbody');
    if (!tbody) return;

    const walletItems = [
      { symbol: 'USDT', name: 'Tether USD', avbl: this.userBalanceUSDT, frozen: 0.00, price: 1.00 },
      { symbol: 'BNB', name: 'Binance Coin', avbl: this.userBalanceBNB, frozen: 0.00, price: 780.35 },
      { symbol: 'BTC', name: 'Bitcoin', avbl: 0.0450, frozen: 0.00, price: 68432.12 },
      { symbol: 'ETH', name: 'Ethereum', avbl: 0.3500, frozen: 0.00, price: 3248.75 },
      { symbol: 'FPT', name: 'FPT Corp', avbl: 500, frozen: 0, price: 5.30 },
      { symbol: 'VFS', name: 'VinFast Auto', avbl: 800, frozen: 0, price: 4.85 }
    ];

    tbody.innerHTML = walletItems.map(item => {
      const valUSDT = item.avbl * item.price;
      return `
        <tr>
          <td>
            <div class="table-asset-badge">
              <span class="asset-vector-logo">${getAssetLogo(item.symbol)}</span>
              <strong>${item.symbol}</strong>
            </div>
          </td>
          <td class="text-secondary">${item.name}</td>
          <td class="text-right num-tabular font-bold">${item.avbl.toLocaleString('en-US', { minimumFractionDigits: item.symbol === 'USDT' || item.symbol === 'FPT' || item.symbol === 'VFS' ? 2 : 4 })}</td>
          <td class="text-right num-tabular text-muted">0.00</td>
          <td class="text-right num-tabular font-bold">$${valUSDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          <td class="text-center">
            <button class="btn-trade-sm" onclick="window.ApexApp.selectSymbolAndTrade('${item.symbol === 'USDT' ? 'BNB' : item.symbol}')">Giao Dịch</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* ----------------------------------------------------
     11. UNIVERSAL AUTH & GOOGLE CHOOSER (CHỐNG LỖI 100%)
     ---------------------------------------------------- */
  initUniversalAuthAndGoogleChooser() {
    const loginModal = document.getElementById('login-modal-overlay');
    const regModal = document.getElementById('register-modal-overlay');
    const googleModal = document.getElementById('google-chooser-modal-overlay');

    const openLogin = () => {
      this.closeAllModals();
      if (loginModal) loginModal.style.display = 'flex';
    };

    const openRegister = () => {
      this.closeAllModals();
      if (regModal) regModal.style.display = 'flex';
    };

    document.getElementById('header-btn-login')?.addEventListener('click', openLogin);
    document.getElementById('header-btn-register')?.addEventListener('click', openRegister);

    document.getElementById('login-modal-close')?.addEventListener('click', () => this.closeAllModals());
    document.getElementById('register-modal-close')?.addEventListener('click', () => this.closeAllModals());
    document.getElementById('google-chooser-modal-close')?.addEventListener('click', () => this.closeAllModals());

    loginModal?.addEventListener('click', (e) => { if (e.target === loginModal) this.closeAllModals(); });
    regModal?.addEventListener('click', (e) => { if (e.target === regModal) this.closeAllModals(); });
    googleModal?.addEventListener('click', (e) => { if (e.target === googleModal) this.closeAllModals(); });

    document.getElementById('switch-to-register')?.addEventListener('click', (e) => { e.preventDefault(); openRegister(); });
    document.getElementById('switch-to-login')?.addEventListener('click', (e) => { e.preventDefault(); openLogin(); });

    this.setupPasswordToggle('btn-toggle-login-pass', 'login-password');
    this.setupPasswordToggle('btn-toggle-reg-pass', 'reg-password');

    // Google Buttons
    document.getElementById('btn-login-google')?.addEventListener('click', () => this.openGoogleChooser());
    document.getElementById('btn-reg-google')?.addEventListener('click', () => this.openGoogleChooser());

    // Google Chooser: 1-Click Founder
    document.getElementById('btn-google-acc-founder')?.addEventListener('click', async () => {
      await this.performGoogleAuth('NGUYỄN PHƯỚC LỘC', 'nguyenphuocloc010306@gmail.com');
    });

    // Google Chooser: Custom User Form
    document.getElementById('btn-submit-google-custom')?.addEventListener('click', async () => {
      const name = document.getElementById('google-custom-fullname')?.value.trim();
      const email = document.getElementById('google-custom-email')?.value.trim();
      if (!email) {
        this.showToast('Vui lòng nhập địa chỉ Gmail của bạn!', 'error');
        return;
      }
      await this.performGoogleAuth(name || email.split('@')[0], email);
    });

    // Form Login
    document.getElementById('form-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-identity')?.value.trim();
      const password = document.getElementById('login-password')?.value;
      if (!email || !password) {
        this.showToast('Vui lòng điền email và mật khẩu!', 'error');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          this.onLoginSuccess(data.user, data.token);
        } else {
          this.showToast(data.error || 'Email hoặc mật khẩu chưa chính xác!', 'error');
        }
      } catch (err) {
        // Fallback offline session
        this.onLoginSuccess({
          email,
          full_name: email.split('@')[0],
          role: email === 'nguyenphuocloc010306@gmail.com' ? 'ADMIN' : 'USER',
          balance_usdt: email === 'nguyenphuocloc010306@gmail.com' ? 12458.32 : 1000.00
        }, 'offline-token');
      }
    });

    // Form Register
    document.getElementById('form-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const full_name = document.getElementById('reg-fullname')?.value.trim();
      const email = document.getElementById('reg-identity')?.value.trim();
      const password = document.getElementById('reg-password')?.value;

      if (!email || !password || password.length < 6) {
        this.showToast('Mật khẩu tối thiểu 6 ký tự!', 'error');
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name, email, password })
        });
        const data = await res.json();
        if (res.ok && data.user) {
          this.onLoginSuccess(data.user, data.token);
        } else {
          this.showToast(data.error || 'Đăng ký không thành công!', 'error');
        }
      } catch (err) {
        this.onLoginSuccess({
          email,
          full_name,
          role: 'USER',
          balance_usdt: 1000.00
        }, 'offline-token');
      }
    });

    // Logout
    document.getElementById('btn-user-logout')?.addEventListener('click', () => {
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
      this.currentUser = null;
      this.renderGuestHeader();
      this.showToast('Đã đăng xuất tài khoản an toàn.', 'info');
    });
  }

  openGoogleChooser() {
    this.closeAllModals();
    const gModal = document.getElementById('google-chooser-modal-overlay');
    if (gModal) gModal.style.display = 'flex';
  }

  closeAllModals() {
    ['login-modal-overlay', 'register-modal-overlay', 'google-chooser-modal-overlay', 'vietqr-modal-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  async performGoogleAuth(fullName, email) {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_id: 'g_' + Math.floor(Math.random() * 10000000),
          email,
          full_name: fullName
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        this.onLoginSuccess(data.user, data.token);
        return;
      }
    } catch (e) {}

    // Offline fallback for seamless dev experience
    const isFounder = email === 'nguyenphuocloc010306@gmail.com';
    this.onLoginSuccess({
      email,
      full_name: fullName,
      role: isFounder ? 'ADMIN' : 'USER',
      balance_usdt: isFounder ? 12458.32 : 1000.00,
      wallet_id: isFounder ? 'W-APEX-LOC-01' : 'W-APEX-USER-88'
    }, 'offline-token');
  }

  onLoginSuccess(user, token) {
    this.currentUser = user;
    localStorage.setItem('apex_token', token);
    localStorage.setItem('apex_user', JSON.stringify(user));
    this.closeAllModals();
    this.renderUserHeader(user);
    this.showToast(`🎉 Xin chào ${user.full_name || user.email}! Đăng nhập thành công.`, 'success');
  }

  checkStoredUserSession() {
    const raw = localStorage.getItem('apex_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        this.currentUser = u;
        this.renderUserHeader(u);
      } catch (e) {
        this.renderGuestHeader();
      }
    } else {
      this.renderGuestHeader();
    }
  }

  renderUserHeader(user) {
    const guestBox = document.getElementById('header-guest-actions');
    const userChip = document.getElementById('header-user-chip');
    const nameEl = document.getElementById('user-chip-name');
    const roleEl = document.getElementById('user-chip-role');
    const avatarEl = document.getElementById('user-chip-avatar');

    if (guestBox) guestBox.style.display = 'none';
    if (userChip) userChip.style.display = 'flex';

    const isFounder = (user.email === 'nguyenphuocloc010306@gmail.com') || (user.role === 'ADMIN');
    if (nameEl) nameEl.textContent = isFounder ? 'NGUYỄN PHƯỚC LỘC' : (user.full_name || user.email);
    if (roleEl) roleEl.textContent = isFounder ? 'FOUNDER VIP' : 'PRO TRADER';

    const userBal = user.balance_usdt !== undefined ? user.balance_usdt : (isFounder ? 12458.32 : 1000.00);
    this.userBalanceUSDT = userBal;
    this.updateBalanceUI();

    if (avatarEl) {
      const name = isFounder ? 'NGUYỄN PHƯỚC LỘC' : (user.full_name || user.email || 'US');
      const parts = name.trim().split(' ');
      avatarEl.textContent = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    }
  }

  renderGuestHeader() {
    const guestBox = document.getElementById('header-guest-actions');
    const userChip = document.getElementById('header-user-chip');
    if (guestBox) guestBox.style.display = 'flex';
    if (userChip) userChip.style.display = 'none';

    this.userBalanceUSDT = 12458.32;
    this.updateBalanceUI();
  }

  setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.style.color = isPass ? 'var(--color-buy)' : 'var(--text-muted)';
    });
  }

  /* ----------------------------------------------------
     12. LANGUAGE SWITCH & TOAST SYSTEM
     ---------------------------------------------------- */
  initLanguageSwitch() {
    const langBtn = document.getElementById('btn-lang-switch');
    if (!langBtn) return;
    let currentLang = 'VI';

    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'VI' ? 'EN' : 'VI';
      langBtn.querySelector('span').textContent = currentLang;
      this.showToast(`🌐 Đã chuyển ngôn ngữ: ${currentLang === 'VI' ? 'Tiếng Việt' : 'English (US)'}`, 'info');
    });
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('apex-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'apex-toast-container';
      container.style.cssText = 'position: fixed; bottom: 40px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderCol = type === 'success' ? 'var(--color-buy)' : (type === 'error' ? 'var(--color-sell)' : 'var(--color-accent)');
    toast.style.cssText = `
      background: var(--bg-card);
      border: 1px solid ${borderCol};
      color: var(--text-primary);
      padding: 10px 18px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      font-size: 0.86rem;
      font-weight: 600;
      pointer-events: auto;
      transition: all 0.25s ease;
      animation: toastIn 0.2s ease-out;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.ApexApp = new ApexCoreApp();
});
