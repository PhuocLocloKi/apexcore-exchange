/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XXIV: SIÊU TRẠM MENU NĂNG LƯỢNG LƯỢNG TỬ ĐA TẦNG (js/pages/home.js)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   Email: nguyenphuoclocSE200425@gmail.com / nguyenphuocloc010306@gmail.com
   ========================================================================== */

import { kineticScroll } from '../../src/engines/kinetic-scroll.js';
import { OrbitalVortexController } from '../../src/engines/orbital-vortex/vortex-controller.js';
import { QuantumReactorEngine } from '../../src/engines/quantum-reactor/quantum-reactor-engine.js';

export class HomePage {
  constructor(router) {
    this.router = router;
    this.userCount = 332845671;
    this.userTimer = null;
    this.priceTimer = null;
    this.activeTab = 'popular';
    this.mouseMoveHandler = null;
    this.vortexController = null;
    this.reactorEngine = null;
    this.orbitActive = false;
    this.orbitRaf = null;
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
    this.startLiveTickers();
    this.initParallaxTilt();
    kineticScroll.init();

    // Khởi tạo Siêu Trạm Menu Năng Lượng Lượng Tử Đa Tầng (Chương XXIV)
    try {
      this.reactorEngine = new QuantumReactorEngine('coreReactorCanvas');
      this.reactorEngine.init();
      window.ApexReactor = this.reactorEngine;
    } catch (err) {
      console.warn('[HomePage] QuantumReactorEngine init warning:', err);
    }

    if (window.currentLang && typeof window.applyLanguageToHome === 'function') {
      window.applyLanguageToHome();
    }
  }

  unmount() {
    if (this.reactorEngine) {
      this.reactorEngine.destroy();
      this.reactorEngine = null;
    }
    this.orbitActive = false;
    if (this.orbitRaf) {
      cancelAnimationFrame(this.orbitRaf);
      this.orbitRaf = null;
    }
    if (this.vortexController) {
      this.vortexController.destroy();
      this.vortexController = null;
    }
    kineticScroll.destroy();
    if (this.userTimer) {
      clearInterval(this.userTimer);
      this.userTimer = null;
    }
    if (this.priceTimer) {
      clearInterval(this.priceTimer);
      this.priceTimer = null;
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }
  }

