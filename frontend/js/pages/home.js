/* ========================================================
   APEXCORE PRO — HOME PAGE (js/pages/home.js)
   CHUẨN BINANCE V7.0 — FULL-WIDTH, 2 CỘT SONG SONG KHÔNG VỠ
   KHÓA CHẶT KÍCH THƯỚC LOGO BITCOIN & MỌI SVG (24x24 / 20x20)
   Founder & CEO: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

export class HomePage {
  constructor(router) {
    this.router = router;
    this.userCount = 332845668;
    this.userTimer = null;
    this.priceTimer = null;
    this.activeTab = 'popular';
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
    this.startLiveTickers();
    if (window.currentLang && typeof window.applyLanguageToHome === 'function') {
      window.applyLanguageToHome();
    }
  }

  unmount() {
    if (this.userTimer) {
      clearInterval(this.userTimer);
      this.userTimer = null;
    }
    if (this.priceTimer) {
      clearInterval(this.priceTimer);
      this.priceTimer = null;
    }
  }

  renderHTML() {
    return `
      <!-- 2. BỐ CỤC HERO CHUẨN 2 CỘT -->
      <main class="hero-layout">
        
        <!-- CỘT TRÁI: DỮ LIỆU NGƯỜI DÙNG & ĐĂNG KÝ NHANH -->
        <div class="hero-left">
          <div class="hero-counter" id="userCounter">${this.userCount.toLocaleString('en-US')}</div>
          <div class="hero-title" id="l-trust">USERS TRUST US</div>
          <div class="hero-desc" id="l-founder">
            Sàn Giao Dịch Đa Tài Sản Hàng Đầu • Sáng Lập Bởi <strong>NGUYỄN PHƯỚC LỘC</strong>
          </div>

          <!-- CỤM ẤN TÍN BẢO CHỨNG QUỐC GIA NẰM NGANG ĐỘC QUYỀN (MỤC 3 CHUẨN V14.0) -->
          <div class="sovereign-seal-row" style="justify-content: flex-start; margin: 20px 0 24px;">
            <!-- Thẻ 1: Tài sản Bảo chứng -->
            <div class="seal-badge-card">
              <div class="seal-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FCD535" stroke-width="2">
                  <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div class="seal-text-group">
                <div class="seal-title-row">
                  <span class="seal-rank">No.1</span>
                  <span class="seal-name">Customer Assets</span>
                </div>
                <div class="seal-sub">Bảo Chứng An Toàn Cấp Quốc Gia • 100% Reserve SAFU</div>
              </div>
            </div>
            <!-- Thẻ 2: Khối lượng giao dịch & Founder -->
            <div class="seal-badge-card">
              <div class="seal-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FCD535" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="seal-text-group">
                <div class="seal-title-row">
                  <span class="seal-rank">No.1</span>
                  <span class="seal-name">Trading Volume</span>
                </div>
                <div class="seal-sub">Thanh Khoản Toàn Cầu • Founder Nguyễn Phước Lộc (UID 1107519625)</div>
              </div>
            </div>
          </div>

          <!-- THANH ĐĂNG KÝ NHANH -->
          <div class="quick-input-group">
            <input type="text" id="quickInp" placeholder="Email / Số điện thoại" autocomplete="username">
            <button class="btn-quick-go" id="l-quickbtn" onclick="window.submitQuick ? window.submitQuick() : window.loginWithGoogleOAuth()">Đăng Ký</button>
          </div>

          <!-- NÚT TRUY CẬP BUỒNG LÁI SANG TRỌNG ĐẲNG CẤP (ĐÃ BỎ ICON TIA SÉT - ẢNH 3) -->
          <div style="margin: 14px 0 18px;">
            <button onclick="location.href='trade.html'" class="btn-cockpit-gold" style="background: linear-gradient(135deg, #FCD535, #E5A800); color: #000; font-weight: 900; font-size: 14px; letter-spacing: 0.8px; padding: 12px 28px; border: none; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 20px rgba(252, 213, 53, 0.35); transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;">
              <span>TRUY CẬP BUỒNG LÁI GIAO DỊCH PRO</span>
              <span class="cockpit-arrow" style="font-size: 16px; display: inline-block; transition: transform 0.2s ease;">→</span>
            </button>
          </div>

          <!-- 3 NÚT GOOGLE, APPLE, QR (KHÓA KÍCH THƯỚC CHUẨN 20x20) -->
          <div class="quick-social-icons">
            <!-- Nút Google -->
            <div class="social-btn-box" title="Đăng nhập Google" onclick="window.loginWithGoogleOAuth ? window.loginWithGoogleOAuth() : window.loginWithGoogle()">
              <svg class="icon-social" width="20" height="20" viewBox="0 0 24 24" style="width:20px;height:20px;max-width:20px;max-height:20px;min-width:20px;min-height:20px;">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <!-- Nút Apple -->
            <div class="social-btn-box" title="Đăng nhập Apple" onclick="window.loginWithAppleOAuth ? window.loginWithAppleOAuth() : window.loginWithApple()">
              <svg class="icon-social" width="20" height="20" viewBox="0 0 170 170" fill="currentColor" style="width:20px;height:20px;max-width:20px;max-height:20px;min-width:20px;min-height:20px;">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.79-11.75-13.88-25.18-18.28-40.3-4.4-15.11-6.6-28.77-6.6-40.97 0-14.59 3.44-26.68 10.33-36.27 6.89-9.59 15.69-14.49 26.4-14.71 4.58 0 9.8 1.25 15.66 3.76 5.86 2.5 9.77 3.82 11.73 3.94 1.74 0 5.86-1.4 12.37-4.22 6.51-2.81 12.01-4.04 16.51-3.69 12.86 1.09 23.01 6.27 30.45 15.54-11.33 6.86-16.89 16.32-16.68 28.38.22 9.59 3.87 17.65 10.95 24.18 7.08 6.53 15.42 10.23 25.04 11.09-2.39 7.4-5.39 15.1-9 23.12zM119.22 33.15c0-7.62 2.76-14.88 8.28-21.78 5.52-6.9 12.28-11.02 20.28-12.37.22 1.09.33 2.18.33 3.27 0 7.4-2.87 14.71-8.61 21.93-5.74 7.22-12.65 11.44-20.73 12.65-.22-1.2-.45-2.43-.45-3.7z"/>
              </svg>
            </div>
            <!-- Nút QR -->
            <div class="social-btn-box" title="Quét mã QR" onclick="alert('Quét mã QR để tải App ApexCore trên điện thoại!')">
              <span style="font-size: 18px;">📱</span>
            </div>
            <span style="font-size: 13px; color: var(--text-secondary);" id="l-quicktxt">Đăng nhập siêu tốc 1-Click</span>
          </div>
        </div>

        <!-- CỘT PHẢI: 2 THẺ XẾP TẦNG -->
        <div class="hero-right">
          <!-- THẺ 1: BẢNG GIÁ POPULAR / STOCKS -->
          <div class="card-panel">
            <div class="tab-head-row">
              <div class="tab-head-left">
                <span class="tab-item-link active" id="tab-btn-popular" onclick="window.switchHomeTab('popular')">Popular</span>
                <span class="tab-item-link" id="tab-btn-new" onclick="window.switchHomeTab('new')">New Listing</span>
                <span class="tab-item-link" id="tab-btn-stocks" onclick="window.switchHomeTab('stocks')">Stocks</span>
                <span class="tab-item-link" id="tab-btn-commodities" onclick="window.switchHomeTab('commodities')">tCommodities</span>
              </div>
              <a href="#/markets" style="font-size: 12px; color: var(--text-secondary); text-decoration:none; cursor: pointer;" id="l-viewall">Xem tất cả ></a>
            </div>

            <div id="home-market-rows">
              <!-- BTC (ĐÃ KHÓA KÍCH THƯỚC 24x24) -->
              <div class="market-coin-row" onclick="window.location.hash='#/trade/BTC_USDT'">
                <div class="coin-left-info">
                  <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
                    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                    <path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783-1.728-.431-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.537c-.535 2.146-4.148.986-5.318.695l.95-3.805c1.17.292 4.925.872 4.368 3.11zm.535-5.567c-.488 1.954-3.495.962-4.47.719l.86-3.45c.976.243 4.118.697 3.61 2.731z"/>
                  </svg>
                  <div><span class="coin-symbol">BTC</span> <span class="coin-desc">Bitcoin</span></div>
                </div>
                <div class="coin-price-num" id="pBtc">$85,450.90</div>
                <div class="coin-change-pill c-green">+2.45%</div>
              </div>

              <!-- ETH -->
              <div class="market-coin-row" onclick="window.location.hash='#/trade/ETH_USDT'">
                <div class="coin-left-info">
                  <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
                    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
                    <path fill="#FFF" fill-opacity=".6" d="M16.498 4v8.87l7.497 3.35z"/>
                    <path fill="#FFF" d="M16.498 4L9 16.22l7.498-3.35z"/>
                    <path fill="#FFF" fill-opacity=".6" d="M16.498 21.968v6.027L24 17.616z"/>
                    <path fill="#FFF" d="M16.498 27.995v-6.028L9 17.616z"/>
                    <path fill="#FFF" fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
                    <path fill="#FFF" fill-opacity=".6" d="M9 16.22l7.498 4.353v-7.701z"/>
                  </svg>
                  <div><span class="coin-symbol">ETH</span> <span class="coin-desc">Ethereum</span></div>
                </div>
                <div class="coin-price-num" id="pEth">$2,619.95</div>
                <div class="coin-change-pill c-red">-1.20%</div>
              </div>

              <!-- BNB -->
              <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
                <div class="coin-left-info">
                  <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
                    <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
                    <path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.884 2.26 2.259L16 26l-6.144-6.144 2.26-2.26zM21.48 16l2.26-2.26L26 16l-2.26 2.26-2.26-2.26zm-3.22 0l-2.26-2.26-2.26 2.26 2.26 2.26 2.26-2.26z"/>
                  </svg>
                  <div><span class="coin-symbol">BNB</span> <span class="coin-desc">BNB</span></div>
                </div>
                <div class="coin-price-num" id="pBnb">$768.38</div>
                <div class="coin-change-pill c-green">+0.85%</div>
              </div>

              <!-- SPACEX -->
              <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
                <div class="coin-left-info">
                  <span style="font-size: 20px;">🚀</span>
                  <div><span class="coin-symbol">SPCXB</span> <span class="coin-desc">SpaceX (bStocks)</span></div>
                </div>
                <div class="coin-price-num">$168.96</div>
                <div class="coin-change-pill c-green">+1.38%</div>
              </div>

              <!-- NVIDIA -->
              <div class="market-coin-row" onclick="window.location.hash='#/trade/FPT_VND'">
                <div class="coin-left-info">
                  <span style="font-size: 20px;">⚡</span>
                  <div><span class="coin-symbol">NVDAB</span> <span class="coin-desc">NVIDIA (bStocks)</span></div>
                </div>
                <div class="coin-price-num">$239.84</div>
                <div class="coin-change-pill c-green">+0.17%</div>
              </div>
            </div>
          </div>

          <!-- THẺ 2: TIN TỨC SỰ KIỆN -->
          <div class="card-panel">
            <div class="tab-head-row">
              <span style="font-weight: 800;" id="l-newshead">Tin Tức Thị Trường</span>
              <a href="#/square" style="font-size: 12px; color: var(--text-secondary); text-decoration:none; cursor: pointer;" id="l-newsall">Xem tất cả ></a>
            </div>
            <div class="news-article-line" onclick="window.location.hash='#/square'">● AI | OpenAI tìm kiếm khoản đầu tư 30 tỷ USD với mức định giá 1,4 nghìn tỷ USD</div>
            <div class="news-article-line" onclick="window.location.hash='#/square'">● AI | Anthropic mở rộng quyền truy cập các mô hình mới nhất cho bảo mật tài chính</div>
            <div class="news-article-line" onclick="window.location.hash='#/square'">● ĐỊA CHÍNH TRỊ | Cục Dự trữ Liên bang duy trì lộ trình ổn định thanh khoản toàn cầu</div>
            <div class="news-article-line" onclick="window.location.hash='#/square'">● GOLDMAN SACHS | Dự báo thị trường tài sản số tiếp tục tăng trưởng mạnh mẽ</div>
          </div>
        </div>
      </main>

      <!-- 3. VÌ SAO CHỌN SÀN -->
      <section class="why-block">
        <h2 class="why-title-main" id="l-whyhead">Vì Sao Các Nhà Giao Dịch Chọn ApexCore</h2>
        <div class="why-cards-row">
          <div class="why-single-card">
            <div class="why-ico">⚡</div>
            <div class="why-h" id="l-f1h">Khớp Lệnh Siêu Tốc</div>
            <div class="why-p" id="l-f1p">Động cơ khớp lệnh đạt độ trễ dưới 12 microsecond, mang đến trải nghiệm mượt mà không độ trễ nghẽn lệnh.</div>
          </div>
          <div class="why-single-card">
            <div class="why-ico">🛡️</div>
            <div class="why-h" id="l-f2h">Bảo Mật Cấp Ngân Hàng</div>
            <div class="why-p" id="l-f2p">Quỹ dự trữ bảo vệ tài sản SAFU độc lập cùng kiến trúc mã hóa đa lớp bảo vệ 100% tiền gửi.</div>
          </div>
          <div class="why-single-card">
            <div class="why-ico">📊</div>
            <div class="why-h" id="l-f3h">Thanh Khoản Sâu</div>
            <div class="why-p" id="l-f3p">Kết nối thanh khoản đa sàn hàng đầu thế giới với hơn 150+ cặp giao dịch Crypto, Cổ phiếu Mỹ và Vàng.</div>
          </div>
          <div class="why-single-card">
            <div class="why-ico">🎁</div>
            <div class="why-h" id="l-f4h">Ưu Đãi Đặc Quyền</div>
            <div class="why-p" id="l-f4p">Chương trình hoàn phí giao dịch và phần thưởng chào mừng dành riêng cho thành viên của ApexCore.</div>
          </div>
        </div>
      </section>

      <!-- 4. KHỐI TẢI APP -->
      <section class="download-block">
        <div class="phone-box">
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">APEXCORE MOBILE PRO</div>
          <div style="font-size: 28px; font-weight: 900; color: var(--color-yellow, #fcd535);">$7,281.43</div>
          <div style="font-size: 12px; color: var(--green, #0ecb81); margin-bottom: 16px;">Today's PNL: +$1,231 (+0.25%)</div>
          <div style="display: flex; justify-content: space-around; font-size: 12px; color: var(--text-secondary);">
            <span>BNB $883.47</span><span>BTC $85,461</span><span>ETH $2,618</span>
          </div>
        </div>
        <div>
          <h2 style="font-size: 38px; font-weight: 900; margin-bottom: 12px;" id="l-dlhead">Giao dịch mọi lúc. Mọi nơi.</h2>
          <p style="color: var(--text-secondary);" id="l-dlsub">Quét mã QR để tải ứng dụng sàn giao dịch ApexCore trên thiết bị của bạn.</p>
          
          <div class="qr-badge-box">
            <span style="font-size: 48px;">📲</span>
            <div>
              <div style="font-size: 13px; color: var(--text-secondary);">Scan to Download App</div>
              <div style="font-size: 16px; font-weight: 800; color: var(--text-primary);">iOS and Android</div>
            </div>
          </div>
          <div class="os-row">
            <span class="os-link" onclick="alert('Đang chuẩn bị bản cài đặt ApexCore cho MacOS!')">🍎 MacOS</span>
            <span class="os-link" onclick="alert('Đang chuẩn bị bản cài đặt ApexCore cho Windows!')">🪟 Windows</span>
            <span class="os-link" onclick="alert('Đang chuẩn bị bản cài đặt ApexCore cho Linux!')">🐧 Linux</span>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="home-page-footer">
        <p>© 2026 ApexCore Exchange. Bản quyền thuộc về Founder <strong>Nguyễn Phước Lộc</strong> (nguyenphuocloc010306@gmail.com).</p>
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
  }

  renderTabContent(tab) {
    const container = document.getElementById('home-market-rows');
    if (!container) return;

    if (tab === 'popular') {
      container.innerHTML = `
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BTC_USDT'">
          <div class="coin-left-info">
            <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
              <circle cx="16" cy="16" r="16" fill="#F7931A"/>
              <path fill="#FFF" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783-1.728-.431-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.537c-.535 2.146-4.148.986-5.318.695l.95-3.805c1.17.292 4.925.872 4.368 3.11zm.535-5.567c-.488 1.954-3.495.962-4.47.719l.86-3.45c.976.243 4.118.697 3.61 2.731z"/>
            </svg>
            <div><span class="coin-symbol">BTC</span> <span class="coin-desc">Bitcoin</span></div>
          </div>
          <div class="coin-price-num" id="pBtc">$85,450.90</div>
          <div class="coin-change-pill c-green">+2.45%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/ETH_USDT'">
          <div class="coin-left-info">
            <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
              <circle cx="16" cy="16" r="16" fill="#627EEA"/>
              <path fill="#FFF" fill-opacity=".6" d="M16.498 4v8.87l7.497 3.35z"/>
              <path fill="#FFF" d="M16.498 4L9 16.22l7.498-3.35z"/>
              <path fill="#FFF" fill-opacity=".6" d="M16.498 21.968v6.027L24 17.616z"/>
              <path fill="#FFF" d="M16.498 27.995v-6.028L9 17.616z"/>
              <path fill="#FFF" fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
              <path fill="#FFF" fill-opacity=".6" d="M9 16.22l7.498 4.353v-7.701z"/>
            </svg>
            <div><span class="coin-symbol">ETH</span> <span class="coin-desc">Ethereum</span></div>
          </div>
          <div class="coin-price-num" id="pEth">$2,619.95</div>
          <div class="coin-change-pill c-red">-1.20%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
          <div class="coin-left-info">
            <svg class="icon-coin" width="24" height="24" viewBox="0 0 32 32" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
              <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
              <path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.884 2.26 2.259L16 26l-6.144-6.144 2.26-2.26zM21.48 16l2.26-2.26L26 16l-2.26 2.26-2.26-2.26zm-3.22 0l-2.26-2.26-2.26 2.26 2.26 2.26 2.26-2.26z"/>
            </svg>
            <div><span class="coin-symbol">BNB</span> <span class="coin-desc">BNB</span></div>
          </div>
          <div class="coin-price-num" id="pBnb">$768.38</div>
          <div class="coin-change-pill c-green">+0.85%</div>
        </div>
      `;
    } else if (tab === 'stocks') {
      container.innerHTML = `
        <div class="market-coin-row" onclick="window.location.hash='#/trade/FPT_VND'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">⚡</span>
            <div><span class="coin-symbol">NVDAB</span> <span class="coin-desc">NVIDIA (bStocks)</span></div>
          </div>
          <div class="coin-price-num">$239.84</div>
          <div class="coin-change-pill c-green">+0.17%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/FPT_VND'">
          <div class="coin-left-info">
            <svg class="icon-coin" width="24" height="24" viewBox="0 0 170 170" fill="currentColor" style="width:24px;height:24px;max-width:24px;max-height:24px;min-width:24px;min-height:24px;">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.74-11.89-14.1-6.73-10.14-12.02-21.65-15.88-34.52-3.86-12.87-5.8-24.97-5.8-36.31 0-15.03 3.73-27.53 11.2-37.52 7.46-9.98 16.9-15.08 28.3-15.3 4.8.12 10.23 1.34 16.29 3.67 6.06 2.33 10.05 3.63 11.97 3.9 2.45-.48 6.64-1.94 12.56-4.39 5.92-2.44 11.05-3.53 15.39-3.26 13.68.79 24.59 5.86 32.72 15.2-11.96 7.27-17.8 17.2-17.52 29.8.27 9.87 4.09 18.23 11.45 25.07 7.37 6.84 16.14 10.58 26.31 11.23-2.17 6.3-4.8 12.44-7.89 18.42m-33.3-107.01c0 7.82-2.9 15.17-8.69 22.06-6.84 8.04-15.22 12.63-24.6 11.85-.27-1.19-.41-2.38-.41-3.57 0-7.59 3.03-15.25 9.09-22.97 3.03-3.86 6.78-7.06 11.25-9.6 4.47-2.54 8.78-4.04 12.93-4.51.3 2.29.43 4.54.43 6.74z"/>
            </svg>
            <div><span class="coin-symbol">AAPLB</span> <span class="coin-desc">Apple Inc (bStocks)</span></div>
          </div>
          <div class="coin-price-num">$231.50</div>
          <div class="coin-change-pill c-green">+0.42%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/FPT_VND'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">🏢</span>
            <div><span class="coin-symbol">FPT_VND</span> <span class="coin-desc">FPT Corporation</span></div>
          </div>
          <div class="coin-price-num">132,500đ</div>
          <div class="coin-change-pill c-green">+2.71%</div>
        </div>
      `;
    } else if (tab === 'commodities') {
      container.innerHTML = `
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">🥇</span>
            <div><span class="coin-symbol">XAU_USD</span> <span class="coin-desc">Vàng Giao Ngay (Gold)</span></div>
          </div>
          <div class="coin-price-num">$2,654.80</div>
          <div class="coin-change-pill c-green">+0.64%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">🥈</span>
            <div><span class="coin-symbol">XAG_USD</span> <span class="coin-desc">Bạc Giao Ngay (Silver)</span></div>
          </div>
          <div class="coin-price-num">$31.85</div>
          <div class="coin-change-pill c-green">+1.15%</div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">✨</span>
            <div><span class="coin-symbol">SUI</span> <span class="coin-desc">Sui Network</span></div>
          </div>
          <div class="coin-price-num">$1.84</div>
          <div class="coin-change-pill c-green">+12.4%</div>
        </div>
        <div class="market-coin-row" onclick="window.location.hash='#/trade/BNB_USDT'">
          <div class="coin-left-info">
            <span style="font-size: 20px;">🌟</span>
            <div><span class="coin-symbol">APT</span> <span class="coin-desc">Aptos</span></div>
          </div>
          <div class="coin-price-num">$8.45</div>
          <div class="coin-change-pill c-green">+5.8%</div>
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
        const btc = 85450.90 + (Math.random() - 0.49) * 15;
        btcEl.textContent = '$' + btc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const ethEl = document.getElementById('pEth');
      if (ethEl) {
        const eth = 2619.95 + (Math.random() - 0.49) * 8;
        ethEl.textContent = '$' + eth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const bnbEl = document.getElementById('pBnb');
      if (bnbEl) {
        const bnb = 768.38 + (Math.random() - 0.49) * 2;
        bnbEl.textContent = '$' + bnb.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }, 1600);
  }
}
