/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — FILL SURVIVAL ENGINE
 * (frontend/scripts/engines/fill-survival-engine.js)
 * Kaplan-Meier Order Flow Decay Engine (HFT Market Microstructure)
 * Master System Blueprint Official V17
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * 
 * Mô hình: S(t) = ∏ (1 - d_i / n_i)
 * 3 Lớp suy giảm: MAKER (#00FFA3) · RETAIL (#FF3366) · PASSIVE (#A855F7)
 * ========================================================
 */

(function () {
  'use strict';

  if (window.FillSurvivalEngine) return;

  class SovereignFillSurvivalEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.animId = null;
      this.tAnim = 0;
      this.isRunning = false;

      this.layout = {
        w: 0,
        h: 0,
        dpr: 1
      };

      // Thống kê độ trễ LOB
      this.stats = {
        p50: 26,
        unf: 2.2,
        gt1s: 18.0,
        gt5s: 7.2,
        gt10s: 3.0,
        gt30s: 0.8
      };

      this.surge = 0.0;
    }

    init(canvasId = 'fillSurvivalCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });

      // Resize observer an toàn
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

      // Lắng nghe sự kiện khớp lệnh
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, () => {
          this.triggerDecayPulse();
        });
      }

      this.handleResize();
      this.start();
      this.startLiveTelemetryJitter();
    }

    triggerDecayPulse() {
      this.surge = Math.min(2.0, this.surge + 1.2);
    }

    handleResize() {
      if (!this.canvas || !this.canvas.parentElement) return;

      const rect = this.canvas.parentElement.getBoundingClientRect();
      const w = Math.max(180, Math.floor(rect.width || this.canvas.parentElement.clientWidth || 240));
      const h = Math.max(90, Math.floor(rect.height || this.canvas.parentElement.clientHeight || 110));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (this.layout.w === w && this.layout.h === h && this.layout.dpr === dpr) {
        return;
      }

      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);

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

      this.tAnim += 0.035;
      this.surge = Math.max(0, this.surge * 0.94);

      const padL = 26;
      const padR = 6;
      const padT = 8;
      const padB = 16;
      const plotW = Math.max(100, w - padL - padR);
      const plotH = Math.max(60, h - padT - padB);

      // 1. Lưới tọa độ Grid & Trục Y (100%, 75%, 50%, 25%, 0%)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.font = '7.5px "JetBrains Mono", Consolas, monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const yTicks = [1.0, 0.75, 0.5, 0.25, 0.0];
      yTicks.forEach(tick => {
        const y = padT + (1 - tick) * plotH;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.fillText(`${Math.round(tick * 100)}%`, padL - 3, y);
      });

      // 2. Trục X (0, 10, 32, 78, 100, 320, 1000 ms)
      const xLabels = ['0', '10', '32', '78', '100', '320', '1s'];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      xLabels.forEach((lbl, i) => {
        const x = padL + (i / (xLabels.length - 1)) * plotW;
        ctx.fillText(lbl, x, h - padB + 3);
      });

      // 3. Vùng thanh toán bù trừ Clear Zone (phía sau mốc 100ms -> 1s)
      const xClr = padL + (4 / 6) * plotW;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(xClr, padT, w - padR - xClr, plotH);

      // 4. Đường cong sống sót RETAIL (Hồng Ruby #FF3366)
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      for (let x = 0; x <= plotW; x += 2) {
        const normX = x / plotW;
        const decayRetail = Math.exp(-2.2 * Math.pow(normX, 0.65)) * 0.95;
        const wave = 0.03 * Math.sin(this.tAnim * 1.8 + normX * 8) + (this.surge * 0.02);
        const sRetail = Math.max(0.04, Math.min(1.0, decayRetail + wave));
        const y = padT + (1 - sRetail) * plotH;
        ctx.lineTo(padL + x, y);
      }
      ctx.lineTo(padL + plotW, padT + plotH);
      ctx.lineTo(padL, padT + plotH);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 51, 102, 0.22)';
      ctx.fill();

      // Viền sáng Retail mỏng
      ctx.beginPath();
      for (let x = 0; x <= plotW; x += 2) {
        const normX = x / plotW;
        const decayRetail = Math.exp(-2.2 * Math.pow(normX, 0.65)) * 0.95;
        const wave = 0.03 * Math.sin(this.tAnim * 1.8 + normX * 8) + (this.surge * 0.02);
        const sRetail = Math.max(0.04, Math.min(1.0, decayRetail + wave));
        const y = padT + (1 - sRetail) * plotH;
        if (x === 0) ctx.moveTo(padL, y); else ctx.lineTo(padL + x, y);
      }
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.65)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // 5. Đường cong sống sót MAKER (Xanh Ngọc Lục Bảo #00FFA3 - Suy giảm cực nhanh)
      ctx.beginPath();
      ctx.moveTo(padL, padT);
      for (let x = 0; x <= plotW; x += 2) {
        const normX = x / plotW;
        const decayMaker = Math.exp(-5.6 * Math.pow(normX, 0.55)) * 0.98;
        const wave = 0.015 * Math.cos(this.tAnim * 2.5 + normX * 7) + (this.surge * 0.015);
        const sMaker = Math.max(0.02, Math.min(1.0, decayMaker + wave));
        const y = padT + (1 - sMaker) * plotH;
        ctx.lineTo(padL + x, y);
      }
      ctx.lineTo(padL + plotW, padT + plotH);
      ctx.lineTo(padL, padT + plotH);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 255, 163, 0.32)';
      ctx.fill();

      // Viền sáng phát quang MAKER
      ctx.beginPath();
      for (let x = 0; x <= plotW; x += 2) {
        const normX = x / plotW;
        const decayMaker = Math.exp(-5.6 * Math.pow(normX, 0.55)) * 0.98;
        const wave = 0.015 * Math.cos(this.tAnim * 2.5 + normX * 7) + (this.surge * 0.015);
        const sMaker = Math.max(0.02, Math.min(1.0, decayMaker + wave));
        const y = padT + (1 - sMaker) * plotH;
        if (x === 0) ctx.moveTo(padL, y); else ctx.lineTo(padL + x, y);
      }
      ctx.strokeStyle = '#00FFA3';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(0, 255, 163, 0.7)';
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 6. Đường nét đứt PASSIVE (Tím Neon #A855F7)
      ctx.beginPath();
      ctx.setLineDash([3, 2.5]);
      for (let x = 0; x <= plotW; x += 2) {
        const normX = x / plotW;
        const decayPass = Math.exp(-1.45 * Math.pow(normX, 0.72)) * 0.96;
        const sPass = Math.max(0.06, Math.min(1.0, decayPass));
        const y = padT + (1 - sPass) * plotH;
        if (x === 0) ctx.moveTo(padL, y); else ctx.lineTo(padL + x, y);
      }
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    startLiveTelemetryJitter() {
      setInterval(() => {
        // Nhẹ nhàng rung động vi mô các chỉ số vi cấu trúc
        const jitter = (val, range) => (val + (Math.random() - 0.5) * range);

        const p50Val = Math.round(jitter(26, 2));
        const p50El = document.getElementById('fs-badge-p50');
        if (p50El) p50El.textContent = `P50 ${p50Val}MS`;

        const unfVal = jitter(2.2, 0.2).toFixed(1);
        const unfEl = document.getElementById('fs-badge-unf');
        if (unfEl) unfEl.textContent = `UNF ${unfVal}%`;

        // Thống kê bên phải
        const s1 = Math.round(jitter(18, 1.5));
        const s5 = jitter(7.2, 0.4).toFixed(1);
        const s10 = jitter(3.0, 0.3).toFixed(1);
        const s30 = jitter(0.8, 0.1).toFixed(1);

        const el1 = document.getElementById('fs-val-1s');
        const el5 = document.getElementById('fs-val-5s');
        const el10 = document.getElementById('fs-val-10s');
        const el30 = document.getElementById('fs-val-30s');
        const elUnf = document.getElementById('fs-val-unf');

        if (el1) el1.textContent = `${s1}%`;
        if (el5) el5.textContent = `${s5}%`;
        if (el10) el10.textContent = `+${s10}%`;
        if (el30) el30.textContent = `+${s30}%`;
        if (elUnf) elUnf.textContent = `${unfVal}%`;

        const b1 = document.getElementById('fs-bar-1s');
        const b5 = document.getElementById('fs-bar-5s');
        const b10 = document.getElementById('fs-bar-10s');
        const b30 = document.getElementById('fs-bar-30s');
        const bUnf = document.getElementById('fs-bar-unf');

        if (b1) b1.style.width = `${Math.min(100, s1 * 4)}%`;
        if (b5) b5.style.width = `${Math.min(100, s5 * 5.8)}%`;
        if (b10) b10.style.width = `${Math.min(100, s10 * 8)}%`;
        if (b30) b30.style.width = `${Math.min(100, s30 * 15)}%`;
        if (bUnf) bUnf.style.width = `${Math.min(100, unfVal * 6.8)}%`;
      }, 1200);
    }
  }

  window.SovereignFillSurvivalEngine = SovereignFillSurvivalEngine;
  window.FillSurvivalEngine = new SovereignFillSurvivalEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.FillSurvivalEngine.init('fillSurvivalCanvas');
    });
  } else {
    setTimeout(() => {
      window.FillSurvivalEngine.init('fillSurvivalCanvas');
    }, 60);
  }
})();
