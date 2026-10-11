/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — QUANTUM TORUS & LIVE TELEMETRY REACTOR (V11)
 * (frontend/scripts/quantum-torus.js)
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * Security Clearance: LEVEL 9 GODMODE · SOVEREIGN SEED
 *
 * PHIÊN BẢN V11 — LIVE OSCILLATION & CANDLE PERFECTION:
 * 1. Động cơ nhịp thở sống động cho Card [01] (Inventory & Flow - chu kỳ 1.2s)
 * 2. Động cơ trôi lệnh Market Lifecycle Gantt (5 tracks) & viên kim cương C01 phát sáng
 * 3. Ma trận nhiệt 24 ô Resolution Grid đếm lùi từng giây & hiệu ứng quyết toán Settlement
 * 4. Radar HUD, 11 thanh Edge By Time Left & Resolved Feed chạy liên tục 100% không đơ
 * ========================================================
 */

(function () {
  'use strict';

  console.log('[ApexCore V11] Quantum Torus & Live Telemetry Reactor đã khởi động.');

  // ========================================================
  // 1. BỘ ĐẾM THỜI GIAN THỰC T / T0.0 & THANH TIẾN TRÌNH QUÉT SÓNG
  // ========================================================
  function updateEdgeTelemetry() {
    const edgeRatioEl = document.getElementById('txt-edge-t0');
    const horizonBar = document.getElementById('edge-horizon-progress');
    const now = Date.now();

    if (edgeRatioEl) {
      // Dao động vi mô quanh mức 0.234 mô phỏng quét sóng Chainlink
      const baseWave = 0.234 + Math.sin(now * 0.0018) * 0.007 + (Math.random() * 0.003 - 0.0015);
      edgeRatioEl.textContent = baseWave.toFixed(3);
    }

    if (horizonBar) {
      const pct = 70 + Math.sin(now * 0.0012) * 8;
      horizonBar.style.width = `${pct.toFixed(1)}%`;
    }
  }

  // ========================================================
  // 2. RADAR HUD THỜI GIAN THỰC: FILLS / MIN, VOLATILITY, SHADOWS, WIN RATE
  // ========================================================
  function updateRadarTelemetry() {
    const fillsEl = document.getElementById('txt-fills-min');
    const volEl = document.getElementById('txt-real-vol');
    const shadowsEl = document.getElementById('txt-shadows-fills');
    const edge50El = document.getElementById('txt-edge-50');
    const winrateEl = document.getElementById('txt-radar-winrate');
    const winrateBar = document.getElementById('bar-radar-winrate');
    const netSpreadEl = document.getElementById('txt-net-spread');
    const liqCoverEl = document.getElementById('txt-liq-cover');
    const now = Date.now();

    if (fillsEl) {
      const fills = (152.6 + Math.sin(now * 0.0025) * 1.3 + (Math.random() * 0.4 - 0.2)).toFixed(1);
      fillsEl.textContent = fills;
      fillsEl.classList.add('pulse-tick');
      setTimeout(() => fillsEl.classList.remove('pulse-tick'), 380);
    }

    if (volEl) {
      const vols = ['28 / SEC', '29 / SEC', '30 / SEC', '31 / SEC', '32 / SEC'];
      volEl.textContent = vols[Math.floor(Math.random() * vols.length)];
    }

    if (shadowsEl) {
      shadowsEl.textContent = Math.floor(86 + Math.random() * 4);
    }

    if (edge50El) {
      edge50El.textContent = (50.8 + (Math.random() * 0.3 - 0.15)).toFixed(1) + '%';
    }

    if (winrateEl) {
      const wr = Math.random() > 0.4 ? '52%' : '53%';
      winrateEl.textContent = wr;
      if (winrateBar) winrateBar.style.width = wr;
    }

    if (netSpreadEl) {
      netSpreadEl.textContent = (0.12 + (Math.random() * 0.02 - 0.01)).toFixed(2) + ' USDT';
    }

    if (liqCoverEl) {
      liqCoverEl.textContent = (98.4 + (Math.random() * 0.5 - 0.25)).toFixed(1) + '%';
    }
  }

  // ========================================================
  // 3. BẢNG RESOLVED FEED CUỘN LỆNH LIÊN TỤC KHÔNG BAO GIỜ ĐƠ
  // ========================================================
  const resolvedPool = [
    { coin: 'BTC UP', isUp: true, pnlBase: 136, fillBase: 72 },
    { coin: 'BTC DN', isUp: false, pnlBase: 101, fillBase: 58 },
    { coin: 'ETH UP', isUp: true, pnlBase: 92, fillBase: 52 },
    { coin: 'ETH DN', isUp: false, pnlBase: 65, fillBase: 42 },
    { coin: 'SOL UP', isUp: true, pnlBase: 78, fillBase: 48 },
    { coin: 'SOL DN', isUp: false, pnlBase: 129, fillBase: 70 },
    { coin: 'BTC UP', isUp: true, pnlBase: 177, fillBase: 92 },
    { coin: 'ETH UP', isUp: true, pnlBase: 44, fillBase: 38 },
    { coin: 'BTC DN', isUp: false, pnlBase: 45, fillBase: 34 },
    { coin: 'SOL UP', isUp: true, pnlBase: 114, fillBase: 64 }
  ];

  function pumpResolvedFeed() {
    const list = document.getElementById('resolved-feed-list');
    if (!list) return;

    const sample = resolvedPool[Math.floor(Math.random() * resolvedPool.length)];
    const pnlJitter = Math.floor(sample.pnlBase + (Math.random() * 20 - 10));
    const fillJitter = Math.min(95, Math.max(15, Math.floor(sample.fillBase + (Math.random() * 14 - 7))));
    const pnlSign = sample.isUp ? '+$' : '-$';

    const row = document.createElement('div');
    row.className = `resolved-feed-row ${sample.isUp ? 'up' : 'down'} new-tick`;
    row.innerHTML = `
      <span class="rf-coin">${sample.coin}</span>
      <div class="rf-bar-track"><div class="rf-bar-fill ${sample.isUp ? 'up' : 'down'}" style="width:${fillJitter}%;"></div></div>
      <span class="rf-pnl ${sample.isUp ? 'up' : 'down'}">${pnlSign}${pnlJitter}</span>
    `;

    list.insertBefore(row, list.firstElementChild);

    while (list.children.length > 10) {
      list.removeChild(list.lastElementChild);
    }
  }

  // ========================================================
  // 4. MICRO-PULSE TRÊN CÁC THANH TIẾN TRÌNH 11 MỐC THỜI GIAN
  // ========================================================
  const baseWidths = [12, 20, 28, 36, 45, 54, 63, 72, 81, 90, 100];
  function microPulseEdgeBars() {
    const fills = document.querySelectorAll('.zone-time-fill');
    if (!fills || fills.length === 0) return;

    fills.forEach((fill, idx) => {
      const base = baseWidths[idx] || 50;
      const jitter = (Math.random() * 2.4 - 1.2);
      const targetW = Math.min(100, Math.max(5, base + jitter));
      fill.style.width = `${targetW.toFixed(1)}%`;
    });
  }

  // ========================================================
  // 5. VI TRẮC PnL CARD [01]
  // ========================================================
  function updateTopCardPnL() {
    const pnlEl = document.getElementById('txt-net-pnl-huge');
    if (pnlEl) {
      const jitter = Math.floor(Math.sin(Date.now() * 0.001) * 24 + (Math.random() * 8 - 4));
      const val = 177996 + jitter;
      pnlEl.textContent = `+$${val.toLocaleString('en-US')}`;
    }
  }

  // ========================================================
  // PHẦN 2: ĐỘNG CƠ SỐNG CHO CARD [01] — INVENTORY & FLOW (V11)
  // ========================================================
  // MASTER V12: SANKEY PARTICLE CAPITAL FLOW TELEMETRY
  // Cứ mỗi 1.2s nhịp thở dòng tiền lượng tử bơm qua hệ vi mạch
  // ========================================================
  function updateInventoryFlowBreathing() {
    if (window.SankeyEngine && typeof window.SankeyEngine.triggerSurge === 'function') {
      window.SankeyEngine.triggerSurge(0.25);
    }
  }

  // ========================================================
  // PHẦN 3.1: ĐỘNG CƠ SỐNG CHO CARD [03] — MARKET LIFECYCLE GANTT (V11)
  // 5 thanh tiến trình tự động trôi từ từ từ trái sang phải
  // Khi chạy hết 100%: Lóe sáng xanh RESOLVED +1 và tái tạo chu kỳ mới ở đầu bên trái
  // ========================================================
  const ganttTracks = [
    { id: 'gantt-bar-1', left: 6, width: 70, speed: 0.18, baseWidth: 68 },
    { id: 'gantt-bar-2', left: 18, width: 50, speed: 0.15, baseWidth: 50 },
    { id: 'gantt-bar-3', left: 26, width: 56, speed: 0.22, baseWidth: 54 },
    { id: 'gantt-bar-4', left: 40, width: 34, speed: 0.14, baseWidth: 36 },
    { id: 'gantt-bar-5', left: 54, width: 40, speed: 0.25, baseWidth: 42 }
  ];
  let resolvedCounter = 137;

  function updateMarketLifecycleGantt() {
    ganttTracks.forEach(track => {
      const el = document.getElementById(track.id);
      if (!el) return;

      track.left += track.speed;

      // Khi thanh chạy hết 100%: Xuất hiện hiệu ứng lóe sáng xanh RESOLVED +1 và tái tạo chu kỳ mới!
      if (track.left + track.width >= 100) {
        resolvedCounter++;
        const resolvedTxt = document.getElementById('txt-gantt-resolved');
        if (resolvedTxt) {
          resolvedTxt.textContent = `RESOLVED: ${resolvedCounter}`;
          resolvedTxt.classList.add('gantt-flash-resolve');
          setTimeout(() => resolvedTxt.classList.remove('gantt-flash-resolve'), 700);
        }

        el.classList.add('gantt-flash-resolve');
        setTimeout(() => el.classList.remove('gantt-flash-resolve'), 700);

        // Tái tạo chu kỳ mới ở đầu bên trái
        track.left = 2 + Math.random() * 6;
        track.width = track.baseWidth + (Math.random() * 6 - 3);
      }

      el.style.left = `${track.left.toFixed(1)}%`;
      el.style.width = `${track.width.toFixed(1)}%`;
    });
  }

  // ========================================================
  // PHẦN 3.2: RESOLUTION GRID (24 Ô GẠCH HEATMAP) LIVE COUNTDOWN & SETTLEMENT
  // Đếm lùi từng giây một (15s -> 14s -> 13s -> 12s...)
  // Khi đếm về 0s: Ô gạch lóe sáng đổi màu, nạp giá Strike mới (85¢ -> 88¢) & reset đếm lùi
  // ========================================================
  let resolutionTilesState = [];
  function initResolutionTilesState() {
    const tileElements = document.querySelectorAll('#resolution-heatmap-tiles .res-tile');
    if (!tileElements || tileElements.length === 0) return;

    resolutionTilesState = [];
    tileElements.forEach((tileEl, idx) => {
      const valEl = tileEl.querySelector('.t-val');
      const secEl = tileEl.querySelector('.t-sec');
      const rawSec = secEl ? parseInt(secEl.textContent) : (15 + (idx * 3) % 75);
      const strikeVal = valEl ? valEl.textContent : `${Math.floor(Math.random() * 80 + 12)}¢`;
      const isWin = tileEl.classList.contains('win');

      resolutionTilesState.push({
        el: tileEl,
        valEl: valEl,
        secEl: secEl,
        seconds: isNaN(rawSec) ? (15 + (idx * 4) % 80) : rawSec,
        strike: strikeVal,
        isWin: isWin
      });
    });
  }

  function tickResolutionGridCountdown() {
    if (resolutionTilesState.length === 0) {
      initResolutionTilesState();
      if (resolutionTilesState.length === 0) return;
    }

    resolutionTilesState.forEach(state => {
      state.seconds -= 1;

      // Cơ chế thanh toán lệnh khi đếm về 0s (Settlement Event)
      if (state.seconds <= 0) {
        // 1. Lóe sáng đổi màu
        state.el.classList.add('settle-flash');
        setTimeout(() => state.el.classList.remove('settle-flash'), 750);

        // 2. Đổi trạng thái Thắng / Thua (Win / Loss) với tỷ lệ quỹ định lượng 54%
        state.isWin = Math.random() < 0.54;
        if (state.isWin) {
          state.el.classList.remove('loss');
          state.el.classList.add('win');
        } else {
          state.el.classList.remove('win');
          state.el.classList.add('loss');
        }

        // 3. Nạp giá Strike mới (ví dụ 85¢ -> 88¢)
        const newStrike = Math.floor(Math.random() * 88 + 8);
        state.strike = `${newStrike}¢`;
        if (state.valEl) state.valEl.textContent = state.strike;

        // 4. Bắt đầu chu kỳ đếm ngược mới (12s -> 92s)
        const resetIntervals = [15, 23, 28, 42, 53, 64, 78, 84, 89];
        state.seconds = resetIntervals[Math.floor(Math.random() * resetIntervals.length)] + Math.floor(Math.random() * 6 - 3);
      }

      if (state.secEl) {
        state.secEl.textContent = `${state.seconds}s`;
      }
    });
  }

  // Khởi động các vòng lặp nhịp đập vi mô
  setInterval(updateEdgeTelemetry, 480);
  setInterval(updateRadarTelemetry, 800);
  setInterval(pumpResolvedFeed, 1350);
  setInterval(microPulseEdgeBars, 1600);
  setInterval(updateTopCardPnL, 1000);

  // Kích hoạt động cơ V11
  setInterval(updateInventoryFlowBreathing, 1200);   // Card [01] nhịp thở 1.2s
  setInterval(updateMarketLifecycleGantt, 120);      // Card [03] Gantt trôi êm
  setInterval(tickResolutionGridCountdown, 1000);    // Card [03] 24 ô gạch đếm lùi từng giây

  // Kích hoạt tức thì nhát đầu tiên
  updateEdgeTelemetry();
  updateRadarTelemetry();
  updateTopCardPnL();
  updateInventoryFlowBreathing();
  initResolutionTilesState();
})();
