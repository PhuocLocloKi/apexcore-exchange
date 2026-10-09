/* ========================================================
   APEXCORE PRO — ANALYTICS TABS MODULE (js/analytics-tabs.js)
   MASTER V9.0 — Hệ Thống 5 Tab Phân Tích Chuyên Sâu (Ảnh 1 & Ảnh 2)
   Founder & CTO: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ======================================================== */

class AnalyticsTabsManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.activeTab = 'info';
    this.init();
  }

  init() {
    this.render();
  }

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.an-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.activeTab === 'info') {
      this.container.innerHTML = `
        <div>
          <!-- Grid 8 Thông Số Cơ Bản -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:16px;">
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Xếp Hạng Vốn Hóa</div>
              <div style="font-size:14px; font-weight:800; color:var(--color-yellow);">Rank No. 137</div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Vốn Hóa Thị Trường (Market Cap)</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono);">$165.43M</div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Vốn Hóa Pha Loãng (FDV)</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono);">$204.07M</div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Tỷ Trọng Thị Trường (Dominance)</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono);">0.0058%</div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Khối Lượng Giao Dịch 24h</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono);">$354.48M <span style="font-size:10px; color:var(--text-secondary);">(214.28%)</span></div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Cung Lưu Thông / Tổng Cung</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono);">60.79M / 74.99M</div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Đỉnh Lịch Sử (ATH)</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono); color:var(--color-green);">$22.29 <span style="font-size:10px; color:var(--text-secondary);">2021-11-16</span></div>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
              <div style="font-size:10px; color:var(--text-secondary); margin-bottom:2px;">Đáy Lịch Sử (ATL)</div>
              <div style="font-size:14px; font-weight:800; font-family:var(--font-mono); color:var(--color-red);">$0.35 <span style="font-size:10px; color:var(--text-secondary);">2022-06-20</span></div>
            </div>
          </div>

          <!-- Giới thiệu token -->
          <div style="background:var(--bg-input); padding:14px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:14px;">
            <div style="font-size:13px; font-weight:800; margin-bottom:4px;">Giới Thiệu Đồng Tiền Orca (ORCA) Trên Hệ Sinh Thái Solana</div>
            <p style="font-size:12px; color:var(--text-secondary); line-height:1.6;">
              Orca là sàn DEX tạo lập thị trường tự động (AMM) hàng đầu trên hệ sinh thái Solana, nổi tiếng với thuật toán Whirlpools cung cấp thanh khoản tập trung giúp trader khớp lệnh với độ trượt giá cực thấp và tốc độ tối ưu dưới 400ms.
            </p>
          </div>

          <div style="display:flex; gap:16px; font-size:12px;">
            <a href="https://orca.so" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">🌐 Website Chính Thức ➔</a>
            <a href="https://solscan.io" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">🔍 Trình Duyệt Solscan ➔</a>
            <a href="https://github.com/orca-so" target="_blank" style="color:var(--color-yellow); text-decoration:none; font-weight:700;">💻 Mã Nguồn GitHub ➔</a>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'data') {
      this.container.innerHTML = `
        <div>
          <div style="font-size:13px; font-weight:800; margin-bottom:12px;">Phân Tích Dòng Tiền & Ký Quỹ Đòn Bẩy (Money Flow Analysis)</div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:center;">
            <!-- Donut Visual -->
            <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
              <div style="width:150px; height:150px; border-radius:50%; background:conic-gradient(#0ecb81 0% 63%, #f6465d 63% 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(0,0,0,0.6);">
                <div style="width:96px; height:96px; border-radius:50%; background:var(--bg-card); display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-size:9px; color:var(--text-secondary);">Dòng Tiền Ròng</span>
                  <strong class="text-green" style="font-size:14px; font-family:var(--font-mono);">+54.41K</strong>
                  <span style="font-size:9px; color:var(--text-secondary);">ORCA</span>
                </div>
              </div>
              <span style="font-size:11px; color:var(--text-secondary); margin-top:8px;">Tổng Khối Lượng: 209.06K ORCA</span>
            </div>

            <!-- 6 Tỷ Lệ Chi Tiết -->
            <div style="display:flex; flex-direction:column; gap:6px; font-size:11px;">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-green font-bold">● Lệnh Mua Lớn (Large Buy):</span> <strong class="font-mono">18.66% (20.47K)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-green font-bold">● Lệnh Mua Vừa (Medium Buy):</span> <strong class="font-mono">34.55% (72.25K)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-green font-bold">● Lệnh Mua Nhỏ (Small Buy):</span> <strong class="font-mono">9.79% (39.02K)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-red font-bold">● Lệnh Bán Lớn (Large Sell):</span> <strong class="font-mono">4.79% (10.01K)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-red font-bold">● Lệnh Bán Vừa (Medium Sell):</span> <strong class="font-mono">22.15% (46.31K)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:4px;">
                <span class="text-red font-bold">● Lệnh Bán Nhỏ (Small Sell):</span> <strong class="font-mono">10.04% (21.00K)</strong>
              </div>
            </div>
          </div>

          <!-- 5x24hr Large Inflow Bars -->
          <div style="margin-top:18px; border-top:1px solid var(--border-color); padding-top:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px;">
              <strong>Dòng Tiền Cá Mập 5 Ngày Liên Tiếp (5 x 24hr Large Inflow)</strong>
              <span style="color:var(--text-secondary);">Tỷ lệ Ký Quỹ: 68.4% Long / 31.6% Short</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; text-align:center;">
              <div style="background:var(--bg-input); padding:8px; border-radius:6px;">
                <div style="font-size:9px; color:var(--text-secondary);">Ngày 1</div>
                <div class="text-green font-bold font-mono" style="font-size:12px;">+250.49K</div>
              </div>
              <div style="background:var(--bg-input); padding:8px; border-radius:6px;">
                <div style="font-size:9px; color:var(--text-secondary);">Ngày 2</div>
                <div class="text-red font-bold font-mono" style="font-size:12px;">-7.32K</div>
              </div>
              <div style="background:var(--bg-input); padding:8px; border-radius:6px;">
                <div style="font-size:9px; color:var(--text-secondary);">Ngày 3</div>
                <div class="text-red font-bold font-mono" style="font-size:12px;">-46.73K</div>
              </div>
              <div style="background:var(--bg-input); padding:8px; border-radius:6px;">
                <div style="font-size:9px; color:var(--text-secondary);">Ngày 4</div>
                <div class="text-green font-bold font-mono" style="font-size:12px;">+278.43K</div>
              </div>
              <div style="background:var(--bg-input); padding:8px; border-radius:6px;">
                <div style="font-size:9px; color:var(--text-secondary);">Ngày 5</div>
                <div class="text-red font-bold font-mono" style="font-size:12px;">-29.45K</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'audit') {
      this.container.innerHTML = `
        <div>
          <!-- BẢNG XẾP HẠNG TOP TRADER TOÀN CẦU (GLOBAL LEADERBOARD) -->
          <div style="margin-bottom:16px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; padding:14px;">
            <div style="font-size:13px; font-weight:800; color:var(--color-yellow); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
              <span>🏆 Bảng Xếp Hạng Top Trader Toàn Cầu (Global Leaderboard)</span>
              <span style="font-size:11px; color:var(--text-secondary);">Cập nhật 1 giây trước</span>
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary); text-align:left;">
                  <th style="padding:6px;">Xếp Hạng</th>
                  <th style="padding:6px;">Trader / Quốc Gia</th>
                  <th style="padding:6px;">Lợi Nhuận (ROI)</th>
                  <th style="padding:6px;">Tỷ Lệ Thắng</th>
                  <th style="padding:6px; text-align:right;">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:8px 6px;">🥇 <strong>No. 1</strong></td>
                  <td style="padding:8px 6px;"><strong>Alex_Quant</strong> <span style="font-size:10px; color:var(--text-secondary);">(Singapore 🇸🇬)</span></td>
                  <td style="padding:8px 6px;" class="text-green font-bold font-mono">+482.35%</td>
                  <td style="padding:8px 6px;" class="font-mono">91.4%</td>
                  <td style="padding:8px 6px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký sao chép lệnh của Alex_Quant!')">Sao Chép Lệnh</button></td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:8px 6px;">🥈 <strong>No. 2</strong></td>
                  <td style="padding:8px 6px;"><strong>CryptoLoc_Master</strong> <span style="font-size:10px; color:var(--color-yellow); font-weight:800;">(Vietnam 🇻🇳)</span></td>
                  <td style="padding:8px 6px;" class="text-green font-bold font-mono">+365.10%</td>
                  <td style="padding:8px 6px;" class="font-mono">88.2%</td>
                  <td style="padding:8px 6px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký sao chép lệnh của CryptoLoc_Master!')">Sao Chép Lệnh</button></td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:8px 6px;">🥉 <strong>No. 3</strong></td>
                  <td style="padding:8px 6px;"><strong>Elena_Derivatives</strong> <span style="font-size:10px; color:var(--text-secondary);">(Dubai 🇦🇪)</span></td>
                  <td style="padding:8px 6px;" class="text-green font-bold font-mono">+294.00%</td>
                  <td style="padding:8px 6px;" class="font-mono">84.6%</td>
                  <td style="padding:8px 6px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký sao chép lệnh của Elena_Derivatives!')">Sao Chép Lệnh</button></td>
                </tr>
                <tr>
                  <td style="padding:8px 6px;">🎖️ <strong>No. 4</strong></td>
                  <td style="padding:8px 6px;"><strong>Kenji_Scalper</strong> <span style="font-size:10px; color:var(--text-secondary);">(Tokyo 🇯🇵)</span></td>
                  <td style="padding:8px 6px;" class="text-green font-bold font-mono">+215.80%</td>
                  <td style="padding:8px 6px;" class="font-mono">82.1%</td>
                  <td style="padding:8px 6px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký sao chép lệnh của Kenji_Scalper!')">Sao Chép Lệnh</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- KIỂM ĐỊNH BẢO MẬT HỢP ĐỒNG (AUDIT AI-INSIGHT) -->
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(252,213,53,0.08); border:1px solid rgba(252,213,53,0.25); border-radius:6px; padding:12px 14px; margin-bottom:14px;">
            <div>
              <div style="font-size:13px; font-weight:800; color:var(--color-yellow);">Kiểm Định Bảo Mật Hợp Đồng Thông Minh (Audit AI-Insight)</div>
              <div style="font-size:11px; color:var(--text-secondary);">Rà soát mã nguồn tự động bảo vệ vốn nhà đầu tư trước rủi ro rug-pull.</div>
            </div>
            <div style="display:flex; gap:6px;">
              <span style="background:rgba(14,203,129,0.15); color:var(--color-green); font-weight:800; padding:3px 8px; border-radius:4px; font-size:11px;">0 Risks</span>
              <span style="background:rgba(252,213,53,0.15); color:var(--color-yellow); font-weight:800; padding:3px 8px; border-radius:4px; font-size:11px;">1 Caution</span>
            </div>
          </div>

          <!-- Caution Banner -->
          <div style="background:rgba(252,213,53,0.05); border-left:3px solid var(--color-yellow); padding:8px 12px; font-size:11px; margin-bottom:14px;">
            ⚠️ <strong>Mintable Detected:</strong> Phát hiện hàm Mintable có thể tạo thêm tổng cung trong tương lai. Cần lưu ý biến động giá khi phát hành token mới.
          </div>

          <!-- 8 Checklist Items -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:11px;">
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Non-Transferable (Không bị khóa chuyển nhượng)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Freezable Authority (Không có quyền đóng băng ví)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Closable Authority (Không có quyền xóa hợp đồng)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Balance Manipulation (Không thể tự sửa số dư ví)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Malicious Creator (Địa chỉ tạo token an toàn)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Metadata Mutable (Dữ liệu cố định minh bạch)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Modifiable Tax (Không có phí thuế ẩn 0% tax)</div>
            <div style="background:var(--bg-input); padding:8px 12px; border-radius:6px;">✅ Liquidity Locked (Thanh khoản đã khóa an toàn)</div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'earn') {
      this.container.innerHTML = `
        <div>
          <div style="font-size:13px; font-weight:800; margin-bottom:10px;">Gói Sinh Lời Thụ Động ApexCore Earn & Staking</div>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-color); color:var(--text-secondary); text-align:left;">
                <th style="padding:8px 10px;">Đồng Tiền</th>
                <th style="padding:8px 10px;">Lãi Suất (APY Ước Tính)</th>
                <th style="padding:8px 10px;">Kỳ Hạn</th>
                <th style="padding:8px 10px; text-align:right;">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>USDT</strong> (Tether)</td>
                <td style="padding:10px;" class="text-green font-bold">6.71%</td>
                <td style="padding:10px;">Linh hoạt (Flexible)</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký gói gửi USDT Earn 6.71%!')">Gửi Tiết Kiệm</button></td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>USDC</strong> (Circle)</td>
                <td style="padding:10px;" class="text-green font-bold">2.15%</td>
                <td style="padding:10px;">Linh hoạt (Flexible)</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký USDC Earn!')">Gửi Tiết Kiệm</button></td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>BNB</strong> (Build N Build)</td>
                <td style="padding:10px;" class="text-green font-bold">0.17% - 62.73%</td>
                <td style="padding:10px;">Khóa 30 - 120 Ngày</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã khóa BNB Staking!')">Stake Ngay</button></td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>BTC</strong> (Bitcoin)</td>
                <td style="padding:10px;" class="text-green font-bold">0.27% - 144.09%</td>
                <td style="padding:10px;">Khóa 60 Ngày</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký BTC Dual Investment!')">Tham Gia</button></td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>ETH</strong> (Ethereum)</td>
                <td style="padding:10px;" class="text-green font-bold">1.30% - 186.72%</td>
                <td style="padding:10px;">Linh hoạt / Khóa</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký ETH Staking!')">Tham Gia</button></td>
              </tr>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                <td style="padding:10px;"><strong>SOL</strong> (Solana)</td>
                <td style="padding:10px;" class="text-green font-bold">2.42% - 89.36%</td>
                <td style="padding:10px;">Khóa 90 Ngày</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký SOL Staking!')">Stake Ngay</button></td>
              </tr>
              <tr>
                <td style="padding:10px;"><strong>PLUME</strong> (RWA Modular)</td>
                <td style="padding:10px;" class="text-green font-bold">12.18%</td>
                <td style="padding:10px;">Linh hoạt (Flexible)</td>
                <td style="padding:10px; text-align:right;"><button class="btn-deposit-gold" style="padding:3px 10px; font-size:11px;" onclick="UserProfile.toast('✅ Đã đăng ký PLUME Earn!')">Đăng Ký</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (this.activeTab === 'news') {
      this.container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">1 MINS AGO · CHIP AI</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">STOCKS | Cổ phiếu chip nhớ Mỹ tăng vọt, SanDisk tăng 2.6% sau thông tin đơn hàng AI mở rộng quy mô.</div>
          </div>
          <div style="border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">3 MINS AGO · ĐỊA CHÍNH TRỊ</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">Syria lên kế hoạch tăng hơn gấp đôi sản lượng dầu khí khi các tập đoàn năng lượng nước ngoài quay trở lại.</div>
          </div>
          <div style="border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">11 MINS AGO · TRUNG ĐÔNG</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">Hezbollah tiếp nhận 200 triệu USD viện trợ cứu trợ người tị nạn Lebanon từ các quỹ từ thiện quốc tế.</div>
          </div>
          <div style="border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">16 MINS AGO · ROBOT & AI</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">Cựu giám đốc Tesla Optimus thành lập startup robot hình người thế hệ mới, dự kiến hoàn tất vòng gọi vốn 100 triệu USD.</div>
          </div>
          <div style="border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">27 MINS AGO · ON-CHAIN LIQUIDATION</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">Vị thế Long 39,025 ETH của Machi Big Brother tiến sát mốc thanh lý cưỡng bức ($2,501.38).</div>
          </div>
          <div>
            <div style="font-size:10px; color:var(--color-yellow); font-weight:800;">44 MINS AGO · MACRO FED</div>
            <div style="font-size:12px; font-weight:600; line-height:1.4;">Bitcoin điều chỉnh tích lũy quanh vùng 83,000 USDT trước thềm biên bản cuộc họp chính sách của Cục Dự trữ Liên bang.</div>
          </div>
        </div>
      `;
    }
  }
}

// Global instance
if (typeof window !== 'undefined') {
  window.AnalyticsTabs = AnalyticsTabsManager;
}
