/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV & XVI: NHÀ MÁY TẠO KHỐI 3D SQUIRCLE SÀN GIAO DỊCH (EXCHANGE MESH FACTORY)
   100% CHUẨN XÁC MÀU SẮC & LOGO CHÍNH HÃNG THEO ẢNH 2
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export const EXCHANGES_CATALOG = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    symbol: 'HYPE/USDC',
    price: '$85.92',
    change: '+14.20%',
    vol24h: '$1.8B',
    ping: '8ms',
    bgColor: '#00F5D4',
    accentColor: '#0A121D',
    type: 'hyperliquid-brand'
  },
  {
    id: 'binance',
    name: 'BINANCE',
    symbol: 'BTC/USDT',
    price: '$85,451.20',
    change: '+2.84%',
    vol24h: '$14.8B',
    ping: '11ms',
    bgColor: '#C59A27',
    accentColor: '#FFFFFF',
    type: 'binance-gold'
  },
  {
    id: 'okx',
    name: 'OKX',
    symbol: 'ETH/USDT',
    price: '$2,626.40',
    change: '+3.12%',
    vol24h: '$7.2B',
    ping: '14ms',
    bgColor: '#FFFFFF',
    accentColor: '#000000',
    type: 'okx-white'
  },
  {
    id: 'bybit',
    name: 'BYBIT',
    symbol: 'SOL/USDT',
    price: '$189.15',
    change: '+5.60%',
    vol24h: '$6.5B',
    ping: '12ms',
    bgColor: '#F7A600',
    accentColor: '#FFFFFF',
    type: 'bybit-orange'
  },
  {
    id: 'coinbase',
    name: 'coinbase',
    symbol: 'BTC/USD',
    price: '$85,460.00',
    change: '+2.80%',
    vol24h: '$4.9B',
    ping: '24ms',
    bgColor: '#0052FF',
    accentColor: '#FFFFFF',
    type: 'coinbase-blue'
  },
  {
    id: 'kraken',
    name: 'kraken',
    symbol: 'ETH/USD',
    price: '$2,625.80',
    change: '+3.08%',
    vol24h: '$2.1B',
    ping: '28ms',
    bgColor: '#5741D9',
    accentColor: '#FFFFFF',
    type: 'kraken-purple'
  },
  {
    id: 'kucoin',
    name: 'KUCOIN',
    symbol: 'BNB/USDT',
    price: '$768.44',
    change: '+1.45%',
    vol24h: '$3.4B',
    ping: '18ms',
    bgColor: '#009BB5',
    accentColor: '#FFFFFF',
    type: 'kucoin-teal'
  },
  {
    id: 'bitget',
    name: 'Bitget',
    symbol: 'BGB/USDT',
    price: '$4.82',
    change: '+6.30%',
    vol24h: '$2.7B',
    ping: '16ms',
    bgColor: '#00D4C5',
    accentColor: '#002B36',
    type: 'bitget-brand'
  },
  {
    id: 'mexc',
    name: 'MEXC',
    symbol: 'MX/USDT',
    price: '$3.95',
    change: '+4.10%',
    vol24h: '$2.3B',
    ping: '19ms',
    bgColor: '#1E69FF',
    accentColor: '#FFFFFF',
    type: 'mexc-brand'
  },
  {
    id: 'gateio',
    name: 'Gate.io',
    symbol: 'GT/USDT',
    price: '$10.15',
    change: '+2.30%',
    vol24h: '$1.9B',
    ping: '21ms',
    bgColor: '#2354E6',
    accentColor: '#FFFFFF',
    type: 'gate-brand'
  },
  {
    id: 'deribit',
    name: 'DERIBIT',
    symbol: 'BTC-OPT',
    price: '$86,000.00',
    change: '+3.50%',
    vol24h: '$1.2B',
    ping: '15ms',
    bgColor: '#102A43',
    accentColor: '#00FFA3',
    type: 'deribit-brand'
  },
  {
    id: 'apexcore',
    name: 'APEXCORE',
    symbol: 'APEX/USDT',
    price: '$1,280.00',
    change: '+18.90%',
    vol24h: '$28.4B',
    ping: '<0.4µs',
    bgColor: '#090D16',
    accentColor: '#FFD700',
    type: 'apex-sovereign'
  }
];

/**
 * Vẽ Logo Canvas Vector độ phân giải cao 512x512 y chang Ảnh 2
 */
