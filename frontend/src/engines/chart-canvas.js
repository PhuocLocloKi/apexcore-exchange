/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIV: ĐỘNG CƠ NẾN OHLC & FILL SURVIVAL (CHART CANVAS)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class SovereignChartCanvas {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement?.getContext('2d');
    this.options = {
      upColor: '#00FFA3',
      downColor: '#FF3366',
      gridColor: 'rgba(30, 41, 59, 0.45)',
      goldAccent: '#FFD700',
      bgColor: '#030712',
      ...options
    };
    this.candles = [];
    this.dpr = window.devicePixelRatio || 1;
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    if (this.ctx) {
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  setData(candles) {
    this.candles = candles;
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = this.canvas.getBoundingClientRect();
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = this.options.gridColor;
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!this.candles.length) return;

    // Calculate min/max price
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    this.candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    const priceRange = maxPrice - minPrice || 1;
    const candleWidth = Math.max(3, (width / this.candles.length) * 0.7);
    const step = width / this.candles.length;

    this.candles.forEach((c, i) => {
      const x = i * step + step / 2;
      const isUp = c.close >= c.open;
      const color = isUp ? this.options.upColor : this.options.downColor;

      const yHigh = height - ((c.high - minPrice) / priceRange) * (height - 40) - 20;
      const yLow = height - ((c.low - minPrice) / priceRange) * (height - 40) - 20;
      const yOpen = height - ((c.open - minPrice) / priceRange) * (height - 40) - 20;
      const yClose = height - ((c.close - minPrice) / priceRange) * (height - 40) - 20;

      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = color;
      const top = Math.min(yOpen, yClose);
      const bodyH = Math.max(2, Math.abs(yClose - yOpen));
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
    });
  }
}
