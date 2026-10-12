/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV: ĐỘNG CƠ 3D VÒNG XOÁY BÀN TAY LƯỢNG TỬ NGUYÊN BẢN (NATIVE 3D VORTEX)
   100% TỰ CHỨA ĐỘC LẬP — KHÔNG PHỤ THUỘC CDN MẠNG — 60 FPS PBR
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

import { EXCHANGES_CATALOG, generateExchangeCanvasTexture } from './exchange-mesh-factory.js';
import { calculateOrbitalPosition, lerp, DEFAULT_ORBITAL_PARAMS } from './orbital-math.js';

// Polyfill cho ctx.roundRect an toàn tuyệt đối trên mọi phiên bản trình duyệt
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

export class NativeOrbitalVortexEngine {
  constructor(containerElement, options = {}) {
    this.container = typeof containerElement === 'string'
      ? document.getElementById(containerElement)
      : containerElement;

    this.options = {
      autoStart: true,
      tiltParallax: true,
      ...options
    };

    this.canvas = null;
    this.ctx = null;
    this.rafId = null;
    this.isRunning = false;

    // Kích thước canvas
    this.width = 600;
    this.height = 520;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Camera & Tham số không gian 3D
    this.focalLength = 520;
    this.cameraDistance = 6.2;
    this.mouseParallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Vận tốc & Thời gian xoay
    this.currentSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed;
    this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed;
    this.elapsedTime = 0;
    this.lastTimestamp = performance.now();

    // Dữ liệu 12 khối sàn & Texture đã vẽ sẵn
    this.tiles = [];
    this.cachedTextures = new Map();

    // Hạt bụi vàng vũ trụ (Stardust Particles)
    this.stardust = [];

    // Tương tác chuột & Thẻ HUD
    this.mouse = { x: -9999, y: -9999 };
    this.hoveredTile = null;
    this.hudTooltip = null;
    this.isWarping = false;

    // Event listeners
    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseLeaveBound = this.onMouseLeave.bind(this);
    this.onClickBound = this.onClick.bind(this);
    this.onWindowMouseMoveBound = this.onWindowMouseMove.bind(this);
    this.resizeObserver = null;
  }

  init() {
    if (!this.container) {
      console.warn('[NativeVortex] Container not found.');
      return false;
    }

    // 1. Tạo Canvas 3D
    this.createCanvas();

    // 2. Chuẩn bị Texture cho 12 sàn giao dịch
    this.prepareExchangeTextures();

    // 3. Khởi tạo 280 hạt bụi vàng vũ trụ
    this.initStardustParticles();

    // 4. Tạo thẻ HUD vi trắc bay theo chuột
    this.createHudElement();

    // 5. Gắn sự kiện tương tác
    this.initEvents();

    // 6. Bắt đầu vòng lặp 60 FPS
    if (this.options.autoStart) {
      this.start();
    }

    console.log('[ApexCore] 🌌 Native 3D Orbital Vortex Engine V17 đã kích hoạt thành công 60 FPS.');
    return true;
  }

  createCanvas() {
    // Xóa nội dung cũ trong container
    this.container.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'vortex-webgl-canvas';
    this.ctx = this.canvas.getContext('2d');

    this.updateDimensions();
    this.container.appendChild(this.canvas);
  }

