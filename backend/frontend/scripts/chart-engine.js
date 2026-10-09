/* ========================================================
   APEXCORE PRO CANDLESTICK ENGINE (chart-engine.js)
   Chuẩn TradingView Pro Terminal — High-DPI Canvas Rendering
   Owner & Founder: NGUYỄN PHƯỚC LỘC
   ======================================================== */

export class CandleChartEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.candles = [];
    this.hoverPos = null;
    this.activeTimeframe = '15m';
    this.symbol = 'BNB/USDT';
    this.basePrice = 780.35;

    this.initData();
    this.setupEvents();
    this.resizeAndRender();

    window.addEventListener('resize', () => this.resizeAndRender());
  }

  initData() {
    this.candles = [];
    let currentPrice = this.basePrice * 0.985;
    const now = Date.now();
    const intervalMs = 15 * 60 * 1000;

    for (let i = 50; i >= 0; i--) {
      const open = currentPrice;
      const change = (Math.random() - 0.49) * (currentPrice * 0.008);
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (currentPrice * 0.004);
      const low = Math.min(open, close) - Math.random() * (currentPrice * 0.004);
      const vol = Math.floor(Math.random() * 1200) + 250;
      const time = now - i * intervalMs;

      this.candles.push({ time, open, high, low, close, vol });
      currentPrice = close;
    }

    // Ensure the last candle closes at basePrice
    if (this.candles.length > 0) {
      const last = this.candles[this.candles.length - 1];
      last.close = this.basePrice;
      if (last.close > last.high) last.high = last.close * 1.002;
      if (last.close < last.low) last.low = last.close * 0.998;
    }
  }

  resizeCanvas() {
    this.resizeAndRender();
  }

  resizeAndRender() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.draw();
  }

  draw() {
    if (!this.ctx || this.candles.length === 0) return;
    const { ctx, width, height, candles } = this;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
    const textColor = isLight ? '#707a8a' : '#848e9c';
    const buyColor = '#0ecb81';
    const sellColor = '#f6465d';

    ctx.clearRect(0, 0, width, height);

    // Layout
    const priceAreaHeight = height * 0.76;
    const volAreaHeight = height * 0.18;
    const rightMargin = 68;
    const chartWidth = Math.max(100, width - rightMargin);

    // Min / Max calculation
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.vol > maxVol) maxVol = c.vol;
    });

    const padding = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= padding;
    maxPrice += padding;
    const priceRange = maxPrice - minPrice;

    // Grid lines & Price axis
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridRows = 5;
    for (let r = 0; r <= gridRows; r++) {
      const y = (priceAreaHeight / gridRows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      const p = maxPrice - (priceRange / gridRows) * r;
      ctx.fillStyle = textColor;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toLocaleString('en-US', { minimumFractionDigits: p < 10 ? 4 : 2, maximumFractionDigits: p < 10 ? 4 : 2 }), chartWidth + 6, y + 3);
    }

    // Geometry & TradingView Golden Ratio
    const numCandles = candles.length;
    const step = chartWidth / numCandles;
    const candleWidth = Math.max(3, Math.floor(step * 0.70));

    // Draw candles and volume bars
    candles.forEach((c, i) => {
      const x = Math.floor(i * step + step / 2);
      const isUp = c.close >= c.open;
      const color = isUp ? buyColor : sellColor;

      const yOpen = priceAreaHeight - ((c.open - minPrice) / priceRange) * priceAreaHeight;
      const yClose = priceAreaHeight - ((c.close - minPrice) / priceRange) * priceAreaHeight;
      const yHigh = priceAreaHeight - ((c.high - minPrice) / priceRange) * priceAreaHeight;
      const yLow = priceAreaHeight - ((c.low - minPrice) / priceRange) * priceAreaHeight;

      // Wick (vẽ râu nến trước, 1px sắc nét ở giữa)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, yHigh);
      ctx.lineTo(x + 0.5, yLow);
      ctx.stroke();

      // Body (vẽ thân nến sau)
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const rawBodyHeight = Math.abs(yClose - yOpen);

      if (Math.abs(c.open - c.close) < 0.0001 || rawBodyHeight < 1) {
        ctx.fillRect(Math.floor(x - candleWidth / 2), Math.floor(bodyTop), candleWidth, 1);
      } else {
        ctx.fillRect(Math.floor(x - candleWidth / 2), Math.floor(bodyTop), candleWidth, Math.max(1, rawBodyHeight));
      }

      // Volume bar ở đáy 20%
      const maxVolH = height * 0.18;
      const volH = Math.max(2, (c.vol / (maxVol || 1)) * maxVolH);
      const yVolTop = height - volH;
      ctx.fillStyle = isUp ? 'rgba(14, 203, 129, 0.28)' : 'rgba(246, 70, 93, 0.28)';
      ctx.fillRect(Math.floor(x - candleWidth / 2), yVolTop, candleWidth, volH);
    });

    // Drifting dashed price line for last candle
    const lastCandle = candles[candles.length - 1];
    const lastY = priceAreaHeight - ((lastCandle.close - minPrice) / priceRange) * priceAreaHeight;

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = lastCandle.close >= lastCandle.open ? buyColor : sellColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, lastY);
    ctx.lineTo(chartWidth, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update live floating price tag
    const flag = document.getElementById('live-price-flag');
    if (flag) {
      flag.style.top = `${Math.max(15, Math.min(priceAreaHeight - 10, lastY))}px`;
      flag.style.background = lastCandle.close >= lastCandle.open ? buyColor : sellColor;
      const flagVal = document.getElementById('flag-price-val');
      if (flagVal) flagVal.textContent = lastCandle.close.toFixed(2);
    }

    // Crosshair hover
    if (this.hoverPos && this.hoverPos.x < chartWidth && this.hoverPos.y < height) {
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(this.hoverPos.x, 0);
      ctx.lineTo(this.hoverPos.x, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, this.hoverPos.y);
      ctx.lineTo(chartWidth, this.hoverPos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  setupEvents() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.hoverPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this.draw();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPos = null;
      this.draw();
    });
  }

  setSymbol(symbol, price) {
    this.symbol = symbol;
    this.basePrice = price;
    this.initData();
    this.draw();
  }

  setTargetPrice(price) {
    if (this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    last.close = price;
    if (price > last.high) last.high = price;
    if (price < last.low) last.low = price;
    this.draw();
  }

  pumpBullishMarubozu() {
    if (this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    const open = last.close;
    const pumpAmount = open * 0.03;
    const close = open + pumpAmount;
    const high = close + pumpAmount * 0.02;
    const low = open - pumpAmount * 0.01;
    const vol = 1500;
    this.candles.push({ time: Date.now(), open, high, low, close, vol });
    this.draw();
  }

  dumpBearishMarubozu() {
    if (this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    const open = last.close;
    const dumpAmount = open * 0.03;
    const close = open - dumpAmount;
    const high = open + dumpAmount * 0.01;
    const low = close - dumpAmount * 0.02;
    const vol = 1800;
    this.candles.push({ time: Date.now(), open, high, low, close, vol });
    this.draw();
  }

  pumpWickSweep() {
    if (this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    const open = last.close;
    const low = open * 0.94; // Deep liquidity sweep
    const close = open * 1.002; // Bounces right back
    const high = open * 1.005;
    const vol = 2500;
    this.candles.push({ time: Date.now(), open, high, low, close, vol });
    this.draw();
  }
}
