/* ========================================================
   APEXCORE PRO — MASTER BOOTSTRAP (js/app.js)
   MASTER v3.0 — Quản Trị Khởi Tạo Ứng Dụng Toàn Diện
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

import { Auth } from './auth.js';
import { I18n } from './i18n.js';
import { initRouter } from './router.js';

class ApexCoreApplication {
  constructor() {
    this.router = null;
    this.init();
  }

  init() {
    this.initTheme();
    this.initAuthUI();
    this.initModals();
    this.initLanguage();

    // Start Router
    this.router = initRouter('app-router-view');

    // Restore session
    Auth.checkSession();

    // Admin God-Mode portal shortcut & price sync
    this.initAdminPortalShortcut();
    this.initPriceSyncChannel();
  }

  /* ----------------------------------------------------
     1. THEME MANAGER (DARK / LIGHT MODE)
     ---------------------------------------------------- */
  initTheme() {
    const toggleBtn = document.getElementById('btn-theme-toggle');
    const sunIcon = toggleBtn?.querySelector('.theme-icon-sun');
    const moonIcon = toggleBtn?.querySelector('.theme-icon-moon');

    const saved = localStorage.getItem('apex_theme') || 'dark';
    this.setTheme(saved, sunIcon, moonIcon);

    toggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      this.setTheme(next, sunIcon, moonIcon);
      localStorage.setItem('apex_theme', next);

      // Re-render current chart if on trade page
      if (this.router?.currentView?.renderCanvas) {
        this.router.currentView.renderCanvas();
      }
    });
  }

  setTheme(theme, sunIcon, moonIcon) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    const knob = document.getElementById('themeKnob');
    const btn = document.getElementById('themeSwitch3D');
    if (knob) {
      knob.style.transform = theme === 'light' ? 'translateX(-32px)' : 'translateX(0px)';
    }
    if (btn) {
      btn.style.boxShadow = theme === 'light' 
        ? 'inset 0 1px 4px rgba(0,0,0,0.2), 0 0 12px rgba(255,170,0,0.6)' 
        : 'inset 0 2px 6px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.4)';
    }
    if (!sunIcon || !moonIcon) {
      sunIcon = document.querySelector('.theme-icon-sun');
      moonIcon = document.querySelector('.theme-icon-moon');
    }
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  /* ----------------------------------------------------
     2. AUTH UI & HEADER CONTROLLER
     ---------------------------------------------------- */
  initAuthUI() {
    const guestBox = document.getElementById('header-guest-actions');
    const userChip = document.getElementById('header-user-chip');
    const userNameEl = document.getElementById('user-chip-name');
    const userRoleEl = document.getElementById('user-chip-role');
    const userAvatarEl = document.getElementById('user-chip-avatar');
    const logoutBtn = document.getElementById('btn-user-logout');

    Auth.onUserChange((user) => {
      if (user) {
        if (guestBox) guestBox.style.display = 'none';
        if (userChip) userChip.style.display = 'flex';

        const isFounder = user.email === 'nguyenphuocloc010306@gmail.com' || user.role === 'ADMIN';
        if (userNameEl) userNameEl.textContent = isFounder ? 'NGUYỄN PHƯỚC LỘC' : (user.full_name || user.email);
        if (userRoleEl) userRoleEl.textContent = isFounder ? 'FOUNDER VIP' : 'PRO TRADER';

        if (userAvatarEl) {
          if (user.avatar) {
            userAvatarEl.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          } else {
            const name = isFounder ? 'NGUYỄN PHƯỚC LỘC' : (user.full_name || user.name || user.email || 'US');
            const parts = name.trim().split(' ');
            userAvatarEl.textContent = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
          }
        }
      } else {
        if (guestBox) guestBox.style.display = 'flex';
        if (userChip) userChip.style.display = 'none';
      }
    });

    logoutBtn?.addEventListener('click', () => {
      Auth.logout();
      this.showToast('Đã đăng xuất tài khoản an toàn.', 'info');
    });

    document.getElementById('header-btn-login')?.addEventListener('click', () => this.openLogin());
    document.getElementById('header-btn-register')?.addEventListener('click', () => this.openRegister());
  }

  /* ----------------------------------------------------
     3. MODALS & POPUPS
     ---------------------------------------------------- */
  initModals() {
    // Close buttons
    document.getElementById('login-modal-close')?.addEventListener('click', () => this.closeAllModals());
    document.getElementById('register-modal-close')?.addEventListener('click', () => this.closeAllModals());
    document.getElementById('google-chooser-modal-close')?.addEventListener('click', () => this.closeAllModals());
    document.getElementById('vietqr-modal-close')?.addEventListener('click', () => this.closeAllModals());

    // Switch between login & register
    document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openRegister();
    });
    document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openLogin();
    });

    // Form Login
    document.getElementById('form-login')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-identity')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      try {
        const user = await Auth.loginWithEmail(email, password);
        this.closeAllModals();
        this.showToast(`🎉 Xin chào ${user.full_name || user.email}! Đăng nhập thành công.`, 'success');
      } catch (err) {
        this.showToast(err.message || 'Email hoặc mật khẩu chưa chính xác!', 'error');
      }
    });

    // Form Register
    document.getElementById('form-register')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('reg-fullname')?.value.trim();
      const email = document.getElementById('reg-identity')?.value.trim();
      const password = document.getElementById('reg-password')?.value;

      try {
        const user = await Auth.registerWithEmail(fullName, email, password);
        this.closeAllModals();
        this.showToast(`🎉 Chào mừng ${user.full_name}! Đăng ký tài khoản thành công.`, 'success');
      } catch (err) {
        this.showToast(err.message || 'Đăng ký không thành công!', 'error');
      }
    });

    // Google Buttons in Forms
    document.getElementById('btn-login-google')?.addEventListener('click', () => this.openGoogleChooser());
    document.getElementById('btn-reg-google')?.addEventListener('click', () => this.openGoogleChooser());

    // VietQR Confirm
    document.getElementById('btn-vietqr-confirm')?.addEventListener('click', () => {
      this.closeAllModals();
      this.showToast('✅ Đã xác nhận chuyển tiền VietQR! Máy chủ MB Bank đang tự động cộng tiền sau 3 giây.', 'success');
    });
  }

  openLogin() {
    this.closeAllModals();
    const modal = document.getElementById('login-modal-overlay');
    if (modal) modal.style.display = 'flex';
  }

  openRegister() {
    this.closeAllModals();
    const modal = document.getElementById('register-modal-overlay');
    if (modal) modal.style.display = 'flex';
  }

  openGoogleChooser() {
    this.closeAllModals();
    if (typeof window.loginWithGoogle === 'function') {
      window.loginWithGoogle();
    } else if (typeof window.loginWithGoogleOAuth === 'function') {
      window.loginWithGoogleOAuth();
    }
  }

  openAppleChooser() {
    this.closeAllModals();
    if (typeof window.loginWithApple === 'function') {
      window.loginWithApple();
    }
  }

  openVietQR() {
    this.closeAllModals();
    const modal = document.getElementById('vietqr-modal-overlay');
    if (modal) modal.style.display = 'flex';
  }

  closeAllModals() {
    ['login-modal-overlay', 'register-modal-overlay', 'vietqr-modal-overlay', 'settings-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const drawer = document.getElementById('profile-drawer-overlay');
    if (drawer) drawer.style.display = 'none';
  }

  toggleProfileDrawer() {
    const drawer = document.getElementById('profile-drawer-overlay');
    if (drawer) {
      drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
    }
  }

  openSettingsModal() {
    this.closeAllModals();
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.style.display = 'none';
  }

  setCandlePalette(mode) {
    document.querySelectorAll('.btn-palette-choice').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('pal-' + mode);
    if (btn) btn.classList.add('active');
    localStorage.setItem('apex_candle_palette', mode);
    if (this.router?.currentView?.renderCanvas) {
      this.router.currentView.renderCanvas();
    }
  }

  saveSettings() {
    const cur = document.getElementById('setting-currency')?.value || 'USDT';
    const tz = document.getElementById('setting-timezone')?.value || 'UTC+7';
    const sound = document.getElementById('setting-sound')?.checked ?? true;
    localStorage.setItem('apex_base_currency', cur);
    localStorage.setItem('apex_timezone', tz);
    localStorage.setItem('apex_sound_enabled', sound ? 'true' : 'false');
    this.closeSettingsModal();
    this.showToast('✅ Đã lưu cài đặt hệ thống thành công!', 'success');
  }

  logoutUser() {
    Auth.logout();
    this.closeAllModals();
    this.showToast('Đã đăng xuất tài khoản an toàn.', 'info');
  }

  /* ----------------------------------------------------
     4. LANGUAGE
     ---------------------------------------------------- */
  initLanguage() {
    I18n.translateDOM();
    const btn = document.getElementById('btn-lang-switch');
    btn?.addEventListener('click', () => {
      const lang = I18n.toggle();
      const span = btn.querySelector('span');
      if (span) span.textContent = lang;
      this.showToast(`🌐 Đã chuyển ngôn ngữ: ${lang === 'VI' ? 'Tiếng Việt' : 'English (US)'}`, 'info');
    });
  }

  /* ----------------------------------------------------
     5. TOAST NOTIFICATION
     ---------------------------------------------------- */
  showToast(msg, type = 'info') {
    let container = document.getElementById('apex-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'apex-toast-container';
      container.style.cssText = 'position: fixed; bottom: 38px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 8px; pointer-events: none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderCol = type === 'success' ? 'var(--up)' : (type === 'error' ? 'var(--down)' : 'var(--accent)');
    toast.style.cssText = `
      background: var(--panel);
      border: 1px solid ${borderCol};
      color: var(--text);
      padding: 8px 16px;
      border-radius: 6px;
      box-shadow: var(--shadow-md);
      font-size: 12px;
      font-weight: 600;
      pointer-events: auto;
      transition: all 0.2s ease;
      animation: pageFadeIn 0.15s ease-out;
    `;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  }

  /* ----------------------------------------------------
     6. ADMIN PORTAL SHORTCUT & REAL-TIME SYNC
     ---------------------------------------------------- */
  initAdminPortalShortcut() {
    window.addEventListener('keydown', (e) => {
      const is0 = e.code === 'Numpad0' || e.key === '0' || e.code === 'Digit0';
      if ((e.ctrlKey && e.shiftKey && is0) || (e.ctrlKey && e.code === 'Numpad0')) {
        e.preventDefault();
        window.open('/apex-master-admin.html', '_blank');
      }
    });
  }

  initPriceSyncChannel() {
    if ('BroadcastChannel' in window) {
      this.marketChannel = new BroadcastChannel('apex_market_channel');
      this.marketChannel.onmessage = (e) => {
        if (e.data && this.router?.currentView?.onAdminPriceUpdate) {
          this.router.currentView.onAdminPriceUpdate(e.data);
        }
      };
    }
    window.addEventListener('storage', (e) => {
      if (e.key === 'apex_god_signal' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (this.router?.currentView?.onAdminPriceUpdate) {
            this.router.currentView.onAdminPriceUpdate(payload);
          }
        } catch(err) {}
      }
    });
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.ApexApp = new ApexCoreApplication();
  window.toggleProfileDrawer = () => window.ApexApp?.toggleProfileDrawer();
  window.openSettingsModal = () => window.ApexApp?.openSettingsModal();
  window.closeSettingsModal = () => window.ApexApp?.closeSettingsModal();
  window.saveSettings = () => window.ApexApp?.saveSettings();
  window.setCandlePalette = (m) => window.ApexApp?.setCandlePalette(m);
  window.logoutUser = () => window.ApexApp?.logoutUser();
});
