/* ========================================================
   APEXCORE SOVEREIGN EXCHANGE — CHART MODULE (assets/js/chart.js)
   SovereignCandleEngine & Interactive TradingView Canvas
   Khắc phục triệt để lỗi nến bị xẹp và nhảy vọt giá
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class SovereignCandleEngine {
  constructor(basePrice = 85450.00) {
    this.currentPrice = basePrice;
    this.history = [];
    this.initHistory(80);
  }

  initHistory(count) {
    this.history = [];
    // Tính bước biến động tự nhiên theo tỷ lệ giá (±0.1% - 0.35%)
    const unitStep = this.currentPrice * 0.0003;
    let price = this.currentPrice - (count * unitStep * 0.8);
    const nowSec = Math.floor(Date.now() / 1000) - (count * 60);

    for (let i = 0; i < count; i++) {
      const open = price;
      const delta = (Math.random() - 0.48) * (unitStep * 3);
      const close = open + delta;
      const spread = Math.abs(close - open) + (unitStep * 0.5);
      const high = Math.max(open, close) + (Math.random() * spread * 0.8);
      const low = Math.min(open, close) - (Math.random() * spread * 0.8);
      const volume = Math.floor(Math.random() * 65) + 15;

      this.history.push({
        time: nowSec + (i * 60),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: volume
      });
      price = close;
    }
    // Cây nến cuối cùng luôn đồng nhất chuẩn giá hiện tại
    if (this.history.length > 0) {
      this.history[this.history.length - 1].close = this.currentPrice;
    }
  }

  nextCandle(timeSec) {
    const unitStep = this.currentPrice * 0.0002;
    const open = this.currentPrice;
    const delta = (Math.random() - 0.48) * (unitStep * 2.5);
    const close = open + delta;
    const spread = Math.abs(close - open) + (unitStep * 0.4);
    const high = Math.max(open, close) + (Math.random() * spread * 0.6);
    const low = Math.min(open, close) - (Math.random() * spread * 0.6);
    this.currentPrice = close;

    return {
      time: timeSec || Math.floor(Date.now() / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 40) + 10
    };
  }
}

class ApexChartRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.symbol = 'BTC/USDT';
    this.currentPrice = 85450.90;
    this.engine = new SovereignCandleEngine(this.currentPrice);
    this.candles = this.engine.history;

    // Zoom & Pan state
    this.visibleCandleCount = 45;
    this.MIN_CANDLES = 15;
    this.MAX_CANDLES = 120;
    this.panOffset = 0;
    this.priceScaleFactor = 1.0;

    // Mouse interactions
    this.isDraggingChart = false;
    this.isDraggingYAxis = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.crosshairX = null;
    this.crosshairY = null;

    this.currentTimeframe = '15m';

    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.bindEvents();
    this.render();
    window.addEventListener('resize', () => this.render());

    // Nhịp tim nến thị trường (Real-time Candle Pulse)
    setInterval(() => {
      this.tick();
    }, 1500);
  }

  setPrice(newPrice, resetHistory = false) {
    this.currentPrice = parseFloat(newPrice);
    if (resetHistory) {
      this.engine = new SovereignCandleEngine(this.currentPrice);
      this.candles = this.engine.history;
      this.panOffset = 0;
    } else if (this.candles.length > 0) {
      const last = this.candles[this.candles.length - 1];
      last.close = this.currentPrice;
      if (this.currentPrice > last.high) last.high = this.currentPrice;
      if (this.currentPrice < last.low) last.low = this.currentPrice;
    }
    this.render();
  }

  tick() {
    if (!this.candles || this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    const unitStep = this.currentPrice * 0.00015;
    const delta = (Math.random() - 0.49) * unitStep;
    this.currentPrice = parseFloat((this.currentPrice + delta).toFixed(2));
    last.close = this.currentPrice;
    if (this.currentPrice > last.high) last.high = this.currentPrice;
    if (this.currentPrice < last.low) last.low = this.currentPrice;
    this.render();

    // Cập nhật giá trên cờ hiển thị
    const flag = document.getElementById('apex-live-price-flag');
    if (flag) {
      flag.textContent = this.formatPrice(this.currentPrice);
    }
  }

  switchTimeframe(tf) {
    this.currentTimeframe = tf;
    // Tái cấu trúc lịch sử theo khung giờ
    this.engine = new SovereignCandleEngine(this.currentPrice);
    this.candles = this.engine.history;
    this.panOffset = 0;
    this.render();
  }

  bindEvents() {
    const canvas = this.canvas;
    const yDragZone = document.getElementById('chart-y-drag-zone');

    // 1. Phóng to / Thu nhỏ bằng con lăn chuột (Wheel Zoom)
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.visibleCandleCount = Math.max(this.MIN_CANDLES, this.visibleCandleCount - 3);
      } else {
        this.visibleCandleCount = Math.min(this.MAX_CANDLES, this.visibleCandleCount + 3);
      }
      this.render();
    }, { passive: false });

    // 2. Kéo rê chuột duyệt lịch sử nến (Pan)
    canvas.addEventListener('mousedown', (e) => {
      this.isDraggingChart = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingChart) {
        const dx = e.clientX - this.lastMouseX;
        const candleStep = (this.canvas.clientWidth / this.visibleCandleCount) || 10;
        const shift = Math.round(dx / candleStep);
        if (shift !== 0) {
          const maxPan = Math.max(0, this.candles.length - this.visibleCandleCount);
          this.panOffset = Math.max(0, Math.min(maxPan, this.panOffset + shift));
          this.lastMouseX = e.clientX;
          this.render();
        }
      } else if (this.isDraggingYAxis) {
        const dy = e.clientY - this.lastMouseY;
        this.priceScaleFactor = Math.max(0.4, Math.min(3.5, this.priceScaleFactor - dy * 0.01));
        this.lastMouseY = e.clientY;
        this.render();
      }

      // Cập nhật tọa độ tâm chữ thập (Crosshair)
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.crosshairX = e.clientX - rect.left;
        this.crosshairY = e.clientY - rect.top;
      } else {
        this.crosshairX = null;
        this.crosshairY = null;
      }
      this.render();
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingChart = false;
      this.isDraggingYAxis = false;
    });

    // 3. Kéo giãn trục giá Y chuyên biệt
    if (yDragZone) {
      yDragZone.addEventListener('mousedown', (e) => {
        this.isDraggingYAxis = true;
        this.lastMouseY = e.clientY;
      });
      yDragZone.addEventListener('dblclick', () => {
        this.priceScaleFactor = 1.0;
        this.panOffset = 0;
        this.render();
      });
    }

    // Double click để reset
    canvas.addEventListener('dblclick', () => {
      this.priceScaleFactor = 1.0;
      this.panOffset = 0;
      this.render();
    });
  }

  // Thuật toán co giãn biên độ tự nhiên (Không bao giờ bị xẹp)
  calculateScale(visibleList) {
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    visibleList.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const diff = max - min;
    // Luôn đảm bảo padding tối thiểu để nến có khoảng thở trên dưới
    const padding = (diff > 0 ? diff * 0.18 : min * 0.01) || 10;
    const center = (max + min) / 2;
    const halfSpan = ((max - min) / 2 + padding) * this.priceScaleFactor;

    return {
      minPrice: Math.max(0.0001, center - halfSpan),
      maxPrice: center + halfSpan,
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
    const gridCol = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    const textCol = isLight ? '#707a8a' : '#848e9c';
    const upCol = '#0ecb81';
    const downCol = '#f6465d';

    this.ctx.clearRect(0, 0, w, h);

    // KHÓA CỨNG TỶ LỆ TRỤC: 75% PHÍA TRÊN CHO NẾN (TOP 8%, BOTTOM 25%), 18% PHÍA DƯỚI CHO VOLUME
    const candleAreaTop = h * 0.08;
    const candleAreaH = h * 0.67;
    const volAreaH = h * 0.18;
    const rightMargin = 72;
    const chartW = Math.max(100, w - rightMargin);

    const endIdx = this.candles.length - this.panOffset;
    const startIdx = Math.max(0, endIdx - this.visibleCandleCount);
    const visibleCandles = this.candles.slice(startIdx, endIdx);

    const { minPrice, maxPrice, maxVol } = this.calculateScale(visibleCandles);
    const priceRange = Math.max(0.0001, maxPrice - minPrice);

    // 1. Grid dòng kẻ & Nhãn giá trục Y (Khóa cứng 5 đường lưới trong vùng nến)
    this.ctx.strokeStyle = gridCol;
    this.ctx.lineWidth = 1;
    for (let r = 0; r <= 4; r++) {
      const y = candleAreaTop + (candleAreaH / 4) * r;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(chartW, y);
      this.ctx.stroke();

      const pVal = maxPrice - (priceRange / 4) * r;
      this.ctx.fillStyle = textCol;
      this.ctx.font = '10px "SF Mono", "Roboto Mono", Consolas, monospace';
      this.ctx.fillText(this.formatPrice(pVal), chartW + 6, y + 3);
    }

    // 2. Vẽ Nến & Volume Histogram (Tách biệt hoàn toàn, không đè nhau)
    const candleCount = visibleCandles.length;
    const step = chartW / candleCount;
    const candleWidth = Math.max(3, Math.floor(step * 0.72));

    visibleCandles.forEach((c, i) => {
      const x = Math.floor(i * step + step / 2);
      const isUp = c.close >= c.open;
      const col = isUp ? upCol : downCol;

      const yO = candleAreaTop + candleAreaH - ((c.open - minPrice) / priceRange) * candleAreaH;
      const yC = candleAreaTop + candleAreaH - ((c.close - minPrice) / priceRange) * candleAreaH;
      const yH = candleAreaTop + candleAreaH - ((c.high - minPrice) / priceRange) * candleAreaH;
      const yL = candleAreaTop + candleAreaH - ((c.low - minPrice) / priceRange) * candleAreaH;

      // Bóng nến (Wick)
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, yH);
      this.ctx.lineTo(x, yL);
      this.ctx.stroke();

      // Thân nến (Body)
      const topY = Math.min(yO, yC);
      const bodyH = Math.max(2, Math.abs(yC - yO));
      this.ctx.fillStyle = col;
      this.ctx.fillRect(Math.floor(x - candleWidth / 2), topY, candleWidth, bodyH);

      // Cột Khối lượng Volume (Khóa riêng biệt 18% đáy màn hình)
      const vRatio = Math.min(1, c.volume / maxVol);
      const vBarH = vRatio * (volAreaH - 4);
      const vY = h - vBarH;
      this.ctx.fillStyle = isUp ? 'rgba(14, 203, 129, 0.40)' : 'rgba(246, 70, 93, 0.40)';
      this.ctx.fillRect(Math.floor(x - candleWidth / 2), vY, candleWidth, vBarH);
    });

    // 3. Đường giá hiện tại (Current Price Line)
    const curY = candleAreaTop + candleAreaH - ((this.currentPrice - minPrice) / priceRange) * candleAreaH;
    this.ctx.strokeStyle = '#fcd535';
    this.ctx.setLineDash([4, 3]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, curY);
    this.ctx.lineTo(chartW, curY);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Cờ giá hiện tại góc phải
    this.ctx.fillStyle = '#fcd535';
    this.ctx.fillRect(chartW, curY - 9, rightMargin - 4, 18);
    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 10px "SF Mono", "Roboto Mono", Consolas, monospace';
    this.ctx.fillText(this.formatPrice(this.currentPrice), chartW + 6, curY + 3.5);

    // 4. Đường chữ thập Crosshair khi rê chuột
    if (this.crosshairX !== null && this.crosshairY !== null && this.crosshairX <= chartW) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      this.ctx.setLineDash([2, 2]);

      // Trục dọc
      this.ctx.beginPath();
      this.ctx.moveTo(this.crosshairX, 0);
      this.ctx.lineTo(this.crosshairX, h);
      this.ctx.stroke();

      // Trục ngang
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.crosshairY);
      this.ctx.lineTo(chartW, this.crosshairY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  formatPrice(p) {
    if (p >= 1000) {
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (p >= 1) {
      return p.toFixed(4);
    }
    return p.toFixed(6);
  }
}

window.SovereignCandleEngine = SovereignCandleEngine;
window.ApexChartRenderer = ApexChartRenderer;
