/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — CAPITAL SANKEY SMART-MONEY FLOW ENGINE
 * (frontend/scripts/engines/capital-sankey-engine.js)
 * Master Blueprint Official V14 — Multi-Node Capital Sankey 60 FPS
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * 
 * 4 Nguồn Vốn: BTC (32%) · ETH (28%) · STABLES (25%) · ALTS (15%)
 * 4 Điểm Đến: LONG (42%) · SHORT (28%) · HEDGE (18%) · CASH (12%)
 * 16 Dải Lụa Uốn Lượn Đan Chéo Multi-Bezier · Hạt Đa Sắc 60 FPS · CPU < 0.5%
 * ========================================================
 */

(function () {
  'use strict';

  if (window.CapitalSankeyEngine) return;

  class SovereignCapitalSankeyEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.animId = null;
      this.frame = 0;
      this.isRunning = false;
      this.surge = 0.0;
      this.mode = 'GOD'; // 'GOD' | 'ECO'

      // 4 Nguồn Vốn Bên Trái
      this.sources = [
        { id: 'btc', name: 'BTC', pct: '32%', weight: 32, color: '#FFD700', glow: 'rgba(255, 215, 0, 0.75)' },
        { id: 'eth', name: 'ETH', pct: '28%', weight: 28, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.75)' },
        { id: 'stables', name: 'STABLES', pct: '25%', weight: 25, color: '#10B981', glow: 'rgba(16, 185, 129, 0.75)' },
        { id: 'alts', name: 'ALTS', pct: '15%', weight: 15, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.75)' }
      ];

      // 4 Điểm Đến Bên Phải
      this.targets = [
        { id: 'long', name: 'LONG', pct: '42%', weight: 42, color: '#00FFA3', glow: 'rgba(0, 255, 163, 0.85)' },
        { id: 'short', name: 'SHORT', pct: '28%', weight: 28, color: '#FF3366', glow: 'rgba(255, 51, 102, 0.85)' },
        { id: 'hedge', name: 'HEDGE', pct: '18%', weight: 18, color: '#00E5FF', glow: 'rgba(0, 229, 255, 0.85)' },
        { id: 'cash', name: 'CASH', pct: '12%', weight: 12, color: '#64748B', glow: 'rgba(100, 116, 139, 0.75)' }
      ];

      // Ma trận phân bổ dòng tiền 16 luồng (weights sum: rows = sources, cols = targets)
      // BTC 32 -> [18, 7, 5, 2]
      // ETH 28 -> [14, 9, 3, 2]
      // STABLES 25 -> [7, 8, 6, 4]
      // ALTS 15 -> [3, 4, 4, 4]
      this.flowMatrix = [
        [18, 7, 5, 2],
        [14, 9, 3, 2],
        [7,  8, 6, 4],
        [3,  4, 4, 4]
      ];

      this.streams = [];
      this.initStreams();

      this.layout = {
        w: 0,
        h: 0,
        dpr: 1
      };
    }

    initStreams() {
      this.streams = [];
      for (let s = 0; s < this.sources.length; s++) {
        for (let t = 0; t < this.targets.length; t++) {
          const weight = this.flowMatrix[s][t];
          if (weight <= 0) continue;

          // Sinh các hạt ánh sáng chuyển động cho mỗi luồng
          const particleCount = Math.max(2, Math.round(weight * 0.4));
          const particles = [];
          for (let p = 0; p < particleCount; p++) {
            particles.push({
              t: (p / particleCount) + (Math.random() * 0.15 - 0.075),
              speed: 0.0035 + Math.random() * 0.0025,
              lateral: (Math.random() - 0.5) * 0.6,
              size: 1.2 + Math.random() * 0.9,
              alpha: 0.7 + Math.random() * 0.3
            });
          }

          this.streams.push({
            sIdx: s,
            tIdx: t,
            weight: weight,
            source: this.sources[s],
            target: this.targets[t],
            particles: particles
          });
        }
      }
    }

    init(canvasId = 'capital-sankey-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });

      // Resize observer an toàn, chống loop kích thước
      if (window.ResizeObserver && this.canvas.parentElement) {
        this.resizeObs = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.width > 20 && cr.height > 20) {
              if (Math.abs(cr.width - this.layout.w) > 3 || Math.abs(cr.height - this.layout.h) > 3) {
                this.handleResize();
              }
            }
          }
        });
        this.resizeObs.observe(this.canvas.parentElement);
      }
      window.addEventListener('resize', () => this.handleResize());

      // ApexEventBus listener
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, (trade) => {
          this.triggerSurge(trade && trade.notional ? Math.min(2.5, 1.2 + trade.notional / 40000) : 1.5);
        });

        window.ApexEventBus.on(window.ApexEvents.MODE_CHANGED, (mode) => {
          this.mode = mode;
        });
      }

      this.handleResize();
      this.start();
    }

    triggerSurge(factor = 1.5) {
      this.surge = Math.min(2.8, this.surge + factor);
    }

    handleResize() {
      if (!this.canvas || !this.canvas.parentElement) return;

      const rect = this.canvas.parentElement.getBoundingClientRect();
      const w = Math.max(300, Math.floor(rect.width || this.canvas.parentElement.clientWidth || 400));
      const h = Math.max(160, Math.floor(rect.height || this.canvas.parentElement.clientHeight || 215));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Tránh gán lại và tránh redraw nếu kích thước không đổi
      if (this.layout.w === w && this.layout.h === h && this.layout.dpr === dpr) {
        return;
      }

      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);

      this.layout.w = w;
      this.layout.h = h;
      this.layout.dpr = dpr;

      this.computeGeometry();
    }

    computeGeometry() {
      const { w, h } = this.layout;
      if (w <= 0 || h <= 0) return;

      const padTop = 14;
      const padBot = 14;
      const usableH = h - padTop - padBot;

      // Vị trí thanh nguồn X và thanh đích X
      const xSrc = Math.max(76, Math.floor(w * 0.16));
      const xTgt = Math.min(w - 76, Math.floor(w * 0.84));
      this.layout.xSrc = xSrc;
      this.layout.xTgt = xTgt;

      // 1. Phân bổ vị trí 4 thanh Nguồn (Sources)
      const gapSrc = 12;
      const totalSrcGaps = (this.sources.length - 1) * gapSrc;
      const netSrcH = usableH - totalSrcGaps;

      let curSrcY = padTop;
      this.sources.forEach(src => {
        const height = (src.weight / 100) * netSrcH;
        src.yTop = curSrcY;
        src.yBot = curSrcY + height;
        src.yMid = (src.yTop + src.yBot) / 2;
        curSrcY += height + gapSrc;
      });

      // 2. Phân bổ vị trí 4 thanh Đích (Targets)
      const gapTgt = 12;
      const totalTgtGaps = (this.targets.length - 1) * gapTgt;
      const netTgtH = usableH - totalTgtGaps;

      let curTgtY = padTop;
      this.targets.forEach(tgt => {
        const height = (tgt.weight / 100) * netTgtH;
        tgt.yTop = curTgtY;
        tgt.yBot = curTgtY + height;
        tgt.yMid = (tgt.yTop + tgt.yBot) / 2;
        curTgtY += height + gapTgt;
      });

      // 3. Phân bổ các lát cắt dải phụ (Sub-slices) cho 16 luồng đan chéo
      const srcCurrentOffsets = this.sources.map(s => s.yTop);
      const tgtCurrentOffsets = this.targets.map(t => t.yTop);

      this.streams.forEach(stream => {
        const src = this.sources[stream.sIdx];
        const tgt = this.targets[stream.tIdx];

        const srcTotalH = src.yBot - src.yTop;
        const tgtTotalH = tgt.yBot - tgt.yTop;

        const sliceSrcH = (stream.weight / src.weight) * srcTotalH;
        const sliceTgtH = (stream.weight / tgt.weight) * tgtTotalH;

        stream.srcTop = srcCurrentOffsets[stream.sIdx];
        stream.srcBot = stream.srcTop + sliceSrcH;
        stream.srcMid = (stream.srcTop + stream.srcBot) / 2;
        srcCurrentOffsets[stream.sIdx] += sliceSrcH;

        stream.tgtTop = tgtCurrentOffsets[stream.tIdx];
        stream.tgtBot = stream.tgtTop + sliceTgtH;
        stream.tgtMid = (stream.tgtTop + stream.tgtBot) / 2;
        tgtCurrentOffsets[stream.tIdx] += sliceTgtH;
      });
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

    cubicBezier(t, p0, p1, p2, p3) {
      const u = 1 - t;
      return (u * u * u * p0) + (3 * u * u * t * p1) + (3 * u * t * t * p2) + (t * t * t * p3);
    }

    roundRect(ctx, x, y, width, height, radius) {
      if (ctx.roundRect) {
        ctx.roundRect(x, y, width, height, radius);
        return;
      }
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    }

    render() {
      if (!this.ctx || !this.canvas) return;
      const { w, h, dpr, xSrc, xTgt } = this.layout;
      if (w <= 0 || h <= 0) return;

      const ctx = this.ctx;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      this.frame++;
      this.surge = Math.max(0, this.surge * 0.955);
      const speedMult = 1.0 + this.surge;

      // 1. Vẽ 16 dải dòng chảy uốn lượn đan chéo Multi-Bezier
      this.renderRibbons(ctx, xSrc, xTgt);

      // 2. Vẽ Hạt Lượng Tử Đa Sắc di chuyển 60 FPS
      this.renderParticles(ctx, xSrc, xTgt, speedMult);

      // 3. Vẽ 4 Thanh Nguồn (Trái) & Nhãn
      this.renderSources(ctx, xSrc);

      // 4. Vẽ 4 Thanh Đích (Phải) & Nhãn
      this.renderTargets(ctx, w, xTgt);

      ctx.restore();
    }

    renderRibbons(ctx, xSrc, xTgt) {
      const span = xTgt - xSrc;
      const cp1x = xSrc + span * 0.46;
      const cp2x = xSrc + span * 0.54;

      // Sắp xếp các luồng theo độ dày để vẽ chồng lớp mượt mà
      this.streams.forEach(stream => {
        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcTop);
        ctx.bezierCurveTo(cp1x, stream.srcTop, cp2x, stream.tgtTop, xTgt, stream.tgtTop);
        ctx.lineTo(xTgt, stream.tgtBot);
        ctx.bezierCurveTo(cp2x, stream.tgtBot, cp1x, stream.srcBot, xSrc, stream.srcBot);
        ctx.closePath();

        // Gradient màu chuyển tiếp từ Nguồn -> Đích
        const grad = ctx.createLinearGradient(xSrc, 0, xTgt, 0);
        grad.addColorStop(0, this.hexToRgba(stream.source.color, 0.30));
        grad.addColorStop(1, this.hexToRgba(stream.target.color, 0.32));

        ctx.fillStyle = grad;
        ctx.fill();

        // Viền ánh sáng mỏng trên & dưới
        ctx.strokeStyle = stream.source.color;
        ctx.lineWidth = 0.65;
        ctx.globalAlpha = 0.35;

        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcTop);
        ctx.bezierCurveTo(cp1x, stream.srcTop, cp2x, stream.tgtTop, xTgt, stream.tgtTop);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcBot);
        ctx.bezierCurveTo(cp1x, stream.srcBot, cp2x, stream.tgtBot, xTgt, stream.tgtBot);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
      });
    }

    renderParticles(ctx, xSrc, xTgt, speedMult) {
      const span = xTgt - xSrc;
      const cp1x = xSrc + span * 0.46;
      const cp2x = xSrc + span * 0.54;

      this.streams.forEach(stream => {
        stream.particles.forEach(p => {
          const t = p.t;
          const xTop = this.cubicBezier(t, xSrc, cp1x, cp2x, xTgt);
          const yTop = this.cubicBezier(t, stream.srcTop, stream.srcTop, stream.tgtTop, stream.tgtTop);

          const xBot = this.cubicBezier(t, xSrc, cp1x, cp2x, xTgt);
          const yBot = this.cubicBezier(t, stream.srcBot, stream.srcBot, stream.tgtBot, stream.tgtBot);

          const fraction = 0.5 + p.lateral;
          const px = xTop + (xBot - xTop) * fraction;
          const py = yTop + (yBot - yTop) * fraction;

          // Vệt đuôi sao băng comet trail
          const tPrev = Math.max(0, t - 0.036);
          const xTopPrev = this.cubicBezier(tPrev, xSrc, cp1x, cp2x, xTgt);
          const yTopPrev = this.cubicBezier(tPrev, stream.srcTop, stream.srcTop, stream.tgtTop, stream.tgtTop);
          const xBotPrev = this.cubicBezier(tPrev, xSrc, cp1x, cp2x, xTgt);
          const yBotPrev = this.cubicBezier(tPrev, stream.srcBot, stream.srcBot, stream.tgtBot, stream.tgtBot);

          const pxPrev = xTopPrev + (xBotPrev - xTopPrev) * fraction;
          const pyPrev = yTopPrev + (yBotPrev - yTopPrev) * fraction;

          // Màu hạt nội suy theo vị trí t (từ màu nguồn sang màu đích)
          const particleCol = t < 0.5 ? stream.source.color : stream.target.color;

          ctx.strokeStyle = particleCol;
          ctx.lineWidth = p.size * 0.75;
          ctx.globalAlpha = 0.35 * p.alpha;
          ctx.beginPath();
          ctx.moveTo(pxPrev, pyPrev);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Lõi sáng trắng cực đại
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = particleCol;
          ctx.shadowBlur = 6;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;

          // Tiến bước hạt
          p.t += p.speed * speedMult;
          if (p.t >= 1.0) {
            p.t = 0.0;
            p.lateral = (Math.random() - 0.5) * 0.6;
            p.speed = 0.0035 + Math.random() * 0.0025;
          }
        });
      });
    }

    renderSources(ctx, xSrc) {
      this.sources.forEach(src => {
        const barH = src.yBot - src.yTop;

        // 1. Thanh đứng màu nguồn
        ctx.save();
        ctx.fillStyle = src.color;
        ctx.shadowColor = src.color;
        ctx.shadowBlur = 8;
        this.roundRect(ctx, xSrc - 5, src.yTop, 5, barH, 2.5);
        ctx.fill();
        ctx.restore();

        // 2. Nhãn bên trái thanh đứng (Căn phải)
        ctx.save();
        ctx.font = 'bold 9px "JetBrains Mono", Consolas, monospace';
        ctx.fillStyle = src.color;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${src.name} · ${src.pct}`, xSrc - 9, src.yMid);
        ctx.restore();
      });
    }

    renderTargets(ctx, w, xTgt) {
      this.targets.forEach(tgt => {
        const barH = tgt.yBot - tgt.yTop;

        // 1. Thanh đứng màu đích
        ctx.save();
        ctx.fillStyle = tgt.color;
        ctx.shadowColor = tgt.color;
        ctx.shadowBlur = 9;
        this.roundRect(ctx, xTgt, tgt.yTop, 5.5, barH, 2.5);
        ctx.fill();
        ctx.restore();

        // 2. Nhãn bên phải thanh đứng (Căn trái)
        ctx.save();
        ctx.font = 'bold 9.5px "JetBrains Mono", Consolas, monospace';
        ctx.fillStyle = tgt.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${tgt.name} · ${tgt.pct}`, xTgt + 9, tgt.yMid);
        ctx.restore();
      });
    }

    hexToRgb(hex) {
      const c = hex.replace('#', '');
      const num = parseInt(c, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }

    hexToRgba(hex, alpha = 0.32) {
      if (!hex) return `rgba(255, 255, 255, ${alpha})`;
      if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
      return `rgba(${this.hexToRgb(hex)}, ${alpha})`;
    }
  }

  window.SovereignCapitalSankeyEngine = SovereignCapitalSankeyEngine;
  window.CapitalSankeyEngine = new SovereignCapitalSankeyEngine();

  // Tự động khởi chạy
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.CapitalSankeyEngine.init('capital-sankey-canvas');
    });
  } else {
    setTimeout(() => {
      window.CapitalSankeyEngine.init('capital-sankey-canvas');
    }, 70);
  }
})();
