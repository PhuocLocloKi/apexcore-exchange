/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — EXECUTION TAPE & PRO CONTROLS
 * (frontend/scripts/engines/tape-engine.js)
 * Băng khớp lệnh Time & Sales 9 Cột, Thước Đo Sổ Lệnh Skew Ladder & 4 Hộp KPI
 * Master Blueprint Official V14 — Final Master Edition
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * ========================================================
 */

(function () {
  'use strict';

  if (window.TapeEngine) return;

  class SovereignTapeEngine {
    constructor() {
      this.tableContainer = null;
      this.proContainer = null;
      this.trades = [];
      this.maxTrades = 16;
      this.totalFills = 6471;
      this.isNewTradeFlash = false;

      // Filter: 'ALL' | 'BUY' | 'SELL' | 'WHALE'
      this.activeFilter = 'ALL';

      this.currentPrice = 86917.00;
      this.activeSymbol = 'BTC/USDT';
      this.activeUnit = 'BTC';
      this.currentExchange = 'APEXCORE';
      this.tradingMode = 'SPOT';

      this.buysCount = 3524;
      this.sellsCount = 2947;
      this.settledTrades = 6471;
      this.lastFillDelta = '$16.15 UP @ .95';

      // KPI elements
      this.lastFillStat = null;
      this.avgMedianStat = null;
      this.buysPctStat = null;
      this.winrateStat = null;
      this.fillsBadge = null;

      // Audio
      this.audioCtx = null;
      this.soundEnabled = true;

      // Hotkey debounce
      this.lastHotkeyTime = 0;

      // Cockpit state
      this.orderType = 'MARKET'; // 'LIMIT' | 'MARKET' | 'STOP'
      this.leverage = '10X';      // '10X' | '20X' | '100X'
      this.capitalPercent = 100;

      // Bottom management active tab
      this.bottomTab = 'orders'; // 'orders' | 'positions' | 'history' | 'wallet'
      this.resolutionTab = 'settling'; // 'settling' | 'open'
    }

    init() {
      this.tableContainer = document.getElementById('tape-scroll-zone');
      this.proContainer = document.getElementById('tape-pro-rows-zone');
      this.lastFillStat = document.getElementById('kpi-last-fill');
      this.avgMedianStat = document.getElementById('kpi-avg-median');
      this.buysPctStat = document.getElementById('kpi-buys-pct');
      this.winrateStat = document.getElementById('kpi-winrate');
      this.fillsBadge = document.getElementById('txt-tape-fills-count');

      this.initInitialTrades();
      this.renderTape();
      this.updateFooterStats();
      this.updateSkewLadder();
      this.bindHftHotkeys();
      this.startSimulatedFeed();
      this.bindResolutionTileClicks();
      this.renderBottomTable();

      // Lắng nghe đổi tài sản
      if (window.ApexEventBus) {
        window.ApexEventBus.on('ASSET_SWITCHED', (sym) => {
          this.activeSymbol = sym;
          this.activeUnit = sym.split('/')[0];
          this.initInitialTrades();
          this.renderTape();
        });

        window.ApexEventBus.on(window.ApexEvents.PRICE_TICK, (price) => {
          this.currentPrice = price;
        });
      }
    }

    initInitialTrades() {
      // 10 Lệnh định lượng chuẩn y chang Ảnh 4
      this.trades = [
        { time: '17:15:38', mkt: 'BTC 5M',  side: 'UP', act: 'ADD',   px: '0.94', size: '$34.12', pUp: '.978', edge: '+2.5', result: '+$0.82', isWhale: false, isWin: true },
        { time: '17:15:36', mkt: 'BTC 15M', side: 'DN', act: 'HEDGE', px: '0.98', size: '$54.30', pUp: '.962', edge: '+0.2', result: '+$0.79', isWhale: true,  isWin: true },
        { time: '17:15:35', mkt: 'BTC 5M',  side: 'UP', act: 'ENTRY', px: '0.92', size: '$8.92',  pUp: '.942', edge: '+1.3', result: '+$0.50', isWhale: false, isWin: true },
        { time: '17:15:33', mkt: 'BTC 5M',  side: 'UP', act: 'ADD',   px: '0.97', size: '$4.73',  pUp: '.972', edge: '+0.3', result: '+$0.37', isWhale: false, isWin: true },
        { time: '17:15:30', mkt: 'BTC 5M',  side: 'UP', act: 'FLIP',  px: '0.95', size: '$11.12', pUp: '.973', edge: '+1.0', result: '+$1.33', isWhale: false, isWin: true },
        { time: '17:15:28', mkt: 'ETH 5M',  side: 'DN', act: 'ENTRY', px: '0.96', size: '$21.12', pUp: '.975', edge: '+1.9', result: '+$4.20', isWhale: false, isWin: true },
        { time: '17:15:25', mkt: 'SOL 5M',  side: 'UP', act: 'ADD',   px: '0.58', size: '$10.95', pUp: '.934', edge: '+2.1', result: '+$1.12', isWhale: false, isWin: true },
        { time: '17:15:20', mkt: 'BTC 5M',  side: 'UP', act: 'ADD',   px: '0.60', size: '$21.44', pUp: '.967', edge: '+2.5', result: '+$2.34', isWhale: false, isWin: true },
        { time: '17:15:15', mkt: 'BTC 15M', side: 'UP', act: 'ENTRY', px: '0.95', size: '$16.15', pUp: '.958', edge: '+1.8', result: '+$0.95', isWhale: false, isWin: true },
        { time: '17:15:10', mkt: 'ETH 15M', side: 'DN', act: 'HEDGE', px: '0.97', size: '$42.50', pUp: '.981', edge: '+0.4', result: '+$1.08', isWhale: true,  isWin: true }
      ];
      this.totalFills = 6471;
    }

    formatTime(date) {
      const pad = (n, z = 2) => String(n).padStart(z, '0');
      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());
      return `${h}:${m}:${s}`;
    }

    /**
     * BỘ LỌC BĂNG KHỚP LỆNH (TẤT CẢ | MUA | BÁN | CÁ VOI)
     */
    setFilter(filter) {
      this.activeFilter = filter;
      document.querySelectorAll('.tape-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
      });
      this.renderTape();
    }

    pushQuantTrade(customTrade = null) {
      const now = new Date();
      const timeStr = this.formatTime(now);

      let trade = customTrade;
      if (!trade) {
        const markets = ['BTC 5M', 'BTC 15M', 'ETH 5M', 'SOL 5M', 'BTC 5M', 'ETH 15M'];
        const acts = ['ADD', 'ENTRY', 'HEDGE', 'FLIP', 'ADD', 'ENTRY'];
        const isUp = Math.random() > 0.38;
        const mkt = markets[Math.floor(Math.random() * markets.length)];
        const act = acts[Math.floor(Math.random() * acts.length)];
        const px = (0.55 + Math.random() * 0.43).toFixed(2);
        const rawSize = (4 + Math.random() * 50);
        const size = '$' + rawSize.toFixed(2);
        const pUp = '.' + Math.floor(930 + Math.random() * 65);
        const edge = '+' + (Math.random() * 2.5 + 0.2).toFixed(1);
        const isWin = Math.random() > 0.16;
        const resVal = (Math.random() * 2.8 + 0.3).toFixed(2);
        const result = isWin ? `+$${resVal}` : `-$${(Math.random() * 0.9 + 0.1).toFixed(2)}`;

        trade = {
          time: timeStr,
          mkt: mkt,
          side: isUp ? 'UP' : 'DN',
          act: act,
          px: px,
          size: size,
          pUp: pUp,
          edge: edge,
          result: result,
          isWin: isWin,
          isWhale: rawSize > 35,
          price: this.currentPrice,
          rawSize: rawSize
        };
      }

      this.trades.unshift(trade);
      if (this.trades.length > this.maxTrades * 2) {
        this.trades.pop();
      }

      this.totalFills++;
      this.settledTrades++;
      if (trade.side === 'UP' || trade.side === 'BUY') this.buysCount++;
      else this.sellsCount++;

      this.isNewTradeFlash = true;
      this.renderTape();
      this.updateFooterStats();

      if (window.ApexEventBus) {
        window.ApexEventBus.emit(window.ApexEvents.TRADE_EXECUTED, {
          notional: trade.rawSize || 20,
          price: this.currentPrice,
          side: trade.side
        });
      }
    }

    pushTrade(side, price, size, isWhale = false) {
      const isUp = side === 'BUY' || side === 'UP';
      const timeStr = this.formatTime(new Date());
      const rawSize = parseFloat(size) || 10;
      const px = (0.80 + Math.random() * 0.18).toFixed(2);
      const acts = ['ENTRY', 'ADD', 'HEDGE', 'FLIP'];
      const act = acts[Math.floor(Math.random() * acts.length)];
      const resVal = (Math.random() * 3.2 + 0.4).toFixed(2);

      const quantTrade = {
        time: timeStr,
        mkt: this.activeSymbol ? this.activeSymbol.split('/')[0] + ' 5M' : 'BTC 5M',
        side: isUp ? 'UP' : 'DN',
        act: act,
        px: px,
        size: '$' + (rawSize * (price > 1000 ? 0.0005 : 1)).toFixed(2),
        pUp: '.' + Math.floor(935 + Math.random() * 60),
        edge: '+' + (Math.random() * 2.4 + 0.2).toFixed(1),
        result: `+$${resVal}`,
        isWin: true,
        isWhale: isWhale,
        price: price,
        rawSize: rawSize
      };

      this.pushQuantTrade(quantTrade);
    }

    renderTape() {
      // 1. Render Bảng Lệnh Chi Tiết Đa Chiều 9 Cột (Ô [05])
      if (this.proContainer) {
        let filtered = this.trades;
        if (this.activeFilter === 'BUY') {
          filtered = this.trades.filter(t => t.side === 'UP' || t.side === 'BUY');
        } else if (this.activeFilter === 'SELL') {
          filtered = this.trades.filter(t => t.side === 'DN' || t.side === 'SELL');
        } else if (this.activeFilter === 'WHALE') {
          filtered = this.trades.filter(t => t.isWhale);
        }

        const displayList = filtered.slice(0, 9);
        let html = '';
        for (let i = 0; i < displayList.length; i++) {
          const t = displayList[i];
          const isUp = t.side === 'UP' || t.side === 'BUY';
          const sideClass = isUp ? 'buy' : 'sell';
          const sideLabel = isUp ? 'UP' : 'DN';
          const actLower = (t.act || 'entry').toLowerCase();
          const resClass = t.isWin !== false ? 'win' : 'loss';
          const flashClass = (i === 0 && this.isNewTradeFlash) ? ' flash' : '';

          html += `
            <div class="tape-grid-row-item ${sideClass}${flashClass}">
              <span class="t-time">${t.time}</span>
              <span class="t-mkt">${t.mkt}</span>
              <span class="t-side">${sideLabel}</span>
              <span class="t-act-pill ${actLower}">${t.act}</span>
              <span class="t-px">${t.px}</span>
              <span class="t-size">${t.size}</span>
              <span class="t-pup">${t.pUp}</span>
              <span class="t-edge">${t.edge}</span>
              <span class="t-res ${resClass}">${t.result}</span>
            </div>
          `;
        }
        this.proContainer.innerHTML = html;
        this.isNewTradeFlash = false;
      }

      // 2. Legacy table nếu tồn tại
      if (this.tableContainer) {
        let filtered = this.trades;
        const displayList = filtered.slice(0, 10);
        let html = '';
        for (let i = 0; i < displayList.length; i++) {
          const t = displayList[i];
          const isUp = t.side === 'UP' || t.side === 'BUY';
          const sideClass = isUp ? 'buy' : 'sell';
          html += `
            <div class="tape-row-item ${sideClass}">
              <span>${t.time}</span>
              <span style="font-weight:700;">${t.side}</span>
              <span>${t.px || t.price}</span>
              <span style="text-align:right;">${t.size}</span>
            </div>
          `;
        }
        this.tableContainer.innerHTML = html;
      }
    }

    updateFooterStats() {
      // 1. Cập nhật Số Fills ở Header
      if (this.fillsBadge) {
        this.fillsBadge.textContent = this.totalFills.toLocaleString();
      }

      // 2. Cập nhật 4 Hộp KPI V14 Dưới Đáy
      if (this.lastFillStat && this.trades.length > 0) {
        const last = this.trades[0];
        const sideLabel = (last.side === 'BUY' || last.side === 'UP') ? 'UP' : 'DN';
        this.lastFillStat.textContent = `${last.size} ${sideLabel} @ ${last.px}`;
      }
      if (this.avgMedianStat) {
        this.avgMedianStat.textContent = '$29.80 / $17.20';
      }
      if (this.buysPctStat) {
        this.buysPctStat.textContent = '54.0%';
      }
      if (this.winrateStat) {
        this.winrateStat.textContent = '82.40%';
      }

      // Legacy footer fallback
      const buysRatio = ((this.buysCount / (this.buysCount + this.sellsCount)) * 100).toFixed(1);
      const legacyBuyStat = document.getElementById('tape-buys-percent');
      const legacySettledStat = document.getElementById('tape-settled-count');
      const legacyLastFillStat = document.getElementById('tape-last-fill');
      if (legacyBuyStat) legacyBuyStat.textContent = `${buysRatio}%`;
      if (legacySettledStat) legacySettledStat.textContent = this.settledTrades.toLocaleString();
      if (legacyLastFillStat) legacyLastFillStat.textContent = this.lastFillDelta;
    }

    updateSkewLadder() {
      // Rung động nhẹ nhàng khối lượng L2 Skew của BTC 15M (Độ lệch ±2-3%)
      const jitter = (base, range) => Math.round(base + (Math.random() - 0.5) * range);

      const v55 = jitter(755, 20);
      const v54 = jitter(680, 16);
      const v53 = jitter(1462, 30);
      const v52 = jitter(1820, 36);

      const v50 = jitter(1602, 30);
      const v49 = jitter(989, 22);
      const v48 = jitter(2845, 45);
      const v47 = jitter(4520, 50);

      const setVol = (id, vol) => {
        const el = document.getElementById(id);
        if (el) el.textContent = vol.toLocaleString();
      };
      const setBar = (id, pct) => {
        const el = document.getElementById(id);
        if (el) el.style.width = `${pct}%`;
      };

      setVol('ask-vol-55', v55);
      setVol('ask-vol-54', v54);
      setVol('ask-vol-53', v53);
      setVol('ask-vol-52', v52);

      setVol('bid-vol-50', v50);
      setVol('bid-vol-49', v49);
      setVol('bid-vol-48', v48);
      setVol('bid-vol-47', v47);

      setBar('ask-bar-55', Math.min(100, Math.round((v55 / 4520) * 100)));
      setBar('ask-bar-54', Math.min(100, Math.round((v54 / 4520) * 100)));
      setBar('ask-bar-53', Math.min(100, Math.round((v53 / 4520) * 100)));
      setBar('ask-bar-52', Math.min(100, Math.round((v52 / 4520) * 100)));

      setBar('bid-bar-50', Math.min(100, Math.round((v50 / 4520) * 100)));
      setBar('bid-bar-49', Math.min(100, Math.round((v49 / 4520) * 100)));
      setBar('bid-bar-48', Math.min(100, Math.round((v48 / 4520) * 100)));
      setBar('bid-bar-47', 100);
    }

    startSimulatedFeed() {
      let tickCount = 0;
      const tick = () => {
        tickCount++;
        this.pushQuantTrade();

        if (tickCount % 2 === 0) {
          this.updateSkewLadder();
        }

        const nextTick = Math.random() * 750 + 420;
        setTimeout(tick, nextTick);
      };

      setTimeout(tick, 600);
    }

    bindResolutionTileClicks() {
      const tiles = document.querySelectorAll('.res-tile');
      tiles.forEach(t => {
        t.onclick = () => {
          this.playHapticSound('CLICK');
        };
      });
    }

    /**
     * PHẦN 4.1: MA TRẬN NHIỆT ĐÁO HẠN LỆNH (RESOLUTION GRID - 16 Ô GẠCH 2 HÀNG X 8 CỘT)
     * Các thẻ Xanh: 93¢, 85¢, 70¢, 79¢, 53¢, 60¢, 79¢, 53¢
     * Các thẻ Đỏ: 29¢, 41¢, 36¢, 11¢, 15¢, 48¢, 96¢, 37¢
     * Mỗi ô gạch đều có chữ nhỏ li ti ghi tên mã thị trường và thời gian đáo hạn
     */
    switchResolutionTab(tab) {
      this.resolutionTab = tab;
      document.querySelectorAll('.res-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-res') === tab);
      });
    }

    renderResolutionGrid() {
      const gridBox = document.getElementById('resolution-heatmap-tiles');
      if (!gridBox) return;

      // 24 ô gạch (2 hàng x 12 cột) theo đúng chuẩn Blueprint V10
      const tiles = [
        // Hàng 1
        { val: '93¢', sec: '12s', up: true },
        { val: '85¢', sec: '18s', up: true },
        { val: '29¢', sec: '04s', up: false },
        { val: '41¢', sec: '22s', up: false },
        { val: '36¢', sec: '15s', up: false },
        { val: '36¢', sec: '31s', up: false },
        { val: '11¢', sec: '08s', up: false },
        { val: '79¢', sec: '45s', up: true },
        { val: '53¢', sec: '19s', up: true },
        { val: '15¢', sec: '03s', up: false },
        { val: '88¢', sec: '27s', up: true },
        { val: '64¢', sec: '39s', up: true },
        // Hàng 2
        { val: '9¢',  sec: '02s', up: false },
        { val: '48¢', sec: '14s', up: false },
        { val: '36¢', sec: '29s', up: false },
        { val: '70¢', sec: '51s', up: true },
        { val: '47¢', sec: '17s', up: false },
        { val: '37¢', sec: '33s', up: false },
        { val: '96¢', sec: '58s', up: false },
        { val: '60¢', sec: '41s', up: true },
        { val: '79¢', sec: '26s', up: true },
        { val: '4¢',  sec: '05s', up: false },
        { val: '52¢', sec: '38s', up: true },
        { val: '71¢', sec: '49s', up: true }
      ];

      let html = '';
      tiles.forEach(item => {
        const cls = item.up ? 'win' : 'loss';
        html += `
          <div class="res-tile ${cls}" onclick="window.TapeEngine && window.TapeEngine.playHapticSound('CLICK')">
            <span class="t-val">${item.val}</span>
            <span class="t-sec">${item.sec}</span>
          </div>
        `;
      });

      gridBox.innerHTML = html;
    }

    /**
     * TAB BAR 7: BẢNG QUẢN LÝ DƯỚI ĐÁY
     * LỆNH ĐANG CHỜ (03) | VỊ THẾ MỞ PnL | LỊCH SỬ KHỚP LỆNH | SỐ DƯ VÍ
     */
    switchBottomTab(tab) {
      this.bottomTab = tab;
      document.querySelectorAll('.bottom-nav-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });
      this.renderBottomTable();
    }

    renderBottomTable() {
      const container = document.getElementById('bottom-tab-content-pane');
      if (!container) return;

      if (this.bottomTab === 'orders') {
        container.innerHTML = `
          <div style="font-family:var(--font-code); font-size:11px;">
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1.2fr 1fr; color:var(--text-muted); padding:4px 0; border-bottom:1px solid var(--border-grid);">
              <span>MÃ</span><span>LOẠI</span><span>GIÁ ĐẶT</span><span>SỐ LƯỢNG</span><span>THỜI GIAN</span><span style="text-align:right;">THAO TÁC</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1.2fr 1fr; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
              <span style="color:var(--sovereign-gold); font-weight:700;">BTC/USDT</span><span style="color:var(--neon-emerald);">LIMIT BUY</span><span>$86,850.00</span><span>0.4500 BTC</span><span>15:15:20</span><span style="text-align:right; color:var(--laser-ruby); cursor:pointer;" onclick="alert('Đã hủy lệnh chờ #8104')">HỦY</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr 1.2fr 1fr; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.03);">
              <span style="color:var(--sovereign-gold); font-weight:700;">ETH/USDT</span><span style="color:var(--laser-ruby);">STOP SELL</span><span>$2,990.00</span><span>2.8000 ETH</span><span>15:14:48</span><span style="text-align:right; color:var(--laser-ruby); cursor:pointer;" onclick="alert('Đã hủy lệnh chờ #8105')">HỦY</span>
            </div>
          </div>
        `;
      } else if (this.bottomTab === 'positions') {
        container.innerHTML = `
          <div style="font-family:var(--font-code); font-size:11px;">
            <div style="display:grid; grid-template-columns: 1fr 1.5fr 1fr 1fr 1.2fr; color:var(--text-muted); padding:4px 0; border-bottom:1px solid var(--border-grid);">
              <span>VỊ THẾ</span><span>GIÁ VÀO</span><span>GIÁ THỊ TRƯỜNG</span><span>ROE %</span><span style="text-align:right;">PNL CHƯA CHỐT</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1.5fr 1fr 1fr 1.2fr; padding:6px 0;">
              <span style="color:var(--neon-emerald); font-weight:700;">LONG BTC 20X</span><span>$85,420.00</span><span>$86,887.00</span><span style="color:var(--neon-emerald); font-weight:700;">+34.34%</span><span style="text-align:right; color:var(--neon-emerald); font-weight:800;">+$2,934.00</span>
            </div>
          </div>
        `;
      } else if (this.bottomTab === 'history') {
        container.innerHTML = `
          <div style="font-family:var(--font-code); font-size:11px; color:var(--text-secondary);">
            <div>Lịch sử khớp lệnh 100% minh bạch chuẩn On-chain FIFO. Tổng 2,765 giao dịch đã thanh quyết toán an toàn qua bảo chứng SAFU của Founder Nguyễn Phước Lộc.</div>
          </div>
        `;
      } else if (this.bottomTab === 'wallet') {
        container.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-code); font-size:12px;">
            <div>Số dư ví khả dụng: <strong style="color:var(--neon-emerald); font-size:15px;">25,480.50 USDT</strong> · <strong style="color:var(--sovereign-gold);">0.8540 BTC</strong></div>
            <button class="hud-pill-btn" onclick="alert('Nạp On-chain Crypto hoặc MB Bank VietQR: NGUYEN PHUOC LOC')">NẠP TIỀN NHANH</button>
          </div>
        `;
      }
    }

    /**
     * COCKPIT TABS: LOẠI LỆNH & ĐÒN BẨY & PHẦN TRĂM VỐN
     */
    setOrderType(type) {
      this.orderType = type;
      document.querySelectorAll('.order-type-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-type') === type);
      });
      this.showToast(`⚡ ĐÃ CHỌN LOẠI LỆNH: ${type}`);
    }

    setLeverage(lev) {
      this.leverage = lev;
      document.querySelectorAll('.leverage-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-lev') === lev);
      });
      this.showToast(`⚖️ ĐÒN BẨY KÝ QUỸ: ${lev}`);
    }

    setCapitalPercent(pct) {
      this.capitalPercent = pct;
      document.querySelectorAll('.capital-pct-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-pct')) === pct);
      });
      const input = document.getElementById('cockpit-amount-input');
      if (input) {
        const val = ((pct / 100) * 1.5).toFixed(3);
        input.value = val;
      }
    }

    setExchange(exchangeCode) {
      this.currentExchange = exchangeCode;
      this.playHapticSound('CLICK');
      if (window.ApexEventBus) {
        window.ApexEventBus.emit('EXCHANGE_CHANGED', exchangeCode);
      }
    }

    setTradingMode(mode) {
      this.tradingMode = mode;
      document.querySelectorAll('.trading-function-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
      });
      this.playHapticSound('CLICK');
      const modeNames = {
        'SPOT': 'GIAO NGAY (SPOT) — MUA BÁN THỰC THỜI',
        'MARGIN': 'ĐÒN BẨY (MARGIN 100X KÝ QUỸ)',
        'PREDICTION': 'QUYỀN CHỌN (PREDICTION/HEDGE)',
        'QUANT_BOT': 'AI QUANT BOT (ROBOT LƯỢNG TỬ)'
      };
      this.showToast(`🎯 CHẾ ĐỘ GIAO DỊCH: ${modeNames[mode] || mode}`, 'GOLD');
      if (window.ApexEventBus) {
        window.ApexEventBus.emit('TRADING_MODE_CHANGED', mode);
      }
    }

    /**
     * ÂM THANH XÚC GIÁC (WEB AUDIO API)
     */
    playHapticSound(type = 'CLICK') {
      if (!this.soundEnabled) return;
      try {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const now = this.audioCtx.currentTime;
        if (type === 'CLICK') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'CHIME') {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
        }
      } catch (e) {}
    }

    /**
     * HFT HOTKEYS
     */
    bindHftHotkeys() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const now = performance.now();
        if (now - this.lastHotkeyTime < 80) return;
        this.lastHotkeyTime = now;

        const key = e.key;
        if (key === 'b' || key === 'B') {
          e.preventDefault();
          this.executeHftAction('BUY');
        } else if (key === 's' || key === 'S') {
          e.preventDefault();
          this.executeHftAction('SELL');
        } else if (e.code === 'Space') {
          e.preventDefault();
          this.executeHftAction('CANCEL_ALL');
        } else if (key === 'Escape') {
          e.preventDefault();
          this.executeHftAction('PANIC_CLOSE');
        }
      });
    }

    executeHftAction(action) {
      if (action === 'BUY') {
        const size = (0.5 + Math.random() * 0.8).toFixed(4);
        this.pushTrade('BUY', this.currentPrice, size, true);
        this.playHapticSound('CLICK');
        this.triggerFlash('BUY');
        this.showToast(`⚡ HFT MARKET BUY: 100% Vốn @ $${this.currentPrice.toLocaleString()} (<0.42µs)`, 'BUY');
      } else if (action === 'SELL') {
        const size = (0.5 + Math.random() * 0.8).toFixed(4);
        this.pushTrade('SELL', this.currentPrice, size, true);
        this.playHapticSound('CLICK');
        this.triggerFlash('SELL');
        this.showToast(`🩸 HFT MARKET SELL: 100% Vốn @ $${this.currentPrice.toLocaleString()} (<0.42µs)`, 'SELL');
      } else if (action === 'CANCEL_ALL') {
        this.playHapticSound('CLICK');
        this.showToast(`🛡️ ĐÃ HỦY TOÀN BỘ LỆNH CHỜ TRONG 0.001s`, 'GOLD');
      } else if (action === 'PANIC_CLOSE') {
        this.playHapticSound('CHIME');
        this.showToast(`🚨 THOÁT KHẨN CẤP MỌI VỊ THẾ BẢO TOÀN VỐN AN TOÀN 100%`, 'GOLD');
      }
    }

    triggerFlash(side) {
      const cls = side === 'BUY' ? 'flash-buy-trigger' : 'flash-sell-trigger';
      document.body.classList.add(cls);
      setTimeout(() => document.body.classList.remove(cls), 400);
    }

    showToast(message, type = 'GOLD') {
      let toast = document.getElementById('quantum-terminal-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'quantum-terminal-toast';
        toast.className = 'quantum-toast';
        document.body.appendChild(toast);
      }

      toast.className = 'quantum-toast';
      if (type === 'BUY') toast.classList.add('buy-toast');
      else if (type === 'SELL') toast.classList.add('sell-toast');
      else toast.classList.add('gold-toast');

      toast.textContent = message;
      toast.classList.add('active');

      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
      }, 2400);
    }
  }

  window.TapeEngine = new SovereignTapeEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.TapeEngine.init());
  } else {
    window.TapeEngine.init();
  }
})();
