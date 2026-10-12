/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XVI: ĐỘNG CƠ BÀN TAY QUỸ ĐẠO CHÌM NỀN KHÔNG VIỀN (BORDERLESS 3D VORTEX)
   100% KHÔNG HỘP · BÀN TAY NGƯỜI THẬT STUDIO · QUỸ ĐẠO ĐAN XEN Z-DEPTH · 60 FPS
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

import { EXCHANGES_CATALOG, generateExchangeCanvasTexture } from './exchange-mesh-factory.js';
import { calculateOrbitalPosition, lerp, DEFAULT_ORBITAL_PARAMS } from './orbital-math.js';
import { generateSculptedHandCanvas } from './sculpted-hand-generator.js';

// Polyfill an toàn cho ctx.roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}

export class BorderlessVortexEngine {
  constructor(viewportElement, options = {}) {
    this.viewport = typeof viewportElement === 'string'
      ? document.getElementById(viewportElement)
      : viewportElement;

    this.options = {
      autoStart: true,
      tiltParallax: true,
      ...options
    };

    // Canvas Layers (Two-Pass Z-Layering chuẩn Chương XVI)
    this.backCanvas = null;
    this.backCtx = null;
    this.frontCanvas = null;
    this.frontCtx = null;

    // Lõi Bàn Tay DOM
    this.handCoreEl = null;
    this.handImgEl = null;
    this.handDataUrl = null;

    this.rafId = null;
    this.isRunning = false;

    // Kích thước Viewport
    this.width = 620;
    this.height = 640;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Camera 3D Perspective
    this.focalLength = 540;
    this.cameraDistance = 6.0;
    this.mouseParallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Vận tốc và chu kỳ thời gian
    this.currentSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed;
    this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed;
    this.elapsedTime = 0;
    this.lastTimestamp = performance.now();

    // Dữ liệu 12 khối sàn
    this.tiles = [];
    this.cachedTextures = new Map();

    // Hạt bụi sáng lượng tử (Cyan & Gold Stardust)
    this.stardust = [];

    // Tương tác chuột & Tooltip
    this.mouse = { x: -9999, y: -9999 };
    this.hoveredTile = null;
    this.tooltipEl = null;
    this.isWarping = false;

    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseLeaveBound = this.onMouseLeave.bind(this);
    this.onClickBound = this.onClick.bind(this);
    this.onWindowMouseMoveBound = this.onWindowMouseMove.bind(this);
    this.resizeObserver = null;
  }

  init() {
    if (!this.viewport) {
      console.warn('[BorderlessVortex] Viewport not found.');
      return false;
    }

    // 1. Dựng cấu trúc DOM chìm nền 3 tầng chuẩn xác Chương XVI
    this.setupDOMHierarchy();

    // 2. Chuẩn bị Texture Logo Vector chính hãng cho 12 sàn giao dịch
    this.prepareExchangeTextures();

    // 3. Chuẩn bị Texture Bàn Tay Người Thật Điêu Khắc Studio
    this.prepareSculptedHand();

    // 4. Khởi tạo 280 hạt bụi sáng lượng tử
    this.initStardust();

    // 5. Chuẩn bị Tooltip Card vi trắc
    this.setupTooltip();

    // 6. Gắn sự kiện chuột
    this.initEvents();

    // 7. Bắt đầu vòng lặp 60 FPS
    if (this.options.autoStart) {
      this.start();
    }

    console.log('[ApexCore] ✋ Borderless 3D Orbiting Hand Engine V17 đã kích hoạt thành công 60 FPS.');
    return true;
  }

  setupDOMHierarchy() {
    // Xóa sạch nội dung cũ để đảm bảo không còn bất kỳ viền hộp nào
    this.viewport.innerHTML = '';
    this.viewport.className = 'seamless-hand-vortex-viewport';

    // PASS 1: Canvas vẽ các khối sàn bay sau lưng bàn tay (Z < 0)
    this.backCanvas = document.createElement('canvas');
    this.backCanvas.className = 'hand-orbit-back-canvas';
    this.backCanvas.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;';
    this.backCtx = this.backCanvas.getContext('2d');
    this.viewport.appendChild(this.backCanvas);

    // PASS 2: Lõi Bàn Tay Điêu Khắc Studio chìm dần vào nền đen Obsidian (Z-Index 2)
    this.handCoreEl = document.createElement('div');
    this.handCoreEl.className = 'seamless-hand-core';
    this.handCoreEl.innerHTML = `
      <img src="" alt="ApexCore Sovereign Sculpted Hand" class="hand-sculpted-img" id="handSculptedImg"/>
      <div class="hand-bottom-fade"></div>
    `;
    this.viewport.appendChild(this.handCoreEl);
    this.handImgEl = this.handCoreEl.querySelector('.hand-sculpted-img');

    // PASS 3: Canvas vẽ các khối sàn bay phía trước bàn tay (Z > 0) & bắt sự kiện chuột (Z-Index 3)
    this.frontCanvas = document.createElement('canvas');
    this.frontCanvas.className = 'hand-orbit-canvas';
    this.frontCanvas.id = 'handOrbitCanvas';
    this.frontCtx = this.frontCanvas.getContext('2d');
    this.viewport.appendChild(this.frontCanvas);

    this.updateDimensions();
  }

