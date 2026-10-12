/* ==========================================================================
   APEXCORE SOLID 3D GOLD COIN WEBGL ENGINE (60 FPS VOLUMETRIC PBR)
   Master System Blueprint V17 — Chương XI
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

class Solid3DGoldCoin {
  constructor(containerId, size = 38) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!this.container) return;
    this.size = size;
    this.angle = 0;
    this.animId = null;

    // Khởi tạo động cơ
    if (typeof THREE !== 'undefined' && THREE.WebGLRenderer && THREE.CylinderGeometry) {
      this.initThreeJS();
    } else {
      this.initVolumetricCanvas();
      // Nếu Three.js tải chậm qua CDN, tự động nâng cấp sang Three.js PBR
      this.waitForThreeJS();
    }
  }

  /* ----------------------------------------------------------------------
     1. ENGINE CHÍNH: THREE.JS SOLID 3D CYLINDER PBR MESH (CHƯƠNG XI)
     ---------------------------------------------------------------------- */
  initThreeJS() {
    this.isThree = true;
    this.container.innerHTML = '';

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.z = 4.2;

    // 2. Renderer tối ưu phần cứng WebGL
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.size, this.size);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.borderRadius = '50%';
    this.renderer.domElement.style.transition = 'transform 0.25s ease';
    this.renderer.domElement.style.cursor = 'pointer';
    this.renderer.domElement.addEventListener('mouseenter', () => {
      this.renderer.domElement.style.transform = 'scale(1.08)';
    });
    this.renderer.domElement.addEventListener('mouseleave', () => {
      this.renderer.domElement.style.transform = 'scale(1)';
    });
    this.container.appendChild(this.renderer.domElement);

    // 3. Hình học khối trụ 3D có độ dày thực tế (Solid Cylinder)
    const radius = 1.0;
    const thickness = 0.12; // Độ dày 12% chuẩn tiền xu hoàng gia
    const geometry = new THREE.CylinderGeometry(radius, radius, thickness, 64);
    geometry.rotateX(Math.PI / 2); // Xoay mặt trước hướng về Camera

    // 4. Vật liệu PBR Vàng 24K Hoàng Gia cho Cạnh Sườn Răng Cưa
    const goldPBR = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.16,
      bumpScale: 0.05
    });

    // 5. Nạp Texture Mặt trước và Mặt sau
    const textureLoader = new THREE.TextureLoader();
    const frontTexture = textureLoader.load('assets/images/apexcore_gold_coin.png');
    frontTexture.generateMipmaps = true;

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.90,
      roughness: 0.18
    });

    // Khối Mesh hoàn chỉnh: [0: Cạnh sườn PBR, 1: Mặt trước Stargate, 2: Mặt sau]
    this.coinMesh = new THREE.Mesh(geometry, [goldPBR, frontMat, frontMat]);
    this.scene.add(this.coinMesh);

    // 6. Ánh sáng Studio 3 điểm (Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xfff5cc, 0.9);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2, 3, 4);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xffd700, 3.5, 10);
    rimLight.position.set(-3, -2, 2);
    this.scene.add(rimLight);

    // 7. Vòng lặp xoay 3D 60 FPS
    this.animateThree();
  }

  animateThree() {
    this.animId = requestAnimationFrame(() => this.animateThree());
    // Xoay quanh trục Y và chao nhẹ trục X tạo chiều sâu 3D nguyên khối
    this.coinMesh.rotation.y += 0.015;
    this.coinMesh.rotation.x = Math.sin(this.coinMesh.rotation.y) * 0.12;
    this.renderer.render(this.scene, this.camera);
  }

  /* ----------------------------------------------------------------------
     2. DỰ PHÒNG CHUẨN XÁC: 3D VOLUMETRIC CANVAS VỚI CẠNH SƯỜN RĂNG CƯA
     Đảm bảo ngay cả khi offline / chưa tải xong Three.js, đồng tiền
     VẪN ĐẦY ĐỦ ĐỘ DÀY THỰC TẾ & KHÍA RĂNG CƯA 3D (KHÔNG BAO GIỜ BỊ MỎNG DÍNH)
     ---------------------------------------------------------------------- */
  initVolumetricCanvas() {
    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.size * dpr;
    this.canvas.height = this.size * dpr;
    this.canvas.style.width = this.size + 'px';
    this.canvas.style.height = this.size + 'px';
    this.canvas.style.display = 'block';
    this.canvas.style.borderRadius = '50%';
    this.canvas.style.transition = 'transform 0.25s ease';
    this.canvas.style.cursor = 'pointer';
    this.canvas.addEventListener('mouseenter', () => {
      this.canvas.style.transform = 'scale(1.08)';
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.canvas.style.transform = 'scale(1)';
    });
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
    this.container.appendChild(this.canvas);

    // Nạp ảnh texture
    this.img = new Image();
    this.img.src = 'assets/images/apexcore_gold_coin.png';
    this.imgLoaded = false;
    this.img.onload = () => { this.imgLoaded = true; };

    this.animateCanvas();
  }

  animateCanvas() {
    this.animId = requestAnimationFrame(() => this.animateCanvas());
    this.angle += 0.02;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

    const ctx = this.ctx;
    const w = this.size;
    const h = this.size;
    const cx = w / 2;
    const cy = h / 2;
    const r = (w / 2) * 0.92;
    const thickness = r * 0.22; // Độ dày 3D nguyên khối 22% bán kính (~11% đường kính)

    ctx.clearRect(0, 0, w, h);

    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    const tilt = Math.sin(this.angle * 0.8) * 0.12;

    // Tọa độ 2 mặt trước và sau
    const zOffset = (thickness / 2) * sin;
    const frontX = cx + zOffset;
    const backX = cx - zOffset;
    const faceW = Math.max(0.001, Math.abs(cos));

    // Vẽ cạnh sườn kim loại dày 3D (Cylinder Reeded Edge)
    if (Math.abs(sin) > 0.05) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // Dựng dải cạnh sườn nối giữa mặt trước và mặt sau
      const x1 = zOffset;
      const x2 = -zOffset;
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);

      const grad = ctx.createLinearGradient(minX, 0, maxX, 0);
      grad.addColorStop(0, '#ffd700');
      grad.addColorStop(0.3, '#fff4b8');
      grad.addColorStop(0.6, '#b8860b');
      grad.addColorStop(1, '#daa520');

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Vẽ vỏ hình trụ
      ctx.ellipse(x2, 0, r * faceW, r, 0, 0, Math.PI * 2);
      ctx.ellipse(x1, 0, r * faceW, r, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vẽ các đường khía răng cưa 3D (Reeded Edges)
      const numReeds = 24;
      ctx.strokeStyle = 'rgba(139, 90, 0, 0.45)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < numReeds; i++) {
        const reedAngle = (i / numReeds) * Math.PI * 2 + this.angle;
        const reedY = Math.sin(reedAngle) * (r * 0.92);
        if (Math.cos(reedAngle) > -0.2) {
          ctx.beginPath();
          ctx.moveTo(x1, reedY);
          ctx.lineTo(x2, reedY);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Vẽ mặt đồng xu
    ctx.save();
    ctx.translate(frontX, cy);
    ctx.rotate(tilt);
    ctx.scale(cos, 1);

    if (this.imgLoaded) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.img, -r, -r, r * 2, r * 2);
    } else {
      const faceGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
      faceGrad.addColorStop(0, '#fff4b8');
      faceGrad.addColorStop(0.7, '#ffd700');
      faceGrad.addColorStop(1, '#b8860b');
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ánh sáng quét gương kim loại (Specular Shimmer)
    const glint = Math.sin(this.angle * 2);
    if (glint > 0.4) {
      const alpha = (glint - 0.4) / 0.6;
      const glintGrad = ctx.createLinearGradient(-r, -r, r, r);
      glintGrad.addColorStop(0, 'rgba(255,255,255,0)');
      glintGrad.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.45})`);
      glintGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glintGrad;
      ctx.fill();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------------------
     3. TỰ ĐỘNG NÂNG CẤP LÊN THREE.JS NẾU CDN LOAD XONG
     ---------------------------------------------------------------------- */
  waitForThreeJS() {
    let checks = 0;
    const interval = setInterval(() => {
      checks++;
      if (typeof THREE !== 'undefined' && THREE.WebGLRenderer && THREE.CylinderGeometry) {
        clearInterval(interval);
        if (this.animId) cancelAnimationFrame(this.animId);
        this.initThreeJS();
      }
      if (checks > 50) clearInterval(interval);
    }, 200);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer) this.renderer.dispose();
  }
}

// Động cơ Solid 3D Coin (chỉ khởi chạy khi được gọi thủ công)
window.Solid3DGoldCoin = Solid3DGoldCoin;
