/**
 * ========================================================
 * APEXCORE CYBER-QUANTUM TERMINAL — 3D QUANTUM HEART & GREEKS ENGINE
 * (frontend/scripts/engines/crystal-engine.js)
 * Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
 * Security Clearance: LEVEL 9 GODMODE · SOVEREIGN SEED
 *
 * PHIÊN BẢN V5 ĐỘC LẬP TỐI CAO:
 * 1. Khôi phục 100% "Trái Tim Quả Cầu 3D" Torus Mesh Heatmap & Golden Aperture Ring
 * 2. Lấp đầy ô [06] Greeks Field (Volatility Funnel 3D) & Hawkes Cascade
 * 3. Dải sóng dòng tiền ròng Net Exposure đối xứng trục 0
 * 4. Không bao giờ bị đen sì màn hình — Luôn chạy mượt mà 60-120 FPS
 * ========================================================
 */

(function () {
  'use strict';

  if (window.CrystalEngine) return;

  // Cấu hình Kích Thước & Điều Khiển 3D Interactive Torus (crystal-engine.js)
  const TORUS_CONFIG = {
    radius: 165,            // Phóng to kích thước tổng thể
    tube: 62,               // Độ dày thân ống quả cầu
    radialSegments: 28,     // Lưới đa giác mịn hơn
    tubularSegments: 56,    // Độ cong tròn mượt mà
    goldenRingRadius: 52,   // Vòng nhẫn vàng kim to rõ ở tâm
    enableMouseDrag: true,  // Bật tính năng kéo xoay 360 độ
    enableWheelZoom: true,  // Bật tính năng lăn chuột phóng to/thu nhỏ
    autoRotateSpeed: 0.003  // Tốc độ tự quay êm ái khi thả chuột
  };
  window.TORUS_CONFIG = TORUS_CONFIG;

  class SovereignQuantumCoreEngine {
    constructor() {
      // Canvases
      this.mainCanvas = null;
      this.mainCtx = null;
      this.funnelCanvas = null;
      this.funnelCtx = null;
      this.miniLogoCanvas = null;
      this.miniCtx = null;
      this.waveCanvas = null;
      this.waveCtx = null;

      // Trạng thái vận hành
      this.isRunning = true;
      this.isEcoMode = false;
      this.animFrameId = null;
      this.clockTime = 0;
      this.wavePhase = 0;
      this.volatilitySpeed = 1.0;

      // 3D Orbit & Zoom Controls (V8 Interactive Upgrade)
      this.userRotX = 0;
      this.userRotY = 0;
      this.targetRotX = 0;
      this.targetRotY = 0;
      this.autoRotAngle = 0;
      this.userZoom = 1.0;
      this.targetZoom = 1.0;
      this.isDragging = false;
      this.dragVelocityX = 0;
      this.dragVelocityY = 0;

      // Bảng màu Lượng tử Tối Thượng
      this.colors = {
        gold: '#FFD700',
        emerald: '#00FFA3',
        cyan: '#00F0FF',
        ruby: '#FF3366',
        navy: '#0A192F',
        purple: '#8A2BE2'
      };

      // 1,500 Hạt lượng tử
      this.particles = [];
      this.initParticleField();

      // Hawkes Cascade Nodes
      this.hawkesNodes = [];
      this.initHawkesNodes();
    }

    initParticleField() {
      const pCount = 320;
      this.particles = [];
      const colorChoices = ['#FFD700', '#00FFA3', '#00F0FF', '#FF3366', '#B026FF'];

      for (let i = 0; i < pCount; i++) {
        this.particles.push({
          u: Math.random() * Math.PI * 2,
          v: Math.random() * Math.PI * 2,
          speedU: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
          speedV: Math.random() * 0.02 + 0.01,
          size: Math.random() * 1.8 + 0.8,
          color: colorChoices[Math.floor(Math.random() * colorChoices.length)],
          alpha: Math.random() * 0.7 + 0.3
        });
      }

      // Hạt bụi vàng lượng tử xoay tròn theo quỹ đạo vòng nhẫn Aperture Ring
      this.ringParticles = [];
      for (let i = 0; i < 64; i++) {
        this.ringParticles.push({
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.02 + 0.015),
          radiusVariance: (Math.random() - 0.5) * 8,
          size: Math.random() * 1.6 + 0.8,
          alpha: Math.random() * 0.7 + 0.3
        });
      }
    }

    initHawkesNodes() {
      this.hawkesNodes = [];
      for (let i = 0; i < 42; i++) {
        this.hawkesNodes.push({
          x: (Math.random() - 0.5) * 160,
          y: (Math.random() - 0.5) * 80,
          z: Math.random() * 80 + 10,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          pulse: Math.random(),
          color: Math.random() > 0.4 ? '#00FFA3' : '#FFD700'
        });
      }
    }

    init() {
      this.mainCanvas = document.getElementById('crystal-canvas');
      this.funnelCanvas = document.getElementById('funnel-canvas');
      this.miniLogoCanvas = document.getElementById('mini-logo-canvas');
      this.waveCanvas = document.getElementById('net-exposure-wave-canvas');

      if (this.mainCanvas) this.mainCtx = this.mainCanvas.getContext('2d');
      if (this.funnelCanvas) this.funnelCtx = this.funnelCanvas.getContext('2d');
      if (this.miniLogoCanvas) this.miniCtx = this.miniLogoCanvas.getContext('2d');
      if (this.waveCanvas) this.waveCtx = this.waveCanvas.getContext('2d');

      this.handleResize();
      this.initMouseOrbitControls();

      // Đăng ký EventBus
      if (window.ApexEventBus) {
        window.ApexEventBus.on(window.ApexEvents.MODE_CHANGED, (mode) => {
          this.setMode(mode);
        });

        window.ApexEventBus.on(window.ApexEvents.TRADE_EXECUTED, (trade) => {
          this.pulseVolatility(trade.isWhale ? 2.5 : 1.3);
        });

        window.ApexEventBus.on('ASSET_SWITCHED', () => {
          this.pulseVolatility(2.0);
        });
      }

      window.addEventListener('resize', () => this.handleResize());
      this.startLoop();
      console.log('[CrystalEngine V8] Trái Tim 3D Torus & Interactive Orbit Controls đã khởi động hoàn mỹ.');
    }

    /**
     * TÍCH HỢP TƯƠNG TÁC CHUỘT 3D (MOUSE ORBIT & ZOOM CONTROLS)
     * - Mouse Click & Drag: xoay 360 độ tự do theo mọi hướng
     * - Mouse Wheel Zoom: lăn chuột phóng to / thu nhỏ chi tiết
     * - Auto-Resume Smooth Idle Rotation: phục hồi nhịp tự quay êm ái khi buông chuột
     */
    initMouseOrbitControls() {
      const canvas = this.mainCanvas;
      if (!canvas) return;

      canvas.style.cursor = 'grab';

      let isDown = false;
      let startX = 0;
      let startY = 0;

      const onStart = (clientX, clientY) => {
        if (!TORUS_CONFIG.enableMouseDrag) return;
        isDown = true;
        this.isDragging = true;
        startX = clientX;
        startY = clientY;
        this.dragVelocityX = 0;
        this.dragVelocityY = 0;
        canvas.classList.add('grabbing');
        canvas.style.cursor = 'grabbing';
      };

      const onMove = (clientX, clientY) => {
        if (!isDown || !TORUS_CONFIG.enableMouseDrag) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        startX = clientX;
        startY = clientY;

        this.dragVelocityX = dx * 0.007;
        this.dragVelocityY = dy * 0.007;

        this.targetRotY += this.dragVelocityX;
        this.targetRotX += this.dragVelocityY;
      };

      const onEnd = () => {
        if (!isDown) return;
        isDown = false;
        this.isDragging = false;
        canvas.classList.remove('grabbing');
        canvas.style.cursor = 'grab';
      };

      // Mouse drag controls
      canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        onStart(e.clientX, e.clientY);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDown) onMove(e.clientX, e.clientY);
      });

      window.addEventListener('mouseup', () => {
        if (isDown) onEnd();
      });

      // Mouse wheel zoom
      canvas.addEventListener('wheel', (e) => {
        if (!TORUS_CONFIG.enableWheelZoom) return;
        e.preventDefault();
        const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
        this.targetZoom = Math.min(Math.max(this.targetZoom + zoomDelta, 0.55), 2.2);
      }, { passive: false });

      // Touch drag controls
      canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          onStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (isDown && e.touches && e.touches.length === 1) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (isDown) onEnd();
      });
    }

    handleResize() {
      const resize = (canvas) => {
        if (!canvas || !canvas.parentElement) return;
        const w = canvas.parentElement.clientWidth || 300;
        const h = canvas.parentElement.clientHeight || 200;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      };

      resize(this.mainCanvas);
      resize(this.funnelCanvas);
      resize(this.waveCanvas);
      if (this.miniLogoCanvas) {
        this.miniLogoCanvas.width = 32;
        this.miniLogoCanvas.height = 32;
      }
    }

    setMode(mode) {
      this.isEcoMode = (mode === 'ECO');
      const banner = document.querySelector('.eco-fallback-banner');
      if (banner) {
        banner.style.display = this.isEcoMode ? 'flex' : 'none';
      }
    }

    pulseVolatility(factor = 1.5) {
      this.volatilitySpeed = factor;
    }

    /**
     * VÒNG LẶP DỰNG HÌNH 60 - 120 FPS
     */
    startLoop() {
      const render = () => {
        if (!this.isRunning) return;
        this.animFrameId = requestAnimationFrame(render);

        this.clockTime += 0.016 * this.volatilitySpeed;
        if (this.volatilitySpeed > 1.0) {
          this.volatilitySpeed = Math.max(1.0, this.volatilitySpeed - 0.015);
        }

        // 3D Orbit Physics & Damping (V8 Smooth Controls)
        this.userRotX += (this.targetRotX - this.userRotX) * 0.12;
        this.userRotY += (this.targetRotY - this.userRotY) * 0.12;
        this.userZoom += (this.targetZoom - this.userZoom) * 0.12;

        if (!this.isDragging) {
          // Quán tính lướt nhẹ khi buông chuột
          this.targetRotX += this.dragVelocityY;
          this.targetRotY += this.dragVelocityX;
          this.dragVelocityX *= 0.90;
          this.dragVelocityY *= 0.90;

          // Tự động quay nhẹ nhàng khi thả chuột (Auto-Resume Smooth Idle Rotation)
          this.autoRotAngle += TORUS_CONFIG.autoRotateSpeed * this.volatilitySpeed;
        }

        // 1. Dựng Trái Tim 3D Torus & Vòng Nhẫn Vàng Kim
        if (!this.isEcoMode) {
          this.renderQuantumTorusHeart();
          this.renderGreeksFunnelField();
          this.renderMiniLogo();
        }

        // 2. Dựng Dải Sóng Dòng Tiền Ròng (Net Exposure Wave)
        this.renderNetExposureWave();
      };

      this.animFrameId = requestAnimationFrame(render);
    }

    /**
     * ========================================================
     * PHẦN 3 & 4: "TRÁI TIM QUẢ CẦU 3D" (THE HEATMAP TORUS CORE)
     * - Volumetric Heatmap Torus Surface Mesh (Cyan/Navy back ➔ Emerald/Gold/Ruby front)
     * - The Central Golden Aperture Ring (#FFD700) dựng đứng ở tâm
     * - Khối Tinh thể Kim Cương ở tâm
     * - 1,500 Hạt lượng tử chuyển động xoắn ốc
     * ========================================================
     */
    renderQuantumTorusHeart() {
      if (!this.mainCtx || !this.mainCanvas) return;
      const ctx = this.mainCtx;
      const w = this.mainCanvas.width;
      const h = this.mainCanvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2 - 8; // Căn giữa tối ưu buồng lái

      const t = this.clockTime;
      const breath = 1.0 + 0.035 * Math.sin(t * 1.8);

      // Tham số Torus hình học chuẩn V8 (+40% Enlarge & Cân Đối Hoàn Hảo)
      const R = TORUS_CONFIG.radius * breath; // 165 * breath (radius: 165)
      const r = TORUS_CONFIG.tube * breath;   // 62 * breath (tube: 62)

      // Góc xoay không gian 3D: Nằm ngang hơn (Oblique Elevation Angle) + Tương tác xoay 360 độ
      const baseElevation = 0.52; // Góc nghiêng nằm ngang bề thế (~30 deg)
      const rotX = baseElevation + this.userRotX + Math.sin(t * 0.25) * 0.04;
      const rotY = this.autoRotAngle + this.userRotY;
      const rotZ = (t * 0.03) + (this.userRotY * 0.08);

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      // Phép chiếu phối cảnh 3D sang 2D kèm Zoom (Mouse Wheel Zoom)
      const project = (x, y, z) => {
        // Xoay Y
        let x1 = x * cosY + z * sinY;
        let y1 = y;
        let z1 = -x * sinY + z * cosY;

        // Xoay X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Xoay Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const fov = 460;
        const scale = (fov / (fov + z3 + 85)) * this.userZoom;
        return {
          px: cx + x3 * scale,
          py: cy + y3 * scale,
          depth: z3,
          scale: scale,
          rawX: x3,
          rawY: y3
        };
      };

      // 1. HÌNH HỌC LƯỚI ĐA GIÁC: 28 VÒNG RADIAL X 56 ĐOẠN TUBULAR
      const uSteps = TORUS_CONFIG.radialSegments; // 28 múi radial
      const vSteps = TORUS_CONFIG.tubularSegments; // 56 đoạn tubular
      const gridPoints = [];

      for (let i = 0; i < uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        gridPoints[i] = [];
        for (let j = 0; j < vSteps; j++) {
          const v = (j / vSteps) * Math.PI * 2;

          // ĐỈNH NHỌN DAO ĐỘNG (VERTEX ELEVATION SPIKES)
          let elevationSpike = 0;
          const upperRimFactor = Math.sin(v);
          if (upperRimFactor > 0.15) {
            const densityWave = Math.sin(u * 6 + t * 2.2) * Math.cos(v * 4 + t * 1.6);
            if (densityWave > 0.12) {
              elevationSpike = Math.pow(densityWave, 1.5) * 18 * (0.85 + 0.35 * Math.sin(t * 3.4));
            }
          }

          const currentR = R + elevationSpike;
          const x = (currentR + r * Math.cos(v)) * Math.cos(u);
          const y = (currentR + r * Math.cos(v)) * Math.sin(u);
          const z = r * Math.sin(v);

          gridPoints[i][j] = project(x, y, z);
        }
      }

      // 2. GRADIENT NHIỆT (HEATMAP SHADERS)
      ctx.lineWidth = 1;
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j += 2) {
          const p1 = gridPoints[i][j];
          const p2 = gridPoints[(i + 1) % uSteps][j];
          const p3 = gridPoints[i][(j + 1) % vSteps];

          let strokeCol;
          if (p1.depth < -15) {
            // Nửa sau: Midnight Cyan bán trong suốt
            strokeCol = 'rgba(0, 150, 255, 0.20)';
          } else {
            // Vành trước & Hố đen trọng lực
            const distFromCenter = Math.hypot(p1.px - cx, p1.py - cy);
            if (distFromCenter < TORUS_CONFIG.goldenRingRadius * breath * this.userZoom) {
              // Lòng trong hố đen trọng lực: Đỏ Ruby & Hồng Magenta
              strokeCol = 'rgba(255, 51, 102, 0.55)';
            } else if (p1.depth > 40) {
              // Vành trước sáng nhất: Vàng Kim #FFB800 / #FFD700
              strokeCol = 'rgba(255, 184, 0, 0.50)';
            } else {
              // Vành trước biên ngoài: Xanh Ngọc Lục Bảo #00FFA3
              strokeCol = 'rgba(0, 255, 163, 0.38)';
            }
          }

          ctx.strokeStyle = strokeCol;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.stroke();
        }
      }

      // 3. VÒNG NHẪN VÀNG KIM APERTURE RING & RESOLUTION AXIS
      // Tăng kích thước Vòng Nhẫn Vàng Kim ở tâm tương ứng từ radius: 38 lên radius: 52
      ctx.save();
      const ringTilt = Math.sin(t * 0.4) * 0.12 + (this.userRotY * 0.08);
      const ringRadX = TORUS_CONFIG.goldenRingRadius * breath * this.userZoom;
      const ringRadY = (TORUS_CONFIG.goldenRingRadius * 1.76) * breath * this.userZoom;

      // Hào quang tỏa sáng rộng
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 36;
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.36)';
      ctx.lineWidth = 8 * this.userZoom;
      ctx.beginPath();
      ctx.ellipse(cx, cy, ringRadX, ringRadY, ringTilt, 0, Math.PI * 2);
      ctx.stroke();

      // Vành nhẫn chính Vàng Kim Rực Rỡ (#FFE600)
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#FFE600';
      ctx.lineWidth = 3.6 * this.userZoom;
      ctx.beginPath();
      ctx.ellipse(cx, cy, ringRadX * 0.85, ringRadY * 0.88, ringTilt, 0, Math.PI * 2);
      ctx.stroke();

      // Vành trong tâm sáng trắng vàng
      ctx.strokeStyle = 'rgba(255, 255, 240, 0.88)';
      ctx.lineWidth = 1.4 * this.userZoom;
      ctx.beginPath();
      ctx.ellipse(cx, cy, ringRadX * 0.80, ringRadY * 0.84, ringTilt, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // TÂM NGẮM ⌖ & CHỮ PHÁT SÁNG "RESOLUTION AXIS" NGAY DƯỚI CHÂN VÒNG NHẪN
      const axisBottomY = cy + ringRadY + 16 * this.userZoom;
      ctx.save();
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#FFE600';
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 10;
      ctx.fillText('⌖ RESOLUTION AXIS', cx, axisBottomY);
      ctx.restore();

      // HẠT BỤI VÀNG LƯỢNG TỬ XOAY TRÒN THEO QUỸ ĐẠO VÒNG NHẪN
      if (this.ringParticles) {
        ctx.save();
        for (let i = 0; i < this.ringParticles.length; i++) {
          const rp = this.ringParticles[i];
          rp.angle += rp.speed * this.volatilitySpeed;
          const rpRadX = (ringRadX * 0.85 + rp.radiusVariance * this.userZoom);
          const rpRadY = (ringRadY * 0.88 + rp.radiusVariance * 1.5 * this.userZoom);
          const px = cx + rpRadX * Math.cos(rp.angle);
          const py = cy + rpRadY * Math.sin(rp.angle);

          ctx.fillStyle = '#FFE600';
          ctx.shadowColor = '#FFE600';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, rp.size * this.userZoom, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. KHỐI TINH THỂ KIM CƯƠNG ĐA DIỆN Ở TÂM LÒNG NHẪN
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.55);
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#FFE600';
      ctx.lineWidth = 1.5 * this.userZoom;

      const cSize = 16 * breath * this.userZoom;
      ctx.beginPath();
      ctx.moveTo(0, -cSize * 1.5);
      ctx.lineTo(cSize, 0);
      ctx.lineTo(0, cSize * 1.5);
      ctx.lineTo(-cSize, 0);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-cSize, 0);
      ctx.lineTo(cSize, 0);
      ctx.moveTo(0, -cSize * 1.5);
      ctx.lineTo(0, cSize * 1.5);
      ctx.stroke();
      ctx.restore();

      // 5. HẠT LƯỢNG TỬ CHUYỂN ĐỘNG TRÊN BỀ MẶT QUẢ CẦU
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.u += p.speedU * this.volatilitySpeed;
        p.v += p.speedV * this.volatilitySpeed;

        const x = (R + r * Math.cos(p.v)) * Math.cos(p.u);
        const y = (R + r * Math.cos(p.v)) * Math.sin(p.u);
        const z = r * Math.sin(p.v);

        const proj = project(x, y, z);
        if (proj.scale > 0) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, Math.max(0.6, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. CÁC CHỐT SỐ MỐC GÓC XOAY: NHÃN 2:30 VÀ 3:45 ĐÍNH TRỰC TIẾP VÀO MẶT LƯỚI
      const p230 = project(R * Math.cos(Math.PI * 0.35), R * Math.sin(Math.PI * 0.35), r * 0.8);
      const p345 = project(R * Math.cos(Math.PI * 0.72), R * Math.sin(Math.PI * 0.72), -r * 0.5);

      ctx.save();
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 6;
      ctx.fillText('2:30', p230.px + 4, p230.py);
      ctx.fillText('3:45', p345.px + 4, p345.py);
      ctx.restore();

      // 7. 4 MŨI TÊN VECTOR CHỈ TỌA ĐỘ KHÔNG GIAN 3D (VECTOR CALLOUTS)
      // - Cyan trên cùng bên trái: vành trên -> BTC 77,318
      // - Cam bên dưới bên trái: góc dưới -> ETH 2,481
      // - Trắng góc trên bên phải: rìa ngoài bên phải -> SOL 91.66
      // - Vàng bên phải: trục giải quyết -> CHAINLINK 77,299 · RESOLUTION CHARGE · LAG 1.1S
      const drawCallout = (targetX, targetY, labelText, color, offsetX, offsetY, subText = null) => {
        const endX = targetX + offsetX;
        const endY = targetY + offsetY;

        ctx.save();
        // Tâm điểm chấm sáng
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Đường gióng vector có mũi tên
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Mũi tên nhỏ trỏ vào mục tiêu
        const angle = Math.atan2(targetY - endY, targetX - endX);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - 5 * Math.cos(angle - 0.4), targetY - 5 * Math.sin(angle - 0.4));
        ctx.lineTo(targetX - 5 * Math.cos(angle + 0.4), targetY - 5 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();

        // Khung nhãn HUD chữ nhật
        ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(labelText).width;
        const padX = 6;
        const padY = 3;
        const boxW = textWidth + padX * 2;
        const boxH = subText ? 24 : 16;
        const boxX = offsetX > 0 ? endX : endX - boxW;
        const boxY = endY - boxH / 2;

        ctx.fillStyle = 'rgba(7, 12, 22, 0.88)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Chữ nhãn
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(labelText, boxX + padX, boxY + padY);

        if (subText) {
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fillText(subText, boxX + padX, boxY + padY + 11);
        }
        ctx.restore();
      };

      // Tọa độ mục tiêu cho 4 vector callouts
      const btcTarget = project(-R * 0.65, R * 0.75, r * 0.8);
      drawCallout(btcTarget.px, btcTarget.py, 'BTC 77,318', '#00F0FF', -55, -28);

      const ethTarget = project(-R * 0.75, -R * 0.6, -r * 0.6);
      drawCallout(ethTarget.px, ethTarget.py, 'ETH 2,481', '#FF9900', -55, 25);

      const solTarget = project(R * 0.95, R * 0.45, r * 0.5);
      drawCallout(solTarget.px, solTarget.py, 'SOL 91.66', '#FFFFFF', 45, -24);

      const clTarget = { px: cx + ringRadX * 0.85, py: cy + 18 * this.userZoom };
      drawCallout(clTarget.px, clTarget.py, 'CHAINLINK 77,299', '#FFE600', 50, 8, 'RESOLUTION CHARGE · LAG 1.1S');
    }

    /**
     * ========================================================
     * PHẦN 5: LẤP ĐẦY Ô [06] GREEKS FIELD & HAWKES CASCADE
     * - Volatility Funnel 3D: Phễu nón xác suất các vòng elip thu hẹp
     * - Hawkes Cascade: Hạt va chạm mô phỏng quá trình tự kích hoạt lệnh
     * ========================================================
     */
    renderGreeksFunnelField() {
      if (!this.funnelCtx || !this.funnelCanvas) return;
      const ctx = this.funnelCtx;
      const w = this.funnelCanvas.width;
      const h = this.funnelCanvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.42;
      const cy = h / 2;
      const t = this.clockTime;

      // 1. VẼ HÌNH NÓN XÁC SUẤT VOLATILITY FUNNEL 3D (8 VÒNG ELIP THU HẸP)
      const ringCount = 8;
      ctx.save();

      for (let i = 0; i < ringCount; i++) {
        const progress = i / (ringCount - 1);
        const zOffset = (1 - progress) * 90;
        const radiusX = (1 - progress * 0.72) * 58;
        const radiusY = radiusX * 0.46;
        const posX = cx + progress * 75;
        const posY = cy;

        // Gradient màu từ Cyan (#00F0FF) sang Emerald (#00FFA3)
        const alpha = 0.25 + progress * 0.65;
        ctx.strokeStyle = i % 2 === 0 ? `rgba(0, 240, 255, ${alpha})` : `rgba(0, 255, 163, ${alpha})`;
        ctx.lineWidth = 1.2 + progress * 0.8;
        ctx.shadowColor = '#00FFA3';
        ctx.shadowBlur = progress * 8;

        ctx.beginPath();
        ctx.ellipse(posX, posY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Đường sinh Perspective nối các vành
        if (i < ringCount - 1) {
          const nextProg = (i + 1) / (ringCount - 1);
          const nextRadX = (1 - nextProg * 0.72) * 58;
          const nextRadY = nextRadX * 0.46;
          const nextPosX = cx + nextProg * 75;

          ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(posX, posY - radiusY);
          ctx.lineTo(nextPosX, posY - nextRadY);
          ctx.moveTo(posX, posY + radiusY);
          ctx.lineTo(nextPosX, posY + nextRadY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. BIỂU ĐỒ TÁN XẠ HẠT HAWKES CASCADE (SELF-EXCITING FILL FLOW)
      ctx.save();
      for (let i = 0; i < this.hawkesNodes.length; i++) {
        const n = this.hawkesNodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.035;

        if (n.x < -80 || n.x > 80) n.vx *= -1;
        if (n.y < -45 || n.y > 45) n.vy *= -1;

        const nx = (w * 0.76) + n.x;
        const ny = cy + n.y;
        const glow = Math.abs(Math.sin(n.pulse));

        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = glow * 10;
        ctx.beginPath();
        ctx.arc(nx, ny, 1.8 + glow * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Tia shockwave va chạm tự kích hoạt
        if (i % 4 === 0) {
          ctx.strokeStyle = `rgba(255, 215, 0, ${glow * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(nx, ny, 8 * glow, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    /**
     * ========================================================
     * DẢI SÓNG DÒNG TIỀN RÒNG (NET EXPOSURE & DELTA FLOW WAVE)
     * Biểu đồ vùng đối xứng: Trên 0 = Xanh Mua (#00FFA3), Dưới 0 = Đỏ Bán (#FF3366)
     * ========================================================
     */
    /**
     * ========================================================
     * PHẦN 4: VI CẤU TRÚC DẢI SÓNG ĐÁY (DUAL-COLOR AREA WAVE)
     * 15M ROLLING DIRECTIONAL REMAINDER VS OPPOSITE-SIDE HEDGE
     * - Trục số 0 nằm chính giữa với các vạch chia nhỏ 15 phút
     * - Vùng sóng Dương (Trên 0): Màu Xanh Ngọc #00FFA3 độ mờ 40%, viền sáng trắng bạc #E0FFFF dày 1.5px
     * - Vùng sóng Âm (Dưới 0): Màu Đỏ Ruby #FF3366 độ mờ 40%, viền màu đỏ laser
     * - Đường sóng nét đứt màu Cam chạy xuyên suốt biểu diễn tỷ lệ phòng hộ Hedge
     * ========================================================
     */
    renderNetExposureWave() {
      if (!this.waveCtx || !this.waveCanvas) return;
      const ctx = this.waveCtx;
      const w = this.waveCanvas.width;
      const h = this.waveCanvas.height;
      if (w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);
      this.wavePhase += 0.035;
      const midY = h / 2;

      // 1. TRỤC SỐ 0 CHÍNH GIỮA VỚI CÁC VẠCH CHIA NHỎ 15 PHÚT
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Các vạch chia nhỏ 15 phút
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const tickStep = Math.max(50, w / 8);
      for (let x = tickStep / 2; x < w; x += tickStep) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 4);
        ctx.lineTo(x, midY + 4);
        ctx.stroke();
      }
      ctx.restore();

      // 2. VÙNG SÓNG DƯƠNG (TRÊN 0): MÀU XANH NGỌC #00FFA3 ĐỘ MỜ 40%, VIỀN TRẮNG BẠC #E0FFFF DÀY 1.5PX
      ctx.save();
      ctx.fillStyle = 'rgba(0, 255, 163, 0.40)';
      ctx.strokeStyle = '#E0FFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for (let x = 0; x <= w; x += 6) {
        const yOffset = Math.sin(x * 0.018 + this.wavePhase) * (h * 0.34) + Math.cos(x * 0.038 - this.wavePhase * 0.5) * (h * 0.12);
        const y = midY - Math.abs(yOffset);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, midY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3. VÙNG SÓNG ÂM (DƯỚI 0): MÀU ĐỎ RUBY #FF3366 ĐỘ MỜ 40%, VIỀN MÀU ĐỎ LASER #FF3366
      ctx.save();
      ctx.fillStyle = 'rgba(255, 51, 102, 0.40)';
      ctx.strokeStyle = '#FF3366';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for (let x = 0; x <= w; x += 6) {
        const yOffset = Math.sin(x * 0.022 - this.wavePhase * 0.8) * (h * 0.32) + Math.sin(x * 0.045 + this.wavePhase) * (h * 0.10);
        const y = midY + Math.abs(yOffset);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, midY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 4. ĐƯỜNG SÓNG NÉT ĐỨT MÀU CAM CHẠY XUYÊN SUỐT BIỂU DIỄN TỶ LỆ PHÒNG HỘ HEDGE
      ctx.save();
      ctx.strokeStyle = '#FF9900';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);
      ctx.shadowColor = '#FF9900';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const hedgeOffset = Math.sin(x * 0.024 + this.wavePhase * 0.9) * (h * 0.24) - Math.cos(x * 0.015 - this.wavePhase * 0.4) * (h * 0.15);
        const y = midY + hedgeOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    /**
     * TOP HUD MINI 3D LOGO (OCTAHEDRON SACRED GEOMETRY)
     */
    renderMiniLogo() {
      if (!this.miniCtx || !this.miniLogoCanvas) return;
      const ctx = this.miniCtx;
      const w = 32, h = 32;
      ctx.clearRect(0, 0, w, h);

      const cx = 16, cy = 16;
      const t = this.clockTime * 1.2;
      const size = 11;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.4);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.85, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.85, 0);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-size * 0.85, 0);
      ctx.lineTo(size * 0.85, 0);
      ctx.stroke();
      ctx.restore();
    }
  }

  window.CrystalEngine = new SovereignQuantumCoreEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.CrystalEngine.init());
  } else {
    window.CrystalEngine.init();
  }
})();
