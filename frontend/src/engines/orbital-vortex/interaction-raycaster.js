/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV: BỘ TƯƠNG TÁC TIA CHUỘT & VI TRẮC THỜI GIAN THỰC (RAYCASTER HUD)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class InteractionRaycaster {
  constructor(container, camera, tilesList, onHoverChange) {
    this.container = container;
    this.camera = camera;
    this.tilesList = tilesList;
    this.onHoverChange = onHoverChange;

    this.mouse = null;
    this.raycaster = null;
    this.hoveredTile = null;
    this.hudTooltip = null;
    this.isWarping = false;

    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onClickBound = this.onClick.bind(this);
    this.onMouseLeaveBound = this.onMouseLeave.bind(this);

    this.init();
  }

  init() {
    if (typeof THREE !== 'undefined' && THREE.Raycaster && THREE.Vector2) {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
    }
    this.createHudElement();
    this.container.addEventListener('mousemove', this.onMouseMoveBound);
    this.container.addEventListener('click', this.onClickBound);
    this.container.addEventListener('mouseleave', this.onMouseLeaveBound);
  }

  createHudElement() {
    this.hudTooltip = document.createElement('div');
    this.hudTooltip.className = 'vortex-hud-tooltip';
    this.hudTooltip.style.display = 'none';
    this.hudTooltip.innerHTML = `
      <div class="hud-top-row">
        <span class="hud-badge-name" id="vortexHudName">BINANCE</span>
        <span class="hud-badge-ping" id="vortexHudPing">⚡ 12ms</span>
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

  onMouseMove(event) {
    if (this.isWarping) return;
    const rect = this.container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;

    if (this.mouse) {
      this.mouse.set(x, y);
    }

    if (!this.raycaster || !this.camera) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = this.tilesList.map(t => t.mesh).filter(Boolean);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      let hitMesh = intersects[0].object;
      // Tìm mesh cha chứa userData
      while (hitMesh && !hitMesh.userData?.isExchangeTile && hitMesh.parent) {
        hitMesh = hitMesh.parent;
      }

      if (hitMesh && hitMesh.userData?.isExchangeTile) {
        if (this.hoveredTile !== hitMesh) {
          this.setHovered(hitMesh);
        }
        this.updateHudPosition(event.clientX - rect.left, event.clientY - rect.top);
        return;
      }
    }

    if (this.hoveredTile) {
      this.clearHover();
    }
  }

  setHovered(mesh) {
    this.hoveredTile = mesh;
    mesh.userData.targetScale = 1.25;
    this.container.style.cursor = 'pointer';

    if (mesh.userData.wireframe) {
      mesh.userData.wireframe.material.opacity = 0.95;
    }

    this.updateHudData(mesh.userData);
    if (this.hudTooltip) {
      this.hudTooltip.style.display = 'block';
    }

    if (this.onHoverChange) {
      this.onHoverChange(mesh);
    }
  }

  clearHover() {
    if (this.hoveredTile) {
      this.hoveredTile.userData.targetScale = 1.0;
      if (this.hoveredTile.userData.wireframe) {
        this.hoveredTile.userData.wireframe.material.opacity = 0.45;
      }
    }
    this.hoveredTile = null;
    this.container.style.cursor = 'default';
    if (this.hudTooltip) {
      this.hudTooltip.style.display = 'none';
    }
    if (this.onHoverChange) {
      this.onHoverChange(null);
    }
  }

  onMouseLeave() {
    this.clearHover();
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
    const pad = 20;
    let posX = x + pad;
    let posY = y - 70;

    const maxW = this.container.clientWidth - 260;
    if (posX > maxW) posX = x - 270;
    if (posY < 10) posY = 15;

    this.hudTooltip.style.transform = `translate(${posX}px, ${posY}px)`;
  }

  onClick() {
    if (this.hoveredTile && !this.isWarping) {
      const data = this.hoveredTile.userData;
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
      }, 420);
    }
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.onMouseMoveBound);
    this.container.removeEventListener('click', this.onClickBound);
    this.container.removeEventListener('mouseleave', this.onMouseLeaveBound);
    if (this.hudTooltip && this.hudTooltip.parentNode) {
      this.hudTooltip.parentNode.removeChild(this.hudTooltip);
    }
  }
}
