/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XXIV: SIÊU TRẠM MENU NĂNG LƯỢNG LƯỢNG TỬ ĐA TẦNG (QUANTUM REACTOR CORE)
   Three.js Cylindrical Holographic Reactor · Volumetric Equalizer Bars · Trendline
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class QuantumReactorEngine {
  constructor(canvasId = 'coreReactorCanvas') {
    this.canvasId = canvasId;
    this.canvas = null;
    this.container = null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.barGroup = null;
    this.trendTube = null;
    this.glassCylinder = null;
    this.bars = [];
    this.cyanCoreLight = null;
    this.orangeBaseLight = null;

    this.rafId = null;
    this.resizeHandler = null;
  }

  async init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) {
      console.warn('[QuantumReactorEngine] Canvas not found:', this.canvasId);
      return;
    }
    this.container = this.canvas.parentElement;

    if (typeof THREE === 'undefined') {
      await this.loadThreeScript();
    }
    if (typeof THREE === 'undefined') {
      console.error('[QuantumReactorEngine] Three.js runtime unavailable.');
      return;
    }

    this.buildScene();
    this.buildLighting();
    this.buildChamber();
    this.buildBars();
    this.buildTrendline();
    this.buildPedestal();
    this.startLoop();

    console.log('[ApexCore] ⚡ Quantum Reactor Core V17 đã khởi chạy thành công 60 FPS.');
  }

  loadThreeScript() {
    return new Promise((resolve) => {
      if (typeof THREE !== 'undefined') return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => resolve();
      script.onerror = () => {
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
    const w = this.container.clientWidth || 440;
    const h = this.container.clientHeight || 620;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 1.2, 5.2);
    this.camera.lookAt(0, 0.2, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.resizeHandler = () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const nw = this.container.clientWidth;
      const nh = this.container.clientHeight;
      if (nw && nh) {
        this.camera.aspect = nw / nh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(nw, nh);
      }
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x0a1526, 1.8);
    this.scene.add(ambientLight);

    this.cyanCoreLight = new THREE.PointLight(0x00f0ff, 3.5, 10);
    this.cyanCoreLight.position.set(0, 2.0, 0);
    this.scene.add(this.cyanCoreLight);

    this.orangeBaseLight = new THREE.PointLight(0xff7700, 4.0, 8);
    this.orangeBaseLight.position.set(0, -1.5, 0);
    this.scene.add(this.orangeBaseLight);

    const magentaRimLight = new THREE.PointLight(0xff007f, 3.0, 12);
    magentaRimLight.position.set(0, 0, -2.5);
    this.scene.add(magentaRimLight);
  }

  buildChamber() {
    // Trụ thủy tinh pha lê trong suốt
    const glassGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.4, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      side: THREE.DoubleSide
    });
    this.glassCylinder = new THREE.Mesh(glassGeo, glassMat);
    this.scene.add(this.glassCylinder);

    // Nắp trên & đế dưới titan
    const capGeo = new THREE.CylinderGeometry(1.28, 1.28, 0.18, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0a1220,
      metalness: 0.9,
      roughness: 0.2
    });

    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = 1.75;
    this.scene.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, capMat);
    bottomCap.position.y = -1.75;
    this.scene.add(bottomCap);

    // Vòng đèn neon cyan trên nắp
    const ringGeo = new THREE.TorusGeometry(1.25, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const topRing = new THREE.Mesh(ringGeo, ringMat);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 1.68;
    this.scene.add(topRing);

    // Cổ áo titan viền xanh dưới đáy trụ kính (Telemetry Collar)
    const collarGeo = new THREE.CylinderGeometry(1.22, 1.25, 0.45, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x060c18,
      metalness: 0.9,
      roughness: 0.2
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = -1.72;
    this.scene.add(collar);

    // Vòng phát sáng xanh ngọc trên cổ đáy
    const collarRingGeo = new THREE.TorusGeometry(1.24, 0.025, 16, 64);
    const collarRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const collarRing = new THREE.Mesh(collarRingGeo, collarRingMat);
    collarRing.rotation.x = Math.PI / 2;
    collarRing.position.y = -1.5;
    this.scene.add(collarRing);
  }

  buildBars() {
    this.barGroup = new THREE.Group();
    this.scene.add(this.barGroup);

    this.bars = [];
    const barCount = 18;
    const barWidth = 0.12;

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 0.45 + (i % 3) * 0.22;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const baseHeight = 0.6 + Math.random() * 1.4;

      const barGeo = new THREE.BoxGeometry(barWidth, baseHeight, barWidth);
      const isOrange = i % 2 === 0;
      const barColor = isOrange ? 0xff7700 : 0xff007f;

      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: barColor,
        emissiveIntensity: 0.75,
        roughness: 0.3,
        metalness: 0.8
      });

      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(x, -0.6 + baseHeight / 2, z);
      bar.userData = {
        baseY: -0.6,
        origHeight: baseHeight,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.005
      };

      this.barGroup.add(bar);
      this.bars.push(bar);
    }
  }

  buildTrendline() {
    const curvePoints = [];
    for (let i = 0; i <= 24; i++) {
      const theta = (i / 24) * Math.PI * 2;
      const px = Math.cos(theta) * 0.9;
      const pz = Math.sin(theta) * 0.9;
      const py = Math.sin(i * 0.8) * 0.45 - 0.2;
      curvePoints.push(new THREE.Vector3(px, py, pz));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.015, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.85 });
    this.trendTube = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.trendTube);
  }

  buildPedestal() {
    // Đĩa bệ tối màu
    const daisGeo = new THREE.CylinderGeometry(2.3, 2.6, 0.35, 32);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x040810,
      metalness: 0.95,
      roughness: 0.15
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = -2.1;
    this.scene.add(dais);

    // Vòng phát quang tím UV neon chiếu xuống sàn
    const purpleRingGeo = new THREE.TorusGeometry(2.55, 0.05, 16, 64);
    const purpleRingMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const purpleRing = new THREE.Mesh(purpleRingGeo, purpleRingMat);
    purpleRing.rotation.x = Math.PI / 2;
    purpleRing.position.y = -2.25;
    this.scene.add(purpleRing);

    // Dải lụa năng lượng Plasma cam uốn lượn (Undulating Plasma Accelerator Ribbon)
    this.plasmaGroup = new THREE.Group();
    this.scene.add(this.plasmaGroup);

    const ribbonPoints = [];
    const count = 48;
    for (let i = 0; i <= count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const r = 1.75 + Math.sin(theta * 3) * 0.22;
      const rx = Math.cos(theta) * r;
      const rz = Math.sin(theta) * r;
      const ry = -1.68 + Math.sin(theta * 2) * 0.18;
      ribbonPoints.push(new THREE.Vector3(rx, ry, rz));
    }
    const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints, true);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 64, 0.045, 10, true);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xff7700,
      emissive: 0xff5500,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      metalness: 0.6
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.plasmaGroup.add(ribbonMesh);

    // 2 Nút lò phản ứng vi mô màu vàng kim gắn trên dải plasma (Mini Arc Reactor Nodes)
    const nodeAngles = [Math.PI * 0.35, Math.PI * 1.35];
    nodeAngles.forEach(ang => {
      const nr = 1.82;
      const nx = Math.cos(ang) * nr;
      const nz = Math.sin(ang) * nr;
      const ny = -1.68 + Math.sin(ang * 2) * 0.18;

      const nodeRingGeo = new THREE.TorusGeometry(0.14, 0.03, 16, 32);
      const nodeRingMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const nodeRing = new THREE.Mesh(nodeRingGeo, nodeRingMat);
      nodeRing.position.set(nx, ny, nz);
      nodeRing.lookAt(0, ny, 0);

      const nodeCoreGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const nodeCoreMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
      const nodeCore = new THREE.Mesh(nodeCoreGeo, nodeCoreMat);
      nodeCore.position.set(nx, ny, nz);

      this.plasmaGroup.add(nodeRing);
      this.plasmaGroup.add(nodeCore);
    });

    // Các hạt bụi năng lượng phát sáng lơ lửng trong trụ (Holographic Spark Particles)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 45;
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const pTheta = Math.random() * Math.PI * 2;
      const pRadius = Math.random() * 0.95;
      posArr[i] = Math.cos(pTheta) * pRadius;
      posArr[i + 1] = -1.2 + Math.random() * 2.6;
      posArr[i + 2] = Math.sin(pTheta) * pRadius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.particleSystem = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particleSystem);
  }

  startLoop() {
    const animateCore = () => {
      if (!this.scene || !this.camera || !this.renderer) return;
      const time = Date.now();

      // Xoay nhẹ nhàng các thành phần
      if (this.barGroup) this.barGroup.rotation.y += 0.004;
      if (this.trendTube) this.trendTube.rotation.y -= 0.003;
      if (this.glassCylinder) this.glassCylinder.rotation.y += 0.0015;
      if (this.plasmaGroup) this.plasmaGroup.rotation.y += 0.002;
      if (this.particleSystem) this.particleSystem.rotation.y -= 0.001;

      // Co giãn chiều cao các cột nến 3D theo nhịp thị trường
      this.bars.forEach(b => {
        const u = b.userData;
        const wave = Math.sin(time * u.speed + u.phase);
        const newScale = 0.6 + (wave + 1) * 0.5;
        b.scale.y = newScale;
        b.position.y = u.baseY + (u.origHeight * newScale) / 2;
      });

      // Nhịp thở ánh sáng năng lượng
      if (this.cyanCoreLight) this.cyanCoreLight.intensity = 3.0 + Math.sin(time * 0.004) * 1.2;
      if (this.orangeBaseLight) this.orangeBaseLight.intensity = 3.5 + Math.cos(time * 0.004) * 1.0;

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(animateCore);
    };

    this.rafId = requestAnimationFrame(animateCore);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
    this.plasmaGroup = null;
    this.particleSystem = null;
    this.bars = [];
    console.log('[ApexCore] ⚡ Quantum Reactor Core destroyed.');
  }
}
