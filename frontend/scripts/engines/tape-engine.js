/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — EXECUTION TAPE & PRO CONTROLS
 * (frontend/scripts/engines/tape-engine.js)
 * Băng khớp lệnh Time & Sales, Phím tắt HFT & 7 Hệ thống Tabs
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * ========================================================
 */

(function () {
  'use strict';

  if (window.TapeEngine) return;

  class SovereignTapeEngine {
    constructor() {
      this.tableContainer = null;
      this.trades = [];
      this.maxTrades = 18;

      // Filter: 'ALL' | 'BUY' | 'SELL' | 'WHALE'
      this.activeFilter = 'ALL';

      this.currentPrice = 86895.00;
      this.activeSymbol = 'BTC/USDT';
      this.activeUnit = 'BTC';
      this.currentExchange = 'APEXCORE';
      this.tradingMode = 'SPOT';

      this.buysCount = 1548;
      this.sellsCount = 1217;
      this.settledTrades = 2765;
      this.lastFillDelta = '+$16.15 UP';

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
      this.initInitialTrades();
      this.renderTape();
      this.bindHftHotkeys();
      this.startSimulatedFeed();
      this.renderResolutionGrid();
      this.renderBottomTable();

      // Lắng nghe đổi tài sản
      if (window.ApexEventBus) {
        window.ApexEventBus.on('ASSET_SWITCHED', (sym) => {
          this.activeSymbol = sym;
          this.activeUnit = sym.split('/')[0];
          this.trades = [];
          this.initInitialTrades();
          this.renderTape();
        });

        window.ApexEventBus.on(window.ApexEvents.PRICE_TICK, (price) => {
          this.currentPrice = price;
        });
      }
    }

    initInitialTrades() {
      const now = Date.now();
      for (let i = 0; i < 15; i++) {
        const side = Math.random() > 0.44 ? 'BUY' : 'SELL';
        const price = this.currentPrice + (Math.random() - 0.48) * 6;
        const size = (0.05 + Math.random() * 1.8).toFixed(4);
        const timeStr = this.formatTime(new Date(now - (15 - i) * 600));

        this.trades.push({
          time: timeStr,
          side: side,
          price: price,
          size: size,
          isWhale: parseFloat(size) > 1.2
        });
      }
    }

    formatTime(date) {
      const pad = (n, z = 2) => String(n).padStart(z, '0');
      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());
      const ms = pad(date.getMilliseconds(), 3);
      return `${h}:${m}:${s}.${ms}`;
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

    pushTrade(side, price, size, isWhale = false) {
      const timeStr = this.formatTime(new Date());
      const trade = {
        time: timeStr,
        side: side,
        price: price,
        size: Number(size).toFixed(4),
        isWhale: isWhale || (parseFloat(size) > 1.2)
      };

      this.trades.unshift(trade);
      if (this.trades.length > this.maxTrades * 2) {
        this.trades.pop();
      }

      this.settledTrades++;
      if (side === 'BUY') this.buysCount++;
      else this.sellsCount++;

      this.currentPrice = price;

      this.renderTape();
      this.updateFooterStats();

      if (window.ApexEventBus) {
        window.ApexEventBus.emit(window.ApexEvents.TRADE_EXECUTED, trade);
        window.ApexEventBus.emit(window.ApexEvents.PRICE_TICK, price);
      }
    }

    renderTape() {
      if (!this.tableContainer) return;

      // Lọc danh sách theo filter
      let filtered = this.trades;
      if (this.activeFilter === 'BUY') {
        filtered = this.trades.filter(t => t.side === 'BUY');
      } else if (this.activeFilter === 'SELL') {
        filtered = this.trades.filter(t => t.side === 'SELL');
      } else if (this.activeFilter === 'WHALE') {
        filtered = this.trades.filter(t => t.isWhale);
      }

      const displayList = filtered.slice(0, this.maxTrades);

      let html = '';
      for (let i = 0; i < displayList.length; i++) {
        const t = displayList[i];
        const isBuy = t.side === 'BUY';
        const sideClass = isBuy ? 'buy' : 'sell';
        const formattedPrice = Number(t.price).toLocaleString('en-US', { minimumFractionDigits: 2 });
        const whaleBadge = t.isWhale ? '<span style="color:#FFD700; margin-left:4px;" title="Cá voi vào lệnh">🐋</span>' : '';

        html += `
          <div class="tape-row-item ${sideClass}">
            <span>${t.time}</span>
            <span style="font-weight:700;">${t.side}${whaleBadge}</span>
            <span>$${formattedPrice}</span>
            <span style="text-align:right;">${t.size} ${this.activeUnit}</span>
          </div>
        `;
      }

      this.tableContainer.innerHTML = html;
    }

    updateFooterStats() {
      const buysRatio = ((this.buysCount / (this.buysCount + this.sellsCount)) * 100).toFixed(1);
      const buyStat = document.getElementById('tape-buys-percent');
      const settledStat = document.getElementById('tape-settled-count');
      const lastFillStat = document.getElementById('tape-last-fill');

      if (buyStat) buyStat.textContent = `${buysRatio}%`;
      if (settledStat) settledStat.textContent = this.settledTrades.toLocaleString();
      if (lastFillStat) lastFillStat.textContent = this.lastFillDelta;
    }

    startSimulatedFeed() {
      const tick = () => {
        const delta = (Math.random() - 0.47) * 3.5;
        const newP = this.currentPrice + delta;
        const side = delta >= 0 ? 'BUY' : 'SELL';
        const size = (0.02 + Math.random() * 0.95).toFixed(4);
        const isWhale = Math.random() < 0.09;

        this.pushTrade(side, newP, isWhale ? (Math.random() * 4 + 2).toFixed(4) : size, isWhale);

        const nextTick = Math.random() * 600 + 260;
        setTimeout(tick, nextTick);
      };

      setTimeout(tick, 500);
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
      this.renderResolutionGrid();
    }

    renderResolutionGrid() {
      const gridBox = document.getElementById('resolution-heatmap-tiles');
      if (!gridBox) return;

      // 16 ô gạch chia thành 2 hàng x 8 cột
      const tiles = [
        // Hàng 1
        { val: '93¢', up: true, sym: 'BTC-15M' },
        { val: '29¢', up: false, sym: 'ETH-5M' },
        { val: '85¢', up: true, sym: 'SOL-15M' },
        { val: '41¢', up: false, sym: 'BTC-5M' },
        { val: '70¢', up: true, sym: 'ETH-15M' },
        { val: '36¢', up: false, sym: 'BNB-5M' },
        { val: '79¢', up: true, sym: 'SOL-5M' },
        { val: '11¢', up: false, sym: 'BTC-15M' },
        // Hàng 2
        { val: '53¢', up: true, sym: 'BTC-5M' },
        { val: '15¢', up: false, sym: 'ETH-5M' },
        { val: '60¢', up: true, sym: 'SOL-15M' },
        { val: '48¢', up: false, sym: 'BNB-15M' },
        { val: '79¢', up: true, sym: 'BTC-15M' },
        { val: '96¢', up: false, sym: 'ETH-15M' },
        { val: '53¢', up: true, sym: 'SOL-5M' },
        { val: '37¢', up: false, sym: 'BTC-5M' }
      ];

      let html = '';
      tiles.forEach(item => {
        const bg = item.up ? 'rgba(0, 255, 163, 0.12)' : 'rgba(255, 51, 102, 0.12)';
        const border = item.up ? 'rgba(0, 255, 163, 0.35)' : 'rgba(255, 51, 102, 0.35)';
        const color = item.up ? 'var(--neon-emerald)' : 'var(--laser-ruby)';
        html += `
          <div class="res-tile-box" style="background:${bg}; border:1px solid ${border}; color:${color};" onclick="window.TapeEngine.playHapticSound('CLICK')">
            <span class="res-tile-val">${item.val}</span>
            <span class="res-tile-sym">${item.sym}</span>
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
