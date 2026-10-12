/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   SIÊU PHẨM KHỐI RUBIK GIAO DỊCH LƯỢNG TỬ ĐA TẦNG (QUANTUM RUBIK ENGINE)
   Three.js PBR Engine · 26 Cubies · Slice Twist Engine · 60 FPS
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class QuantumRubikEngine {
  constructor(containerId = 'rubikQuantumContainer', canvasId = 'rubikCanvas', tooltipId = 'rubikTooltip') {
    this.containerId = containerId;
    this.canvasId = canvasId;
    this.tooltipId = tooltipId;

    this.container = null;
    this.canvas = null;
    this.tooltip = null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.rubikGroup = null;
    this.pivotGroup = null;
    this.laserPillar = null;
    this.cubies = [];

    this.isTwisting = false;
    this.isHovered = false;
    this.rotSpeedY = 0.0035;
    this.rafId = null;
    this.twistTimeout = null;
    this.resizeHandler = null;

    this.raycaster = null;
    this.mouse = null;
    this.mouseMoveHandler = null;
    this.mouseClickHandler = null;
    this.mouseEnterHandler = null;
    this.mouseLeaveHandler = null;

    this.exchanges = [
      { name: 'BINANCE', color: '#f0b90b', price: '$98,420.50', change: '+4.2%' },
      { name: 'OKX', color: '#ffffff', price: '$3,410.80', change: '+3.8%' },
      { name: 'BYBIT', color: '#f7a600', price: '$712.10', change: '+6.1%' },
      { name: 'COINBASE', color: '#3b82f6', price: '$224.50', change: '+2.4%' },
      { name: 'KUCOIN', color: '#00f0ff', price: '$18.90', change: '+5.7%' },
      { name: 'HYPERLIQUID', color: '#00f5d4', price: '$44.15', change: '+12.4%' },
      { name: 'KRAKEN', color: '#a855f7', price: '$98,410.00', change: '+4.1%' },
      { name: 'GATE.IO', color: '#60a5fa', price: '$8.45', change: '+1.9%' },
      { name: 'APEXCORE', color: '#00ffff', price: '$1,000,000', change: '+99.9%' }
    ];
  }

  async init() {
    this.container = document.getElementById(this.containerId);
    this.canvas = document.getElementById(this.canvasId);
    this.tooltip = document.getElementById(this.tooltipId);

    if (!this.container || !this.canvas) {
      console.warn('[QuantumRubikEngine] Container or Canvas not found.');
      return;
    }

    // Đảm bảo Three.js đã sẵn sàng
    if (typeof THREE === 'undefined') {
      await this.loadThreeScript();
    }

    if (typeof THREE === 'undefined') {
      console.error('[QuantumRubikEngine] Three.js runtime is unavailable.');
      return;
    }

    this.buildScene();
    this.buildLighting();
    this.buildFloor();
    this.buildRubikCube();
    this.buildLaserPillar();
    this.initTwistEngine();
    this.initInteraction();
    this.startLoop();

    console.log('[ApexCore] 🎲 Quantum Rubik Exchange Engine V17 đã khởi chạy thành công 60 FPS.');
  }

  loadThreeScript() {
    return new Promise((resolve) => {
      if (typeof THREE !== 'undefined') return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => resolve();
      script.onerror = () => {
        // Fallback sang local file
        const fallback = document.createElement('script');
        fallback.src = 'scripts/vendor/three.min.js';
        fallback.onload = () => resolve();
        fallback.onerror = () => resolve();
        document.head.appendChild(fallback);
      };
      document.head.appendChild(script);
    });
  }

  buildScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // Trong suốt để hòa quyện hoàn hảo vào nền web tối
    this.scene.fog = new THREE.FogExp2(0x010308, 0.045);

    const w = this.container.clientWidth || 650;
    const h = this.container.clientHeight || 680;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(4.8, 4.2, 5.8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (this.renderer.shadowMap) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap || THREE.BasicShadowMap;
    }
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x1a2638, 1.6);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4.2, 18);
    cyanLight.position.set(3.5, 4.5, 3.5);
    this.scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff007f, 3.6, 18);
    magentaLight.position.set(-3.5, -2, -3.5);
    this.scene.add(magentaLight);

    const goldLight = new THREE.DirectionalLight(0xf0b90b, 1.8);
    goldLight.position.set(0, 7, 2);
    this.scene.add(goldLight);
  }

  buildFloor() {
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x010206,
      roughness: 0.12,
      metalness: 0.95
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.3;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createScreenTexture(ex) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Nền gradient công nghệ titan obsidian
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#0a1222');
    grad.addColorStop(1, '#02050a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Viền phát sáng thương hiệu sàn
    ctx.strokeStyle = ex.color;
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 248, 248);

    // Tên sàn giao dịch
    ctx.fillStyle = ex.color;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ex.name, 128, 45);

    // Biểu đồ nến mini sống động thời gian thực
    for (let i = 0; i < 9; i++) {
      const x = 32 + i * 22;
      const isGreen = Math.random() > 0.38;
      ctx.fillStyle = isGreen ? '#00f5d4' : '#ff3366';
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      const wickTop = 80 + Math.random() * 28;
      const wickBottom = 160 + Math.random() * 28;
      ctx.beginPath();
      ctx.moveTo(x + 7, wickTop);
      ctx.lineTo(x + 7, wickBottom);
      ctx.stroke();

      const bodyTop = wickTop + 10;
      const bodyHeight = 35 + Math.random() * 24;
      ctx.fillRect(x, bodyTop, 14, bodyHeight);
    }

    // Giá giao dịch & Biến động %
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(ex.price, 128, 215);

    ctx.fillStyle = ex.change.startsWith('+') ? '#00f5d4' : '#ff3366';
    ctx.font = '16px monospace';
    ctx.fillText(ex.change, 128, 238);

    const texture = new THREE.CanvasTexture(c);
    return texture;
  }

  buildRubikCube() {
    this.rubikGroup = new THREE.Group();
    this.scene.add(this.rubikGroup);

    this.cubies = [];
    const cubieSize = 0.94;
    const gap = 1.0;
    this.gap = gap;
    const boxGeo = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

    let exIndex = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Khối rỗng ở tâm để tối ưu GPU

          const materials = [];
          for (let side = 0; side < 6; side++) {
            const ex = this.exchanges[(exIndex + side) % this.exchanges.length];
            const screenTex = this.createScreenTexture(ex);
            const mat = new THREE.MeshStandardMaterial({
              map: screenTex,
              roughness: 0.18,
              metalness: 0.85,
              emissive: new THREE.Color(ex.color),
              emissiveIntensity: 0.35
            });
            mat.userData = ex;
            materials.push(mat);
          }
          exIndex++;

          const cubie = new THREE.Mesh(boxGeo, materials);
          cubie.position.set(x * gap, y * gap, z * gap);
          cubie.castShadow = true;
          cubie.receiveShadow = true;
          this.rubikGroup.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  buildLaserPillar() {
    const laserGeo = new THREE.CylinderGeometry(0.05, 0.28, 14, 16);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85
    });
    this.laserPillar = new THREE.Mesh(laserGeo, laserMat);
    this.laserPillar.position.set(0, 8.0, 0);
    this.rubikGroup.add(this.laserPillar);
  }

  initTwistEngine() {
    this.pivotGroup = new THREE.Group();
    this.scene.add(this.pivotGroup);

    const axes = ['x', 'y', 'z'];
    const layers = [-1, 0, 1];

    const twistRandomSlice = () => {
      if (this.isTwisting || !this.scene) return;
      this.isTwisting = true;

      // Ưu tiên tầng giữa Y = 0 để quan sát chuyển động xoay ngang uy lực
      const axis = Math.random() > 0.4 ? 'y' : axes[Math.floor(Math.random() * axes.length)];
      const layer = Math.random() > 0.5 ? 0 : layers[Math.floor(Math.random() * layers.length)];
      const direction = Math.random() > 0.5 ? 1 : -1;
      const targetAngle = (Math.PI / 2) * direction;

      // Lọc 9 cubies thuộc tầng đó
      const activeCubies = this.cubies.filter(c => Math.abs(c.position[axis] - layer * this.gap) < 0.2);

      this.pivotGroup.rotation.set(0, 0, 0);
      activeCubies.forEach(c => {
        this.pivotGroup.attach(c);
      });

      let startTime = null;
      const duration = 2400; // 2.4s xoay từ tốn, cơ học

      const stepTwist = (time) => {
        if (!this.scene) return;
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1.0);

        // Hàm toán học Easing Cubic mượt mà
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.pivotGroup.rotation[axis] = targetAngle * ease;

        if (progress < 1.0) {
          requestAnimationFrame(stepTwist);
        } else {
          this.pivotGroup.updateMatrixWorld();
          activeCubies.forEach(c => {
            this.rubikGroup.attach(c);
            c.position.x = Math.round(c.position.x / this.gap) * this.gap;
            c.position.y = Math.round(c.position.y / this.gap) * this.gap;
            c.position.z = Math.round(c.position.z / this.gap) * this.gap;
          });
          this.isTwisting = false;

          // Nghỉ 1.8 giây rồi tự động xoay tầng tiếp theo (Vòng lặp vĩnh cửu)
          this.twistTimeout = setTimeout(twistRandomSlice, 1800);
        }
      };

      requestAnimationFrame(stepTwist);
    };

    this.twistTimeout = setTimeout(twistRandomSlice, 1200);
  }

  initInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.mouseEnterHandler = () => {
      this.isHovered = true;
      this.rotSpeedY = 0.0008; // Xoay cực chậm khi rê chuột
    };

    this.mouseLeaveHandler = () => {
      this.isHovered = false;
      this.rotSpeedY = 0.0035; // Trở lại tốc độ tự nhiên
      if (this.tooltip) this.tooltip.style.display = 'none';
    };

    this.mouseMoveHandler = (e) => {
      if (!this.canvas || !this.camera) return;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cubies);

      if (intersects.length > 0 && this.tooltip) {
        const hit = intersects[0];
        const mat = hit.object.material[hit.face.materialIndex];
        if (mat && mat.userData && mat.userData.name) {
          this.tooltip.style.display = 'block';
          this.tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
          this.tooltip.style.top = (e.clientY - rect.top - 20) + 'px';
          this.tooltip.innerHTML = `
            <div style="font-weight: 800; color: ${mat.userData.color}; font-size: 14px; margin-bottom: 4px;">❖ ${mat.userData.name}</div>
            <div style="color: #ffffff; font-size: 13px;">Giá: <strong>${mat.userData.price}</strong></div>
            <div style="color: #00f5d4; font-size: 12px; margin-bottom: 6px;">24h: <strong>${mat.userData.change}</strong></div>
            <div style="color: #94a3b8; font-size: 10px; border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 4px;">⚡ Nhấp để mở trạm giao dịch</div>
          `;
        }
      } else if (this.tooltip) {
        this.tooltip.style.display = 'none';
      }
    };

    this.mouseClickHandler = () => {
      if (!this.camera) return;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cubies);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const mat = hit.object.material[hit.face.materialIndex];
        if (mat && mat.userData && mat.userData.name) {
          const exSlug = mat.userData.name.toLowerCase();
          window.location.href = `trade.html?ex=${exSlug}`;
        }
      }
    };

    this.canvas.addEventListener('mouseenter', this.mouseEnterHandler);
    this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('click', this.mouseClickHandler);

    this.resizeHandler = () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w && h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  startLoop() {
    const renderLoop = () => {
      if (!this.scene || !this.camera || !this.renderer) return;

      if (!this.isHovered && this.rubikGroup) {
        this.rubikGroup.rotation.y += this.rotSpeedY;
        this.rubikGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.12;
      }

      if (this.laserPillar) {
        this.laserPillar.material.opacity = 0.65 + Math.sin(Date.now() * 0.005) * 0.25;
      }

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(renderLoop);
    };

    this.rafId = requestAnimationFrame(renderLoop);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.twistTimeout) clearTimeout(this.twistTimeout);

    if (this.canvas) {
      if (this.mouseEnterHandler) this.canvas.removeEventListener('mouseenter', this.mouseEnterHandler);
      if (this.mouseLeaveHandler) this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
      if (this.mouseMoveHandler) this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
      if (this.mouseClickHandler) this.canvas.removeEventListener('click', this.mouseClickHandler);
    }
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
    this.cubies = [];
    console.log('[ApexCore] 🎲 Quantum Rubik Exchange Engine destroyed.');
  }
}
