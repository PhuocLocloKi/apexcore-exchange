/* ========================================================
   APEXCORE PRO — SQUARE PAGE (js/pages/square.js)
   MASTER v3.0 — Tường Tin Tức Tài Chính & Phân Tích Chuyên Sâu
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

export class SquarePage {
  constructor(router) {
    this.router = router;
  }

  mount(container) {
    container.innerHTML = this.renderHTML();
    this.initEvents();
  }

  unmount() {}

  renderHTML() {
    return `
      <div class="square-container">
        <div class="card-panel">
          <span class="trust-pill" style="font-size:11px; padding:2px 8px; background:var(--up-bg); color:var(--up); border-radius:4px; font-weight:700;">
            APEXCORE SQUARE
          </span>
          <h1 style="font-size:24px; font-weight:900; margin:8px 0 4px;">Tin Tức & Nhận Định Tài Chính</h1>
          <p class="text-sub" style="font-size:12px;">Cập nhật phân tích kỹ thuật độc quyền từ Founder Nguyễn Phước Lộc và đội ngũ chuyên gia.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
          <div class="card-panel" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="tag-sm text-gold">Phân Tích Kỹ Thuật</span>
              <h3 style="font-size:14px; font-weight:800; margin:8px 0 6px;">BNB Vượt Đỉnh 780 USDT — Xu Hướng Dòng Tiền Q4/2026</h3>
              <p class="text-sub" style="font-size:12px; line-height:1.5;">Hệ sinh thái Layer 1 bùng nổ thanh khoản lớn, thu hút khối lượng giao dịch đột biến từ các quỹ đầu tư quốc tế...</p>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:14px;">
              <span>Tác giả: <strong>Nguyễn Phước Lộc</strong></span>
              <span>10 phút trước</span>
            </div>
          </div>

          <div class="card-panel" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="tag-sm text-up">Kinh Tế Vĩ Mô</span>
              <h3 style="font-size:14px; font-weight:800; margin:8px 0 6px;">Cổ Phiếu FPT & VinFast Thu Hút Dòng Vốn Ngoại</h3>
              <p class="text-sub" style="font-size:12px; line-height:1.5;">Cổ phiếu công nghệ và xe điện Việt Nam tiếp tục ghi nhận lực mua ròng mạnh mẽ từ các định chế tài chính toàn cầu...</p>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:14px;">
              <span>Tác giả: <strong>Ban Phân Tích ApexCore</strong></span>
              <span>1 giờ trước</span>
            </div>
          </div>

          <div class="card-panel" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="tag-sm text-gold">Tâm Lý Thị Trường</span>
              <h3 style="font-size:14px; font-weight:800; margin:8px 0 6px;">Crypto Fear & Greed Index Đạt Mức 78 (Tham Lam Cực Độ)</h3>
              <p class="text-sub" style="font-size:12px; line-height:1.5;">Thị trường phái sinh ghi nhận tỷ lệ Long áp đảo, cảnh báo rủi ro biến động giật quét râu thanh lý ngắn hạn...</p>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:14px;">
              <span>Tác giả: <strong>Apex Sentinel Bot</strong></span>
              <span>3 giờ trước</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initEvents() {}
}
