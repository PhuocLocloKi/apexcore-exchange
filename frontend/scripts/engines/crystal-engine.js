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
    radius: 175,            // Phóng to kích thước tổng thể bè ngang
    tube: 68,               // Độ dày thân ống quả cầu
    radialSegments: 28,     // Lưới đa giác mịn hơn
    tubularSegments: 48,    // Độ cong tròn mượt mà
    goldenRingRadius: 54,   // Vòng nhẫn vàng kim to rõ ở tâm
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
     * PHẦN 3 & 4: "TRÁI TIM QUẢ CẦU 3D ĐA GIÁC THỂ TÍCH" (VOLUMETRIC FACETED TORUS V9)
     * - Dáng nằm ngang bè rộng chuẩn Ảnh 4 (Wide Oblique Perspective, camera ~28-30 độ)
     * - Mặt đa giác thể tích tô màu nhiệt (Solid Translucent Facets):
     *   + Nửa sau: Kính mờ Xanh Cyan vi mô bán trong suốt rgba(0, 140, 235, 0.18)
     *   + Vành trước: Xanh Ngọc Lục Bảo #00FFA3 -> Vàng Hổ Phách #FFB800
     *   + Hố sâu trọng lực ở tâm: Đỏ Ruby & Hồng Magenta #FF3366
     * - Các chóp nhọn địa hình nhấp nhô trên vành (Top Rim Mountain Spikes - Ảnh 4)
     * - Vòng Nhẫn Vàng Kim đứng thẳng tắp xuyên qua tâm hố sâu (#FFE600)
     * - Tách biệt 100%: ETH 2,481 ở góc 7 giờ, tuyệt đối không đè RESOLUTION AXIS!
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
      const cy = h / 2 - 12; // Căn giữa tối ưu buồng lái

      const t = this.clockTime;
      const breath = 1.0 + 0.035 * Math.sin(t * 1.8);

      // Tham số Torus hình học chuẩn V9 — Bánh Donut Bè Ngang Thể Tích
      const R = (TORUS_CONFIG.radius || 175) * breath;
      const r = (TORUS_CONFIG.tube || 68) * breath;

      // Góc nhìn camera hạ xuống ~28-30 độ nghiêng nằm ngang (Wide Oblique Angle - Ảnh 4)
      const basePitch = 0.50; // ~29 độ
      const rotX = basePitch + this.userRotX + Math.sin(t * 0.2) * 0.03;
      const rotY = this.autoRotAngle + this.userRotY;
      const rotZ = (t * 0.02) + (this.userRotY * 0.05);

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      // Phép chiếu phối cảnh 3D không gian sang 2D màn hình (Torus nằm ngang trên mặt phẳng XZ)
      const project = (x, y, z) => {
        // Xoay quanh trục đứng Y (Yaw)
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // Xoay nghiêng quanh trục ngang X (Pitch)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Xoay nhẹ theo trục sâu Z (Roll)
        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = x2 * sinZ + y2 * cosZ;
        const z3 = z2;

        const fov = 480;
        const scale = (fov / (fov + z3 + 120)) * this.userZoom;
        return {
          px: cx + x3 * scale,
          py: cy + y3 * scale,
          depth: z3,
          scale: scale,
          rawX: x3,
          rawY: y3,
          rawZ: z3
        };
      };

      // 1. SINH LƯỚI ĐA GIÁC THỂ TÍCH & CHÓP NHỌN ĐỊA HÌNH TRÊN VÀNH (VERTEX MOUNTAIN SPIKES)
      const uSteps = TORUS_CONFIG.radialSegments || 28; // 28 múi radial
      const vSteps = TORUS_CONFIG.tubularSegments || 48; // 48 đoạn tubular
      const gridPoints = [];

      for (let i = 0; i < uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        gridPoints[i] = [];
        for (let j = 0; j < vSteps; j++) {
          const v = (j / vSteps) * Math.PI * 2;

          // Chóp nhọn địa hình nhấp nhô trên vành (Top Rim Mountain Spikes - Ảnh 4)
          let mountainSpike = 0;
          const upperRimFactor = Math.sin(v); // Nửa trên của ống (y > 0)
          if (upperRimFactor > 0.15) {
            const spikeWave = Math.sin(u * 5.0 + t * 0.9) * Math.cos(v * 3.0 + t * 0.6);
            if (spikeWave > 0.12) {
              mountainSpike = Math.pow(spikeWave, 1.4) * 24.0 * (0.85 + 0.35 * Math.sin(t * 2.4));
            }
          }

          // Tọa độ 3D: Vành chính nằm ngang trên mặt phẳng XZ, trục Y hướng lên trên
          const x0 = (R + r * Math.cos(v)) * Math.cos(u);
          const z0 = (R + r * Math.cos(v)) * Math.sin(u);
          const y0 = r * Math.sin(v) + mountainSpike;

          const proj = project(x0, y0, z0);
          proj.u = u;
          proj.v = v;
          proj.cosV = Math.cos(v);
          proj.isTopRim = upperRimFactor > 0.2;
          gridPoints[i][j] = proj;
        }
      }

      // 2. MẶT ĐA GIÁC THỂ TÍCH TÔ MÀU NHIỆT (SOLID TRANSLUCENT FACETS - Y CHANG ẢNH 4)
      const facets = [];
      for (let i = 0; i < uSteps; i++) {
        const nextI = (i + 1) % uSteps;
        for (let j = 0; j < vSteps; j++) {
          const nextJ = (j + 1) % vSteps;

          const p1 = gridPoints[i][j];
          const p2 = gridPoints[nextI][j];
          const p3 = gridPoints[nextI][nextJ];
          const p4 = gridPoints[i][nextJ];

          const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) * 0.25;
          const avgCosV = (p1.cosV + p2.cosV + p3.cosV + p4.cosV) * 0.25;
          const avgX = (p1.rawX + p2.rawX + p3.rawX + p4.rawX) * 0.25;

          // Phân phối màu nhiệt thể tích đa giác
          let fillColor, strokeColor;
          if (avgCosV < -0.25) {
            // Hố sâu trọng lực ở tâm: Đỏ Ruby & Hồng Magenta
            fillColor = 'rgba(255, 45, 95, 0.38)';
            strokeColor = 'rgba(255, 60, 130, 0.55)';
          } else if (avgDepth < -15) {
            // Nửa sau: Kính mờ Xanh Cyan vi mô bán trong suốt
            fillColor = 'rgba(0, 140, 235, 0.18)';
            strokeColor = 'rgba(0, 190, 255, 0.38)';
          } else {
            // Vành trước: Xanh Ngọc Lục Bảo (#00FFA3) chuyển dần sang Vàng Hổ Phách (#FFB800)
            if (avgX < 20) {
              fillColor = 'rgba(0, 255, 163, 0.24)';
              strokeColor = 'rgba(0, 255, 163, 0.55)';
            } else {
              fillColor = 'rgba(255, 184, 0, 0.30)';
              strokeColor = 'rgba(255, 215, 0, 0.62)';
            }
          }

          facets.push({
            p1, p2, p3, p4,
            depth: avgDepth,
            fillColor,
            strokeColor
          });
        }
      }

      // Sắp xếp mặt đa giác theo chiều sâu (Painter's Algorithm: vẽ từ xa tới gần)
      facets.sort((a, b) => a.depth - b.depth);

      // Dựng các mặt thể tích và lưới wireframe sắc nét
      for (let k = 0; k < facets.length; k++) {
        const f = facets[k];
        ctx.fillStyle = f.fillColor;
        ctx.beginPath();
        ctx.moveTo(f.p1.px, f.p1.py);
        ctx.lineTo(f.p2.px, f.p2.py);
        ctx.lineTo(f.p3.px, f.p3.py);
        ctx.lineTo(f.p4.px, f.p4.py);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = f.strokeColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 3. VÒNG NHẪN VÀNG KIM ĐỨNG DỌC Ở TÂM (#FFE600) & RESOLUTION AXIS
      const ringRad = (TORUS_CONFIG.goldenRingRadius || 54) * breath;
      const ringSegs = 48;
      const ring3DPoints = [];

      for (let s = 0; s <= ringSegs; s++) {
        const theta = (s / ringSegs) * Math.PI * 2;
        // Vòng nhẫn đứng thẳng tắp xuyên qua tâm hố sâu (trong mặt phẳng YZ)
        const rx = 0;
        const ry = ringRad * 1.55 * Math.sin(theta);
        const rz = ringRad * Math.cos(theta);
        ring3DPoints.push(project(rx, ry, rz));
      }

      ctx.save();
      // Ánh hào quang vàng kim tỏa sáng rộng
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 35;
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.38)';
      ctx.lineWidth = 7 * this.userZoom;
      ctx.beginPath();
      for (let s = 0; s <= ringSegs; s++) {
        const pt = ring3DPoints[s];
        if (s === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.closePath();
      ctx.stroke();

      // Vành nhẫn chính Vàng Kim Rực Rỡ (#FFE600)
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#FFE600';
      ctx.lineWidth = 3.6 * this.userZoom;
      ctx.beginPath();
      for (let s = 0; s <= ringSegs; s++) {
        const pt = ring3DPoints[s];
        if (s === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.closePath();
      ctx.stroke();

      // Vành trong tâm sáng trắng vàng
      ctx.strokeStyle = 'rgba(255, 255, 240, 0.90)';
      ctx.lineWidth = 1.4 * this.userZoom;
      ctx.stroke();
      ctx.restore();

      // TÂM NGẮM ⌖ & CHỮ PHÁT SÁNG "RESOLUTION AXIS" NGAY DƯỚI CHÂN VÒNG NHẪN
      // Cố định ở đáy nhẫn (6 giờ), cách ly tuyệt đối khỏi nhãn ETH 2,481
      const ringBottomProj = project(0, -ringRad * 1.55, 0);
      const axisY = Math.max(cy + 65, ringBottomProj.py + 18);

      ctx.save();
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#FFE600';
      ctx.shadowColor = '#FFE600';
      ctx.shadowBlur = 10;
      ctx.fillText('⌖ RESOLUTION AXIS', cx, axisY);
      ctx.restore();

      // HẠT BỤI VÀNG LƯỢNG TỬ XOAY TRÒN THEO VÒNG NHẪN
      if (this.ringParticles) {
        ctx.save();
        for (let i = 0; i < this.ringParticles.length; i++) {
          const rp = this.ringParticles[i];
          rp.angle += rp.speed * this.volatilitySpeed;
          const rpx = 0;
          const rpy = (ringRad * 1.55 + rp.radiusVariance) * Math.sin(rp.angle);
          const rpz = (ringRad + rp.radiusVariance * 0.8) * Math.cos(rp.angle);
          const rProj = project(rpx, rpy, rpz);

          ctx.fillStyle = '#FFE600';
          ctx.shadowColor = '#FFE600';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(rProj.px, rProj.py, rp.size * this.userZoom, 0, Math.PI * 2);
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

      const cSize = 15 * breath * this.userZoom;
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

        const px3 = (R + r * Math.cos(p.v)) * Math.cos(p.u);
        const pz3 = (R + r * Math.cos(p.v)) * Math.sin(p.u);
        const py3 = r * Math.sin(p.v);

        const proj = project(px3, py3, pz3);
        if (proj.scale > 0) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, Math.max(0.6, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. CÁC CHỐT SỐ MỐC GÓC XOAY: NHÃN 2:30 VÀ 3:45
      const p230 = project(R * 0.60, r * 0.5, -R * 0.70);
      const p345 = project(R * 0.85, -r * 0.1, -R * 0.25);

      ctx.save();
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FFD700';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 6;
      ctx.fillText('2:30', p230.px + 4, p230.py);
      ctx.fillText('3:45', p345.px + 4, p345.py);
      ctx.restore();

      // 7. 4 MŨI TÊN VECTOR CHỈ TỌA ĐỘ KHÔNG GIAN 3D (VECTOR CALLOUTS)
      // Tách biệt 100%: ETH 2,481 ở góc 7 giờ, tuyệt đối không đè lên RESOLUTION AXIS!
      const drawCallout = (targetX, targetY, labelText, color, offsetX, offsetY, subText = null) => {
        const endX = targetX + offsetX;
        const endY = targetY + offsetY;

        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        const angle = Math.atan2(targetY - endY, targetX - endX);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - 5 * Math.cos(angle - 0.4), targetY - 5 * Math.sin(angle - 0.4));
        ctx.lineTo(targetX - 5 * Math.cos(angle + 0.4), targetY - 5 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(labelText).width;
        const padX = 6;
        const padY = 3;
        const boxW = textWidth + padX * 2;
        const boxH = subText ? 24 : 16;
        const boxX = offsetX > 0 ? endX : endX - boxW;
        const boxY = endY - boxH / 2;

        ctx.fillStyle = 'rgba(7, 12, 22, 0.90)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeRect(boxX, boxY, boxW, boxH);

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

      // - BTC 77,318: Vành trên bên trái (Góc 10 giờ)
      const btcTarget = project(-R * 0.75, r * 0.6 + 10, -R * 0.55);
      drawCallout(btcTarget.px, btcTarget.py, 'BTC 77,318', '#00F0FF', -65, -30);

      // - ETH 2,481: LỆCH HẲN SANG GÓC 7 GIỜ (TÂY NAM), CÁCH XA RESOLUTION AXIS > 60PX
      const ethTarget = project(-R * 0.85, -r * 0.25, R * 0.55);
      drawCallout(ethTarget.px, ethTarget.py, 'ETH 2,481', '#FF9900', -72, 16);

      // - SOL 91.66: Rìa ngoài bên phải (Góc 2 giờ)
      const solTarget = project(R * 0.85, r * 0.5, -R * 0.45);
      drawCallout(solTarget.px, solTarget.py, 'SOL 91.66', '#FFFFFF', 55, -28);

      // - CHAINLINK 77,299: Trục giải quyết bên phải (Góc 4 giờ)
      const clTarget = project(R * 0.85, -r * 0.2, R * 0.45);
      drawCallout(clTarget.px, clTarget.py, 'CHAINLINK 77,299', '#FFE600', 55, 12, 'RESOLUTION CHARGE · LAG 1.1S');
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
