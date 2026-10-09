/* ========================================================
   APEXCORE PRO — I18N DICTIONARY (js/i18n.js)
   MASTER v8.0 — Từ Điển Song Ngữ VI / EN Toàn Diện
   Founder: NGUYỄN PHƯỚC LỘC (nguyenphuocloc010306@gmail.com)
   UID: 1107519625
   ======================================================== */

export const I18nDict = {
  VI: {
    nav_home: 'Trang chủ',
    nav_markets: 'Thị trường',
    nav_trade: 'Giao dịch (Spot)',
    nav_futures: 'Phái sinh (Futures)',
    nav_earn: 'Tiết kiệm (Earn)',
    nav_square: 'Cộng đồng (Square)',
    nav_wallet: 'Ví tiền (Wallet)',
    btn_login: 'Đăng nhập',
    btn_register: 'Đăng ký',
    buy: 'MUA',
    sell: 'BÁN',
    order_book: 'Sổ Lệnh (Order Book)',
    market_trades: 'Lịch Sử Khớp Lệnh (Market Trades)',
    my_trades: 'Lệnh Của Tôi',
    price: 'Giá',
    amount: 'Số Lượng',
    total: 'Tổng',
    time: 'Thời Gian',
    connection_stable: 'Kết nối máy chủ ổn định (12µs)',
    
    // Profile Drawer & Menu
    dashboard: 'Bảng điều khiển',
    assets: 'Tài sản & Số dư',
    orders: 'Đơn hàng & Lịch sử',
    account: 'Cài đặt Tài khoản & Bảo mật',
    referral: 'Giới thiệu bạn bè (Hoa hồng 30%)',
    rewards: 'Trung tâm Phần thưởng',
    subaccounts: 'Quản lý Tài khoản phụ',
    settings: 'Cài đặt Hệ thống',
    logout: 'Đăng xuất An toàn',
    
    // Analysis Tabs
    moneyFlow: 'Phân tích dòng tiền',
    marginDebt: 'Tăng trưởng nợ Margin',
    largeInflow: '5 x 24hr Dòng tiền lớn vào ròng',
    securityAudit: 'Kiểm định bảo mật hợp đồng AI',
    orcaDexIntro: 'Orca là sàn DEX tạo lập thị trường tự động (AMM) hàng đầu trên hệ sinh thái Solana.',
    mintableWarning: 'Phát hiện hàm Mintable: Tổng cung có thể tăng thêm, cần lưu ý biến động giá.',
    
    // Additional general terms
    regularUser: 'Người dùng Thường',
    verified: 'Đã xác minh KYC',
    following: 'Đang theo dõi',
    followers: 'Người theo dõi',
    estimatedBalance: 'Ước tính Tổng giá trị',
    todayPnl: 'Lợi nhuận hôm nay'
  },
  EN: {
    nav_home: 'Home',
    nav_markets: 'Markets',
    nav_trade: 'Trade (Spot)',
    nav_futures: 'Futures',
    nav_earn: 'Earn',
    nav_square: 'Square',
    nav_wallet: 'Wallet',
    btn_login: 'Log In',
    btn_register: 'Register',
    buy: 'BUY',
    sell: 'SELL',
    order_book: 'Order Book',
    market_trades: 'Market Trades',
    my_trades: 'My Trades',
    price: 'Price',
    amount: 'Amount',
    total: 'Total',
    time: 'Time',
    connection_stable: 'Stable Connection (12µs)',
    
    // Profile Drawer & Menu
    dashboard: 'Dashboard',
    assets: 'Assets & Balance',
    orders: 'Orders & History',
    account: 'Account & Security Settings',
    referral: 'Referral Program (30% Rebate)',
    rewards: 'Rewards Hub',
    subaccounts: 'Sub Accounts Management',
    settings: 'System Settings',
    logout: 'Log Out Safely',
    
    // Analysis Tabs
    moneyFlow: 'Money Flow Analysis',
    marginDebt: 'Margin Debt Growth',
    largeInflow: '5 x 24hr Large Inflow',
    securityAudit: 'AI Contract Security Detection',
    orcaDexIntro: 'Orca is the leading automated market maker (AMM) DEX on the Solana blockchain.',
    mintableWarning: 'Mintable function detected: Token total supply can be increased, affecting market price.',
    
    // Additional general terms
    regularUser: 'Regular User',
    verified: 'Identity Verified',
    following: 'Following',
    followers: 'Followers',
    estimatedBalance: 'Estimated Balance',
    todayPnl: "Today's PnL"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('apex_lang') || 'VI';
  }

  t(key) {
    return I18nDict[this.currentLang]?.[key] || key;
  }

  setLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('apex_lang', lang);
    this.translateDOM();
  }

  toggle() {
    const nextLang = this.currentLang === 'VI' ? 'EN' : 'VI';
    this.setLang(nextLang);
    return this.currentLang;
  }

  translateDOM() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && I18nDict[this.currentLang]?.[key]) {
        el.textContent = I18nDict[this.currentLang][key];
      }
    });
  }
}

export const I18n = new I18nManager();
