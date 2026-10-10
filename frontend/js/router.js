/* ========================================================
   APEXCORE PRO — HASH ROUTER (js/router.js)
   MASTER v3.0 — Quản Lý Chuyển Trang & Giữ Trạng Thái F5
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { HomePage } from './pages/home.js';
import { MarketsPage } from './pages/markets.js';
import { TradePage } from './pages/trade.js';
import { FuturesPage } from './pages/futures.js';
import { EarnPage } from './pages/earn.js';
import { WalletPage } from './pages/wallet.js';
import { SquarePage } from './pages/square.js';

class HashRouter {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentView = null;
    this.currentPath = '';

    this.pages = {
      home: new HomePage(this),
      markets: new MarketsPage(this),
      trade: new TradePage(this),
      futures: new FuturesPage(this),
      earn: new EarnPage(this),
      wallet: new WalletPage(this),
      square: new SquarePage(this)
    };
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
  }

  handleRoute() {
    let rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash) {
      rawHash = 'trade/BNB_USDT';
    }

    const parts = rawHash.split('/').filter(Boolean);
    const mainRoute = parts[0] || 'home';
    const param = parts[1] || '';

    // Unmount old view
    if (this.currentView && this.currentView.unmount) {
      try { this.currentView.unmount(); } catch (e) {}
    }

    let targetPage = this.pages.home;
    let activeNav = 'home';

    if (mainRoute === 'home' || mainRoute === '') {
      targetPage = this.pages.home;
      activeNav = 'home';
      targetPage.mount(this.container);
    } else if (mainRoute === 'markets') {
      targetPage = this.pages.markets;
      activeNav = 'markets';
      targetPage.mount(this.container);
    } else if (mainRoute === 'trade' || mainRoute === 'futures') {
      const sym = (param || 'BTC_USDT').replace('_', '/');
      window.location.href = `trade.html?symbol=${encodeURIComponent(sym)}`;
      return;
    } else if (mainRoute === 'earn') {
      targetPage = this.pages.earn;
      activeNav = 'earn';
      targetPage.mount(this.container);
    } else if (mainRoute === 'wallet') {
      targetPage = this.pages.wallet;
      activeNav = 'wallet';
      targetPage.mount(this.container);
    } else if (mainRoute === 'square') {
      targetPage = this.pages.square;
      activeNav = 'square';
      targetPage.mount(this.container);
    } else {
      targetPage = this.pages.trade;
      activeNav = 'trade';
      targetPage.mount(this.container, { symbol: 'BNB_USDT' });
    }

    this.currentView = targetPage;
    this.updateNavUI(activeNav);
  }

  updateNavUI(activeNav) {
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === activeNav) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

export function initRouter(containerId) {
  const router = new HashRouter(containerId);
  window.ApexRouter = router;
  router.init();
  return router;
}
