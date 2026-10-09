/* ========================================================
   APEXCORE PRO — EARN PAGE (js/pages/earn.js)
   MASTER v3.0 — Tiết Kiệm Simple Earn & Staking Nhận Lãi
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   ======================================================== */

export class EarnPage {
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
      <div class="earn-container">
        <div class="card-panel">
          <span class="trust-pill" style="font-size:11px; padding:2px 8px; background:var(--up-bg); color:var(--up); border-radius:4px; font-weight:700;">
            TIẾT KIỆM ĐƠN GIẢN — SIMPLE EARN
          </span>
          <h1 style="font-size:24px; font-weight:900; margin:8px 0 4px;">Nhận Lãi Hàng Ngày Với Tài Sản Rảnh Rỗi</h1>
          <p class="text-sub" style="font-size:12px;">Lợi suất APY cao, linh hoạt rút gốc bất kỳ lúc nào với bảo hiểm 100%.</p>
        </div>

        <div class="card-panel" style="padding:0; overflow:hidden;">
          <table class="pro-data-table">
            <thead>
              <tr>
                <th>Tài Sản</th>
                <th>Kỳ Hạn</th>
                <th class="text-right">Lợi Suất (Est. APY)</th>
                <th class="text-right">Tối Thiểu</th>
                <th class="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">💵</span>
                    <div><strong>USDT</strong><br><small class="text-sub">Tether USD</small></div>
                  </div>
                </td>
                <td><span class="tag-sm">Linh hoạt (Flexible)</span></td>
                <td class="text-right num-tabular text-up font-bold" style="font-size:14px;">12.50% APY</td>
                <td class="text-right num-tabular">10 USDT</td>
                <td class="text-center">
                  <button class="btn-primary" style="padding:4px 12px; font-size:12px;" onclick="window.ApexApp.showToast('Đã đăng ký gửi tiết kiệm USDT linh hoạt!', 'success')">Đăng Ký</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">🟡</span>
                    <div><strong>BNB</strong><br><small class="text-sub">Binance Coin</small></div>
                  </div>
                </td>
                <td><span class="tag-sm">Khóa 60 Ngày</span></td>
                <td class="text-right num-tabular text-up font-bold" style="font-size:14px;">18.20% APY</td>
                <td class="text-right num-tabular">0.1 BNB</td>
                <td class="text-center">
                  <button class="btn-primary" style="padding:4px 12px; font-size:12px;" onclick="window.ApexApp.showToast('Đã khóa Staking BNB 60 ngày thành công!', 'success')">Đăng Ký</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:18px;">₿</span>
                    <div><strong>BTC</strong><br><small class="text-sub">Bitcoin</small></div>
                  </div>
                </td>
                <td><span class="tag-sm">Linh hoạt (Flexible)</span></td>
                <td class="text-right num-tabular text-up font-bold" style="font-size:14px;">4.80% APY</td>
                <td class="text-right num-tabular">0.001 BTC</td>
                <td class="text-center">
                  <button class="btn-primary" style="padding:4px 12px; font-size:12px;" onclick="window.ApexApp.showToast('Đã gửi tiết kiệm BTC thành công!', 'success')">Đăng Ký</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  initEvents() {}
}
