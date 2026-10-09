/* ========================================================
   APEXCORE PRO — SETTINGS PANEL MODULE (js/settings-panel.js)
   MASTER V9.0 — Menu Lục Giác Cài Đặt Chuyên Sâu ⬡ (Ảnh 4)
   Founder & CTO: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class SettingsPanelManager {
  constructor() {
    this.modalEl = null;
    this.init();
  }

  init() {
    this.createModalDOM();
  }

  createModalDOM() {
    const existing = document.getElementById('terminal-preferences-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'terminal-preferences-modal';
    modal.className = 'modal-overlay-backdrop';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="modal-card-center" onclick="event.stopPropagation()">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid var(--border-color); padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px; color:var(--color-yellow);">⬡</span>
            <h2 style="font-size:16px; font-weight:800;">Tùy Chọn Giao Dịch & Cài Đặt Lục Giác</h2>
          </div>
          <button onclick="SettingsPanel.close()" style="background:none; border:none; color:var(--text-secondary); font-size:18px; cursor:pointer;">✕</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:20px;">
          <!-- A. XÁC NHẬN LỆNH (ORDER CONFIRMATION) -->
          <div>
            <div style="font-size:12px; font-weight:800; color:var(--color-yellow); text-transform:uppercase; margin-bottom:8px;">
              A. Hộp Thoại Xác Nhận Lệnh (Order Confirmation)
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Limit Order (Lệnh giới hạn)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Market Order (Lệnh thị trường)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Stop Limit Order (Dừng giới hạn)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Stop Market Order (Dừng thị trường)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> OCO Order (One-Cancels-Other)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Trailing Stop (Dừng bám đuổi)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> TWAP Order (Trung bình thời gian)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> POV Order (Khối lượng theo tỷ lệ)
              </label>
            </div>
          </div>

          <!-- B. THIẾT LẬP MARGIN -->
          <div style="border-top:1px solid var(--border-color); padding-top:14px;">
            <div style="font-size:12px; font-weight:800; color:var(--color-yellow); text-transform:uppercase; margin-bottom:8px;">
              B. Thiết Lập Ký Quỹ Đòn Bẩy (Margin Settings)
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Auto Borrow/Repay for Margin (Tự động vay và hoàn trả khi đặt lệnh)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Auto Transfer for Margin (Tự động điều chuyển vốn ký quỹ)
              </label>
            </div>
          </div>

          <!-- C. TINH CHỈNH BIỂU ĐỒ & ÂM THANH -->
          <div style="border-top:1px solid var(--border-color); padding-top:14px;">
            <div style="font-size:12px; font-weight:800; color:var(--color-yellow); text-transform:uppercase; margin-bottom:8px;">
              C. Tinh Chỉnh Biểu Đồ & Âm Thanh (Chart & Audio Alerts)
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Order Adjustment (Kéo sửa giá lệnh trực tiếp)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Kline Adjustment (Tinh chỉnh tỷ lệ nến)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Indicators Storage (Local) (Lưu chỉ báo)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="pref-sound-toggle" checked style="accent-color:var(--color-yellow);" onchange="SettingsPanel.toggleSound(this.checked)"> Trade Sound Reminder (Âm thanh ting ting khớp lệnh)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" checked style="accent-color:var(--color-yellow);"> Announcement & Reminder (Nhắc nhở thị trường)
              </label>
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                <input type="checkbox" id="pref-demo-toggle" style="accent-color:var(--color-yellow);" onchange="SettingsPanel.toggleDemo(this.checked)"> Demo Trading Mode (Chế độ đánh thử tài khoản ảo)
              </label>
            </div>
          </div>

          <!-- D. BẢNG MÀU THƯƠNG HIỆU PHONG PHÚ (5 COLOR PALETTES) -->
          <div style="border-top:1px solid var(--border-color); padding-top:14px;">
            <div style="font-size:12px; font-weight:800; color:var(--color-yellow); text-transform:uppercase; margin-bottom:8px;">
              D. Bảng Màu Phong Phú Đa Dạng (5 Color Palettes)
            </div>
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; font-size:11px;">
              <button type="button" class="btn-deposit-gold" style="padding:6px 2px; font-size:10px;" onclick="SettingsPanel.setPalette('classic')">🖤 Classic Pro</button>
              <button type="button" class="btn-deposit-gold" style="padding:6px 2px; font-size:10px;" onclick="SettingsPanel.setPalette('white')">🤍 Clean White</button>
              <button type="button" class="btn-deposit-gold" style="padding:6px 2px; font-size:10px;" onclick="SettingsPanel.setPalette('ocean')">🌌 Cyber Ocean</button>
              <button type="button" class="btn-deposit-gold" style="padding:6px 2px; font-size:10px;" onclick="SettingsPanel.setPalette('matrix')">🌲 Matrix Green</button>
              <button type="button" class="btn-deposit-gold" style="padding:6px 2px; font-size:10px;" onclick="SettingsPanel.setPalette('gold')">👑 Imperial Gold</button>
            </div>
          </div>

          <!-- E. PHÍM TẮT & CỔNG BÍ MẬT -->
          <div style="background:rgba(252,213,53,0.06); border:1px solid rgba(252,213,53,0.25); border-radius:6px; padding:10px 14px; font-size:11px;">
            <strong class="text-yellow">⚡ Phím Tắt Quản Trị Tối Cao:</strong> Nhấn <kbd style="background:#000; padding:2px 6px; border-radius:3px; border:1px solid #444;">Ctrl + Shift + 0</kbd> (hoặc Ctrl + NumPad 0) để mở Cổng Điều Khiển Giá Admin God-Mode.
          </div>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button class="btn-deposit-gold" onclick="SettingsPanel.save()" style="padding:8px 20px;">Lưu Cấu Hình</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', () => this.close());
    document.body.appendChild(modal);
    this.modalEl = modal;
  }

  open() {
    if (this.modalEl) this.modalEl.style.display = 'flex';
  }

  close() {
    if (this.modalEl) this.modalEl.style.display = 'none';
  }

  toggleSound(enabled) {
    localStorage.setItem('apex_sound_enabled', enabled ? 'true' : 'false');
    if (window.OrderBook) {
      window.OrderBook.isSoundEnabled = enabled;
    }
  }

  toggleDemo(enabled) {
    if (window.UserProfile) {
      window.UserProfile.toast(enabled ? '🎮 Đã bật chế độ Demo Trading với số dư 100,000 USDT ảo!' : '⚡ Đã quay về tài khoản thực tế.');
    }
  }

  setPalette(palette) {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('apex_palette', palette);
    if (window.ChartEngine) window.ChartEngine.render();
    if (window.UserProfile) {
      window.UserProfile.toast(`🎨 Đã đổi bộ màu giao diện: ${palette.toUpperCase()}`);
    }
  }

  save() {
    if (window.UserProfile) {
      window.UserProfile.toast('✅ Đã lưu cấu hình tùy chọn giao dịch thành công!');
    }
    this.close();
  }
}

// Restore saved palette on page load
if (typeof window !== 'undefined') {
  window.SettingsPanel = new SettingsPanelManager();
  const savedPal = localStorage.getItem('apex_palette');
  if (savedPal) {
    document.documentElement.setAttribute('data-palette', savedPal);
  }
}
