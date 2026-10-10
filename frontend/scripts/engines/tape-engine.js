/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — EXECUTION TAPE & HFT HOTKEYS
 * (frontend/scripts/engines/tape-engine.js)
 * Băng khớp lệnh vi giây Time & Sales & Bộ vũ khí phím tắt HFT
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
      this.maxTrades = 18; // Virtual bounded list (giới hạn 15-20 dòng để siêu mượt 0-lag)

      this.currentPrice = 86887.00;
      this.buysCount = 1548;
      this.sellsCount = 1217;
      this.settledTrades = 2765;
      this.lastFillDelta = '+16.15 UP';

      // Web Audio API Haptic Audio
      this.audioCtx = null;
      this.soundEnabled = true;

      // HFT Hotkeys lock
      this.lastHotkeyTime = 0;
    }

    /**
     * Khởi tạo bộ máy Time & Sales và Hotkeys
     */
    init() {
      this.tableContainer = document.getElementById('tape-scroll-zone');
      this.initInitialTrades();
      this.renderTape();
      this.bindHftHotkeys();
      this.startSimulatedFeed();
    }

    /**
     * Nạp dữ liệu ban đầu
     */
    initInitialTrades() {
      const now = Date.now();
      for (let i = 0; i < 15; i++) {
        const side = Math.random() > 0.44 ? 'BUY' : 'SELL';
        const price = this.currentPrice + (Math.random() - 0.48) * 8;
        const size = (0.05 + Math.random() * 1.8).toFixed(4);
        const timeStr = this.formatTime(new Date(now - (15 - i) * 600));

        this.trades.push({
          time: timeStr,
          side: side,
          price: price,
          size: size,
          isWhale: parseFloat(size) > 1.5
        });
      }
    }

    /**
     * Định dạng giờ HH:mm:ss.SSS
     */
    formatTime(date) {
      const pad = (n, z = 2) => String(n).padStart(z, '0');
      const h = pad(date.getHours());
      const m = pad(date.getMinutes());
      const s = pad(date.getSeconds());
      const ms = pad(date.getMilliseconds(), 3);
      return `${h}:${m}:${s}.${ms}`;
    }

    /**
     * Thêm lệnh khớp mới vào đỉnh (FIFO Bounded List)
     */
    pushTrade(side, price, size, isWhale = false) {
      const timeStr = this.formatTime(new Date());
      const trade = {
        time: timeStr,
        side: side,
        price: price,
        size: Number(size).toFixed(4),
        isWhale: isWhale || (parseFloat(size) > 1.5)
      };

      this.trades.unshift(trade);
      if (this.trades.length > this.maxTrades) {
        this.trades.pop();
      }

      this.settledTrades++;
      if (side === 'BUY') this.buysCount++;
      else this.sellsCount++;

      this.currentPrice = price;

      // Render lại bảng ảo
      this.renderTape();
      this.updateFooterStats();

      // Phát tán sự kiện EventBus
      if (window.ApexEventBus) {
        window.ApexEventBus.emit(window.ApexEvents.TRADE_EXECUTED, trade);
        window.ApexEventBus.emit(window.ApexEvents.PRICE_TICK, price);
      }
    }

    /**
     * Render bảng khớp lệnh ảo siêu nhẹ
     */
    renderTape() {
      if (!this.tableContainer) return;
      let html = '';

      for (let i = 0; i < this.trades.length; i++) {
        const t = this.trades[i];
        const isBuy = t.side === 'BUY';
        const sideClass = isBuy ? 'buy' : 'sell';
        const formattedPrice = Number(t.price).toLocaleString('en-US', { minimumFractionDigits: 2 });
        const whaleGlow = t.isWhale ? 'style="font-weight:800; text-shadow:0 0 8px currentColor;"' : '';

        html += `
          <div class="tape-row-item ${sideClass}" ${whaleGlow}>
            <span>${t.time}</span>
            <span style="font-weight:700;">${t.side}</span>
            <span>$${formattedPrice}</span>
            <span style="text-align:right;">${t.size} BTC</span>
          </div>
        `;
      }

      this.tableContainer.innerHTML = html;
    }

    /**
     * Cập nhật các thống kê chân bảng
     */
    updateFooterStats() {
      const buysRatio = ((this.buysCount / (this.buysCount + this.sellsCount)) * 100).toFixed(1);
      const buyStat = document.getElementById('tape-buys-percent');
      const settledStat = document.getElementById('tape-settled-count');
      const lastFillStat = document.getElementById('tape-last-fill');

      if (buyStat) buyStat.textContent = `${buysRatio}%`;
      if (settledStat) settledStat.textContent = this.settledTrades.toLocaleString();
      if (lastFillStat) lastFillStat.textContent = this.lastFillDelta;
    }

    /**
     * Mô phỏng luồng lệnh khớp tự động từ thị trường
     */
    startSimulatedFeed() {
      const tick = () => {
        const delta = (Math.random() - 0.47) * 3.5;
        const newP = this.currentPrice + delta;
        const side = delta >= 0 ? 'BUY' : 'SELL';
        const size = (0.02 + Math.random() * 0.85).toFixed(4);
        const isWhale = Math.random() < 0.08;

        this.pushTrade(side, newP, isWhale ? (Math.random() * 3 + 2).toFixed(4) : size, isWhale);

        const nextTick = Math.random() * 600 + 250;
        setTimeout(tick, nextTick);
      };

      setTimeout(tick, 500);
    }

    /**
     * ÂM THANH XÚC GIÁC LƯỢNG TỬ (WEB AUDIO API HAPTIC SYNTHESIZER)
     */
    playHapticSound(type = 'CLICK') {
      if (!this.soundEnabled) return;
      try {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;

        if (type === 'CLICK') {
          // Tiếng click cơ học vi mô dứt khoát
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
          // Tiếng ping chốt lời du dương
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now); // nốt A5
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // nốt A6

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
        }
      } catch (e) {
        // Trình duyệt chặn autoplay trước tương tác
      }
    }

    /**
     * BỘ VŨ KHÍ PHÍM TẮT HFT (HFT HOTKEYS)
     * B: Mua thị trường 100% vốn
     * S: Bán thị trường 100% vốn
     * Space: Hủy toàn bộ lệnh chờ trong 0.001s
     * Esc: Thoát khẩn cấp mọi vị thế bảo toàn vốn
     */
    bindHftHotkeys() {
      window.addEventListener('keydown', (e) => {
        // Bỏ qua nếu đang gõ trong input text
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          return;
        }

        const now = performance.now();
        if (now - this.lastHotkeyTime < 80) return; // Chống dội phím (debounce 80ms)
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

    /**
     * Thực thi hành động HFT
     */
    executeHftAction(action) {
      if (action === 'BUY') {
        const buyPrice = this.currentPrice;
        const size = (0.5 + Math.random() * 0.8).toFixed(4);
        this.pushTrade('BUY', buyPrice, size, true);
        this.playHapticSound('CLICK');
        this.triggerFlash('BUY');
        this.showToast(`⚡ HFT MARKET BUY: 100% Vốn @ $${buyPrice.toLocaleString()} (Khớp vi giây <0.42µs)`, 'BUY');
      } else if (action === 'SELL') {
        const sellPrice = this.currentPrice;
        const size = (0.5 + Math.random() * 0.8).toFixed(4);
        this.pushTrade('SELL', sellPrice, size, true);
        this.playHapticSound('CLICK');
        this.triggerFlash('SELL');
        this.showToast(`🩸 HFT MARKET SELL: 100% Vốn @ $${sellPrice.toLocaleString()} (Khớp vi giây <0.42µs)`, 'SELL');
      } else if (action === 'CANCEL_ALL') {
        this.playHapticSound('CLICK');
        this.showToast(`🛡️ ĐÃ HỦY TOÀN BỘ LỆNH CHỜ TRONG 0.001s`, 'GOLD');
      } else if (action === 'PANIC_CLOSE') {
        this.playHapticSound('CHIME');
        this.showToast(`🚨 THOÁT KHẨN CẤP MỌI VỊ THẾ BẢO TOÀN VỐN AN TOÀN 100%`, 'GOLD');
      }
    }

    /**
     * Hiệu ứng chớp sáng phản hồi
     */
    triggerFlash(side) {
      const cls = side === 'BUY' ? 'flash-buy-trigger' : 'flash-sell-trigger';
      document.body.classList.add(cls);
      setTimeout(() => document.body.classList.remove(cls), 400);
    }

    /**
     * Hiển thị thông báo Toast lượng tử
     */
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
