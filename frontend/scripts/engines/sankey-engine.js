/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — SANKEY PARTICLE CAPITAL FLOW ENGINE
 * (frontend/scripts/engines/sankey-engine.js)
 * Master Blueprint Official V12 — Sankey Particle Flow Pipeline
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * 
 * 60 FPS Organic Bezier Flow · High-Precision Particle Physics · CPU < 0.5%
 * ========================================================
 */

(function () {
  'use strict';

  if (window.SankeyEngine) return;

  class SovereignSankeyEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.animId = null;
      this.frame = 0;
      this.isRunning = false;
      this.mode = 'GOD'; // 'GOD' (full 60fps bloom) | 'ECO' (low CPU)

      // Surging speed factor (triggered by real-time trades)
      this.surge = 0.0;
      this.hoverIndex = -1;

      // Master Inflow (Source Pill Node - Official V13)
      this.inflow = {
        title: 'PORTFOLIO INFLOW',
        sub: '402 x $299',
        amount: '$99,317',
        rawAmount: 99317.00
      };

      // 5 Dải Dòng Chảy Uốn Lượn (Official V13 Ultra-Clean Numbers & Badges)
      this.streams = [
        {
          id: 'fees',
          name: 'PAYMENT & GAS FEES',
          v13Tag: '[3%]',
          val: '$3,606',
          weight: 3.5,
          color: '#cbd5e1', // Silver / White
          glowColor: 'rgba(203, 213, 225, 0.45)',
          particleColor: '#ffffff',
          thick: 3.5,
          bar: null,
          particles: []
        },
        {
          id: 'hosting',
          name: 'HOSTING & DATA FEED',
          v13Tag: '[DATA]',
          val: '$6,400',
          weight: 6.4,
          color: '#00D2FF', // Electric Cyan
          glowColor: 'rgba(0, 210, 255, 0.55)',
          particleColor: '#a5f3fc',
          thick: 5.5,
          bar: null,
          particles: []
        },
        {
          id: 'agent',
          name: 'THE AI QUANT AGENT',
          v13Tag: '[AGENT]',
          val: '$2,055',
          weight: 2.1,
          color: '#E040FB', // Magenta / Purple
          glowColor: 'rgba(224, 64, 251, 0.55)',
          particleColor: '#f5d0fe',
          thick: 3.0,
          bar: null,
          particles: []
        },
        {
          id: 'hedge',
          name: 'HEDGE LIQUIDITY',
          v13Tag: '[HEDGE]',
          val: '$34,672',
          weight: 35.0,
          color: '#FFD700', // Amber Sovereign Gold
          glowColor: 'rgba(255, 215, 0, 0.75)',
          particleColor: '#fef08a',
          thick: 13.0,
          bar: { color: '#FFD700', width: 4.5 },
          particles: []
        },
        {
          id: 'retained',
          name: 'NET PnL RETAINED',
          v13Tag: '[NET]',
          val: '$81,232',
          weight: 53.0,
          color: '#00FFA3', // Neon Emerald
          glowColor: 'rgba(0, 255, 163, 0.85)',
          particleColor: '#6ee7b7',
          thick: 22.0,
          bar: { color: '#00FFA3', width: 6.5 },
          particles: []
        }
      ];

      // Tọa độ đã tính toán
      this.layout = {
        w: 0,
        h: 0,
        dpr: 1,
        pillX: 0,
        pillY: 0,
        pillW: 0,
        pillH: 0,
        xSrc: 0,
        xDst: 0
      };

      this.initParticles();
    }

    initParticles() {
      this.streams.forEach(stream => {
        stream.particles = [];
        const count = this.mode === 'GOD' ? 7 : 4;
        for (let i = 0; i < count; i++) {
          stream.particles.push({
            t: (i / count) + (Math.random() * 0.1 - 0.05),
            speed: 0.0045 + Math.random() * 0.003,
            lateral: (Math.random() - 0.5) * 0.65,
            size: stream.weight > 20 ? (1.6 + Math.random() * 0.8) : (1.2 + Math.random() * 0.6),
            alpha: 0.75 + Math.random() * 0.25
          });
        }
      });
    }

    init(canvasId = 'sankey-flow-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });

      // Resize observer để responsive hoàn hảo
      const resizeHandler = () => this.handleResize();
      if (window.ResizeObserver && this.canvas.parentElement) {
        this.resizeObs = new ResizeObserver(resizeHandler);
        this.resizeObs.observe(this.canvas.parentElement);
      }
      window.addEventListener('resize', resizeHandler);

      // Event listeners cho mouse interaction
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mouseleave', () => { this.hoverIndex = -1; });

      // Kết nối ApexEventBus để kích hoạt dòng chảy siêu tốc khi có lệnh mới
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, (trade) => {
          this.triggerSurge(trade && trade.notional ? Math.min(2.2, 1.2 + trade.notional / 50000) : 1.5);
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
      this.initParticles();
    }

    triggerSurge(factor = 1.6) {
      this.surge = Math.min(2.8, this.surge + factor);
    }

    handleResize() {
      if (!this.canvas || !this.canvas.parentElement) return;

      const rect = this.canvas.parentElement.getBoundingClientRect();
      const w = Math.max(280, Math.floor(rect.width));
      const h = Math.max(110, Math.floor(rect.height || 135));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      this.layout.w = w;
      this.layout.h = h;
      this.layout.dpr = dpr;

      this.computeGeometry();
    }

    computeGeometry() {
      const { w, h } = this.layout;

      // 1. Source Pill Node (Nút nguồn con nhộng bên trái)
      const pillW = Math.max(76, Math.min(92, Math.floor(w * 0.23)));
      const pillH = Math.max(52, Math.min(74, Math.floor(h * 0.62)));
      const pillX = 6;
      const pillY = Math.floor((h - pillH) / 2);

      this.layout.pillX = pillX;
      this.layout.pillY = pillY;
      this.layout.pillW = pillW;
      this.layout.pillH = pillH;

      const xSrc = pillX + pillW;
      // V13: Điểm đến x kết thúc trước 105px để dành toàn bộ khoảng trống bên phải cho số căn phải
      const xDst = Math.max(w * 0.45, w - 105);

      this.layout.xSrc = xSrc;
      this.layout.xDst = xDst;

      // 2. Phân bổ các dải tại nguồn xSrc (theo trọng số)
      const srcBandTop = pillY + 6;
      const srcBandBot = pillY + pillH - 6;
      const totalSrcH = srcBandBot - srcBandTop;
      const gapSrc = 1.0;
      const usableSrcH = totalSrcH - (this.streams.length - 1) * gapSrc;

      let curSrcY = srcBandTop;
      this.streams.forEach(stream => {
        const sliceH = (stream.weight / 100) * usableSrcH;
        stream.srcTop = curSrcY;
        stream.srcBot = curSrcY + sliceH;
        stream.srcMid = (stream.srcTop + stream.srcBot) / 2;
        curSrcY += sliceH + gapSrc;
      });

      // 3. Phân bổ các dải tại đích đến xDst (tầng 0 -> 4)
      const padTop = 8;
      const padBot = 8;
      const usableDstH = h - padTop - padBot;
      const sumThick = this.streams.reduce((acc, s) => acc + s.thick, 0);
      const gapDst = Math.max(3.5, (usableDstH - sumThick) / (this.streams.length - 1));

      let curDstY = padTop;
      this.streams.forEach(stream => {
        stream.dstTop = curDstY;
        stream.dstBot = curDstY + stream.thick;
        stream.dstMid = (stream.dstTop + stream.dstBot) / 2;
        curDstY += stream.thick + gapDst;
      });
    }

    handleMouseMove(e) {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const my = e.clientY - rect.top;

      let found = -1;
      this.streams.forEach((stream, idx) => {
        if (my >= stream.dstTop - 4 && my <= stream.dstBot + 4) {
          found = idx;
        }
      });
      this.hoverIndex = found;
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
      const { w, h, dpr, pillX, pillY, pillW, pillH, xSrc, xDst } = this.layout;
      if (w <= 0 || h <= 0) return;

      const ctx = this.ctx;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      this.frame++;
      // Decay surge
      this.surge = Math.max(0, this.surge * 0.955);
      const speedMult = 1.0 + this.surge;

      // 1. Vẽ 5 dải Bezier Ribbons
      this.renderRibbons(ctx, xSrc, xDst);

      // 2. Vẽ Animated Particle Stream
      this.renderParticles(ctx, xSrc, xDst, speedMult);

      // 3. Vẽ Destination Bars & Labels
      this.renderDestinations(ctx, w, xDst);

      // 4. Vẽ Source Pill Node bên trái
      this.renderSourcePill(ctx, pillX, pillY, pillW, pillH);

      ctx.restore();
    }

    renderRibbons(ctx, xSrc, xDst) {
      const span = xDst - xSrc;
      const cp1x = xSrc + span * 0.44;
      const cp2x = xSrc + span * 0.56;

      this.streams.forEach((stream, idx) => {
        const isHover = this.hoverIndex === idx;

        // Path kín của dải lụa
        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcTop);
        ctx.bezierCurveTo(cp1x, stream.srcTop, cp2x, stream.dstTop, xDst, stream.dstTop);
        ctx.lineTo(xDst, stream.dstBot);
        ctx.bezierCurveTo(cp2x, stream.dstBot, cp1x, stream.srcBot, xSrc, stream.srcBot);
        ctx.closePath();

        // Gradient màu mượt từ Xanh Ngọc nguồn -> Màu dải đích
        const grad = ctx.createLinearGradient(xSrc, 0, xDst, 0);
        const alphaMid = isHover ? 0.55 : 0.32;
        const alphaEnd = isHover ? 0.42 : 0.20;

        grad.addColorStop(0, 'rgba(0, 255, 163, 0.30)');
        grad.addColorStop(0.38, stream.glowColor.replace(/[\d\.]+\)$/, `${alphaMid})`));
        grad.addColorStop(1.0, stream.glowColor.replace(/[\d\.]+\)$/, `${alphaEnd})`));

        ctx.fillStyle = grad;
        ctx.fill();

        // Viền ánh sáng mỏng trên & dưới
        ctx.strokeStyle = stream.color;
        ctx.lineWidth = isHover ? 1.2 : 0.75;
        ctx.globalAlpha = isHover ? 0.85 : 0.45;

        // Đường trên
        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcTop);
        ctx.bezierCurveTo(cp1x, stream.srcTop, cp2x, stream.dstTop, xDst, stream.dstTop);
        ctx.stroke();

        // Đường dưới
        ctx.beginPath();
        ctx.moveTo(xSrc, stream.srcBot);
        ctx.bezierCurveTo(cp1x, stream.srcBot, cp2x, stream.dstBot, xDst, stream.dstBot);
        ctx.stroke();

        ctx.globalAlpha = 1.0;
      });
    }

    renderParticles(ctx, xSrc, xDst, speedMult) {
      const span = xDst - xSrc;
      const cp1x = xSrc + span * 0.44;
      const cp2x = xSrc + span * 0.56;

      this.streams.forEach((stream, streamIdx) => {
        const isHover = this.hoverIndex === streamIdx;

        stream.particles.forEach(p => {
          // Tính tọa độ hiện tại t
          const t = p.t;
          const xTop = this.cubicBezier(t, xSrc, cp1x, cp2x, xDst);
          const yTop = this.cubicBezier(t, stream.srcTop, stream.srcTop, stream.dstTop, stream.dstTop);

          const xBot = this.cubicBezier(t, xSrc, cp1x, cp2x, xDst);
          const yBot = this.cubicBezier(t, stream.srcBot, stream.srcBot, stream.dstBot, stream.dstBot);

          const fraction = 0.5 + p.lateral;
          const px = xTop + (xBot - xTop) * fraction;
          const py = yTop + (yBot - yTop) * fraction;

          // Vệt đuôi sao băng comet trail (t - 0.035)
          const tPrev = Math.max(0, t - 0.038);
          const xTopPrev = this.cubicBezier(tPrev, xSrc, cp1x, cp2x, xDst);
          const yTopPrev = this.cubicBezier(tPrev, stream.srcTop, stream.srcTop, stream.dstTop, stream.dstTop);
          const xBotPrev = this.cubicBezier(tPrev, xSrc, cp1x, cp2x, xDst);
          const yBotPrev = this.cubicBezier(tPrev, stream.srcBot, stream.srcBot, stream.dstBot, stream.dstBot);

          const pxPrev = xTopPrev + (xBotPrev - xTopPrev) * fraction;
          const pyPrev = yTopPrev + (yBotPrev - yTopPrev) * fraction;

          // Vẽ vệt đuôi
          ctx.strokeStyle = stream.particleColor;
          ctx.lineWidth = p.size * 0.75;
          ctx.globalAlpha = (isHover ? 0.55 : 0.32) * p.alpha;
          ctx.beginPath();
          ctx.moveTo(pxPrev, pyPrev);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Vẽ hạt sáng lượng tử chính (White-Hot Core)
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = stream.particleColor;
          ctx.shadowBlur = isHover ? 10 : 6;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;

          // Cập nhật vị trí t cho frame tiếp theo
          p.t += p.speed * speedMult;
          if (p.t >= 1.0) {
            p.t = 0.0;
            p.lateral = (Math.random() - 0.5) * 0.65;
            p.speed = 0.0045 + Math.random() * 0.003;
          }
        });
      });
    }

    renderDestinations(ctx, w, xDst) {
      this.streams.forEach((stream, idx) => {
        const isHover = this.hoverIndex === idx;

        // 1. Thanh chặn đứng (Vertical Pillar Bar cho Dải 4 Vàng & Dải 5 Xanh Ngọc)
        if (stream.bar) {
          ctx.save();
          ctx.fillStyle = stream.bar.color;
          ctx.shadowColor = stream.bar.color;
          ctx.shadowBlur = isHover ? 14 : 9;

          const barW = stream.bar.width;
          const barH = stream.dstBot - stream.dstTop;
          this.roundRect(ctx, xDst, stream.dstTop, barW, barH, 2);
          ctx.fill();
          ctx.restore();
        }

        // 2. V13: Căn chỉnh tọa độ tuyệt đối - Ghim cố định ở mép phải (right: 12px; text-align: right;)
        // Lược bỏ toàn bộ chữ dài dòng, chỉ giữ lại số và mã thẻ siêu tinh gọn:
        // Nhánh 1: $3,606 [3%]
        // Nhánh 2: $6,400 [DATA]
        // Nhánh 3: $2,055 [AGENT]
        // Nhánh 4: $34,672 [HEDGE]
        // Nhánh 5: $81,232 [NET]
        const textY = stream.dstMid;
        const rightEdge = w - 12;

        ctx.save();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const isBigStream = stream.weight > 20;

        // Đo độ rộng mã thẻ [TAG]
        ctx.font = isBigStream 
          ? 'bold 9.5px "JetBrains Mono", Consolas, monospace' 
          : '600 8.5px "JetBrains Mono", Consolas, monospace';

        const tagText = ` ${stream.v13Tag}`;
        const tagWidth = ctx.measureText(tagText).width;

        // Vẽ mã thẻ [TAG]
        ctx.fillStyle = stream.color;
        ctx.globalAlpha = isHover ? 1.0 : (isBigStream ? 0.95 : 0.75);
        ctx.fillText(tagText, rightEdge, textY);

        // Vẽ con số $XXXX đứng trước mã thẻ (tách rời hoàn toàn khỏi dải lụa)
        ctx.font = isBigStream 
          ? '800 10.5px "JetBrains Mono", Consolas, monospace' 
          : '700 9.5px "JetBrains Mono", Consolas, monospace';
        ctx.fillStyle = isHover ? '#ffffff' : stream.color;
        ctx.shadowColor = stream.color;
        ctx.shadowBlur = isHover ? 10 : (isBigStream ? 6 : 2);
        ctx.globalAlpha = 1.0;
        ctx.fillText(stream.val, rightEdge - tagWidth, textY);

        ctx.restore();
      });
    }

    renderSourcePill(ctx, pillX, pillY, pillW, pillH) {
      ctx.save();

      // Nút Nguồn Bên Trái: Viên con nhộng đứng phát sáng màu Xanh Ngọc viền kính Glassmorphism
      this.roundRect(ctx, pillX, pillY, pillW, pillH, 8);

      const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
      pillGrad.addColorStop(0, 'rgba(0, 255, 163, 0.16)');
      pillGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.90)');
      pillGrad.addColorStop(1, 'rgba(9, 14, 26, 0.96)');

      ctx.fillStyle = pillGrad;
      ctx.fill();

      // Viền kính sáng neon
      ctx.strokeStyle = 'rgba(0, 255, 163, 0.65)';
      ctx.lineWidth = 1;
      ctx.shadowColor = 'rgba(0, 255, 163, 0.50)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Radar live dot nhấp nháy bên trong
      const pulse = 0.5 + Math.sin(this.frame * 0.08) * 0.5;
      ctx.beginPath();
      ctx.arc(pillX + 11, pillY + 12, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00FFA3';
      ctx.shadowColor = '#00FFA3';
      ctx.shadowBlur = 5 * pulse;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dòng 1: Tiêu đề
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '7.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('INFLOW SOURCE', pillX + 18, pillY + 12);

      // Dòng 2: Số tiền siêu nổi bật
      ctx.font = 'bold 11.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#00FFA3';
      ctx.shadowColor = 'rgba(0, 255, 163, 0.70)';
      ctx.shadowBlur = 6;
      ctx.fillText(this.inflow.amount, pillX + 9, pillY + 28);
      ctx.shadowBlur = 0;

      // Dòng 3: Multiplier (402 x $299)
      ctx.font = '7.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(this.inflow.sub, pillX + 9, pillY + 43);

      // Dòng 4: Tag chân con nhộng
      ctx.font = '6.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('⚡ QUANTUM SEED', pillX + 9, pillY + 54);

      ctx.restore();
    }
  }

  window.SovereignSankeyEngine = SovereignSankeyEngine;
  window.SankeyEngine = new SovereignSankeyEngine();

  // Tự động khởi chạy khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.SankeyEngine.init('sankey-flow-canvas');
    });
  } else {
    setTimeout(() => {
      window.SankeyEngine.init('sankey-flow-canvas');
    }, 50);
  }
})();
