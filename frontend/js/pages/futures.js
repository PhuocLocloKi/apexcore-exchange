/* ========================================================
   APEXCORE PRO — FUTURES PAGE (js/pages/futures.js)
   MASTER v3.0 — Phái Sinh Hợp Đồng Vĩnh Cửu Đòn Bẩy x100
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { SYMBOLS, getLogo } from '../config.js';
import { Auth } from '../auth.js';

export class FuturesPage {
  constructor(router) {
    this.router = router;
    this.currentLeverage = 20;
    this.currentSymbol = SYMBOLS.find(s => s.symbol === 'BTC') || SYMBOLS[1];
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
  }

  unmount() {}

  renderHTML() {
    return `
      <div class="futures-container">
        <div class="card-panel" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div>
            <span class="trust-pill" style="font-size:11px; padding:2px 8px; background:var(--up-bg); color:var(--up); border-radius:4px; font-weight:700;">
              ⚡ FUTURES TERMINAL
            </span>
            <h1 style="font-size:22px; font-weight:900; margin:6px 0 2px;">Giao Dịch Phái Sinh Vĩnh Cửu</h1>
            <p class="text-sub" style="font-size:12px;">Đòn bẩy lên tới <strong class="text-gold">100x</strong> với ký quỹ chéo (Cross) & cô lập (Isolated)</p>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-trade-sm font-bold" onclick="window.ApexRouter.navigate('/trade/BTC_USDT')">Xem Biểu Đồ Gốc ➔</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:360px 1fr; gap:16px;">
          <!-- Order Form -->
          <div class="card-panel">
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Chọn Hợp Đồng</label>
              <select class="form-input" id="futures-select-pair">
                <option value="BTC_USDT">BTC/USDT Perpetual (100x)</option>
                <option value="ETH_USDT">ETH/USDT Perpetual (100x)</option>
                <option value="BNB_USDT">BNB/USDT Perpetual (50x)</option>
                <option value="SOL_USDT">SOL/USDT Perpetual (50x)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <label class="form-label">Đòn bẩy: <strong class="text-gold" id="f-lev-display">20x</strong></label>
                <span class="text-muted" style="font-size:11px;">Max 100x</span>
              </div>
              <input type="range" min="1" max="100" value="20" class="order-pct-range" id="f-lev-range">
            </div>

            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Ký Quỹ (Margin USDT)</label>
              <input type="number" class="form-input num-tabular" id="f-margin-val" placeholder="100.00" value="100">
            </div>

            <!-- Preview -->
            <div style="background:var(--panel-sub); padding:12px; border-radius:6px; font-size:12px; display:flex; flex-direction:column; gap:6px; margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between;">
                <span class="text-sub">Quy mô vị thế:</span>
                <strong class="num-tabular" id="f-pos-size">$2,000.00</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="text-sub">Giá thanh lý ước tính:</span>
                <strong class="num-tabular text-down" id="f-liq-price">$65,010.50</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="text-sub">Tỷ lệ rủi ro:</span>
                <span class="text-up font-bold">An Toàn (1.2%)</span>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="btn-execute-order btn-buy-main" id="btn-f-long">MỞ MUA (LONG)</button>
              <button class="btn-execute-order btn-sell-main" id="btn-f-short">MỞ BÁN (SHORT)</button>
            </div>
          </div>

          <!-- Open Positions -->
          <div class="card-panel">
            <h3 style="font-size:14px; font-weight:800; margin-bottom:12px;">Vị Thế Đang Mở (Open Positions)</h3>
            <table class="pro-data-table">
              <thead>
                <tr>
                  <th>Hợp Đồng</th>
                  <th>Vị Thế</th>
                  <th class="text-right">Giá Vào</th>
                  <th class="text-right">Giá Hiện Tại</th>
                  <th class="text-right">PnL Chưa Chốt</th>
                  <th class="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>BTC/USDT</strong> <span class="tag-sm text-up">20x</span></td>
                  <td><span class="text-up font-bold">LONG 0.50 BTC</span></td>
                  <td class="text-right num-tabular">67,820.00</td>
                  <td class="text-right num-tabular">68,432.12</td>
                  <td class="text-right num-tabular text-up font-bold">+$306.06 (+9.02%)</td>
                  <td class="text-center">
                    <button class="btn-trade-sm" style="background:var(--down); color:#fff; border:none;" onclick="window.ApexApp.showToast('Đã đóng vị thế BTC/USDT thành công!', 'success')">Đóng</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  initEvents() {
    const range = document.getElementById('f-lev-range');
    const disp = document.getElementById('f-lev-display');
    const margin = document.getElementById('f-margin-val');
    const pos = document.getElementById('f-pos-size');
    const liq = document.getElementById('f-liq-price');

    const update = () => {
      const lev = Number(range?.value || 20);
      const m = parseFloat(margin?.value) || 100;
      if (disp) disp.textContent = `${lev}x`;
      if (pos) pos.textContent = `$${(m * lev).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (liq) {
        const drop = 68432.12 / lev;
        liq.textContent = `$${(68432.12 - drop).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
    };

    range?.addEventListener('input', update);
    margin?.addEventListener('input', update);

    document.getElementById('btn-f-long')?.addEventListener('click', () => {
      if (!Auth.isLoggedIn()) { window.ApexApp.openLogin(); return; }
      window.ApexApp.showToast('🚀 Đã mở vị thế LONG Futures thành công!', 'success');
    });

    document.getElementById('btn-f-short')?.addEventListener('click', () => {
      if (!Auth.isLoggedIn()) { window.ApexApp.openLogin(); return; }
      window.ApexApp.showToast('💥 Đã mở vị thế SHORT Futures thành công!', 'success');
    });
  }
}
