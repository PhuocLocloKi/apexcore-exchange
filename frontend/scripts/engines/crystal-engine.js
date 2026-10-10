/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — 3D CRYSTAL ENGINE
 * (frontend/scripts/engines/crystal-engine.js)
 * Bộ dựng 3D Tinh thể Kim Cương Tối Cao & Vòng xoáy Lượng tử Torus
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * Security Clearance: LEVEL 9 GODMODE · SOVEREIGN SEED
 * ========================================================
 */

(function () {
  'use strict';

  // Chống xung đột / nạp lại
  if (window.CrystalEngine) return;

  class SovereignCrystalEngine {
    constructor() {
      this.mode = 'GOD'; // 'GOD' | 'ECO'
      this.isRunning = true;
      this.animFrameId = null;

      // 3D Canvas Contexts
      this.mainCanvas = null;
      this.funnelCanvas = null;
      this.miniLogoCanvas = null;

      // Three.js instances
      this.mainRenderer = null;
      this.mainScene = null;
      this.mainCamera = null;
      this.crystalMesh = null;
      this.crystalWire = null;
      this.torusPoints = null;
      this.synapseLines = null;

      // Funnel Scene
      this.funnelRenderer = null;
      this.funnelScene = null;
      this.funnelCamera = null;
      this.funnelCone = null;
      this.funnelParticles = null;

      // Mini Logo Scene
      this.miniRenderer = null;
      this.miniScene = null;
      this.miniCamera = null;
      this.miniMesh = null;

      // Timers & clock
      this.clockTime = 0;
      this.volatilitySpeed = 1.0;

      // Palette tokens
      this.colors = {
        gold: 0xFFD700,
        emerald: 0x00FFA3,
        cyan: 0x00F0FF,
        ruby: 0xFF3366,
        purple: 0x8A2BE2
      };
    }

    /**
     * Khởi tạo bộ máy 3D toàn diện
     */
    init() {
      this.mainCanvas = document.getElementById('crystal-canvas');
      this.funnelCanvas = document.getElementById('funnel-canvas');
      this.miniLogoCanvas = document.getElementById('mini-logo-canvas');

      if (!this.mainCanvas) {
        console.warn('[CrystalEngine] Không tìm thấy canvas #crystal-canvas');
        return;
      }

      // Kiểm tra sự sẵn sàng của Three.js
      if (typeof THREE !== 'undefined') {
        this.initThreeScenes();
      } else {
        // Fallback thuần WebGL / Canvas2.5D siêu mượt nếu Three.js đang tải hoặc offline
        this.initCanvasFallback();
      }

      // Lắng nghe sự kiện từ EventBus
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.MODE_CHANGED, (mode) => {
          this.setMode(mode);
        });

        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, (trade) => {
          this.pulseVolatility(trade.isWhale ? 2.5 : 1.4);
        });
      }

      // Xử lý co giãn màn hình tự động
      window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Khởi tạo các Scene Three.js
     */
    initThreeScenes() {
      try {
        this.setupMainCrystalScene();
        this.setupFunnelScene();
        this.setupMiniLogoScene();
        this.startLoop();
      } catch (err) {
        console.error('[CrystalEngine] Lỗi khởi tạo Three.js:', err);
        this.initCanvasFallback();
      }
    }

    /**
     * PHÂN KHU 4: SOVEREIGN DIAMOND CRYSTAL & NEURAL TORUS MANIFOLD
     */
    setupMainCrystalScene() {
      const container = this.mainCanvas.parentElement;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 380;

      this.mainScene = new THREE.Scene();
      this.mainCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.mainCamera.position.set(0, 0, 16);

      this.mainRenderer = new THREE.WebGLRenderer({
        canvas: this.mainCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.mainRenderer.setSize(width, height);
      this.mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Khối Tinh Thể Kim Cương Đa Diện Bất Khả Thi (Sacred Geometry Icosahedron)
      const crystalGeo = new THREE.IcosahedronGeometry(2.5, 0);

      // Custom Shader Material: Khúc xạ quang học & tán sắc cầu vồng (Chromatic Dispersion)
      const customShader = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

            // Dải màu Hoàng Gia & Xanh Ngọc
            vec3 gold = vec3(1.0, 0.843, 0.0);       // #FFD700
            vec3 emerald = vec3(0.0, 1.0, 0.639);    // #00FFA3
            vec3 cyan = vec3(0.0, 0.941, 1.0);       // #00F0FF

            // Tán sắc khúc xạ cầu vồng
            float dispersion = sin(dot(vNormal, vec3(1.0, 2.0, 3.0)) * 3.5 + uTime * 2.2) * 0.5 + 0.5;
            vec3 color = mix(gold, emerald, dispersion);
            color = mix(color, cyan, fresnel * 0.75);

            // Nhịp thở phát quang
            float pulse = 0.88 + 0.12 * sin(uTime * 1.8);
            gl_FragColor = vec4(color * (fresnel * 0.85 + 0.55) * pulse, 0.92);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      });

      this.crystalMesh = new THREE.Mesh(crystalGeo, customShader);
      this.mainScene.add(this.crystalMesh);

      // Khung viền kim cương Vàng Kim Hoàng Gia
      const wireGeo = new THREE.WireframeGeometry(crystalGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: this.colors.gold,
        transparent: true,
        opacity: 0.85,
        linewidth: 1.5
      });
      this.crystalWire = new THREE.LineSegments(wireGeo, wireMat);
      this.mainScene.add(this.crystalWire);

      // 2. Vòng xoáy 1,500 Hạt Lượng Tử Torus (Torus Manifold - 1 Draw Call Duy Nhất)
      const particleCount = 1500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const R = 5.6; // Bán kính vòng lớn
      const r = 1.8; // Bán kính mặt cắt

      const colorPalette = [
        new THREE.Color(this.colors.gold),
        new THREE.Color(this.colors.emerald),
        new THREE.Color(this.colors.cyan),
        new THREE.Color(this.colors.ruby),
        new THREE.Color(this.colors.purple)
      ];

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;

        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        const z = r * Math.sin(v);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const col = colorPalette[i % colorPalette.length];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      const torusBuffer = new THREE.BufferGeometry();
      torusBuffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      torusBuffer.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Hạt phát sáng điểm tròn
      const canvasSprite = document.createElement('canvas');
      canvasSprite.width = 16;
      canvasSprite.height = 16;
      const ctx = canvasSprite.getContext('2d');
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(0,255,163,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      const spriteTex = new THREE.CanvasTexture(canvasSprite);

      const pointsMat = new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        map: spriteTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.torusPoints = new THREE.Points(torusBuffer, pointsMat);
      this.mainScene.add(this.torusPoints);

      // 3. Sợi chỉ nơ-ron (Vector Synapses)
      const synapseCount = 36;
      const synapsePositions = new Float32Array(synapseCount * 6);
      for (let i = 0; i < synapseCount; i++) {
        // Điểm đầu từ tâm kim cương
        const angle = (i / synapseCount) * Math.PI * 2;
        synapsePositions[i * 6] = Math.cos(angle) * 1.5;
        synapsePositions[i * 6 + 1] = Math.sin(angle) * 1.5;
        synapsePositions[i * 6 + 2] = (Math.random() - 0.5) * 1.5;

        // Điểm cuối nối tới Torus
        synapsePositions[i * 6 + 3] = Math.cos(angle) * 5.2;
        synapsePositions[i * 6 + 4] = Math.sin(angle) * 5.2;
        synapsePositions[i * 6 + 5] = (Math.random() - 0.5) * 2.0;
      }

      const synapseGeo = new THREE.BufferGeometry();
      synapseGeo.setAttribute('position', new THREE.BufferAttribute(synapsePositions, 3));
      const synapseMat = new THREE.LineBasicMaterial({
        color: this.colors.cyan,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      this.synapseLines = new THREE.LineSegments(synapseGeo, synapseMat);
      this.mainScene.add(this.synapseLines);
    }

    /**
     * PHÂN KHU 6: 3D RESOLUTION FUNNEL (PHỄU XÁC SUẤT NÓN ELIP WIREFRAME)
     */
    setupFunnelScene() {
      if (!this.funnelCanvas) return;
      const container = this.funnelCanvas.parentElement;
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 200;

      this.funnelScene = new THREE.Scene();
      this.funnelCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      this.funnelCamera.position.set(0, 1.5, 7.5);
      this.funnelCamera.lookAt(0, 0, 0);

      this.funnelRenderer = new THREE.WebGLRenderer({
        canvas: this.funnelCanvas,
        alpha: true,
        antialias: true
      });
      this.funnelRenderer.setSize(width, height);
      this.funnelRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Khung lưới hình nón elip
      const coneGeo = new THREE.ConeGeometry(2.4, 4.2, 18, 12, true);
      coneGeo.rotateX(Math.PI / 2);
      const coneWire = new THREE.WireframeGeometry(coneGeo);
      const coneMat = new THREE.LineBasicMaterial({
        color: this.colors.cyan,
        transparent: true,
        opacity: 0.35
      });
      this.funnelCone = new THREE.LineSegments(coneWire, coneMat);
      this.funnelScene.add(this.funnelCone);

      // Các hạt quỹ đạo hội tụ tương lai
      const fParticleCount = 180;
      const fPositions = new Float32Array(fParticleCount * 3);
      for (let i = 0; i < fParticleCount; i++) {
        const t = Math.random(); // vị trí từ đáy tới đỉnh
        const z = (t - 0.5) * 4.0;
        const rad = (1.0 - t) * 2.2;
        const theta = Math.random() * Math.PI * 2;
        fPositions[i * 3] = Math.cos(theta) * rad;
        fPositions[i * 3 + 1] = Math.sin(theta) * rad * 0.6; // hình elip
        fPositions[i * 3 + 2] = z;
      }

      const fGeo = new THREE.BufferGeometry();
      fGeo.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));
      const fMat = new THREE.PointsMaterial({
        color: this.colors.emerald,
        size: 0.12,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      this.funnelParticles = new THREE.Points(fGeo, fMat);
      this.funnelScene.add(this.funnelParticles);
    }

    /**
     * TOP HUD: LOGO 3D TINH THỂ KIM CƯƠNG MINI KHÔNG VIỀN (32x32)
     */
    setupMiniLogoScene() {
      if (!this.miniLogoCanvas) return;
      const size = 32;

      this.miniScene = new THREE.Scene();
      this.miniCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
      this.miniCamera.position.set(0, 0, 4.2);

      this.miniRenderer = new THREE.WebGLRenderer({
        canvas: this.miniLogoCanvas,
        alpha: true,
        antialias: true
      });
      this.miniRenderer.setSize(size, size);
      this.miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const miniGeo = new THREE.OctahedronGeometry(1.0, 0);
      const miniMat = new THREE.MeshBasicMaterial({
        color: this.colors.gold,
        wireframe: true
      });
      this.miniMesh = new THREE.Mesh(miniGeo, miniMat);
      this.miniScene.add(this.miniMesh);
    }

    /**
     * Vòng lặp dựng hình 60/120Hz
     */
    startLoop() {
      const render = () => {
        if (!this.isRunning) return;

        this.animFrameId = requestAnimationFrame(render);
        this.clockTime += 0.016 * this.volatilitySpeed;

        // Trả dần tốc độ biến động về bình thường
        if (this.volatilitySpeed > 1.0) {
          this.volatilitySpeed = Math.max(1.0, this.volatilitySpeed - 0.01);
        }

        // Cập nhật Main Crystal Scene
        if (this.mainRenderer && this.mainScene) {
          // Nhịp thở Breathing Animation
          const breathScale = 1.0 + 0.045 * Math.sin(this.clockTime * 2.0);
          if (this.crystalMesh) {
            this.crystalMesh.scale.set(breathScale, breathScale, breathScale);
            this.crystalMesh.rotation.y += 0.007;
            this.crystalMesh.rotation.x = Math.sin(this.clockTime * 0.7) * 0.18;
            if (this.crystalMesh.material.uniforms) {
              this.crystalMesh.material.uniforms.uTime.value = this.clockTime;
            }
          }

          if (this.crystalWire) {
            this.crystalWire.scale.set(breathScale * 1.01, breathScale * 1.01, breathScale * 1.01);
            this.crystalWire.rotation.y += 0.007;
            this.crystalWire.rotation.x = Math.sin(this.clockTime * 0.7) * 0.18;
          }

          // Xoay kép Torus
          if (this.torusPoints) {
            this.torusPoints.rotation.z += 0.003;
            this.torusPoints.rotation.x = Math.sin(this.clockTime * 0.4) * 0.25;
            this.torusPoints.rotation.y += 0.002;
          }

          if (this.synapseLines) {
            this.synapseLines.rotation.z += 0.003;
          }

          this.mainRenderer.render(this.mainScene, this.mainCamera);
        }

        // Cập nhật Funnel Scene
        if (this.funnelRenderer && this.funnelScene) {
          if (this.funnelCone) {
            this.funnelCone.rotation.z += 0.005;
          }
          if (this.funnelParticles) {
            this.funnelParticles.rotation.z += 0.008;
          }
          this.funnelRenderer.render(this.funnelScene, this.funnelCamera);
        }

        // Cập nhật Mini Logo Scene
        if (this.miniRenderer && this.miniScene) {
          if (this.miniMesh) {
            this.miniMesh.rotation.y += 0.02;
            this.miniMesh.rotation.x += 0.01;
          }
          this.miniRenderer.render(this.miniScene, this.miniCamera);
        }
      };

      this.animFrameId = requestAnimationFrame(render);
    }

    /**
     * Fallback Canvas 2D/2.5D tuyệt đẹp nếu WebGL/Three.js chưa sẵn sàng
     */
    initCanvasFallback() {
      if (!this.mainCanvas) return;
      const ctx = this.mainCanvas.getContext('2d');
      const w = this.mainCanvas.width = this.mainCanvas.parentElement.clientWidth || 800;
      const h = this.mainCanvas.height = this.mainCanvas.parentElement.clientHeight || 380;

      const fallbackRender = () => {
        if (!this.isRunning) return;
        this.animFrameId = requestAnimationFrame(fallbackRender);
        this.clockTime += 0.02;

        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;

        // Vẽ hào quang
        const radGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
        radGrad.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
        radGrad.addColorStop(0.5, 'rgba(0, 255, 163, 0.15)');
        radGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);

        // Vẽ 120 hạt Torus 2.5D
        const pCount = 240;
        for (let i = 0; i < pCount; i++) {
          const u = (i / pCount) * Math.PI * 2 + this.clockTime * 0.4;
          const v = i * 0.1 + this.clockTime;
          const rBig = 140;
          const rSmall = 40;
          const px = cx + (rBig + rSmall * Math.cos(v)) * Math.cos(u);
          const py = cy + (rBig + rSmall * Math.cos(v)) * Math.sin(u) * 0.4;

          ctx.fillStyle = (i % 2 === 0) ? '#00FFA3' : '#FFD700';
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vẽ Kim Cương Octahedron 2.5D
        const size = 55 + Math.sin(this.clockTime * 2.0) * 4;
        const angle = this.clockTime * 0.8;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(Math.cos(angle) * size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-Math.cos(angle) * size, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#00FFA3';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.moveTo(-Math.cos(angle) * size, 0);
        ctx.lineTo(Math.cos(angle) * size, 0);
        ctx.stroke();
        ctx.restore();
      };

      fallbackRender();
    }

    /**
     * Tăng tốc độ biến động khi có lệnh lớn khớp
     */
    pulseVolatility(factor = 1.5) {
      this.volatilitySpeed = Math.min(3.5, this.volatilitySpeed * factor);
    }

    /**
     * Công tắc Chế độ Kép: GOD MODE (🌌) vs ECO MODE (⚡)
     */
    setMode(newMode) {
      this.mode = newMode;
      const isGod = (newMode === 'GOD');

      if (isGod) {
        document.body.classList.remove('ecomode-active');
        document.body.classList.add('godmode-active');
        this.isRunning = true;
        if (!this.animFrameId) {
          if (typeof THREE !== 'undefined' && this.mainScene) {
            this.startLoop();
          } else {
            this.initCanvasFallback();
          }
        }
      } else {
        // ECO MODE: Tạm dừng vòng lặp, giải phóng CPU < 2%
        document.body.classList.remove('godmode-active');
        document.body.classList.add('ecomode-active');
        this.isRunning = false;
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
      }
    }

    /**
     * Điều chỉnh kích thước khung nhìn
     */
    handleResize() {
      if (this.mainRenderer && this.mainCamera && this.mainCanvas) {
        const container = this.mainCanvas.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.mainCamera.aspect = w / h;
        this.mainCamera.updateProjectionMatrix();
        this.mainRenderer.setSize(w, h);
      }

      if (this.funnelRenderer && this.funnelCamera && this.funnelCanvas) {
        const container = this.funnelCanvas.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;
        this.funnelCamera.aspect = w / h;
        this.funnelCamera.updateProjectionMatrix();
        this.funnelRenderer.setSize(w, h);
      }
    }
  }

  // Khởi tạo instance
  window.CrystalEngine = new SovereignCrystalEngine();

  // Tự động gắn vào DOM khi trang sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.CrystalEngine.init());
  } else {
    window.CrystalEngine.init();
  }
})();