  updateDimensions() {
    this.width = this.viewport.clientWidth || 620;
    this.height = this.viewport.clientHeight || 640;

    [this.backCanvas, this.frontCanvas].forEach(canv => {
      if (canv) {
        canv.width = this.width * this.dpr;
        canv.height = this.height * this.dpr;
        canv.style.width = '100%';
        canv.style.height = '100%';
        const ctx = canv.getContext('2d');
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      }
    });
  }

  prepareExchangeTextures() {
    this.tiles = [];
    const count = EXCHANGES_CATALOG.length;

    EXCHANGES_CATALOG.forEach((ex, i) => {
      let textureCanvas = this.cachedTextures.get(ex.id);
      if (!textureCanvas) {
        textureCanvas = generateExchangeCanvasTexture(ex);
        this.cachedTextures.set(ex.id, textureCanvas);
      }

      this.tiles.push({
        index: i,
        total: count,
        data: ex,
        texture: textureCanvas,
        scale: 1.0,
        targetScale: 1.0,
        screenX: 0,
        screenY: 0,
        screenSize: 0,
        worldZ: 0
      });
    });
  }

  prepareSculptedHand() {
    // 1. Tạo bản vẽ giải phẫu da người thật siêu thực 100% trong suốt làm nền
    const handCanvas = generateSculptedHandCanvas(800, 1060);
    this.handDataUrl = handCanvas.toDataURL('image/png');
    if (this.handImgEl) {
      this.handImgEl.src = this.handDataUrl;
    }

    // 2. Tự động kiểm tra và ưu tiên file ảnh render gốc nếu người dùng đặt vào assets/images
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
  }

  initStardust() {
    this.stardust = [];
    const count = 280;
    for (let i = 0; i < count; i++) {
      this.stardust.push({
        angle: Math.random() * Math.PI * 2,
        radius: 1.6 + Math.random() * 1.8,
        speed: 0.18 + Math.random() * 0.42,
        y: (Math.random() - 0.5) * 2.6,
        size: 1.2 + Math.random() * 2.4,
        isCyan: Math.random() > 0.45,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  setupTooltip() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'vortex-hover-card';
    this.tooltipEl.id = 'vortexTooltip';
    this.tooltipEl.style.display = 'none';
    this.tooltipEl.innerHTML = `
      <div class="vt-name-row">
        <span class="vt-name" id="vtName">BINANCE</span>
        <span class="vt-ping" id="vtPing">⚡ 11ms</span>
      </div>
      <div class="vt-pair-row">
        <span class="vt-symbol" id="vtSymbol">BTC/USDT</span>
        <span class="vt-price" id="vtPrice">$85,451</span>
        <span class="vt-change" id="vtChange">+2.84%</span>
      </div>
      <div class="vt-action">Click để vào Giao Dịch ➔</div>
    `;
    this.viewport.appendChild(this.tooltipEl);
  }

  initEvents() {
    this.frontCanvas.addEventListener('mousemove', this.onMouseMoveBound);
    this.frontCanvas.addEventListener('mouseleave', this.onMouseLeaveBound);
    this.frontCanvas.addEventListener('click', this.onClickBound);

    if (this.options.tiltParallax) {
      window.addEventListener('mousemove', this.onWindowMouseMoveBound, { passive: true });
    }

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });
      this.resizeObserver.observe(this.viewport);
    }
  }

  onMouseMove(e) {
    if (this.isWarping) return;
    if (!this.frontCanvas) return;
    const rect = this.frontCanvas.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    this.mouse.x = Math.max(-9999, Math.min(this.width + 100, e.clientX - rect.left));
    this.mouse.y = Math.max(-9999, Math.min(this.height + 100, e.clientY - rect.top));

    let hitTile = null;
    let minZ = Infinity;

    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      if (!tile || !isFinite(tile.screenX) || !isFinite(tile.screenY)) continue;
      const dx = this.mouse.x - tile.screenX;
      const dy = this.mouse.y - tile.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = Math.max(30, (tile.screenSize / 2) * 1.28);

      if (dist <= hitRadius && tile.worldZ < minZ) {
        minZ = tile.worldZ;
        hitTile = tile;
      }
    }