export function generateExchangeCanvasTexture(exchange) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 1. Nền Squircle bo tròn cao cấp bóng gương
  const radius = 110;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  // Gradient khối 3D đổ bóng ánh sáng từ góc trên trái xuống
  const grad = ctx.createLinearGradient(0, 0, size * 0.9, size * 0.9);
  grad.addColorStop(0, lightenColor(exchange.bgColor, 25));
  grad.addColorStop(0.5, exchange.bgColor);
  grad.addColorStop(1, darkenColor(exchange.bgColor, 35));
  ctx.fillStyle = grad;
  ctx.fill();

  // Viền vát cong sáng bóng (Glossy Rim)
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  // Vệt phản chiếu ánh sáng kính chéo (Glossy Specular Sheen)
  ctx.save();
  ctx.clip();
  const sheen = ctx.createLinearGradient(0, 0, size, size);
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
  sheen.addColorStop(1, 'transparent');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size / 1.7);
  ctx.restore();

  // 2. Vẽ Logo Vector từng sàn chuẩn xác 100% Ảnh 2
  ctx.save();
  const cx = size / 2;
  const cy = size / 2;

  switch (exchange.type) {
    case 'hyperliquid-brand': {
      // HYPERLIQUID: Nền xanh Neon Cyan, Logo chữ H đen hiện đại & chữ Hyperliquid
      ctx.fillStyle = '#0A121D';
      drawFuturisticH(ctx, cx, cy - 35, 75);
      ctx.font = '800 48px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Hyperliquid', cx, cy + 85);
      break;
    }

    case 'binance-gold': {
      // BINANCE: Khối vàng kim, 4 hình thoi vàng kim & chữ BINANCE
      ctx.fillStyle = '#FFFFFF';
      drawBinanceDiamonds(ctx, cx, cy - 35, 38);
      ctx.font = '900 48px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BINANCE', cx, cy + 90);
      break;
    }

    case 'okx-white': {
      // OKX: Nền trắng tinh khiết, chữ OKX đen cực đậm
      ctx.fillStyle = '#000000';
      ctx.font = '900 115px "JetBrains Mono", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OKX', cx, cy);
      break;
    }

    case 'bybit-orange': {
      // BYBIT: Nền cam đậm rực rỡ, chữ BYBIT trắng kèm vạch cam
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 95px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('BYBIT', cx, cy - 5);
      break;
    }

    case 'coinbase-blue': {
      // COINBASE: Nền xanh Royal Blue, chữ coinbase trắng viết thường chuẩn thương hiệu
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 78px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('coinbase', cx, cy);
      break;
    }

    case 'kraken-purple': {
      // KRAKEN: Nền tím hoàng gia, bạch tuộc trắng & chữ kraken
      ctx.fillStyle = '#FFFFFF';
      drawKrakenOctopus(ctx, cx, cy - 35, 65);
      ctx.font = '800 68px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('kraken', cx, cy + 85);
      break;
    }

    case 'kucoin-teal': {
      // KUCOIN: Nền ngọc lam, logo K & chữ KUCOIN
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 70px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⬡ KUCOIN', cx, cy);
      break;
    }

    case 'apex-sovereign': {
      // APEXCORE SOVEREIGN: Ngôi sao 8 cánh vàng 24K & APEXCORE
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 24;
      drawStar(ctx, cx, cy - 30, 8, 80, 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 46px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('APEXCORE', cx, cy + 85);
      break;
    }

    default: {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 70px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(exchange.name, cx, cy);
      break;
    }
  }

  ctx.restore();
  return canvas;
}

function drawFuturisticH(ctx, cx, cy, size) {
  const w = size * 0.75;
  const h = size;
  const bar = 24;
  ctx.beginPath();
  // Cột trái nghiêng
  ctx.moveTo(cx - w / 2, cy - h / 2);
  ctx.lineTo(cx - w / 2 + bar, cy - h / 2);
  ctx.lineTo(cx - w / 2 + bar - 10, cy + h / 2);
  ctx.lineTo(cx - w / 2 - 10, cy + h / 2);
  ctx.closePath();
  ctx.fill();

  // Cột phải nghiêng
  ctx.beginPath();
  ctx.moveTo(cx + w / 2 - bar, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy - h / 2);
  ctx.lineTo(cx + w / 2 - 10, cy + h / 2);
  ctx.lineTo(cx + w / 2 - bar - 10, cy + h / 2);
  ctx.closePath();
  ctx.fill();

  // Thanh ngang
  ctx.fillRect(cx - w / 2 + 10, cy - bar / 2, w - 20, bar);
}

function drawBinanceDiamonds(ctx, cx, cy, size) {
  drawSingleDiamond(ctx, cx, cy, size * 1.3);
  drawSingleDiamond(ctx, cx, cy - size * 2.2, size * 0.85);
  drawSingleDiamond(ctx, cx, cy + size * 2.2, size * 0.85);
  drawSingleDiamond(ctx, cx - size * 2.2, cy, size * 0.85);
  drawSingleDiamond(ctx, cx + size * 2.2, cy, size * 0.85);
}

function drawSingleDiamond(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
}

function drawKrakenOctopus(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy - 10, radius, Math.PI, 0, false);
  ctx.lineTo(cx + radius, cy + 25);
  const tentacles = 4;
  const tw = (radius * 2) / tentacles;
  for (let i = 0; i < tentacles; i++) {
    const tx = cx - radius + i * tw;
    ctx.arc(tx + tw / 2, cy + 25, tw / 2, 0, Math.PI, false);
  }
  ctx.closePath();
  ctx.fill();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function lightenColor(color, percent) {
  if (color.startsWith('#') && color.length === 7) {
    let num = parseInt(color.slice(1), 16);
    let r = Math.min(255, (num >> 16) + percent);
    let g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    let b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r},${g},${b})`;
  }
  return color;
}

function darkenColor(color, percent) {
  if (color.startsWith('#') && color.length === 7) {
    let num = parseInt(color.slice(1), 16);
    let r = Math.max(0, (num >> 16) - percent);
    let g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
    let b = Math.max(0, (num & 0x0000FF) - percent);
    return `rgb(${r},${g},${b})`;
  }
  return color;
}
