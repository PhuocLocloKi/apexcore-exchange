/* ========================================================
   APEXCORE PRO — CHART ENGINE (js/chart-engine.js)
   MASTER V9.0 — Thuật Toán Nến Zoom, Kéo Giãn Trục Y, Pan Lịch Sử
   Founder & CTO: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class InteractiveChartEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    // Zoom & Pan state
    this.visibleCandleCount = 40;
    this.MIN_CANDLES = 15;
    this.MAX_CANDLES = 120;
    this.panOffset = 0; // Kéo ngang duyệt lịch sử
    this.priceScaleFactor = 1.0; // Kéo giãn trục giá Y

    // Dragging state
    this.isDraggingChart = false;
    this.isDraggingYAxis = false;
    this.startX = 0;
    this.startY = 0;

    // Timeframe data store
    this.currentTimeframe = '15m';
    this.timeframeStore = {};
    this.currentPrice = 85450.90;
    this.symbol = 'BTC/USDT';

    // Interpolation
    this.isInterpolating = false;

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    this.initTimeframes();
    this.bindEvents();
    this.render();
    window.addEventListener('resize', () => this.render());
  }

  initTimeframes() {
    const baseP = this.currentPrice;
    this.timeframeStore['1s'] = this.generateCandles(baseP, 120, 1000, 0.001);
    this.timeframeStore['15m'] = this.generateCandles(baseP, 120, 15 * 60 * 1000, 0.005);
    this.timeframeStore['1h'] = this.generateCandles(baseP, 120, 60 * 60 * 1000, 0.008);
    this.timeframeStore['4h'] = this.generateCandles(baseP, 100, 4 * 60 * 60 * 1000, 0.012);
    this.timeframeStore['1D'] = this.generateCandles(baseP, 90, 24 * 60 * 60 * 1000, 0.018);
    this.timeframeStore['1W'] = this.generateCandles(baseP, 80, 7 * 24 * 60 * 1000, 0.025);

    this.candles = this.timeframeStore[this.currentTimeframe] || this.timeframeStore['15m'];
  }

  generateCandles(startP, count, intervalMs, volScale) {
    const list = [];
    let p = startP * (1 - volScale * (count / 4));
    const now = Date.now();
    for (let i = count - 1; i >= 0; i--) {
      const open = p;
      const change = (Math.random() - 0.495) * (p * volScale);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (p * volScale * 0.4);
      const low = Math.min(open, close) - Math.random() * (p * volScale * 0.4);
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
    this.panOffset = 0;
    this.render();
  }

  bindEvents() {
    const canvas = this.canvas;
    const yAxisArea = document.getElementById('chart-y-drag-zone');

    // 1. ZOOM LĂN CHUỘT (WHEEL EVENT)
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        // Phóng to
        this.visibleCandleCount = Math.max(this.MIN_CANDLES, this.visibleCandleCount - 3);
      } else {
        // Thu nhỏ
        this.visibleCandleCount = Math.min(this.MAX_CANDLES, this.visibleCandleCount + 3);
      }
      this.render();
    }, { passive: false });

    // 2. KÉO GIÃN TRỤC Y (Y-AXIS STRETCH)
    if (yAxisArea) {
      yAxisArea.addEventListener('mousedown', (e) => {
        this.isDraggingYAxis = true;
        this.startY = e.clientY;
      });
    }

    // 3. KÉO TRƯỢT PAN LỊCH SỬ NẾN (X-AXIS PAN)
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      // Nếu nhấn vào khu vực trục giá bên phải (70px)
      if (x > rect.width - 70) {
        this.isDraggingYAxis = true;
        this.startY = e.clientY;
      } else {
        this.isDraggingChart = true;
        this.startX = e.clientX;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingYAxis) {
        const deltaY = e.clientY - this.startY;
        this.priceScaleFactor *= (1 + deltaY * 0.006);
        this.priceScaleFactor = Math.min(Math.max(0.3, this.priceScaleFactor), 3.0);
        this.startY = e.clientY;
        this.render();
      } else if (this.isDraggingChart) {
        const deltaX = e.clientX - this.startX;
        const candleWidth = (this.canvas.width / (window.devicePixelRatio || 1)) / this.visibleCandleCount;
        const shiftCandles = Math.round(deltaX / candleWidth);
        if (shiftCandles !== 0) {
          this.panOffset = Math.max(0, Math.min(this.candles.length - this.visibleCandleCount, this.panOffset - shiftCandles));
          this.startX = e.clientX;
          this.render();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingYAxis = false;
      this.isDraggingChart = false;
    });

    // Double click trục Y để reset tỷ lệ
    canvas.addEventListener('dblclick', () => {
      this.priceScaleFactor = 1.0;
      this.panOffset = 0;
      this.render();
    });
  }

  // Thuật toán co giãn thích ứng Dynamic Clamped Auto-Scale
  calculateAdaptiveScale(visibleCandles, forcedPrice) {
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    visibleCandles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.vol > maxVol) maxVol = c.vol;
    });

    if (forcedPrice && forcedPrice > 0) {
      if (forcedPrice < min) min = forcedPrice;
      if (forcedPrice > max) max = forcedPrice;
    }

    const diff = max - min;
    const padding = (diff > 0 ? diff * 0.15 : min * 0.02) || 10;
    const center = (max + min) / 2;
    const halfSpan = ((max - min) / 2 + padding) * this.priceScaleFactor;

    return {
      scaledMin: Math.max(0.0001, center - halfSpan),
      scaledMax: center + halfSpan,
      maxVol: maxVol || 1
    };
  }

  render() {
    if (!this.canvas || !this.ctx || !this.candles || this.candles.length === 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridCol = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)';
    const textCol = isLight ? '#707a8a' : '#848e9c';

    // Bảng màu nến (Standard vs Cyberpunk)
    const pal = localStorage.getItem('apex_candle_palette') || 'standard';
    const upCol = pal === 'cyberpunk' ? '#00ffcc' : '#0ecb81';
    const downCol = pal === 'cyberpunk' ? '#ff007f' : '#f6465d';

    this.ctx.clearRect(0, 0, w, h);

    const priceH = h * 0.78;
    const volH = h * 0.16;
    const rightMargin = 70;
    const chartW = Math.max(100, w - rightMargin);

    // Cắt slice nến đang hiển thị theo panOffset và count
    const endIdx = this.candles.length - this.panOffset;
    const startIdx = Math.max(0, endIdx - this.visibleCandleCount);
    const visibleCandles = this.candles.slice(startIdx, endIdx);

    const { scaledMin: minP, scaledMax: maxP, maxVol: maxV } = this.calculateAdaptiveScale(visibleCandles, this.currentPrice);
    const range = Math.max(0.0001, maxP - minP);

    // 1. Grid & Y-Axis Prices
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
      this.ctx.font = '10px "SF Mono", "Roboto Mono", Consolas, monospace';
      this.ctx.fillText(this.formatPrice(pVal), chartW + 6, y + 3);
    }

    // 2. Render Candles & Volume (TradingView Golden Ratio Standard)
    const candleCount = visibleCandles.length;
    const step = chartW / candleCount;
    const candleWidth = Math.max(3, Math.floor(step * 0.70)); // Thân nến chiếm 70% bề rộng step

    visibleCandles.forEach((c, i) => {
      const x = Math.floor(i * step + step / 2); // Trục tọa độ x nằm chính giữa step
      const isUp = c.close >= c.open;
      const col = isUp ? upCol : downCol;

      const yO = priceH - ((c.open - minP) / range) * priceH;
      const yC = priceH - ((c.close - minP) / range) * priceH;
      const yH = priceH - ((c.high - minP) / range) * priceH;
      const yL = priceH - ((c.low - minP) / range) * priceH;

      // Bước A: Vẽ râu nến (Wick) TRƯỚC, 1px sắc nét chính giữa trục X
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, Math.max(0, Math.min(priceH, yH)));
      this.ctx.lineTo(x + 0.5, Math.max(0, Math.min(priceH, yL)));
      this.ctx.stroke();

      // Bước B: Vẽ thân nến (Body) SAU
      const topY = Math.min(yO, yC);
      const rawBodyH = Math.abs(yC - yO);

      this.ctx.fillStyle = col;
      // Cơ chế Doji: Nếu open === close hoặc bodyH < 1px, vẽ 1 vạch ngang sắc nét 1px
      if (Math.abs(c.open - c.close) < 0.0001 || rawBodyH < 1) {
        this.ctx.fillRect(Math.floor(x - candleWidth / 2), Math.floor(topY), candleWidth, 1);
      } else {
        this.ctx.fillRect(Math.floor(x - candleWidth / 2), Math.floor(topY), candleWidth, Math.max(1, rawBodyH));
      }

      // Bước C: Khối lượng Volume Bar ở đáy (chiếm max 20% chiều cao đáy) chuẩn sàn quốc tế
      const maxVolH = h * 0.20;
      const vH = Math.max(2, (c.vol / maxV) * maxVolH);
      this.ctx.fillStyle = isUp ? 'rgba(14, 203, 129, 0.35)' : 'rgba(246, 70, 93, 0.35)';
      this.ctx.fillRect(Math.floor(x - candleWidth / 2), h - vH, candleWidth, vH);
    });

    // 3. Current Live Price Line & Flag
    const curY = priceH - ((this.currentPrice - minP) / range) * priceH;
    if (curY >= 0 && curY <= priceH) {
      this.ctx.strokeStyle = upCol;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(0, curY);
      this.ctx.lineTo(chartW, curY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      const flag = document.getElementById('apex-live-price-flag');
      if (flag) {
        flag.style.top = `${curY - 10}px`;
        flag.style.background = upCol;
        flag.textContent = this.formatPrice(this.currentPrice);
      }
    }
  }

  // Cập nhật giá mượt mà từ Admin hoặc Market Tick (Xóa sổ đứt gãy chuỗi giá & nến cột khói)
  updatePrice(newP, isInstant = false) {
    if (!this.candles || this.candles.length === 0) return;

    const last = this.candles[this.candles.length - 1];
    const priceGap = Math.abs(newP - last.open);
    const gapThreshold = last.open * 0.015; // Ngưỡng đứt gãy > 1.5%

    // Giải quyết triệt để lỗi đứt gãy chuỗi giá Admin: Nếu Admin gán bước nhảy giá quá xa (như $743 -> $780)
    // Thay vì kéo dài 1 thân nến duy nhất thành cột khói, tự động chia thành các nến bước sóng liên tục
    if (!isInstant && priceGap > gapThreshold) {
      const stepsCount = Math.min(5, Math.ceil(priceGap / (gapThreshold * 0.8)));
      let currentBaseP = last.close;
      const stepDiff = (newP - currentBaseP) / stepsCount;
      const interval = 15 * 60 * 1000;
      let now = Date.now();

      for (let s = 1; s <= stepsCount; s++) {
        const nextP = currentBaseP + stepDiff;
        const openP = currentBaseP;
        const closeP = nextP;
        const highP = Math.max(openP, closeP) + Math.abs(stepDiff) * 0.15;
        const lowP = Math.min(openP, closeP) - Math.abs(stepDiff) * 0.15;
        const vol = Math.floor(Math.random() * 600) + 400;

        if (s === 1) {
          // Khép lại nến hiện tại với biên độ mượt
          last.close = closeP;
          last.high = Math.max(last.high, highP);
          last.low = Math.min(last.low, lowP);
        } else {
          // Thêm nến bước tiếp theo
          this.candles.push({
            time: now + (s - 1) * interval,
            open: openP,
            high: highP,
            low: lowP,
            close: closeP,
            vol: vol
          });
        }
        currentBaseP = nextP;
      }
      this.currentPrice = newP;
      this.render();
      return;
    }

    if (isInstant || Math.abs(newP - this.currentPrice) < 0.1) {
      this.currentPrice = newP;
      last.close = newP;
      if (newP > last.high) last.high = newP;
      if (newP < last.low) last.low = newP;
      this.render();
      return;
    }

    const startP = this.currentPrice;
    const steps = 5;
    let step = 0;
    const diff = (newP - startP) / steps;

    if (this.interpolateInterval) clearInterval(this.interpolateInterval);
    this.interpolateInterval = setInterval(() => {
      step++;
      this.currentPrice += diff;
      if (this.candles.length > 0) {
        const activeCandle = this.candles[this.candles.length - 1];
        activeCandle.close = this.currentPrice;
        if (this.currentPrice > activeCandle.high) activeCandle.high = this.currentPrice;
        if (this.currentPrice < activeCandle.low) activeCandle.low = this.currentPrice;
      }
      this.render();

      if (step >= steps) {
        clearInterval(this.interpolateInterval);
        this.currentPrice = newP;
        this.render();

        const flag = document.getElementById('apex-live-price-flag');
        if (flag) {
          flag.style.boxShadow = newP >= startP ? '0 0 16px var(--color-green)' : '0 0 16px var(--color-red)';
          setTimeout(() => { if (flag) flag.style.boxShadow = 'none'; }, 250);
        }
      }
    }, 50);
  }

  formatPrice(p) {
    if (typeof p !== 'number') p = parseFloat(p) || 0;
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.InteractiveChartEngine = InteractiveChartEngine;
}