    if (hitTile) {
      if (this.hoveredTile !== hitTile) {
        // Reset old hover an toàn về 1.0 (TUYỆT ĐỐI KHÔNG BAO GIỜ VỀ 0)
        if (this.hoveredTile) {
          this.hoveredTile.targetScale = 1.0;
        }
        this.hoveredTile = hitTile;
        hitTile.targetScale = 1.25; // Phóng to an toàn 1.25
        this.targetSpeed = DEFAULT_ORBITAL_PARAMS.hoverSlowSpeed || DEFAULT_ORBITAL_PARAMS.hoverSpeed || 0.18;
        this.frontCanvas.style.cursor = 'pointer';
        this.showTooltip(hitTile);
      }
      this.updateTooltipPosition(hitTile.screenX, hitTile.screenY);
    } else {
      if (this.hoveredTile) {
        this.hoveredTile.targetScale = 1.0; // Reset an toàn về 1.0
        this.hoveredTile = null;
        this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed || 0.45;
        this.frontCanvas.style.cursor = 'default';
        this.hideTooltip();
      }
    }
  }

  onMouseLeave() {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
    this.hoveredTile = null;
    this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed || 0.45;

    // Đảm bảo toàn bộ 12 khối trở về chuẩn xác 1.0, không khối nào bị kẹt hoặc teo về 0
    this.tiles.forEach(tile => {
      tile.targetScale = 1.0;
    });

    if (this.frontCanvas) {
      this.frontCanvas.style.cursor = 'default';
    }
    this.hideTooltip();
  }

  onWindowMouseMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.mouseParallax.targetX = nx * 0.45;
    this.mouseParallax.targetY = ny * 0.35;
  }

  showTooltip(tile) {
    if (!this.tooltipEl) return;
    const data = tile.data;
    this.tooltipEl.style.display = 'block';

    const nameEl = document.getElementById('vtName');
    const pingEl = document.getElementById('vtPing');
    const symbolEl = document.getElementById('vtSymbol');
    const priceEl = document.getElementById('vtPrice');
    const changeEl = document.getElementById('vtChange');

    if (nameEl) nameEl.textContent = data.name;
    if (pingEl) pingEl.textContent = `⚡ ${data.ping}`;
    if (symbolEl) symbolEl.textContent = data.symbol;
    if (priceEl) priceEl.textContent = data.price;
    if (changeEl) {
      changeEl.textContent = `▲ ${data.change}`;
      changeEl.style.color = '#00FFA3';
    }
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  updateTooltipPosition(x, y) {
    if (!this.tooltipEl) return;
    const pad = 24;
    let posX = x + pad;
    let posY = y - 75;

    const maxW = this.width - 240;
    if (posX > maxW) posX = x - 250;
    if (posY < 10) posY = 15;

    this.tooltipEl.style.transform = `translate(${posX}px, ${posY}px)`;
  }

  onClick() {
    if (this.hoveredTile && !this.isWarping) {
      const data = this.hoveredTile.data;
      this.isWarping = true;
      this.viewport.classList.add('vortex-warp-active');

      if (this.tooltipEl) {
        this.tooltipEl.innerHTML = `
          <div style="color: #FFD700; font-weight: 800; font-size: 13px; text-align: center; padding: 8px 0;">
            🚀 ĐANG MỞ BUỒNG LÁI ${data.name}...
          </div>
        `;
      }

      setTimeout(() => {
        const symbolParam = (data.symbol || 'BTC/USDT').replace('/', '_');
        window.location.href = `trade.html?exchange=${data.id}&pair=${symbolParam}`;
      }, 380);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop();
  }

  pause() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(() => this.loop());

    // Tự động thích ứng kích thước
    if (this.viewport && (this.viewport.clientWidth !== this.width || this.viewport.clientHeight !== this.height)) {
      if (this.viewport.clientWidth > 0 && this.viewport.clientHeight > 0) {
        this.updateDimensions();
      }
    }

    const now = performance.now();
    const delta = Math.min((now - this.lastTimestamp) / 1000, 0.05);
    this.lastTimestamp = now;

    const safeTargetSpeed = Number(this.targetSpeed) || DEFAULT_ORBITAL_PARAMS.defaultSpeed || 0.45;
    this.currentSpeed = lerp(Number(this.currentSpeed) || 0.45, safeTargetSpeed, 0.08);
    if (!isFinite(this.currentSpeed) || isNaN(this.currentSpeed)) {
      this.currentSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed || 0.45;
    }
    this.elapsedTime += delta * this.currentSpeed;
    if (!isFinite(this.elapsedTime) || isNaN(this.elapsedTime)) {
      this.elapsedTime = 0;
    }

    this.mouseParallax.x = lerp(this.mouseParallax.x || 0, this.mouseParallax.targetX || 0, 0.05);
    this.mouseParallax.y = lerp(this.mouseParallax.y || 0, this.mouseParallax.targetY || 0, 0.05);

    try {
      this.render();
    } catch (err) {
      console.warn('[Vortex] Frame render error guarded:', err);
    }
  }

  render() {
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2 - 10;

    const backCtx = this.backCtx;
    const frontCtx = this.frontCtx;

    if (!backCtx || !frontCtx) return;

    backCtx.clearRect(0, 0, w, h);
    frontCtx.clearRect(0, 0, w, h);

    const camX = (this.mouseParallax.x || 0) * 0.42;
    const camY = -(this.mouseParallax.y || 0) * 0.32;

    // ========================================================
    // TÍNH TOÁN QUỸ ĐẠO 12 KHỐI SÀN (Z-DEPTH SEPARATION)
    // ========================================================
    const backTiles = [];
    const frontTiles = [];

    this.tiles.forEach(tile => {
      // BẢO VỆ SCALE AN TOÀN TUYỆT ĐỐI THEO CHƯƠNG XVIII
      // targetScale kẹp chặt trong khoảng [1.0, 1.25], TUYỆT ĐỐI KHÔNG BAO GIỜ VỀ 0 HOẶC NaN
      const targetScale = Math.max(1.0, Math.min(1.25, Number(tile.targetScale) || 1.0));
      tile.scale = lerp(Number(tile.scale) || 1.0, targetScale, 0.14);
      if (!isFinite(tile.scale) || isNaN(tile.scale) || tile.scale < 1.0) {
        tile.scale = 1.0;
      }

      const pos = calculateOrbitalPosition(
        tile.index,
        tile.total,
        this.elapsedTime,
        1.0,
        {
          radiusX: 2.85,
          radiusZ: 2.18,
          baseY: 0.16,
          amplitudeY: 0.52,
          tiltY: 0.18
        }
      );

      const worldX = pos.x - camX;
      const worldY = pos.y - camY;
      const worldZ = pos.z; // Z < 0: bay sau lưng tay; Z >= 0: bay trước ngực tay

      const depth = Math.max(1.0, worldZ + this.cameraDistance);
      const projScale = this.focalLength / depth;
      const screenX = cx + worldX * projScale;
      const screenY = cy - worldY * projScale;
      const basePx = 98;
      const screenSize = Math.max(20, basePx * (projScale / 80) * tile.scale);

      tile.screenX = screenX;
      tile.screenY = screenY;
      tile.screenSize = screenSize;
      tile.worldZ = depth;

      const item = {
        tile: tile,
        z: depth,
        screenX: screenX,
        screenY: screenY,
        screenSize: screenSize
      };

      if (worldZ < 0) {
        backTiles.push(item);
      } else {
        frontTiles.push(item);
      }
    });

    // Sắp xếp sâu trong từng nhóm
    backTiles.sort((a, b) => b.z - a.z);
    frontTiles.sort((a, b) => b.z - a.z);

    // ========================================================
    // PASS 1: VẼ CÁC KHỐI SÀN BAY SAU LƯNG BÀN TAY (Z < 0)
    // Lớp này nằm trên Back Canvas (Z-Index 1), dưới lưng bàn tay
    // ========================================================
    this.renderStardustBack(backCtx, cx, cy, camX, camY);
    backTiles.forEach(item => this.drawSquircleTile(backCtx, item));

    // ========================================================
    // PASS 2: BÀN TAY NGƯỜI THỰC THỂ STUDIO Ở TÂM ĐIỂM (DOM LAYER)
    // Bàn tay nhấp nhô hơi thở & nghiêng parallax nhẹ nhàng
    // ========================================================
    if (this.handCoreEl) {
      const breathe = Math.sin(this.elapsedTime * 1.6) * 4;
      const tiltX = (this.mouseParallax.x || 0) * 12;
      const tiltY = -(this.mouseParallax.y || 0) * 10;
      this.handCoreEl.style.transform = `translate3d(${tiltX}px, ${breathe + tiltY}px, 0)`;
    }

    // ========================================================
    // PASS 3: VẼ CÁC KHỐI SÀN BAY PHÍA TRƯỚC BÀN TAY (Z >= 0)
    // Lớp này nằm trên Front Canvas (Z-Index 3), lướt qua ngực và cổ tay
    // ========================================================
    frontTiles.forEach(item => this.drawSquircleTile(frontCtx, item));
    this.renderStardustFront(frontCtx, cx, cy, camX, camY);
  }

  drawSquircleTile(ctx, item) {
    if (!ctx || !item || !item.tile) return;
    const tile = item.tile;
    const sx = item.screenX;
    const sy = item.screenY;
    const size = item.screenSize;
    if (!isFinite(sx) || !isFinite(sy) || !isFinite(size) || size <= 4) return;
    const half = size / 2;

    try {
      ctx.save();

      // 1. Bóng đổ 3D sâu thẳm
      ctx.beginPath();
      ctx.roundRect(sx - half, sy - half + 6, size, size, size * 0.24);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 18;
      ctx.fill();

      // 2. Cạnh sườn 3D vát góc dày dặn (Thick Extruded 3D Bevel)
      const bevel = Math.max(4, 8 * (size / 90));
      ctx.beginPath();
      ctx.roundRect(sx - half, sy - half + bevel, size, size, size * 0.24);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fill();

      // 3. Mặt chính diện: Vẽ logo vector chính hãng
      if (tile.texture) {
        ctx.beginPath();
        ctx.roundRect(sx - half, sy - half, size, size, size * 0.24);
        ctx.clip();
        ctx.drawImage(tile.texture, sx - half, sy - half, size, size);
      }

      ctx.restore();
      ctx.save();

      // 4. Ánh sáng viền vát gương bóng bẩy (Acrylic Glass Specular Rim)
      ctx.beginPath();
      ctx.roundRect(sx - half + 1.5, sy - half + 1.5, size - 3, size - 3, size * 0.23);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // 5. Hiệu ứng Hover: Phóng to, viền Neon rực rỡ và đốm sáng
      if (tile.targetScale > 1.05) {
        ctx.beginPath();
        ctx.roundRect(sx - half - 2, sy - half - 2, size + 4, size + 4, size * 0.25);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = tile.data.accentColor || '#00F0FF';
        ctx.shadowColor = tile.data.accentColor || '#00F0FF';
        ctx.shadowBlur = 30;
        ctx.stroke();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.restore();
    } catch (drawErr) {
      try { ctx.restore(); } catch (e) {}
    }
  }

  renderStardustBack(ctx, cx, cy, camX, camY) {
    this.renderStardustGroup(ctx, cx, cy, camX, camY, p => Math.sin(p.angle) < 0);
  }

  renderStardustFront(ctx, cx, cy, camX, camY) {
    this.renderStardustGroup(ctx, cx, cy, camX, camY, p => Math.sin(p.angle) >= 0);
  }

  renderStardustGroup(ctx, cx, cy, camX, camY, filterFn) {
    ctx.save();
    const t = this.elapsedTime;

    for (let i = 0; i < this.stardust.length; i++) {
      const p = this.stardust[i];
      if (!filterFn(p)) continue;

      const currentAngle = p.angle + t * p.speed * 0.8;
      const x = Math.cos(currentAngle) * p.radius;
      const z = Math.sin(currentAngle) * (p.radius * 0.75);
      const y = p.y + Math.sin(t * 1.5 + p.pulseOffset) * 0.15;

      const worldX = x - camX;
      const worldY = y - camY;
      const depth = z + this.cameraDistance;

      const projScale = this.focalLength / depth;
      const sx = cx + worldX * projScale;
      const sy = cy - worldY * projScale;
      const sz = Math.max(0.8, p.size * (projScale / 90));

      const alpha = 0.25 + 0.55 * Math.sin(t * 3.0 + p.pulseOffset);

      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = p.isCyan
        ? `rgba(0, 240, 255, ${Math.max(0, alpha)})`
        : `rgba(255, 215, 0, ${Math.max(0, alpha * 0.85)})`;
      ctx.fill();
    }

    ctx.restore();
  }

  destroy() {
    this.pause();

    if (this.frontCanvas) {
      this.frontCanvas.removeEventListener('mousemove', this.onMouseMoveBound);
      this.frontCanvas.removeEventListener('mouseleave', this.onMouseLeaveBound);
      this.frontCanvas.removeEventListener('click', this.onClickBound);
    }

    if (this.options.tiltParallax) {
      window.removeEventListener('mousemove', this.onWindowMouseMoveBound);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.viewport) {
      this.viewport.innerHTML = '';
    }

    this.cachedTextures.clear();
    this.tiles = [];
  }
}