  renderHTML() {
    return `
      <!-- ==========================================================================
           [SECTION 01: SOVEREIGN INCEPTION & QUANTUM REACTOR TERMINAL] (CHƯƠNG XXIV)
           ========================================================================== -->
      <section class="apex-kinetic-hero" style="padding-top: 10px;">
        <div class="hero-top-intro" style="max-width: 1240px; margin: 0 auto 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
          <!-- Thông điệp chủ quyền -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="hero-metric-badge">
              <span class="pulse-emerald"></span>
              <span class="metric-num" id="userCounter">${this.userCount.toLocaleString('en-US')}</span>
              <span class="metric-label">USERS TRUST US</span>
            </div>
            <h1 class="hero-title" style="font-size: 30px; margin: 2px 0;">Sàn Giao Dịch Đa Tài Sản Lượng Tử Tối Cao</h1>
            <p class="hero-founder-sub" style="margin: 0;">
              Sáng Lập Bởi <strong class="gold-gradient-txt">NGUYỄN PHƯỚC LỘC</strong> (UID: 1107519625)
            </p>
          </div>

          <!-- Đăng ký siêu tốc capsule -->
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
            <div class="hero-reg-capsule" style="margin: 0;">
              <input type="text" id="quickInp" placeholder="Email / Số điện thoại" class="reg-input" autocomplete="username"/>
              <button class="reg-btn-gold" id="btnQuickSubmit" onclick="window.submitQuick ? window.submitQuick() : window.loginWithGoogleOAuth()">ĐĂNG KÝ VÀNG</button>
            </div>
            <div class="quick-social-row" style="margin: 0;">
              <div class="social-chip" title="Đăng nhập Google" onclick="window.loginWithGoogleOAuth ? window.loginWithGoogleOAuth() : window.loginWithGoogle()">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              </div>
              <div class="social-chip" title="Đăng nhập Apple" onclick="window.loginWithAppleOAuth ? window.loginWithAppleOAuth() : window.loginWithApple()">
                <svg width="16" height="16" viewBox="0 0 170 170" fill="#FFFFFF"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.79-11.75-13.88-25.18-18.28-40.3-4.4-15.11-6.6-28.77-6.6-40.97 0-14.59 3.44-26.68 10.33-36.27 6.89-9.59 15.69-14.49 26.4-14.71 4.58 0 9.8 1.25 15.66 3.76 5.86 2.5 9.77 3.82 11.73 3.94 1.74 0 5.86-1.4 12.37-4.22 6.51-2.81 12.01-4.04 16.51-3.69 12.86 1.09 23.01 6.27 30.45 15.54-11.33 6.86-16.89 16.32-16.68 28.38.22 9.59 3.87 17.65 10.95 24.18 7.08 6.53 15.42 10.23 25.04 11.09-2.39 7.4-5.39 15.1-9 23.12zM119.22 33.15c0-7.62 2.76-14.88 8.28-21.78 5.52-6.9 12.28-11.02 20.28-12.37.22 1.09.33 2.18.33 3.27 0 7.4-2.87 14.71-8.61 21.93-5.74 7.22-12.65 11.44-20.73 12.65-.22-1.2-.45-2.43-.45-3.7z"/></svg>
              </div>
              <span class="social-chip-txt">Đăng nhập 1-Click</span>
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- 🚀 APEXCORE SOVEREIGN CYBER-QUANTUM REACTOR MENU TERMINAL V17             -->
        <!-- 👑 CHIEF ARCHITECT: NGUYỄN PHƯỚC LỘC (UID: 1107519625)                     -->
        <!-- ========================================================================= -->
        <div class="quantum-station-viewport" id="quantumStation">
          <!-- 1. CÁNH MENU TRÁI (LEFT HUD WING) -->
          <aside class="station-wing wing-left">
            <div class="wing-header">
              <span class="wing-tag">NODE L-01</span>
              <h4>CENTRAL EXCHANGES</h4>
            </div>
            <div class="menu-badge-list">
              <div class="hud-badge-item badge-binance" onclick="window.location.href='trade.html?ex=binance'">
                <div class="badge-halo"><span class="badge-icon">❖</span></div>
                <div class="badge-info">
                  <span class="badge-title">BINANCE</span>
                  <span class="badge-metric text-gold">$98,420 · +4.2%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-okx" onclick="window.location.href='trade.html?ex=okx'">
                <div class="badge-halo"><span class="badge-icon">⬛</span></div>
                <div class="badge-info">
                  <span class="badge-title">OKX PROTOCOL</span>
                  <span class="badge-metric text-silver">$3,410 · +3.8%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-coinbase" onclick="window.location.href='trade.html?ex=coinbase'">
                <div class="badge-halo"><span class="badge-icon">🔵</span></div>
                <div class="badge-info">
                  <span class="badge-title">COINBASE PRIME</span>
                  <span class="badge-metric text-blue">$224.5 · +2.4%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-hyper" onclick="window.location.href='trade.html?ex=hyperliquid'">
                <div class="badge-halo"><span class="badge-icon">💠</span></div>
                <div class="badge-info">
                  <span class="badge-title">HYPERLIQUID L1</span>
                  <span class="badge-metric text-teal">$44.15 · +12.4%</span>
                </div>
              </div>
            </div>
            <div class="wing-footer">
              <div class="mini-hud-chip" onclick="window.location.href='trade.html'"><span class="chip-dot"></span> SỔ LỆNH LƯỢNG TỬ</div>
              <div class="mini-hud-chip" onclick="window.location.href='trade.html'"><span class="chip-dot"></span> ĐỘ TRỄ 0.1MS</div>
            </div>
          </aside>

          <!-- 2. TRỤ LÕI KÍNH LƯỢNG TỬ TRUNG TÂM (THREE.JS 3D CORE) -->
          <main class="station-center-core" onclick="window.location.href='trade.html'" title="Nhấp để vào Buồng Lái Giao Dịch">
            <div class="core-hologram-overlay">
              <div class="core-header-telemetry">
                <span class="tele-badge">⚡ CORE REACTOR ONLINE</span>
                <h3>APEXCORE SOVEREIGN MATRIX</h3>
                <p class="tele-sub">VOLUME 24H: <strong>$128,490,200,000</strong> · SPREAD: <strong>0.001%</strong></p>
              </div>
            </div>
            <canvas id="coreReactorCanvas"></canvas>
          </main>

          <!-- 3. CÁNH MENU PHẢI (RIGHT HUD WING) -->
          <aside class="station-wing wing-right">
            <div class="wing-header">
              <span class="wing-tag">NODE R-02</span>
              <h4>DERIVATIVES & AI</h4>
            </div>
            <div class="menu-badge-list">
              <div class="hud-badge-item badge-bybit" onclick="window.location.href='trade.html?ex=bybit'">
                <div class="badge-halo"><span class="badge-icon">🟧</span></div>
                <div class="badge-info">
                  <span class="badge-title">BYBIT DERIVATIVES</span>
                  <span class="badge-metric text-orange">$712.1 · +6.1%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-kucoin" onclick="window.location.href='trade.html?ex=kucoin'">
                <div class="badge-halo"><span class="badge-icon">🟢</span></div>
                <div class="badge-info">
                  <span class="badge-title">KUCOIN HUB</span>
                  <span class="badge-metric text-cyan">$18.90 · +5.7%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-kraken" onclick="window.location.href='trade.html?ex=kraken'">
                <div class="badge-halo"><span class="badge-icon">🟣</span></div>
                <div class="badge-info">
                  <span class="badge-title">KRAKEN DARKPOOL</span>
                  <span class="badge-metric text-purple">$98,410 · +4.1%</span>
                </div>
              </div>
              <div class="hud-badge-item badge-gate" onclick="window.location.href='trade.html?ex=gate'">
                <div class="badge-halo"><span class="badge-icon">🔷</span></div>
                <div class="badge-info">
                  <span class="badge-title">GATE.IO ALPHA</span>
                  <span class="badge-metric text-sky">$8.45 · +1.9%</span>
                </div>
              </div>
            </div>
            <div class="wing-footer">
              <div class="mini-hud-chip" onclick="window.location.href='trade.html'"><span class="chip-dot"></span> ĐÒN BẨY X125</div>
              <div class="mini-hud-chip" onclick="window.location.href='trade.html'"><span class="chip-dot"></span> AI QUANTUM BOT</div>
            </div>
          </aside>

          <!-- 4. BỆ NĂNG LƯỢNG ĐÁY & MENU ĐIỀU HƯỚNG NHANH -->
          <footer class="station-pedestal-nav">
            <div class="plasma-arc-glow"></div>
            <div class="pedestal-buttons">
              <button class="pedestal-btn p-btn-active" onclick="window.location.href='index.html'">
                🏛️ CỔNG CHÀO SÀN
              </button>
              <button class="pedestal-btn p-btn-primary" onclick="window.location.href='trade.html'">
                🚀 BUỒNG LÁI GIAO DỊCH
              </button>
              <button class="pedestal-btn p-btn-admin" onclick="window.location.href='apex-master-admin.html'">
                👑 ADMIN GODMODE
              </button>
              <button class="pedestal-btn" onclick="alert('⚡ Đang kết nối ApexCore Sovereign Web3 Wallet...')">
                💳 KẾT NỐI VÍ
              </button>
            </div>
          </footer>
        </div>
      </section>

      <!-- ==========================================================================
           [SECTION 02: BỐN TRỤ CỘT SOVEREIGN & MOBILE PRO] (ẢNH 3 TÁI SINH 3D)
           ========================================================================== -->
      <section class="apex-pillars-section">
        <div class="section-title-wrap">
          <h2 class="section-title">Bốn Trụ Cột Tối Thượng Của Sàn ApexCore</h2>
          <p class="section-sub">Kiến tạo và bảo chứng bởi Founder Nguyễn Phước Lộc (UID: 1107519625)</p>
        </div>

        <!-- Lưới 4 Phiến Kính 3D Bay Lượn Khi Cuộn Chuột -->
        <div class="four-pillars-grid">
          <!-- Trụ Cột 1: Khớp Lệnh Siêu Tốc -->
          <div class="pillar-glass-slab">
            <div class="gold-wave-trim"></div>
            <div class="pillar-ico">⚡</div>
            <h3 class="pillar-heading">Khớp Lệnh Siêu Tốc</h3>
            <p class="pillar-desc">Độ trễ dưới 12 microsecond, mang lại trải nghiệm mượt mà không độ trễ nghẽn lệnh.</p>
          </div>

          <!-- Trụ Cột 2: Bảo Mật SAFU -->
          <div class="pillar-glass-slab">
            <div class="gold-wave-trim"></div>
            <div class="pillar-ico">🛡️</div>
            <h3 class="pillar-heading">Bảo Mật Cấp Ngân Hàng</h3>
            <p class="pillar-desc">Quỹ dự trữ bảo vệ tài sản SAFU độc lập cùng kiến trúc mã hóa đa lớp bảo vệ 100% tiền gửi.</p>
          </div>

          <!-- Trụ Cột 3: Thanh Khoản Sâu -->
          <div class="pillar-glass-slab">
            <div class="gold-wave-trim"></div>
            <div class="pillar-ico">📊</div>
            <h3 class="pillar-heading">Thanh Khoản Sâu</h3>
            <p class="pillar-desc">Kết nối thanh khoản đa sàn hàng đầu thế giới với hơn 150+ cặp Crypto, Cổ phiếu Mỹ và Vàng.</p>
          </div>

          <!-- Trụ Cột 4: Ưu Đãi Founder -->
          <div class="pillar-glass-slab">
            <div class="gold-wave-trim"></div>
            <div class="pillar-ico">🎁</div>
            <h3 class="pillar-heading">Ưu Đãi Đặc Quyền</h3>
            <p class="pillar-desc">Hoàn phí giao dịch & quyền lợi thành viên VIP ApexCore độc quyền cho cộng đồng.</p>
          </div>
        </div>

        <!-- Phiến Kính Lớn: Giao Dịch Mọi Lúc Mọi Nơi (Mobile Apex Pro) -->
        <div class="mobile-pro-slab">
          <div class="mobile-phone-mockup">
            <div class="mp-tag">APEXCORE MOBILE PRO</div>
            <div class="mp-balance">$7,281.43</div>
            <div class="mp-pnl">Today's PnL: +$1,231 (+0.25%)</div>
            <div class="mp-tickers">
              <span>BNB $883.47</span>
              <span>BTC $85,461</span>
              <span>ETH $2,618</span>
            </div>
          </div>

          <div class="mobile-dl-col">
            <h3>Giao dịch mọi lúc. Mọi nơi.</h3>
            <p>Quét mã QR để tải ứng dụng sàn giao dịch ApexCore trên thiết bị của bạn.</p>

            <div class="qr-trigger-box" onclick="alert('Quét QR để cài App ApexCore trên iOS & Android')">
              <span class="qr-ico">📲</span>
              <div class="qr-txt-group">
                <strong>QUÉT QR TẢI APP IOS & ANDROID</strong>
                <span>Hỗ trợ FaceID & Sinh trắc học</span>
              </div>
            </div>

            <div class="os-platforms-row">
              <span class="os-pill" onclick="alert('Bản cài đặt MacOS đang sẵn sàng')">🍎 MacOS</span>
              <span class="os-pill" onclick="alert('Bản cài đặt Windows đang sẵn sàng')">🪟 Windows</span>
              <span class="os-pill" onclick="alert('Bản cài đặt Linux đang sẵn sàng')">🐧 Linux</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           [SECTION 03: FOOTER SOVEREIGN QUANTUM]
           ========================================================================== -->
      <footer class="apex-kinetic-footer">
        <p>© 2026 ApexCore Exchange. Bản quyền thuộc về Founder <strong>Nguyễn Phước Lộc</strong> (nguyenphuocloc010306@gmail.com · UID: 1107519625).</p>
      </footer>
    `;
  }