  updateDimensions() {
    this.width = this.container.clientWidth || 600;
    this.height = this.container.clientHeight || 520;

    if (this.canvas) {
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
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
        depthZ: 0
      });
    });
  }

  initStardustParticles() {
    this.stardust = [];
    const count = 320;
    for (let i = 0; i < count; i++) {
      this.stardust.push({
        angle: Math.random() * Math.PI * 2,
        radius: 1.8 + Math.random() * 1.8,
        speed: 0.2 + Math.random() * 0.45,
        y: (Math.random() - 0.5) * 2.2,
        size: 1.2 + Math.random() * 2.5,
        isCyan: Math.random() > 0.8,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  createHudElement() {
    this.hudTooltip = document.createElement('div');
    this.hudTooltip.className = 'vortex-hud-tooltip';
    this.hudTooltip.style.display = 'none';
    this.hudTooltip.innerHTML = `
      <div class="hud-top-row">
        <span class="hud-badge-name" id="vortexHudName">BINANCE</span>
        <span class="hud-badge-ping" id="vortexHudPing">⚡ 11ms</span>
      </div>
      <div class="hud-price-row">
        <span class="hud-symbol" id="vortexHudSymbol">BTC/USDT</span>
        <span class="hud-price" id="vortexHudPrice">$85,451.20</span>
        <span class="hud-change up" id="vortexHudChange">+2.84%</span>
      </div>
      <div class="hud-vol-row">
        <span>24h Vol: <strong id="vortexHudVol">$14.8B</strong></span>
        <span>SAFU: <strong style="color: #00FFA3;">Verified 100%</strong></span>
      </div>
      <div class="hud-click-hint">⚡ NHẤP ĐỂ MỞ BUỒNG LÁI GIAO DỊCH ➔</div>
    `;
    this.container.appendChild(this.hudTooltip);
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', this.onMouseMoveBound);
    this.canvas.addEventListener('mouseleave', this.onMouseLeaveBound);
    this.canvas.addEventListener('click', this.onClickBound);

    if (this.options.tiltParallax) {
      window.addEventListener('mousemove', this.onWindowMouseMoveBound, { passive: true });
    }

    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });
      this.resizeObserver.observe(this.container);
    }
  }

  onMouseMove(e) {
    if (this.isWarping) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    // Kiểm tra xem chuột có trúng khối sàn nào không
    let hitTile = null;
    // Tìm khối sàn gần nhất theo trục Z
    let minZ = Infinity;

    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const half = tile.screenSize / 2;
      if (
        this.mouse.x >= tile.screenX - half &&
        this.mouse.x <= tile.screenX + half &&
        this.mouse.y >= tile.screenY - half &&
        this.mouse.y <= tile.screenY + half
      ) {
        if (tile.depthZ < minZ) {
          minZ = tile.depthZ;
          hitTile = tile;
        }
      }
    }

    if (hitTile) {
      if (this.hoveredTile !== hitTile) {
        if (this.hoveredTile) this.hoveredTile.targetScale = 1.0;
        this.hoveredTile = hitTile;
        hitTile.targetScale = 1.25;
        this.targetSpeed = DEFAULT_ORBITAL_PARAMS.hoverSpeed; // Giảm tốc vòng xoay
        this.canvas.style.cursor = 'pointer';
        this.updateHudData(hitTile.data);
      }
      this.updateHudPosition(this.mouse.x, this.mouse.y);
      if (this.hudTooltip) this.hudTooltip.style.display = 'block';
    } else {
      if (this.hoveredTile) {
        this.hoveredTile.targetScale = 1.0;
        this.hoveredTile = null;
        this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed; // Khôi phục tốc độ chuẩn
        this.canvas.style.cursor = 'default';
        if (this.hudTooltip) this.hudTooltip.style.display = 'none';
      }
    }
  }

  onMouseLeave() {
    if (this.hoveredTile) {
      this.hoveredTile.targetScale = 1.0;
      this.hoveredTile = null;
      this.targetSpeed = DEFAULT_ORBITAL_PARAMS.defaultSpeed;
      this.canvas.style.cursor = 'default';
      if (this.hudTooltip) this.hudTooltip.style.display = 'none';
    }
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  onWindowMouseMove(e) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    this.mouseParallax.targetX = (e.clientX - halfW) / halfW;
    this.mouseParallax.targetY = (e.clientY - halfH) / halfH;
  }

  updateHudData(data) {
    const nameEl = document.getElementById('vortexHudName');
    const pingEl = document.getElementById('vortexHudPing');
    const symbolEl = document.getElementById('vortexHudSymbol');
    const priceEl = document.getElementById('vortexHudPrice');
    const changeEl = document.getElementById('vortexHudChange');
    const volEl = document.getElementById('vortexHudVol');

    if (nameEl) nameEl.textContent = data.name;
    if (pingEl) pingEl.textContent = `⚡ ${data.ping}`;
    if (symbolEl) symbolEl.textContent = data.symbol;
    if (priceEl) priceEl.textContent = data.price;
    if (changeEl) {
      changeEl.textContent = `▲ ${data.change}`;
      changeEl.style.color = '#00FFA3';
    }
    if (volEl) volEl.textContent = data.vol24h;
  }

  updateHudPosition(x, y) {
    if (!this.hudTooltip) return;
    const pad = 24;
    let posX = x + pad;
    let posY = y - 65;

    const maxW = this.width - 260;
    if (posX > maxW) posX = x - 270;
    if (posY < 10) posY = 15;

    this.hudTooltip.style.transform = `translate(${posX}px, ${posY}px)`;
  }

  onClick() {
    if (this.hoveredTile && !this.isWarping) {
      const data = this.hoveredTile.data;
      this.isWarping = true;
      this.container.classList.add('vortex-warp-active');

      if (this.hudTooltip) {
        this.hudTooltip.innerHTML = `
          <div style="color: #FFD700; font-weight: 800; font-size: 14px; text-align: center; padding: 12px 0;">
            🚀 ĐANG PHÓNG VÀO BUỒNG LÁI ${data.name}...
          </div>
        `;
      }

      setTimeout(() => {
        const symbolParam = (data.symbol || 'BTC/USDT').replace('/', '_');
        window.location.href = `trade.html?exchange=${data.id}&pair=${symbolParam}`;
      }, 400);
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

    // Luôn đảm bảo kích thước canvas khớp với container thực tế
    if (this.container && (this.container.clientWidth !== this.width || this.container.clientHeight !== this.height)) {
      if (this.container.clientWidth > 0 && this.container.clientHeight > 0) {
        this.updateDimensions();
      }
    }

    const now = performance.now();
    const delta = Math.min((now - this.lastTimestamp) / 1000, 0.05);
    this.lastTimestamp = now;

    // Cập nhật tốc độ & thời gian
    this.currentSpeed = lerp(this.currentSpeed, this.targetSpeed, 0.08);
    this.elapsedTime += delta * this.currentSpeed;

    // Cập nhật Parallax
    this.mouseParallax.x = lerp(this.mouseParallax.x, this.mouseParallax.targetX, 0.05);
    this.mouseParallax.y = lerp(this.mouseParallax.y, this.mouseParallax.targetY, 0.05);

    // Vẽ toàn bộ Scene 3D
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2 + 10;

    // Xóa khung hình với nền trong suốt
    ctx.clearRect(0, 0, w, h);

    // Camera offset từ Parallax chuột
    const camX = this.mouseParallax.x * 0.45;
    const camY = -this.mouseParallax.y * 0.35;

    // ========================================================
    // 1. TÍNH TOÁN TỌA ĐỘ VÀ SẮP XẾP ĐỘ SÂU (DEPTH SORTING)
    // ========================================================
    const renderList = [];

    // A. 12 Khối Sàn Giao Dịch 3D
    this.tiles.forEach(tile => {
      // Nội suy kích thước scale khi hover
      tile.scale = lerp(tile.scale, tile.targetScale, 0.14);

      // Tọa độ elip xoắn ốc 3D chuẩn phương trình Chương XV
      const pos = calculateOrbitalPosition(
        tile.index,
        tile.total,
        this.elapsedTime,
        1.0,
        DEFAULT_ORBITAL_PARAMS
      );

      // Chiếu phối cảnh (Perspective Projection)
      const worldX = pos.x - camX;
      const worldY = pos.y - camY;
      const worldZ = pos.z + this.cameraDistance;

      const scale = this.focalLength / worldZ;
      const screenX = cx + worldX * scale;
      const screenY = cy - worldY * scale;
      const baseSize = 82;
      const screenSize = baseSize * (scale / 80) * tile.scale;

      tile.screenX = screenX;
      tile.screenY = screenY;
      tile.screenSize = screenSize;
      tile.depthZ = worldZ;

      renderList.push({
        type: 'tile',
        z: worldZ,
        tile: tile,
        screenX: screenX,
        screenY: screenY,
        screenSize: screenSize,
        scale: scale
      });
    });

    // B. Bàn tay lượng tử 3D trung tâm (Cyber Hand)
    // Bàn tay nằm ở trung tâm (Z = cameraDistance, tức là giữa vòng xoay)
    const handWorldZ = this.cameraDistance;
    renderList.push({
      type: 'cyberHand',
      z: handWorldZ,
      screenX: cx - camX * (this.focalLength / handWorldZ),
      screenY: cy + 30 + camY * (this.focalLength / handWorldZ),
      scale: this.focalLength / handWorldZ
    });

    // C. Hạt bụi vàng vũ trụ (Stardust Particles)
    this.stardust.forEach(p => {
      p.angle -= 0.008 * p.speed; // Xoay ngược chiều tạo luồng lốc xoáy
      const px = p.radius * Math.cos(p.angle);
      const pz = (p.radius * 0.78) * Math.sin(p.angle);
      const py = p.y + Math.sin(this.elapsedTime * 2 + p.pulseOffset) * 0.12;

      const worldX = px - camX;
      const worldY = py - camY;
      const worldZ = pz + this.cameraDistance;

      const scale = this.focalLength / worldZ;
      const sx = cx + worldX * scale;
      const sy = cy - worldY * scale;

      renderList.push({
        type: 'stardust',
        z: worldZ,
        sx: sx,
        sy: sy,
        size: p.size * (scale / 80),
        isCyan: p.isCyan
      });
    });

    // Sắp xếp các đối tượng theo thứ tự từ xa đến gần (Painter's Algorithm)
    renderList.sort((a, b) => b.z - a.z);

    // ========================================================
    // 2. VẼ TOÀN BỘ CÁC ĐỐI TƯỢNG THEO THỨ TỰ ĐỘ SÂU
    // ========================================================
    renderList.forEach(item => {
      if (item.type === 'stardust') {
        this.renderStardustParticle(ctx, item);
      } else if (item.type === 'cyberHand') {
        this.renderCyberHand(ctx, item.screenX, item.screenY, item.scale);
      } else if (item.type === 'tile') {
        this.renderExchangeTile(ctx, item);
      }
    });
  }

  renderStardustParticle(ctx, p) {
    if (p.size <= 0.2) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.isCyan ? 'rgba(0, 240, 255, 0.75)' : 'rgba(255, 215, 0, 0.85)';
    ctx.shadowColor = p.isCyan ? '#00F0FF' : '#FFD700';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  renderExchangeTile(ctx, item) {
    const tile = item.tile;
    const sx = item.screenX;
    const sy = item.screenY;
    const size = item.screenSize;
    const half = size / 2;

    ctx.save();

    // 1. Bóng đổ 3D đen tự nhiên dưới khối
    ctx.beginPath();
    ctx.roundRect(sx - half, sy - half + 6, size, size, size * 0.22);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 18;
    ctx.fill();

    // 2. Độ dày cạnh viền 3D (Chamfered Beveled Slabs)
    const bevelThickness = Math.max(3, 7 * (size / 80));
    ctx.beginPath();
    ctx.roundRect(sx - half, sy - half + bevelThickness, size, size, size * 0.22);
    const rimGrad = ctx.createLinearGradient(sx - half, sy, sx + half, sy);
    rimGrad.addColorStop(0, '#111827');
    rimGrad.addColorStop(0.5, '#F59E0B');
    rimGrad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // 3. Mặt trước: Vẽ Texture Canvas Logo độ phân giải cao
    ctx.beginPath();
    ctx.roundRect(sx - half, sy - half, size, size, size * 0.22);
    ctx.clip();

    ctx.drawImage(tile.texture, sx - half, sy - half, size, size);

    // 4. Viền kim loại nổi và hiệu ứng phát sáng khi Hover
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(sx - half, sy - half, size, size, size * 0.22);

    if (tile.targetScale > 1.05) {
      // Khi Hover: Viền vàng kim hoặc Neon rực rỡ
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = tile.data.accentColor || '#FFD700';
      ctx.shadowColor = tile.data.accentColor || '#FFD700';
      ctx.shadowBlur = 24;
      ctx.stroke();

      // Vạch sáng quét qua mặt (Shimmer Glint)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Dựng Bàn Tay Lượng Tử 3D Trung Tâm (Obsidian & 24K Gold Quantum Hand)
   * Vươn lên giữa vòng xoáy theo phối cảnh hoàn mỹ của ảnh tham chiếu.
   */
  renderCyberHand(ctx, hx, hy, scale) {
    ctx.save();

    const t = this.elapsedTime;
    const breatheY = Math.sin(t * 1.8) * 4;
    const baseY = hy + 85 + breatheY;
    const s = scale / 80; // Tỉ lệ co giãn theo camera

    // ========================================================
    // A. HAI VÒNG HÀO QUANG VÀNG KIM XOAY QUANH BÀN TAY (AURA RINGS)
    // ========================================================
    const ringRadiusX = 85 * s;
    const ringRadiusY = 24 * s;

    // Vòng 1: Nghiêng trái
    ctx.save();
    ctx.translate(hx, baseY - 60 * s);
    ctx.rotate(0.35 + Math.sin(t * 0.8) * 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRadiusX, ringRadiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.65)';
    ctx.lineWidth = 2.5 * s;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 16 * s;
    ctx.stroke();
    ctx.restore();

    // Vòng 2: Nghiêng phải đối xứng
    ctx.save();
    ctx.translate(hx, baseY - 90 * s);
    ctx.rotate(-0.42 - Math.sin(t * 0.8) * 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRadiusX * 0.85, ringRadiusY * 0.85, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
    ctx.lineWidth = 2.0 * s;
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 14 * s;
    ctx.stroke();
    ctx.restore();

    // ========================================================
    // B. CẲNG TAY HỢP KIM OBSIDIAN & PISTON VÀNG (FOREARM)
    // ========================================================
    const armW = 44 * s;
    const armH = 130 * s;

    // Bóng đổ cẳng tay
    ctx.beginPath();
    ctx.roundRect(hx - armW / 2, baseY, armW, armH, 8 * s);
    const armGrad = ctx.createLinearGradient(hx - armW / 2, baseY, hx + armW / 2, baseY);
    armGrad.addColorStop(0, '#0a0d14');
    armGrad.addColorStop(0.3, '#1c2433');
    armGrad.addColorStop(0.5, '#2e3b52'); // Ánh kim loại specular
    armGrad.addColorStop(0.7, '#141a26');
    armGrad.addColorStop(1, '#05070a');
    ctx.fillStyle = armGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fill();

    // 2 Piston thủy lực mạ vàng 2 bên
    const pW = 5 * s;
    const pGrad = ctx.createLinearGradient(0, baseY, 0, baseY + armH);
    pGrad.addColorStop(0, '#FFD700');
    pGrad.addColorStop(0.5, '#FFF2A3');
    pGrad.addColorStop(1, '#B8860B');

    ctx.fillStyle = pGrad;
    ctx.fillRect(hx - armW / 2 - pW - 2, baseY + 15 * s, pW, armH - 30 * s);
    ctx.fillRect(hx + armW / 2 + 2, baseY + 15 * s, pW, armH - 30 * s);

    // Vành cổ tay mạ vàng (Wrist Ring Collar)
    ctx.beginPath();
    ctx.roundRect(hx - armW / 2 - 4 * s, baseY - 6 * s, armW + 8 * s, 12 * s, 4 * s);
    ctx.fillStyle = pGrad;
    ctx.fill();

    // ========================================================
    // C. KHỚP NỐI CỔ TAY VÀ KHỐI LÒNG BÀN TAY (PALM CHASSIS)
    // ========================================================
    const palmW = 58 * s;
    const palmH = 55 * s;
    const palmY = baseY - palmH;

    // Khối lòng bàn tay vát cạnh
    ctx.beginPath();
    ctx.moveTo(hx - palmW / 2 + 6 * s, palmY);
    ctx.lineTo(hx + palmW / 2 - 6 * s, palmY);
    ctx.lineTo(hx + palmW / 2 + 4 * s, palmY + palmH);
    ctx.lineTo(hx - palmW / 2 - 4 * s, palmY + palmH);
    ctx.closePath();

    const palmGrad = ctx.createLinearGradient(hx - palmW / 2, palmY, hx + palmW / 2, palmY);
    palmGrad.addColorStop(0, '#0d111a');
    palmGrad.addColorStop(0.4, '#242f44');
    palmGrad.addColorStop(0.6, '#3a4a6b');
    palmGrad.addColorStop(1, '#090c12');
    ctx.fillStyle = palmGrad;
    ctx.fill();

    // Tấm giáp mu bàn tay vàng kim (Golden Armor Plate)
    ctx.beginPath();
    ctx.roundRect(hx - palmW / 2 + 10 * s, palmY + 8 * s, palmW - 20 * s, palmH - 16 * s, 6 * s);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 1.5 * s;
    ctx.stroke();

    // Lõi năng lượng lượng tử phát quang Cyan ở tâm bàn tay
    ctx.beginPath();
    ctx.arc(hx, palmY + palmH / 2, 7 * s, 0, Math.PI * 2);
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 18 * s;
    ctx.fill();

    // ========================================================
    // D. NĂM NGÓN TAY CƠ HỌC KHỚP NỐI VƯƠN LÊN (5 ARTICULATED FINGERS)
    // ========================================================
    const fingerDefs = [
      { name: 'Thumb', x: hx - 28 * s, y: palmY + 30 * s, angle: -0.65, len: 44 * s },
      { name: 'Index', x: hx - 18 * s, y: palmY + 2 * s, angle: -0.18, len: 72 * s },
      { name: 'Middle', x: hx - 2 * s, y: palmY - 2 * s, angle: -0.04, len: 78 * s },
      { name: 'Ring', x: hx + 14 * s, y: palmY + 4 * s, angle: 0.12, len: 70 * s },
      { name: 'Pinky', x: hx + 26 * s, y: palmY + 12 * s, angle: 0.32, len: 54 * s }
    ];

    fingerDefs.forEach(f => {
      this.drawArticulatedFinger(ctx, f.x, f.y, f.angle, f.len, s);
    });

    ctx.restore();
  }

  drawArticulatedFinger(ctx, startX, startY, baseAngle, totalLen, s) {
    const p1Len = totalLen * 0.42;
    const p2Len = totalLen * 0.34;
    const p3Len = totalLen * 0.28;
    const w = 7.5 * s;

    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(baseAngle);

    // Đốt 1 (Gốc)
    ctx.beginPath();
    ctx.roundRect(-w / 2, -p1Len, w, p1Len, 3 * s);
    ctx.fillStyle = '#1c2433';
    ctx.fill();

    // Khớp vàng 1
    ctx.beginPath();
    ctx.arc(0, -p1Len, w / 2 + 1 * s, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 6 * s;
    ctx.fill();

    // Đốt 2 (Giữa)
    ctx.translate(0, -p1Len);
    ctx.rotate(-0.1); // Uốn cong nhẹ tự nhiên
    ctx.beginPath();
    ctx.roundRect(-w * 0.42, -p2Len, w * 0.84, p2Len, 3 * s);
    ctx.fillStyle = '#263247';
    ctx.fill();

    // Khớp vàng 2
    ctx.beginPath();
    ctx.arc(0, -p2Len, w * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    // Đốt 3 (Đầu ngón tay vuốt nhọn mạ vàng)
    ctx.translate(0, -p2Len);
    ctx.rotate(-0.14);
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, 0);
    ctx.lineTo(w * 0.35, 0);
    ctx.lineTo(0, -p3Len);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10 * s;
    ctx.fill();

    ctx.restore();
  }

  destroy() {
    this.pause();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.onMouseMoveBound);
      this.canvas.removeEventListener('mouseleave', this.onMouseLeaveBound);
      this.canvas.removeEventListener('click', this.onClickBound);
    }
    window.removeEventListener('mousemove', this.onWindowMouseMoveBound);

    if (this.hudTooltip && this.hudTooltip.parentNode) {
      this.hudTooltip.parentNode.removeChild(this.hudTooltip);
      this.hudTooltip = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
    this.tiles = [];
  }
}
