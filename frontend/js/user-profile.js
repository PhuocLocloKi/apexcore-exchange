/* ========================================================
   APEXCORE PRO — USER PROFILE MODULE (js/user-profile.js)
   MASTER V9.0 — Hồ Sơ Cá Nhân Founder NguyenPhuocLoc (Ảnh 3)
   Founder UID: 1107519625 | nguyenphuocloc010306@gmail.com
   ======================================================== */

class UserProfileManager {
  constructor() {
    this.drawerEl = null;
    this.isOpen = false;
    this.profileData = {
      name: "NguyenPhuocLoc",
      uid: "1107519625",
      email: "nguyenphuocloc010306@gmail.com",
      balance: "0.1579766 USDT",
      usdEquiv: "≈ $0.16",
      pnl: "+$0.00 (0.00%)",
      following: 0,
      followers: 0
    };

    this.init();
  }

  init() {
    this.createDrawerDOM();
  }

  createDrawerDOM() {
    const existing = document.getElementById('user-profile-drawer');
    if (existing) existing.remove();

    const drawer = document.createElement('div');
    drawer.id = 'user-profile-drawer';
    drawer.className = 'profile-drawer-slide';
    drawer.style.display = 'none';

    drawer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="width:46px; height:46px; border-radius:50%; background:var(--color-yellow); color:#000; font-size:18px; font-weight:900; display:flex; align-items:center; justify-content:center;">
            NL
          </div>
          <div>
            <div style="font-size:16px; font-weight:800; color:var(--text-primary);">${this.profileData.name}</div>
            <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-secondary); margin-top:2px;">
              <span>UID: <strong style="color:var(--text-primary);">${this.profileData.uid}</strong></span>
              <button onclick="UserProfile.copyUID()" style="background:none; border:none; color:var(--color-yellow); cursor:pointer; font-size:12px;" title="Sao chép UID">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
        </div>
        <button onclick="UserProfile.toggle()" style="background:none; border:none; color:var(--text-secondary); font-size:18px; cursor:pointer;">✕</button>
      </div>

      <!-- Badges -->
      <div style="display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap;">
        <span style="font-size:11px; font-weight:700; background:rgba(252,213,53,0.12); color:var(--color-yellow); padding:3px 8px; border-radius:4px;">PRO Regular User</span>
        <span style="font-size:11px; font-weight:700; background:rgba(14,203,129,0.12); color:var(--color-green); padding:3px 8px; border-radius:4px;">✔ Verified</span>
        <span style="font-size:11px; font-weight:700; background:rgba(255,255,255,0.08); color:var(--text-secondary); padding:3px 8px; border-radius:4px;">Link X</span>
      </div>

      <!-- Asset Summary Box -->
      <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; padding:14px; margin-bottom:16px;">
        <div style="font-size:11px; color:var(--text-secondary); text-transform:uppercase;">Ước Tính Tổng Giá Trị</div>
        <div style="font-size:17px; font-weight:800; font-family:var(--font-mono); color:var(--text-primary); margin:4px 0;">
          ${this.profileData.balance} <span style="font-size:12px; color:var(--text-secondary);">${this.profileData.usdEquiv}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-secondary); border-top:1px solid rgba(255,255,255,0.05); padding-top:6px; margin-top:6px;">
          <span>Today's PnL: <strong class="text-green">${this.profileData.pnl}</strong></span>
          <span>Following: ${this.profileData.following} | Followers: ${this.profileData.followers}</span>
        </div>
      </div>

      <!-- 9 Mục Điều Hướng Chuẩn Binance -->
      <div style="display:flex; flex-direction:column; gap:2px; flex:1;">
        <a href="index.html#/home" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard (Bảng tổng quan)</span> ➔
        </a>
        <a href="#assets" onclick="UserProfile.showInfo('Ví chính chủ Founder đang nắm giữ 0.1579766 USDT an toàn.')" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M16 14h2"/></svg> Assets (Ví và danh mục số dư)</span> ➔
        </a>
        <a href="#orders" onclick="UserProfile.showInfo('Không có lệnh chờ khớp nào. Sổ lệnh sẵn sàng.')" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Orders (Lịch sử đặt lệnh)</span> ➔
        </a>
        <a href="#account" onclick="UserProfile.showInfo('Tài khoản đã kích hoạt 2FA Google Authenticator & Khóa bảo mật đa tầng.')" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg> Account (Cài đặt bảo mật 2FA)</span> ➔
        </a>
        <a href="#referral" onclick="UserProfile.copyReferral()" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Referral (Mã giới thiệu hoa hồng 30%)</span> ➔
        </a>
        <a href="#rewards" onclick="UserProfile.showInfo('Bạn có 3 hộp quà phần thưởng chào mừng người mới!')" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M20 12v10H4V12M2 7h20v5H2zM12 7V3M7.5 3a2.5 2.5 0 0 0 0 5M16.5 3a2.5 2.5 0 0 1 0 5"/></svg> Rewards Hub (Trung tâm phần thưởng)</span> ➔
        </a>
        <a href="#subaccounts" onclick="UserProfile.showInfo('Đang quản lý 1 tài khoản chính và 0 tài khoản phụ.')" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Sub Accounts (Quản lý tài khoản phụ)</span> ➔
        </a>
        <a href="#settings" onclick="SettingsPanel.open(); UserProfile.toggle();" class="wallet-item-link" style="padding:10px 12px; border-radius:6px;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/><circle cx="12" cy="11" r="2.5"/></svg> Settings (Cài đặt hệ thống)</span> ➔
        </a>
        <a href="#logout" onclick="UserProfile.logout()" class="wallet-item-link text-red" style="padding:10px 12px; border-radius:6px; margin-top:auto;">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:6px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Log Out (Đăng xuất an toàn)</span> ➔
        </a>
      </div>
    `;

    document.body.appendChild(drawer);
    this.drawerEl = drawer;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.drawerEl) {
      this.drawerEl.style.display = this.isOpen ? 'flex' : 'none';
    }
  }

  copyUID() {
    navigator.clipboard.writeText(this.profileData.uid).then(() => {
      this.toast(`✅ Đã sao chép Founder UID: ${this.profileData.uid}`);
    });
  }

  copyReferral() {
    const ref = `https://apexcore.io/ref/${this.profileData.uid}`;
    navigator.clipboard.writeText(ref).then(() => {
      this.toast(`✅ Đã sao chép link hoa hồng: ${ref}`);
    });
  }

  showInfo(msg) {
    this.toast(`ℹ️ ${msg}`);
  }

  logout() {
    this.toast(`🚪 Đã đăng xuất tài khoản an toàn.`);
    this.toggle();
  }

  toast(msg) {
    let t = document.getElementById('apex-global-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'apex-global-toast';
      t.style.cssText = 'position:fixed; bottom:24px; right:24px; background:var(--bg-card); border:1px solid var(--color-yellow); color:var(--text-primary); padding:10px 18px; border-radius:6px; font-size:12px; font-weight:700; z-index:999999; box-shadow:0 8px 30px rgba(0,0,0,0.8); transition:all 0.2s;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
    }, 2500);
  }
}

// Global instance
if (typeof window !== 'undefined') {
  window.UserProfile = new UserProfileManager();
}