  initEvents() {
    window.switchHomeTab = (tabName) => {
      this.activeTab = tabName;
      ['popular', 'new', 'stocks', 'commodities'].forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (btn) {
          if (t === tabName) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
      this.renderTabContent(tabName);
    };

    window.setVortexMode = (mode) => {
      if (this.vortexController) {
        this.vortexController.switchMode(mode);
        const btnCanvas = document.getElementById('btnVortexCanvas3d');
        const btnCss = document.getElementById('btnVortexCss3d');
        if (btnCanvas && btnCss) {
          if (mode === 'canvas3d') {
            btnCanvas.style.background = 'rgba(0, 240, 255, 0.2)';
            btnCanvas.style.color = '#00F0FF';
            btnCanvas.style.borderColor = '#00F0FF';
            btnCss.style.background = 'transparent';
            btnCss.style.color = '#94A3B8';
            btnCss.style.borderColor = 'transparent';
          } else {
            btnCss.style.background = 'rgba(255, 215, 0, 0.2)';
            btnCss.style.color = '#FFD700';
            btnCss.style.borderColor = '#FFD700';
            btnCanvas.style.background = 'transparent';
            btnCanvas.style.color = '#94A3B8';
            btnCanvas.style.borderColor = 'transparent';
          }
        }
      }
    };

    // 8K EXCHANGE EXPLORER INTERACTION (CHƯƠNG XXXI)
    window.handleCardParallax = (e, card) => {
      if (!card || !e) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / rect.height) * -20;
      const rotY = (x / rect.width) * 20;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04, 1.04, 1.04)`;
    };

    window.resetCardParallax = (card) => {
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    window.filterExchanges = (category) => {
      const tabs = document.querySelectorAll('.filter-tab');
      tabs.forEach(t => t.classList.remove('active'));
      if (window.event && window.event.target) {
        window.event.target.classList.add('active');
      }
      const cards = document.querySelectorAll('.ex-card');
      cards.forEach(c => {
        const cats = c.getAttribute('data-cat') || '';
        if (category === 'all' || cats.includes(category)) {
          c.style.display = 'flex';
          c.style.opacity = '1';
        } else {
          c.style.display = 'none';
          c.style.opacity = '0';
        }
      });
    };

    window.openQuickPeek = (e, name, price, spread, slug) => {
      if (e) e.stopPropagation();
      const modal = document.getElementById('quickPeekModal');
      const title = document.getElementById('peekTitle');
      const priceEl = document.getElementById('peekPrice');
      const spreadEl = document.getElementById('peekSpread');
      const launchBtn = document.getElementById('peekLaunchBtn');

      if (title) title.innerText = `${name.toUpperCase()} SỔ LỆNH VI MÔ`;
      if (priceEl) priceEl.innerText = price;
      if (spreadEl) spreadEl.innerText = spread;
      if (launchBtn) {
        launchBtn.onclick = () => window.location.href = `trade.html?ex=${slug || 'binance'}`;
      }
      if (modal) modal.style.display = 'flex';
    };

    window.closeQuickPeek = (e) => {
      const modal = document.getElementById('quickPeekModal');
      if (modal) modal.style.display = 'none';
    };

    window.closeQuickPeekDirect = () => {
      const modal = document.getElementById('quickPeekModal');
      if (modal) modal.style.display = 'none';
    };
  }

  initParallaxTilt() {
    // Parallax tilt được quản lý trực tiếp mượt mà bởi BorderlessVortexEngine
  }

  renderTabContent(tab) {
    const container = document.getElementById('home-market-rows');
    if (!container) return;

    if (tab === 'popular') {
      container.innerHTML = `
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BTC/USDT'">
          <span class="coin-cell"><span class="c-ico">₿</span> BTC Bitcoin</span>
          <span class="px-val" id="pBtc">$85,447.74</span>
          <span class="chg-val plus">▲ +2.84%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=ETH/USDT'">
          <span class="coin-cell"><span class="c-ico">Ξ</span> ETH Ethereum</span>
          <span class="px-val" id="pEth">$2,622.54</span>
          <span class="chg-val plus">▲ +3.12%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BNB/USDT'">
          <span class="coin-cell"><span class="c-ico">❖</span> BNB BNB</span>
          <span class="px-val" id="pBnb">$767.44</span>
          <span class="chg-val plus">▲ +1.45%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=SOL/USDT'">
          <span class="coin-cell"><span class="c-ico">◎</span> SOL Solana</span>
          <span class="px-val" id="pSol">$188.65</span>
          <span class="chg-val plus">▲ +5.60%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BTC/USDT'">
          <span class="coin-cell"><span class="c-ico">⚡</span> NVDAB NVIDIA</span>
          <span class="px-val" id="pNvdab">$239.84</span>
          <span class="chg-val plus">▲ +0.17%</span>
        </div>
      `;
    } else if (tab === 'stocks') {
      container.innerHTML = `
        <div class="price-row" onclick="window.location.href='trade.html?symbol=SOL/USDT'">
          <span class="coin-cell"><span class="c-ico">⚡</span> NVDAB NVIDIA (bStocks)</span>
          <span class="px-val">$239.84</span>
          <span class="chg-val plus">▲ +0.17%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=ETH/USDT'">
          <span class="coin-cell"><span class="c-ico">🍎</span> AAPLB Apple Inc</span>
          <span class="px-val">$231.50</span>
          <span class="chg-val plus">▲ +0.42%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BTC/USDT'">
          <span class="coin-cell"><span class="c-ico">🏢</span> FPT_VND FPT Corp</span>
          <span class="px-val">132,500đ</span>
          <span class="chg-val plus">▲ +2.71%</span>
        </div>
      `;
    } else if (tab === 'commodities') {
      container.innerHTML = `
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BTC/USDT'">
          <span class="coin-cell"><span class="c-ico">🥇</span> XAU_USD Vàng Giao Ngay</span>
          <span class="px-val">$2,654.80</span>
          <span class="chg-val plus">▲ +0.64%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=ETH/USDT'">
          <span class="coin-cell"><span class="c-ico">🥈</span> XAG_USD Bạc Giao Ngay</span>
          <span class="px-val">$31.85</span>
          <span class="chg-val plus">▲ +1.15%</span>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="price-row" onclick="window.location.href='trade.html?symbol=SOL/USDT'">
          <span class="coin-cell"><span class="c-ico">✨</span> SUI Sui Network</span>
          <span class="px-val">$1.84</span>
          <span class="chg-val plus">▲ +12.4%</span>
        </div>
        <div class="price-row" onclick="window.location.href='trade.html?symbol=BNB/USDT'">
          <span class="coin-cell"><span class="c-ico">🌟</span> APT Aptos</span>
          <span class="px-val">$8.45</span>
          <span class="chg-val plus">▲ +5.8%</span>
        </div>
      `;
    }
  }

  startLiveTickers() {
    this.userTimer = setInterval(() => {
      this.userCount += Math.floor(Math.random() * 3) + 1;
      const counterEl = document.getElementById('userCounter');
      if (counterEl) {
        counterEl.textContent = this.userCount.toLocaleString('en-US');
      }
    }, 2000);

    this.priceTimer = setInterval(() => {
      const btcEl = document.getElementById('pBtc');
      if (btcEl) {
        const btc = 85447.74 + (Math.random() - 0.49) * 15;
        btcEl.textContent = '$' + btc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const ethEl = document.getElementById('pEth');
      if (ethEl) {
        const eth = 2622.54 + (Math.random() - 0.49) * 8;
        ethEl.textContent = '$' + eth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const bnbEl = document.getElementById('pBnb');
      if (bnbEl) {
        const bnb = 767.44 + (Math.random() - 0.49) * 2;
        bnbEl.textContent = '$' + bnb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const solEl = document.getElementById('pSol');
      if (solEl) {
        const sol = 188.65 + (Math.random() - 0.49) * 1.5;
        solEl.textContent = '$' + sol.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }, 1600);
  }
}
