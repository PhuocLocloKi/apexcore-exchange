/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — OFFSCREEN CHART CANVAS & MICROSTRUCTURE
 * (frontend/scripts/engines/chart-canvas.js)
 * Biểu đồ nến vi cấu trúc 2 lớp siêu nhẹ & Thang giá Price Ladder
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * ========================================================
 */

(function () {
  'use strict';

  if (window.ChartCanvasEngine) return;

  class SovereignChartCanvasEngine {
    constructor() {
      // Canvases
      this.microCanvas = null;
      this.microCtx = null;
      this.oscCanvas = null;
      this.oscCtx = null;
      this.sparkCanvas = null;
      this.sparkCtx = null;

      // Offscreen static buffer
      this.offscreenGrid = null;
      this.offscreenGridCtx = null;

      // Dữ liệu vi cấu trúc
      this.currentPrice = 86887.00;
      this.candles = [];
      this.maxCandles = 32;

      // Ladder steps
      this.ladderSteps = [];
      this.ladderContainer = null;

      // Oscillograph wave
      this.wavePhase = 0;
      this.latencyMs = 916; // Hoặc 0.42µs

      // Hex Wire dump
      this.wireContainer = null;
      this.wireTimer = null;

      // Color tokens từ theme-tokens.css
      this.tokens = {
        emerald: '#00FFA3',
        ruby: '#FF3366',
        gold: '#FFD700',
        cyan: '#00F0FF'
      };
    }

    readTokens() {
      if (typeof window !== 'undefined' && document.documentElement) {
        const s = getComputedStyle(document.documentElement);
        this.tokens = {
          emerald: s.getPropertyValue('--neon-emerald').trim() || '#00FFA3',
          ruby: s.getPropertyValue('--laser-ruby').trim() || '#FF3366',
          gold: s.getPropertyValue('--sovereign-gold').trim() || '#FFD700',
          cyan: s.getPropertyValue('--cyber-cyan').trim() || '#00F0FF'
        };
      }
    }

    /**
     * Khởi tạo bộ máy biểu đồ nến vi cấu trúc
     */
    init() {
      this.readTokens();
      this.microCanvas = document.getElementById('micro-chart-canvas');
      this.oscCanvas = document.getElementById('oscillograph-canvas');
      this.sparkCanvas = document.getElementById('sparkline-canvas');
      this.ladderContainer = document.getElementById('price-ladder-rows');
      this.wireContainer = document.getElementById('wire-hex-feed-box');

      if (this.microCanvas) {
        this.microCtx = this.microCanvas.getContext('2d');
        this.setupOffscreenGrid();
        this.generateInitialCandles();
        this.renderMicroChart();
      }

      if (this.oscCanvas) {
        this.oscCtx = this.oscCanvas.getContext('2d');
        this.startOscillographLoop();
      }

      if (this.sparkCanvas) {
        this.sparkCtx = this.sparkCanvas.getContext('2d');
        this.renderSparkline();
      }

      this.initPriceLadder();
      this.startWireInspector();

      // Đăng ký EventBus
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.PRICE_TICK, (newPrice) => {
          this.updatePrice(newPrice);
        });
      }
    }

    /**
     * Khởi tạo Offscreen Canvas để vẽ lưới tĩnh 1 lần (Zero redraw overhead)
     */
    setupOffscreenGrid() {
      const w = this.microCanvas.width = this.microCanvas.parentElement.clientWidth || 320;
      const h = this.microCanvas.height = this.microCanvas.parentElement.clientHeight || 180;

      this.offscreenGrid = document.createElement('canvas');
      this.offscreenGrid.width = w;
      this.offscreenGrid.height = h;
      this.offscreenGridCtx = this.offscreenGrid.getContext('2d');

      const ctx = this.offscreenGridCtx;
      ctx.clearRect(0, 0, w, h);

      // Đường lưới vi mô kỹ thuật
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);

      // Lưới ngang
      for (let y = 30; y < h; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Lưới dọc
      for (let x = 40; x < w; x += 45) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    /**
     * Tạo dữ liệu nến vi cấu trúc ban đầu
     */
    generateInitialCandles() {
      this.candles = [];
      let base = this.currentPrice - 60;
      for (let i = 0; i < this.maxCandles; i++) {
        const delta = (Math.random() - 0.47) * 12;
        const o = base;
        const c = base + delta;
        const h = Math.max(o, c) + Math.random() * 8;
        const l = Math.min(o, c) - Math.random() * 8;
        this.candles.push({
          open: o,
          high: h,
          low: l,
          close: c,
          vol: Math.random() * 2.5 + 0.4
        });
        base = c;
      }
      this.currentPrice = base;
    }

    /**
     * Dựng hình biểu đồ nến 2 lớp (Offscreen tĩnh + Động)
     */
    renderMicroChart() {
      if (!this.microCtx || !this.microCanvas) return;
      const w = this.microCanvas.width;
      const h = this.microCanvas.height;
      const ctx = this.microCtx;

      // 1. Sao chép lớp tĩnh từ Offscreen Canvas
      ctx.clearRect(0, 0, w, h);
      if (this.offscreenGrid) {
        ctx.drawImage(this.offscreenGrid, 0, 0);
      }

      // 2. Tìm Min / Max giá để scale
      let minP = Infinity;
      let maxP = -Infinity;
      this.candles.forEach(c => {
        if (c.low < minP) minP = c.low;
        if (c.high > maxP) maxP = c.high;
      });
      const padding = 15;
      const range = (maxP - minP) || 1;

      const getY = (val) => h - padding - ((val - minP) / range) * (h - padding * 2);

      // 3. Vẽ mây biên độ giá (Price Cloud / Bollinger Ribbon)
      ctx.beginPath();
      const candleW = (w - 20) / this.maxCandles;
      for (let i = 0; i < this.candles.length; i++) {
        const x = 10 + i * candleW + candleW / 2;
        const yTop = getY(this.candles[i].high);
        if (i === 0) ctx.moveTo(x, yTop);
        else ctx.lineTo(x, yTop);
      }
      for (let i = this.candles.length - 1; i >= 0; i--) {
        const x = 10 + i * candleW + candleW / 2;
        const yBot = getY(this.candles[i].low);
        ctx.lineTo(x, yBot);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.fill();

      // 4. Vẽ các cột nến lượng tử (Quantum Candles)
      for (let i = 0; i < this.candles.length; i++) {
        const c = this.candles[i];
        const isUp = c.close >= c.open;
        const color = isUp ? this.tokens.emerald : this.tokens.ruby;
        const x = 10 + i * candleW;
        const cx = x + candleW / 2;

        const yHigh = getY(c.high);
        const yLow = getY(c.low);
        const yOpen = getY(c.open);
        const yClose = getY(c.close);

        // Tim nến (Wick)
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, yHigh);
        ctx.lineTo(cx, yLow);
        ctx.stroke();

        // Thân nến (Body)
        ctx.fillStyle = color;
        const topY = Math.min(yOpen, yClose);
        const bodyH = Math.max(Math.abs(yClose - yOpen), 2);
        ctx.fillRect(x + 1, topY, candleW - 2, bodyH);
      }

      // 5. Đường giá hiện tại với dải phát quang neon
      const lastY = getY(this.currentPrice);
      ctx.strokeStyle = this.tokens.emerald;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(0, lastY);
      ctx.lineTo(w, lastY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /**
     * BẬC THANG GIÁ PRICE LADDER (PHÂN KHU 2)
     */
    initPriceLadder() {
      this.updatePriceLadder();
    }

    updatePriceLadder() {
      if (!this.ladderContainer) return;
      const stepSize = 1.50;
      const count = 7;
      let html = '';

      // Asks (bán - đỏ) phía trên
      for (let i = 3; i >= 1; i--) {
        const p = (this.currentPrice + i * stepSize).toFixed(2);
        const vol = (0.35 + Math.random() * 0.95).toFixed(2);
        const ratio = Math.min(95, Math.floor(vol * 55));
        html += `
          <div class="ladder-row-item ask">
            <span class="ladder-p">$${Number(p).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span class="ladder-v">${vol} BTC</span>
            <div class="ladder-depth-fill ask" style="width: ${ratio}%;"></div>
          </div>
        `;
      }

      // Mid Price (giá hiện tại - vàng/xanh)
      html += `
        <div class="ladder-row-item current">
          <span class="ladder-p" style="color:var(--sovereign-gold);">$${this.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span class="ladder-v" style="color:var(--sovereign-gold);">MID</span>
          <div class="ladder-depth-fill" style="background:var(--sovereign-gold); opacity:0.15; width:100%;"></div>
        </div>
      `;

      // Bids (mua - xanh) phía dưới
      for (let i = 1; i <= 3; i--) {
        const p = (this.currentPrice - i * stepSize).toFixed(2);
        const vol = (0.42 + Math.random() * 1.1).toFixed(2);
        const ratio = Math.min(95, Math.floor(vol * 55));
        html += `
          <div class="ladder-row-item bid">
            <span class="ladder-p">$${Number(p).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span class="ladder-v">${vol} BTC</span>
            <div class="ladder-depth-fill bid" style="width: ${ratio}%;"></div>
          </div>
        `;
      }

      this.ladderContainer.innerHTML = html;
    }

    /**
     * MÁY ĐO NHỊP TIM SÓNG MẠNG (OSCILLOGRAPH WAVE) (PHÂN KHU 3)
     */
    startOscillographLoop() {
      const renderWave = () => {
        if (!this.oscCtx || !this.oscCanvas) return;
        requestAnimationFrame(renderWave);

        const w = this.oscCanvas.width = this.oscCanvas.parentElement.clientWidth || 300;
        const h = this.oscCanvas.height = 60;
        const ctx = this.oscCtx;

        ctx.clearRect(0, 0, w, h);
        this.wavePhase += 0.08;

        // Vẽ đường sóng sin Cyber Cyan
        ctx.strokeStyle = this.tokens.cyan;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = this.tokens.cyan;
        ctx.shadowBlur = 8;
        ctx.beginPath();

        for (let x = 0; x < w; x++) {
          const freq = 0.045;
          const amp = 14 * Math.sin(x * 0.01 + this.wavePhase * 0.3);
          const y = (h / 2) + Math.sin(x * freq + this.wavePhase) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      requestAnimationFrame(renderWave);
    }

    /**
     * BỘ TRÍCH XUẤT GÓI TIN NHỊ PHÂN (WIRE INSPECTOR LIVE HEX DUMP)
     */
    startWireInspector() {
      if (!this.wireContainer) return;

      const sampleHex = [
        '0x7b 0x22 0x73 0x79 0x6d 0x62 0x6f 0x6c 0x22 0x3a 0x22 0x42 0x54 0x43 0x22',
        '0x22 0x70 0x72 0x69 0x63 0x65 0x22 0x3a 0x38 0x36 0x38 0x38 0x37 0x2e 0x30',
        '0x22 0x73 0x69 0x64 0x65 0x22 0x3a 0x22 0x42 0x55 0x59 0x22 0x2c 0x22 0x75',
        '0x75 0x69 0x64 0x22 0x3a 0x22 0x31 0x31 0x30 0x37 0x35 0x31 0x39 0x36 0x32',
        '0x22 0x6c 0x61 0x74 0x65 0x6e 0x63 0x79 0x22 0x3a 0x22 0x30 0x2e 0x34 0x32'
      ];

      const generateHex = () => {
        const randomLine = sampleHex[Math.floor(Math.random() * sampleHex.length)];
        const div = document.createElement('div');
        div.textContent = `>> [${new Date().toISOString().substring(17, 23)}] ${randomLine}`;
        this.wireContainer.prepend(div);
        while (this.wireContainer.children.length > 5) {
          this.wireContainer.removeChild(this.wireContainer.lastChild);
        }
      };

      this.wireTimer = setInterval(generateHex, 450);
    }

    /**
     * VẼ SPARKLINE KHỐI LƯỢNG LADDER (PHÂN KHU 1)
     */
    renderSparkline() {
      if (!this.sparkCtx || !this.sparkCanvas) return;
      const w = this.sparkCanvas.width = this.sparkCanvas.parentElement.clientWidth || 240;
      const h = this.sparkCanvas.height = 38;
      const ctx = this.sparkCtx;

      ctx.clearRect(0, 0, w, h);
      const bars = 24;
      const barW = (w - 20) / bars;

      for (let i = 0; i < bars; i++) {
        const barH = Math.random() * (h - 8) + 4;
        const x = 10 + i * barW;
        const y = h - barH;
        ctx.fillStyle = (i % 3 === 0) ? this.tokens.cyan : this.tokens.emerald;
        ctx.fillRect(x, y, barW - 2, barH);
      }
    }

    /**
     * Cập nhật khi có bước giá mới
     */
    updatePrice(newPrice) {
      this.currentPrice = newPrice;
      const last = this.candles[this.candles.length - 1];
      if (last) {
        last.close = newPrice;
        if (newPrice > last.high) last.high = newPrice;
        if (newPrice < last.low) last.low = newPrice;
      }
      this.renderMicroChart();
      this.updatePriceLadder();
    }
  }

  window.ChartCanvasEngine = new SovereignChartCanvasEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ChartCanvasEngine.init());
  } else {
    window.ChartCanvasEngine.init();
  }
})();
