/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — TRADE HELIX DNA ENGINE
 * (frontend/scripts/engines/helix-engine.js)
 * Master Blueprint Official V13 — Double Helix Wave Equation & Fills
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * 
 * Sợi 1: y1(x) = centerY + A * sin(x * omega - t) (Vàng Kim #FFD700)
 * Sợi 2: y2(x) = centerY - A * sin(x * omega - t) (Xanh Ngọc #00FFA3)
 * 104 Fills Nucleotide Rungs (Mua Xanh Ngọc ┃┃ Bán Đỏ Ruby) · 60 FPS
 * ========================================================
 */

(function () {
  'use strict';

  if (window.TradeHelixEngine) return;

  class SovereignHelixEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.animId = null;
      this.phase = 0.0;
      this.surge = 0.0;
      this.mode = 'GOD'; // 'GOD' | 'ECO'
      this.isRunning = false;

      // 104 Lệnh khớp gần nhất (49% Mua Xanh / 51% Bán Đỏ)
      this.totalFills = 104;
      this.fills = [];
      this.initHistoricalFills();

      // Thông số vi mô
      this.stats = {
        headerWr: '49%',
        headerPnl: '+$412',
        footerPnl: '+$336',
        wins: 349,
        losses: 451,
        winRate: '49%',
        node: 'QUANT-01'
      };

      this.layout = {
        w: 0,
        h: 0,
        dpr: 1
      };
    }

    initHistoricalFills() {
      this.fills = [];
      // Khởi tạo 104 fills với tỷ lệ 49% BUY / 51% SELL
      for (let i = 0; i < this.totalFills; i++) {
        // Tạo các cụm lệnh khớp HFT tự nhiên
        const isBuy = (Math.sin(i * 0.42) + Math.cos(i * 0.85) + (Math.random() - 0.52)) > 0;
        this.fills.push({
          id: i,
          side: isBuy ? 'BUY' : 'SELL',
          notional: Math.floor(120 + Math.random() * 450),
          alpha: 0.65 + Math.random() * 0.35
        });
      }
    }

    init(canvasId = 'trade-helix-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });

      // Resize observer
      const resizeHandler = () => this.handleResize();
      if (window.ResizeObserver && this.canvas.parentElement) {
        this.resizeObs = new ResizeObserver(resizeHandler);
        this.resizeObs.observe(this.canvas.parentElement);
      }
      window.addEventListener('resize', resizeHandler);

      // Lắng nghe sự kiện lệnh khớp từ ApexEventBus
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, (trade) => {
          this.pushFill(trade && trade.side ? trade.side : (Math.random() > 0.51 ? 'BUY' : 'SELL'));
          this.triggerSurge(0.8);
        });

        window.ApexEventBus.on(window.ApexEvents.MODE_CHANGED, (mode) => {
          this.setMode(mode);
        });
      }

      this.handleResize();
      this.start();
    }

    setMode(mode) {
      this.mode = mode;
    }

    triggerSurge(amount = 0.8) {
      this.surge = Math.min(2.5, this.surge + amount);
    }

    pushFill(side) {
      this.fills.shift();
      this.fills.push({
        id: Date.now(),
        side: side,
        notional: Math.floor(150 + Math.random() * 500),
        alpha: 1.0
      });
    }

    handleResize() {
      if (!this.canvas || !this.canvas.parentElement) return;

      const rect = this.canvas.parentElement.getBoundingClientRect();
      const w = Math.max(200, Math.floor(rect.width));
      const h = Math.max(42, Math.floor(rect.height || 55));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      this.layout.w = w;
      this.layout.h = h;
      this.layout.dpr = dpr;
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      const loop = () => {
        this.render();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      const { w, h, dpr } = this.layout;
      if (w <= 0 || h <= 0) return;

      const ctx = this.ctx;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Cập nhật góc pha sóng (Double Helix Phase)
      this.surge = Math.max(0, this.surge * 0.96);
      const baseSpeed = this.mode === 'GOD' ? 0.038 : 0.024;
      this.phase += baseSpeed * (1.0 + this.surge);

      // 1. Tham số chuỗi xoắn kép DNA
      const centerY = h * 0.5;
      const amplitude = Math.max(10, Math.min(17, h * 0.32));
      const wavesCount = 6.2; // 6 đến 7 mắt xoắn trên toàn chiều rộng
      const omega = (Math.PI * 2 * wavesCount) / w;

      // 2. Vẽ 104 Thanh Liên Kết Nucleotide Khớp Lệnh (Inside Helix Fills)
      this.renderNucleotideFills(ctx, w, centerY, amplitude, omega);

      // 3. Vẽ 2 Sợi Xoắn DNA Kép 3D (Gold & Emerald)
      this.renderHelixStrands(ctx, w, centerY, amplitude, omega);

      ctx.restore();
    }

    renderNucleotideFills(ctx, w, centerY, amplitude, omega) {
      const padLeft = 8;
      const padRight = 8;
      const usableW = w - padLeft - padRight;
      const fillCount = this.fills.length;
      const dx = usableW / (fillCount - 1);

      ctx.save();
      for (let i = 0; i < fillCount; i++) {
        const x = padLeft + i * dx;
        const fill = this.fills[i];

        // Tọa độ 2 sợi tại điểm x
        const angle = x * omega - this.phase;
        const sinVal = Math.sin(angle);
        const y1 = centerY + amplitude * sinVal;
        const y2 = centerY - amplitude * sinVal;

        const yTop = Math.min(y1, y2);
        const yBot = Math.max(y1, y2);
        const height = yBot - yTop;

        // Chỉ vẽ khi khoảng cách giữa 2 sợi lớn hơn ngưỡng (bên trong mắt xoắn)
        if (height > 2.0) {
          const isBuy = fill.side === 'BUY';
          const strokeCol = isBuy ? '#00FFA3' : '#FF3366';
          const glowCol = isBuy ? 'rgba(0, 255, 163, 0.45)' : 'rgba(255, 51, 102, 0.45)';

          ctx.beginPath();
          ctx.moveTo(x, yTop + 1);
          ctx.lineTo(x, yBot - 1);

          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = 1.3;
          ctx.globalAlpha = Math.min(1.0, 0.45 + (height / (amplitude * 2)) * 0.55);
          ctx.shadowColor = glowCol;
          ctx.shadowBlur = 4;
          ctx.stroke();

          // Điểm tiếp xúc hạt sáng tại chân liên kết
          if (height > 8) {
            ctx.fillStyle = strokeCol;
            ctx.fillRect(x - 0.75, yTop, 1.5, 1.5);
            ctx.fillRect(x - 0.75, yBot - 1.5, 1.5, 1.5);
          }
        }
      }
      ctx.restore();
    }

    renderHelixStrands(ctx, w, centerY, amplitude, omega) {
      const step = 2.0;

      // 1. Sợi 1: Vàng Kim Hoàng Gia (#FFD700)
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const y = centerY + amplitude * Math.sin(x * omega - this.phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.85)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Viền lõi sáng trắng cho Sợi 1
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.7;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.restore();

      // 2. Sợi 2: Xanh Ngọc Lục Bảo (#00FFA3)
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += step) {
        const y = centerY - amplitude * Math.sin(x * omega - this.phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00FFA3';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = 'rgba(0, 255, 163, 0.85)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Viền lõi neon cho Sợi 2
      ctx.strokeStyle = '#e6fff7';
      ctx.lineWidth = 0.7;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.restore();

      // 3. Các hạt sáng giao nhau tại các Mắt Xoắn (DNA Crossover Nodes)
      ctx.save();
      const nodeStep = Math.PI / omega;
      const phaseOffset = (this.phase % Math.PI) / omega;
      const startX = phaseOffset > 0 ? phaseOffset : phaseOffset + nodeStep;

      for (let x = startX; x <= w; x += nodeStep) {
        const y = centerY; // Điểm giao cắt luôn nằm ở trục giữa centerY
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  window.SovereignHelixEngine = SovereignHelixEngine;
  window.TradeHelixEngine = new SovereignHelixEngine();

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.TradeHelixEngine.init('trade-helix-canvas');
    });
  } else {
    setTimeout(() => {
      window.TradeHelixEngine.init('trade-helix-canvas');
    }, 60);
  }
})();
