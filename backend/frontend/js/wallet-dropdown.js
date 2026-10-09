/* ========================================================
   APEXCORE PRO — WALLET DROPDOWN MODULE (js/wallet-dropdown.js)
   MASTER V9.0 — Danh Sách 11 Ví Chuyên Nghiệp Chuẩn Binance (Ảnh 4)
   Founder & CTO: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class WalletDropdownManager {
  constructor() {
    this.menuEl = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createDropdownDOM();
    document.addEventListener('click', (e) => {
      const btn = document.getElementById('btn-wallet-header');
      if (this.menuEl && !this.menuEl.contains(e.target) && btn && !btn.contains(e.target)) {
        this.close();
      }
    });
  }

  createDropdownDOM() {
    const existing = document.getElementById('terminal-wallet-dropdown');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'terminal-wallet-dropdown';
    menu.className = 'wallet-dropdown-menu';

    menu.innerHTML = `
      <div style="padding:10px 16px; border-bottom:1px solid var(--border-color); font-size:11px; color:var(--text-secondary); text-transform:uppercase; font-weight:800;">
        Danh Mục Quản Lý Ví (11 Ví)
      </div>
      <a href="#overview" onclick="WalletDropdown.select('Overview')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg> Overview (Tổng quan tài sản)</span> <strong class="text-yellow">0.16 USD</strong>
      </a>
      <a href="#spot" onclick="WalletDropdown.select('Spot')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Spot (Ví giao ngay)</span> <span>0.16 USD</span>
      </a>
      <a href="#margin" onclick="WalletDropdown.select('Margin')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M12 3v18M3 12h18"/></svg> Margin (Ví ký quỹ đòn bẩy)</span> <span>0.00 USD</span>
      </a>
      <a href="#futures" onclick="WalletDropdown.select('Futures')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M4.5 16.5L12 3l7.5 13.5H4.5z"/></svg> Futures (Ví hợp đồng tương lai)</span> <span>0.00 USD</span>
      </a>
      <a href="#options" onclick="WalletDropdown.select('Options')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M18 20V10M12 20V4M6 20v-6"/></svg> Options (Ví quyền chọn)</span> <span>0.00 USD</span>
      </a>
      <a href="#bots" onclick="WalletDropdown.select('Trading Bots')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg> Trading Bots (Ví bot tự động)</span> <span>0.00 USD</span>
      </a>
      <a href="#earn" onclick="WalletDropdown.select('Earn')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M16 10H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H8"/></svg> Earn (Ví tiết kiệm & staking)</span> <span class="text-green">+6.71%</span>
      </a>
      <a href="#funding" onclick="WalletDropdown.select('Funding')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3L2 10h20L12 3z"/></svg> Funding (Ví P2P & Ngân hàng)</span> <span>0.00 USD</span>
      </a>
      <a href="#history" onclick="WalletDropdown.select('Asset History')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Asset History (Lịch sử biến động)</span> <span>➔</span>
      </a>
      <a href="#statement" onclick="WalletDropdown.select('Account Statement')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Account Statement (Sao kê tài chính)</span> <span>➔</span>
      </a>
      <a href="#kyc" onclick="WalletDropdown.select('Verification')" class="wallet-item-link">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Verification (Xác minh KYC: Level 2)</span> <span class="text-green">Đã duyệt</span>
      </a>
    `;

    document.body.appendChild(menu);
    this.menuEl = menu;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.menuEl) {
      this.menuEl.style.display = this.isOpen ? 'block' : 'none';
      if (this.isOpen) {
        const btn = document.getElementById('btn-wallet-header');
        if (btn) {
          const rect = btn.getBoundingClientRect();
          this.menuEl.style.top = `${rect.bottom + 6}px`;
          this.menuEl.style.left = `${rect.left - 100}px`;
        }
      }
    }
  }

  close() {
    this.isOpen = false;
    if (this.menuEl) this.menuEl.style.display = 'none';
  }

  select(name) {
    if (window.UserProfile) {
      window.UserProfile.toast(`📂 Đã chuyển sang chế độ quản lý: ${name}`);
    }
    this.close();
  }
}

// Global instance
if (typeof window !== 'undefined') {
  window.WalletDropdown = new WalletDropdownManager();
}
