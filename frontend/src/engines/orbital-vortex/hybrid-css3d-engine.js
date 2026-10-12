/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XVIII: PHƯƠNG ÁN B — ĐỘNG CƠ HYBRID CSS 3D (SIÊU NHẸ · 0% LỖI · 120 FPS)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

import { EXCHANGES_CATALOG } from './exchange-mesh-factory.js';
import { generateSculptedHandCanvas } from './sculpted-hand-generator.js';

export class HybridCss3dVortexEngine {
  constructor(containerElement, options = {}) {
    this.container = typeof containerElement === 'string'
      ? document.getElementById(containerElement)
      : containerElement;
    this.options = options;
    this.handImgEl = null;
    this.ringTrackEl = null;
  }

  init() {
    if (!this.container) return false;
    this.container.innerHTML = '';
    this.container.className = 'seamless-hand-vortex-viewport';

    const scene = document.createElement('div');
    scene.className = 'vortex-3d-scene';

    // 1. Lõi Bàn Tay Người Thật Điêu Khắc Chìm Nền
    const handLayer = document.createElement('div');
    handLayer.className = 'vortex-hand-layer';

    this.handImgEl = document.createElement('img');
    this.handImgEl.className = 'hand-fade-bottom';
    this.handImgEl.alt = 'ApexCore Sovereign Hand';

    // Tạo hình ảnh bàn tay điêu khắc SSS
    const handCanvas = generateSculptedHandCanvas(800, 1060);
    this.handImgEl.src = handCanvas.toDataURL('image/png');

    // Ưu tiên nạp ảnh render gốc nếu có trong thư mục assets/images
    const candidates = [
      'assets/images/hand_orbital_core.png',
      'assets/images/hand_orbital_core.jpg',
      'assets/images/hand.png',
      'assets/images/hand.jpg',
      'assets/images/media_1791695675917.jpg'
    ];

    const tryCandidate = (index) => {
      if (index >= candidates.length) return;
      const img = new Image();
      img.onload = () => {
        if (this.handImgEl) {
          this.handImgEl.src = candidates[index];
        }
      };
      img.onerror = () => {
        tryCandidate(index + 1);
      };
      img.src = candidates[index];
    };
    tryCandidate(0);

    handLayer.appendChild(this.handImgEl);
    scene.appendChild(handLayer);

    // 2. Vòng Xoay Các Khối Sàn CSS 3D
    this.ringTrackEl = document.createElement('div');
    this.ringTrackEl.className = 'vortex-ring-track';

    const count = EXCHANGES_CATALOG.length;
    const radius = 230; // Bán kính quỹ đạo không gian CSS 3D

    EXCHANGES_CATALOG.forEach((ex, i) => {
      const angle = (i / count) * 360;
      const card = document.createElement('div');
      card.className = `exchange-card-3d c-${ex.id}`;
      card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      card.style.borderColor = `${ex.bgColor || '#00F0FF'}`;
      card.title = `${ex.name} — ${ex.symbol} (${ex.price})`;

      card.innerHTML = `
        <div class="card-glass-face" style="color:${ex.bgColor === '#FFFFFF' ? '#000000' : '#FFFFFF'}; background:${ex.bgColor}; width:100%; height:100%; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:inset 0 1px 3px rgba(255,255,255,0.4);">
          <span style="font-weight:900; font-size:12px; letter-spacing:0.5px;">${ex.name}</span>
          <span style="font-size:10px; opacity:0.85; font-family:'JetBrains Mono';">${ex.price}</span>
        </div>
      `;

      card.onclick = () => {
        window.location.href = `trade.html?exchange=${ex.id}&pair=${(ex.symbol || 'BTC/USDT').replace('/', '_')}`;
      };

      this.ringTrackEl.appendChild(card);
    });

    scene.appendChild(this.ringTrackEl);
    this.container.appendChild(scene);
    return true;
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
