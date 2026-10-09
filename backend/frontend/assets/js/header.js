/* ========================================================
   APEXCORE SOVEREIGN EXCHANGE — HEADER CONTROLLER (assets/js/header.js)
   Quản lý Thanh Điều Hướng, Profile Founder, Theme Switcher & Logout
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

(function (window) {
  'use strict';

  const HeaderController = {
    init() {
      this.initTheme();
      this.bindActions();
    },

    // Sao chép UID Độc Quyền Founder
    copyFounderUID() {
      const uid = '1107519625';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(uid).then(() => {
          this.toast('📋 Đã sao chép Founder UID: 1107519625');
        }).catch(() => {
          this.fallbackCopy(uid);
        });
      } else {
        this.fallbackCopy(uid);
      }
    },

    fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.toast('📋 Đã sao chép Founder UID: 1107519625');
    },

    // Đăng xuất An Toàn 100%
    handleLogout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống ApexCore?')) {
        localStorage.removeItem('apex_token');
        localStorage.removeItem('apex_user');
        sessionStorage.clear();
        this.toast('🔒 Đã đăng xuất an toàn!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },

    // Khởi tạo và đồng bộ chủ đề Sáng / Tối
    initTheme() {
      const savedTheme = localStorage.getItem('apex_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (document.body) document.body.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme);
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      if (document.body) document.body.setAttribute('data-theme', next);
      localStorage.setItem('apex_theme', next);
      this.updateThemeIcon(next);
      if (window.ChartEngine && typeof window.ChartEngine.render === 'function') {
        window.ChartEngine.render();
      }
    },

    updateThemeIcon(theme) {
      const btn = document.getElementById('btn-theme-switch');
      if (!btn) return;
      if (theme === 'light') {
        // Biểu tượng Mặt trời
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
        btn.title = "Chuyển sang giao diện Tối";
      } else {
        // Biểu tượng Mặt trăng
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        btn.title = "Chuyển sang giao diện Sáng";
      }
    },

    // Thông báo nhanh Toast
    toast(msg) {
      let box = document.getElementById('apex-global-toast');
      if (!box) {
        box = document.createElement('div');
        box.id = 'apex-global-toast';
        box.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #181c24;
          color: #eaecef;
          border: 1px solid #fcd535;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
          font-size: 13px;
          font-weight: 600;
          z-index: 100000;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(12px);
        `;
        document.body.appendChild(box);
      }
      box.innerHTML = `<span>✨</span><span>${msg}</span>`;
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(12px)';
      }, 3000);
    },

    bindActions() {
      // Phím tắt Master God-Mode (Ctrl + Shift + 0)
      window.addEventListener('keydown', (e) => {
        const is0 = e.code === 'Numpad0' || e.key === '0' || e.code === 'Digit0';
        if ((e.ctrlKey && e.shiftKey && is0) || (e.ctrlKey && e.code === 'Numpad0')) {
          e.preventDefault();
          window.open('/apex-master-admin.html', '_blank');
        }
      });
    }
  };

  window.HeaderController = HeaderController;
  window.copyUID = () => HeaderController.copyFounderUID();
  window.handleUserLogout = () => HeaderController.handleLogout();
  window.toggleTheme = () => HeaderController.toggleTheme();

  document.addEventListener('DOMContentLoaded', () => {
    HeaderController.init();
  });
})(window);
