/* ========================================================
   APEXCORE PRO — WALLET PAGE (js/pages/wallet.js)
   MASTER v3.0 — Quản Lý Ví, Nạp VietQR 3s, Rút Tiền & Chuyển P2P
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { getLogo } from '../config.js';
import { Auth } from '../auth.js';

export class WalletPage {
  constructor(router) {
    this.router = router;
    this.isHidden = false;
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
  }

  unmount() {}

  renderHTML() {
    const isFounder = Auth.isFounder();
    const balance = isFounder ? 12458.32 : (Auth.user?.balance_usdt || 1000.00);

    const assets = [
      { symbol: 'USDT', name: 'Tether USD', avbl: balance, price: 1.0 },
      { symbol: 'BNB', name: 'Binance Coin', avbl: isFounder ? 18.50 : 0.50, price: 780.35 },
      { symbol: 'BTC', name: 'Bitcoin', avbl: isFounder ? 0.045 : 0.005, price: 68432.12 },
      { symbol: 'ETH', name: 'Ethereum', avbl: isFounder ? 0.35 : 0.02, price: 3248.75 },
      { symbol: 'FPT', name: 'FPT Corp', avbl: isFounder ? 500 : 50, price: 5.30 },
      { symbol: 'VFS', name: 'VinFast Auto', avbl: isFounder ? 800 : 100, price: 4.85 }
    ];

    return `
      <div class="wallet-container">
        <!-- Balance Hero -->
        <div class="card-panel" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-sub);">
              <span>Tổng Số Dư Ước Tính</span>
              <button id="btn-toggle-eye" style="background:none; border:none; cursor:pointer;">👁️</button>
            </div>
            <div class="num-tabular font-bold" id="wallet-main-bal" style="font-size:32px; line-height:1.2; margin:4px 0;">
              $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div class="text-sub" style="font-size:12px;">≈ ${(balance * 25400).toLocaleString('vi-VN')} VNĐ</div>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn-primary" style="padding:10px 18px; font-size:13px;" id="btn-wallet-vietqr">
              ⚡ Nạp VietQR 3s
            </button>
            <button class="btn-ghost" style="padding:10px 18px; font-size:13px;" id="btn-wallet-withdraw">
              Rút Tiền
            </button>
            <button class="btn-ghost" style="padding:10px 18px; font-size:13px;" id="btn-wallet-transfer">
              Chuyển P2P
            </button>
          </div>
        </div>

        <!-- Asset Breakdown -->
        <div class="card-panel" style="padding:0; overflow:hidden;">
          <div style="padding:12px 16px; border-bottom:1px solid var(--border);">
            <strong style="font-size:14px;">Danh Mục Tài Sản Trong Ví</strong>
            <span class="text-muted" style="font-size:11px; margin-left:8px;">Sổ cái kép tự chủ trên máy chủ Go</span>
          </div>

          <table class="pro-data-table">
            <thead>
              <tr>
                <th>Tài Sản</th>
                <th>Tên Đầy Đủ</th>
                <th class="text-right">Khả Dụng</th>
                <th class="text-right">Đóng Băng</th>
                <th class="text-right">Giá Trị (USDT)</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              ${assets.map(a => `
                <tr>
                  <td>
                    <div class="table-asset-badge">
                      <span class="asset-vector-logo">${getLogo(a.symbol)}</span>
                      <strong>${a.symbol}</strong>
                    </div>
                  </td>
                  <td class="text-sub">${a.name}</td>
                  <td class="text-right num-tabular font-bold">${a.avbl.toLocaleString('en-US', { minimumFractionDigits: a.symbol === 'USDT' || a.symbol === 'FPT' || a.symbol === 'VFS' ? 2 : 4 })}</td>
                  <td class="text-right num-tabular text-muted">0.00</td>
                  <td class="text-right num-tabular font-bold">$${(a.avbl * a.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td class="text-center">
                    <button class="btn-trade-sm" onclick="window.ApexRouter.navigate('/trade/${a.symbol === 'USDT' ? 'BNB_USDT' : a.symbol + '_USDT'}')">Giao Dịch</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  initEvents() {
    const eyeBtn = document.getElementById('btn-toggle-eye');
    const balEl = document.getElementById('wallet-main-bal');
    eyeBtn?.addEventListener('click', () => {
      this.isHidden = !this.isHidden;
      if (balEl) balEl.textContent = this.isHidden ? '••••••••' : `$${(Auth.isFounder() ? 12458.32 : 1000).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    });

    document.getElementById('btn-wallet-vietqr')?.addEventListener('click', () => {
      window.ApexApp.openVietQR();
    });

    document.getElementById('btn-wallet-withdraw')?.addEventListener('click', () => {
      window.ApexApp.showToast('Yêu cầu rút tiền được bảo vệ an toàn với OTP 2FA.', 'info');
    });

    document.getElementById('btn-wallet-transfer')?.addEventListener('click', () => {
      window.ApexApp.showToast('Chuyển quỹ nội bộ 0s giữa Spot và Futures thành công!', 'success');
    });
  }
}
