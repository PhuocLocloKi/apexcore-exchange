/* ========================================================
   APEXCORE CONFIG — site-config.js
   Cấu Hình Thương Hiệu, Nội Dung & Thông Số Toàn Sàn
   ======================================================== */

export const SiteConfig = {
  brandName: "APEXCORE EXCHANGE",
  creatorName: "NGUYỄN PHƯỚC LỘC",
  ownerTitle: "Nhà Sáng Lập & Chủ Sở Hữu Toàn Quyền",
  officialEmail: "nguyenphuocloc010306@gmail.com",
  tagline: "Giao dịch thông minh — Kiến tạo tương lai",
  slogan: "DREAM · TRADE · FREEDOM — Trade Beyond Limits",
  vision: "Siêu Sàn Giao Dịch Đa Tài Sản Độc Lập (Crypto · Chứng Khoán · Forex & Vàng)",
  subTagline: "APEXCORE mang đến nền tảng giao dịch hiện đại, ổn định và an toàn cho mọi nhà đầu tư.",

  // Thông số thống kê Hero
  stats: {
    totalUsers: "1.2M+",
    volume24h: "$8.6B+",
    supportedAssets: "150+"
  },

  // 4 Thẻ tính năng kính mờ
  featureCards: [
    {
      title: "Giao dịch Crypto",
      desc: "BTC, ETH, SOL, vv.",
      icon: "crypto"
    },
    {
      title: "Chứng khoán",
      desc: "Cổ phiếu, ETF, Chỉ số",
      icon: "stocks"
    },
    {
      title: "Bảo mật cao",
      desc: "SSL, 2FA, Cold Wallet",
      icon: "security"
    },
    {
      title: "Phí giao dịch thấp",
      desc: "Cạnh tranh nhất thị trường",
      icon: "fee"
    }
  ],

  // Cấu hình chuyển động 3D
  motion3D: {
    enableTiltParallax: true, // Bật/Tắt nghiêng 3D theo chuột
    maxTiltAngle: 15,         // Góc nghiêng tối đa (độ)
    perspective: 1000
  },

  // API Backend endpoint
  apiBaseUrl: "http://127.0.0.1:5000"
};

// Expose globally for vanilla scripts
if (typeof window !== "undefined") {
  window.SiteConfig = SiteConfig;
}
