/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XXXII: HATOM-INSPIRED IMMERSIVE 3D WEBGL CINEMATIC CORE
   Benchmark: hatom.com (Awwwards SOTD by Immersive Garden)
   Three.js WebGL · Procedural Sound Engine · Click-and-Hold Charge · 5 Chapters
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class HatomQuantumEngine {
  constructor(containerId = 'hatomQuantumViewport') {
    this.containerId = containerId;
    this.container = null;
    this.canvas = null;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rafId = null;

    // 3D Objects
    this.coreGroup = null;
    this.innerPlasma = null;
    this.crystalShell = null;
    this.gyroscopicRings = [];
    this.laserBeacon = null;
    this.particleCloud = null;
    this.satelliteNodes = [];
    this.connectingBeams = [];
    this.shockwaveMesh = null;

    // Lights
    this.coreLight = null;
    this.cyanLight = null;
    this.magentaLight = null;

    // Camera choreography & chapters
    this.currentChapter = 1;
    this.targetCameraPos = { x: 0, y: 1.2, z: 6.8 };
    this.targetCameraLook = { x: 0, y: 0.2, z: 0 };
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Click & Hold (Long-Press Charge Mechanic)
    this.isHolding = false;
    this.holdProgress = 0; // 0 to 1
    this.holdSpeed = 0.018; // ~1.5s to full charge
    this.isHyperdrive = false;

    // Sound Synthesizer (Web Audio API)
    this.audioCtx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.chargeOsc = null;
    this.chargeGain = null;
    this.soundEnabled = true;

    // Bindings
    this.onResize = this.handleResize.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
  }

  async init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.warn('[HatomEngine] Container not found:', this.containerId);
      return;
    }

    this.canvas = document.getElementById('hatomCanvas');
    if (!this.canvas) {
      console.warn('[HatomEngine] Canvas not found: hatomCanvas');
      return;
    }

    if (typeof THREE === 'undefined') {
      await this.loadThreeScript();
    }
    if (typeof THREE === 'undefined') {
      console.error('[HatomEngine] Three.js runtime unavailable.');
      return;
    }

    this.buildScene();
    this.buildLights();
    this.buildStarfield();
    this.buildQuantumCore();
    this.buildGyroscopicRings();
    this.buildSatellites();
    this.buildLaserBeacon();
    this.buildShockwave();
    this.initAudioContext();
    this.initInteractionEvents();
    this.startRenderLoop();

    console.log('[ApexCore] 🌌 Hatom-Inspired Immersive 3D Engine V17 đã khởi chạy thành công 60-120 FPS.');
  }

  loadThreeScript() {
    return new Promise((resolve) => {
      if (typeof THREE !== 'undefined') return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }

  buildScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020409, 0.045);

    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || 780;

    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 1000);
    this.camera.position.set(this.targetCameraPos.x, this.targetCameraPos.y, this.targetCameraPos.z);
    this.camera.lookAt(this.targetCameraLook.x, this.targetCameraLook.y, this.targetCameraLook.z);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  buildLights() {
    const ambientLight = new THREE.AmbientLight(0x0a1424, 1.6);
    this.scene.add(ambientLight);

    // Điểm sáng vàng kim từ tâm lõi
    this.coreLight = new THREE.PointLight(0xf0b90b, 5.0, 15);
    this.coreLight.position.set(0, 0.3, 0);
    this.scene.add(this.coreLight);

    // Điểm sáng cyan viền ngoài
    this.cyanLight = new THREE.PointLight(0x00f0ff, 4.2, 20);
    this.cyanLight.position.set(3.5, 2.5, 3.5);
    this.scene.add(this.cyanLight);

    // Điểm sáng magenta ngược sáng (Cinematic Rim)
    this.magentaLight = new THREE.PointLight(0xff007f, 3.8, 18);
    this.magentaLight.position.set(-3.5, -2.0, -3.0);
    this.scene.add(this.magentaLight);
  }

  buildStarfield() {
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 2;

      // Pha màu: Cyan, Gold, Violet
      const choice = Math.random();
      if (choice < 0.45) {
        colors[i] = 0.0; colors[i + 1] = 0.94; colors[i + 2] = 1.0; // Cyan
      } else if (choice < 0.8) {
        colors[i] = 0.94; colors[i + 1] = 0.72; colors[i + 2] = 0.04; // Gold
      } else {
        colors[i] = 0.85; colors[i + 1] = 0.2; colors[i + 2] = 1.0; // Magenta
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particleCloud = new THREE.Points(starGeo, starMat);
    this.scene.add(this.particleCloud);
  }

  buildQuantumCore() {
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    // 1. LÕI NĂNG LƯỢNG NÓNG CHẢY BÊN TRONG (MOLTEN PLASMA SINGULARITY)
    const plasmaGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const plasmaMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.8
    });
    this.innerPlasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    this.coreGroup.add(this.innerPlasma);

    // 2. VỎ PHA LÊ LƯỢNG TỬ KHÚC XẠ BÊN NGOÀI (PRISMATIC CRYSTAL SHELL)
    const shellGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.94,
      ior: 1.55,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    this.crystalShell = new THREE.Mesh(shellGeo, shellMat);
    this.coreGroup.add(this.crystalShell);

    // 3. VÒNG HÀO QUANG NỘI TẠI
    const haloGeo = new THREE.RingGeometry(0.95, 1.4, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    this.coreGroup.add(halo);
  }

  buildGyroscopicRings() {
    this.gyroscopicRings = [];

    // VÒNG 1: VÀNG HOÀNG GIA (24K GOLD RING)
    const ring1Geo = new THREE.TorusGeometry(1.95, 0.038, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xf0b90b,
      emissive: 0xf0b90b,
      emissiveIntensity: 0.7,
      metalness: 0.95,
      roughness: 0.15
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = 0.85;
    ring1.userData = { rx: 0.008, ry: 0.012, rz: 0.004 };
    this.coreGroup.add(ring1);
    this.gyroscopicRings.push(ring1);

    // VÒNG 2: CYAN LƯỢNG TỬ (QUANTUM CYAN RING)
    const ring2Geo = new THREE.TorusGeometry(2.45, 0.032, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = 1.15;
    ring2.userData = { rx: -0.005, ry: 0.009, rz: 0.014 };
    this.coreGroup.add(ring2);
    this.gyroscopicRings.push(ring2);

    // VÒNG 3: MAGENTA / UV VIOLET RING
    const ring3Geo = new THREE.TorusGeometry(2.95, 0.028, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 0.75,
      metalness: 0.85,
      roughness: 0.25
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = 0.75;
    ring3.userData = { rx: 0.011, ry: -0.006, rz: 0.007 };
    this.coreGroup.add(ring3);
    this.gyroscopicRings.push(ring3);
  }

  buildSatellites() {
    this.satelliteNodes = [];
    this.connectingBeams = [];

    const exchangeData = [
      { name: 'BINANCE', color: 0xf0b90b, slug: 'binance', price: '$98,420.50', chg: '+4.2%', icon: '❖' },
      { name: 'OKX', color: 0xffffff, slug: 'okx', price: '$3,410.80', chg: '+3.8%', icon: '⬛' },
      { name: 'BYBIT', color: 0xf7a600, slug: 'bybit', price: '$218.40', chg: '+6.1%', icon: '🟧' },
      { name: 'COINBASE', color: 0x3b82f6, slug: 'coinbase', price: '$98,435.10', chg: '+4.1%', icon: '🔵' },
      { name: 'KUCOIN', color: 0x00f0ff, slug: 'kucoin', price: '$18.90', chg: '+5.7%', icon: '🟢' },
      { name: 'HYPERLIQUID', color: 0x00f5d4, slug: 'hyperliquid', price: '$44.15', chg: '+12.4%', icon: '💠' },
      { name: 'KRAKEN', color: 0xa855f7, slug: 'kraken', price: '$98,410.00', chg: '+4.1%', icon: '🟣' },
      { name: 'GATE.IO', color: 0x60a5fa, slug: 'gate', price: '$8.45', chg: '+1.9%', icon: '🔷' }
    ];

    const satCount = exchangeData.length;
    const orbitRadius = 4.1;

    for (let i = 0; i < satCount; i++) {
      const data = exchangeData[i];
      const angle = (i / satCount) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius * 0.75;
      const y = Math.sin(angle * 2) * 0.65;

      const satGroup = new THREE.Group();
      satGroup.position.set(x, y, z);

      // 1. Khối cầu phát sáng nhỏ của vệ tinh
      const sphereGeo = new THREE.SphereGeometry(0.18, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.95,
        roughness: 0.2,
        metalness: 0.7
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      satGroup.add(sphere);

      // 2. Vành tròn vệ tinh
      const diskGeo = new THREE.TorusGeometry(0.32, 0.02, 12, 32);
      const diskMat = new THREE.MeshBasicMaterial({ color: data.color });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.rotation.x = Math.PI / 2;
      satGroup.add(disk);

      satGroup.userData = {
        data: data,
        baseAngle: angle,
        orbitRadius: orbitRadius,
        orbitSpeed: 0.003
      };

      this.scene.add(satGroup);
      this.satelliteNodes.push(satGroup);

      // 3. Tia laser nối từ tâm lõi ra vệ tinh (Connecting Beam)
      const beamCurve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z));
      const beamGeo = new THREE.TubeGeometry(beamCurve, 16, 0.012, 6, false);
      const beamMat = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.45
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      this.scene.add(beam);
      this.connectingBeams.push({ mesh: beam, node: satGroup });
    }
  }

  buildLaserBeacon() {
    // Chùm tia laser lượng tử phóng thẳng đứng lên trời
    const beaconGeo = new THREE.CylinderGeometry(0.05, 0.35, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85
    });
    this.laserBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    this.laserBeacon.position.set(0, 8.5, 0);
    this.coreGroup.add(this.laserBeacon);
  }

  buildShockwave() {
    // Vòng sóng xung kích lượng tử nổ bùng khi nạp đầy năng lượng
    const shockGeo = new THREE.RingGeometry(0.2, 0.45, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.shockwaveMesh = new THREE.Mesh(shockGeo, shockMat);
    this.shockwaveMesh.rotation.x = Math.PI / 2;
    this.scene.add(this.shockwaveMesh);
  }

  // =========================================================================
  // BỘ PHÁT ÂM THANH NỘI VI (PROCEDURAL SCI-FI WEBAUDIO SYNTHESIZER)
  // =========================================================================
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
    } catch (err) {
      console.warn('[HatomAudio] Web Audio API unhandled:', err);
    }
  }

  ensureAudioResumed() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startAmbientSound() {
    if (!this.soundEnabled || !this.audioCtx || this.ambientOsc) return;
    try {
      this.ensureAudioResumed();
      // Tiếng rền lượng tử không gian tần số thấp (Cosmic Sub-Bass Drone 65Hz)
      this.ambientOsc = this.audioCtx.createOscillator();
      this.ambientGain = this.audioCtx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(65, this.audioCtx.currentTime);

      this.ambientGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.06, this.audioCtx.currentTime + 2.5);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.audioCtx.destination);
      this.ambientOsc.start();
    } catch (e) {
      // Audio autoplay policy
    }
  }

  startChargeSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      this.ensureAudioResumed();
      if (this.chargeOsc) {
        this.chargeOsc.stop();
        this.chargeOsc.disconnect();
      }

      this.chargeOsc = this.audioCtx.createOscillator();
      this.chargeGain = this.audioCtx.createGain();

      this.chargeOsc.type = 'triangle';
      // Tần số tăng dần từ 130Hz lên 780Hz khi giữ chuột
      this.chargeOsc.frequency.setValueAtTime(130, this.audioCtx.currentTime);
      this.chargeOsc.frequency.exponentialRampToValueAtTime(820, this.audioCtx.currentTime + 1.5);

      this.chargeGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      this.chargeGain.gain.linearRampToValueAtTime(0.18, this.audioCtx.currentTime + 1.5);

      this.chargeOsc.connect(this.chargeGain);
      this.chargeGain.connect(this.audioCtx.destination);
      this.chargeOsc.start();
    } catch (e) {}
  }

  stopChargeSound() {
    if (!this.chargeGain || !this.audioCtx) return;
    try {
      this.chargeGain.gain.setValueAtTime(this.chargeGain.gain.value, this.audioCtx.currentTime);
      this.chargeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);
      setTimeout(() => {
        if (this.chargeOsc) {
          try { this.chargeOsc.stop(); this.chargeOsc.disconnect(); } catch (e) {}
          this.chargeOsc = null;
        }
      }, 160);
    } catch (e) {}
  }

  playQuantumChime() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      this.ensureAudioResumed();
      // Hòa âm pha lê giải phóng năng lượng (Dual Crystal Sine Chime: 1046Hz & 1318Hz)
      const freqs = [1046.5, 1318.5, 1567.9];
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15 / (idx + 1), this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.8);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.85);
      });
    } catch (e) {}
  }

  // =========================================================================
  // TƯƠNG TÁC CHUỘT & CLICK-AND-HOLD CHARGE (THE HATOM SIGNATURE)
  // =========================================================================
  initInteractionEvents() {
    const chargeBtn = document.getElementById('hatomChargeBtn');
    const ringProgress = document.getElementById('hatomProgressCircle');

    const startCharge = (e) => {
      if (e) e.preventDefault();
      this.isHolding = true;
      this.startChargeSound();
      this.startAmbientSound();
    };

    const endCharge = (e) => {
      if (e) e.preventDefault();
      this.isHolding = false;
      this.stopChargeSound();
    };

    if (chargeBtn) {
      chargeBtn.addEventListener('mousedown', startCharge);
      window.addEventListener('mouseup', endCharge);
      chargeBtn.addEventListener('touchstart', startCharge, { passive: false });
      window.addEventListener('touchend', endCharge);
    }

    // Nút Bật/Tắt Âm Thanh Không Gian
    const soundToggle = document.getElementById('hatomSoundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        soundToggle.innerText = this.soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
        if (this.soundEnabled) this.startAmbientSound();
        else if (this.ambientGain) this.ambientGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
      });
    }

    // Raycaster Click vệ tinh sàn
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, this.camera);
      const meshesToTest = [];
      this.satelliteNodes.forEach(node => {
        node.children.forEach(c => meshesToTest.push({ mesh: c, node: node }));
      });

      const hits = raycaster.intersectObjects(meshesToTest.map(m => m.mesh));
      if (hits.length > 0) {
        const found = meshesToTest.find(m => m.mesh === hits[0].object);
        if (found && found.node.userData.data) {
          const exSlug = found.node.userData.data.slug;
          this.playQuantumChime();
          window.location.href = `trade.html?ex=${exSlug}`;
        }
      }
    });
  }

  handleMouseMove(e) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.mouse.targetX = (e.clientX / w - 0.5) * 1.8;
    this.mouse.targetY = (e.clientY / h - 0.5) * 1.2;
  }

  handleResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const nw = this.container.clientWidth;
    const nh = this.container.clientHeight;
    if (nw && nh) {
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(nw, nh);
    }
  }

  setChapter(chapterNum) {
    this.currentChapter = chapterNum;
    const chapterPositions = {
      1: { pos: { x: 0, y: 1.2, z: 6.8 }, look: { x: 0, y: 0.2, z: 0 } },
      2: { pos: { x: 1.8, y: 0.6, z: 4.8 }, look: { x: 0, y: 0, z: 0 } },
      3: { pos: { x: -3.2, y: 1.8, z: 5.5 }, look: { x: -0.5, y: 0.2, z: 0 } },
      4: { pos: { x: 0, y: 3.5, z: 5.2 }, look: { x: 0, y: -0.5, z: 0 } },
      5: { pos: { x: 0, y: 0.4, z: 3.2 }, look: { x: 0, y: 0.2, z: 0 } }
    };

    const target = chapterPositions[chapterNum] || chapterPositions[1];
    this.targetCameraPos = target.pos;
    this.targetCameraLook = target.look;

    // Cập nhật giao diện menu chương bên ngoài
    document.querySelectorAll('.hatom-nav-step').forEach((el, idx) => {
      if (idx + 1 === chapterNum) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  // =========================================================================
  // VÒNG LẶP RENDER CHÍNH 60-120 FPS
  // =========================================================================
  startRenderLoop() {
    const ringCircle = document.getElementById('hatomProgressCircle');
    const chargeLabel = document.getElementById('hatomChargePercent');

    const animate = () => {
      const time = Date.now();

      // 1. Quản lý trạng thái Click-and-Hold Charge
      if (this.isHolding) {
        this.holdProgress = Math.min(this.holdProgress + this.holdSpeed, 1.0);
      } else {
        this.holdProgress = Math.max(this.holdProgress - this.holdSpeed * 1.5, 0);
      }

      // Cập nhật SVG vòng tròn nạp (Hatom Circular Meter)
      if (ringCircle) {
        const circumference = 2 * Math.PI * 38; // r = 38
        const offset = circumference * (1 - this.holdProgress);
        ringCircle.style.strokeDashoffset = offset;
      }
      if (chargeLabel) {
        chargeLabel.innerText = Math.round(this.holdProgress * 100) + '%';
      }

      // Khi nạp đầy 100% (Full Hyperdrive Trigger)
      if (this.holdProgress >= 1.0 && !this.isHyperdrive) {
        this.isHyperdrive = true;
        this.playQuantumChime();
        this.triggerShockwave();
        setTimeout(() => {
          window.location.href = 'trade.html';
        }, 1200);
      }

      // 2. Nội suy chuyển động chuột mượt mà (Inertia Damping)
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      // 3. Nội suy camera theo chương và con trỏ
      const holdZoom = this.holdProgress * 2.2;
      this.camera.position.x += (this.targetCameraPos.x + this.mouse.x * 0.6 - this.camera.position.x) * 0.04;
      this.camera.position.y += (this.targetCameraPos.y - this.mouse.y * 0.4 - this.camera.position.y) * 0.04;
      this.camera.position.z += (this.targetCameraPos.z - holdZoom - this.camera.position.z) * 0.04;

      this.camera.lookAt(this.targetCameraLook.x, this.targetCameraLook.y, this.targetCameraLook.z);

      // 4. Tốc độ xoay lõi gia tốc theo độ nạp năng lượng
      const speedMultiplier = 1.0 + this.holdProgress * 4.5;

      if (this.coreGroup) {
        this.coreGroup.rotation.y += 0.005 * speedMultiplier;
        this.coreGroup.rotation.x = Math.sin(time * 0.001) * 0.08;
      }

      if (this.innerPlasma) {
        const pulse = 0.85 + Math.sin(time * 0.006 * speedMultiplier) * 0.08;
        this.innerPlasma.scale.set(pulse, pulse, pulse);
        this.innerPlasma.rotation.y -= 0.008 * speedMultiplier;
      }

      if (this.crystalShell) {
        this.crystalShell.rotation.y += 0.004 * speedMultiplier;
        this.crystalShell.rotation.z = Math.cos(time * 0.0015) * 0.12;
      }

      // 5. Xoay 3 vòng hồi chuyển (Gyroscopic Motion)
      this.gyroscopicRings.forEach(ring => {
        const u = ring.userData;
        ring.rotation.x += u.rx * speedMultiplier;
        ring.rotation.y += u.ry * speedMultiplier;
        ring.rotation.z += u.rz * speedMultiplier;
      });

      // 6. Xoay các vệ tinh sàn quanh lõi
      this.satelliteNodes.forEach((node, idx) => {
        const u = node.userData;
        const currentAngle = u.baseAngle + (time * 0.0003 * speedMultiplier * (idx % 2 === 0 ? 1 : -0.8));
        const nx = Math.cos(currentAngle) * u.orbitRadius;
        const nz = Math.sin(currentAngle) * u.orbitRadius * 0.75;
        const ny = Math.sin(currentAngle * 2) * 0.65;
        node.position.set(nx, ny, nz);

        // Cập nhật vị trí tia laser nối
        const beamObj = this.connectingBeams[idx];
        if (beamObj && beamObj.mesh) {
          beamObj.mesh.position.set(nx / 2, ny / 2, nz / 2);
          beamObj.mesh.lookAt(nx, ny, nz);
          beamObj.mesh.scale.z = Math.sqrt(nx * nx + ny * ny + nz * nz) / u.orbitRadius;
        }
      });

      // 7. Nhịp đập Laser Beacon và Starfield
      if (this.laserBeacon) {
        this.laserBeacon.material.opacity = 0.65 + Math.sin(time * 0.008) * 0.3 + this.holdProgress * 0.4;
      }
      if (this.particleCloud) {
        this.particleCloud.rotation.y += 0.0004;
      }

      // 8. Hiệu ứng sóng nổ xung kích (Shockwave expansion)
      if (this.shockwaveMesh && this.shockwaveMesh.material.opacity > 0) {
        this.shockwaveMesh.scale.x += 0.28;
        this.shockwaveMesh.scale.y += 0.28;
        this.shockwaveMesh.material.opacity -= 0.025;
      }

      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  triggerShockwave() {
    if (!this.shockwaveMesh) return;
    this.shockwaveMesh.scale.set(1, 1, 1);
    this.shockwaveMesh.material.opacity = 1.0;
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    if (this.ambientOsc) {
      try { this.ambientOsc.stop(); this.ambientOsc.disconnect(); } catch (e) {}
    }
    if (this.chargeOsc) {
      try { this.chargeOsc.stop(); this.chargeOsc.disconnect(); } catch (e) {}
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
    console.log('[ApexCore] 🌌 Hatom Engine destroyed.');
  }
}
