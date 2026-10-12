/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV: THIẾT LẬP SCENE, CHIẾU SÁNG STUDIO & BỤI VÀNG VŨ TRỤ (VORTEX SCENE)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class VortexScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stardustPoints = null;
    this.stardustAngles = [];
    this.starfield = null;
    this.lights = {};
  }

  init(THREE) {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 520;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera Perspective PBR
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, 5.6);
    this.camera.lookAt(0, 0.25, 0);

    // 3. WebGL Renderer siêu tốc 60 FPS
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Gắn canvas vào DOM
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.className = 'vortex-webgl-canvas';

    // 4. Hệ thống chiếu sáng Studio 3 điểm
    this.setupLighting(THREE);

    // 5. Trường bụi vàng vũ trụ & Tinh vân hạt lượng tử (Gold Stardust Particle Ring)
    this.setupStardustVortex(THREE);

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    };
  }

  setupLighting(THREE) {
    // Ánh sáng môi trường dịu nhẹ
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.1);
    this.scene.add(ambient);
    this.lights.ambient = ambient;

    // Đèn chính vàng ròng 24K (Royal Gold Key Light)
    const goldKey = new THREE.DirectionalLight(0xffd700, 2.6);
    goldKey.position.set(4.2, 5.0, 3.8);
    this.scene.add(goldKey);
    this.lights.goldKey = goldKey;

    // Đèn viền xanh Neon Cyber (Cyan Rim Light)
    const cyanRim = new THREE.PointLight(0x00f0ff, 3.2, 12);
    cyanRim.position.set(-3.6, -1.8, 2.8);
    this.scene.add(cyanRim);
    this.lights.cyanRim = cyanRim;

    // Đèn hắt dưới ngọc lục bảo (Emerald Fill Light)
    const emeraldFill = new THREE.PointLight(0x00ffa3, 1.8, 10);
    emeraldFill.position.set(0, -3.2, 2.5);
    this.scene.add(emeraldFill);
    this.lights.emeraldFill = emeraldFill;
  }

  setupStardustVortex(THREE) {
    const particleCount = 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    this.stardustAngles = [];

    const goldColor = new THREE.Color(0xFFD700);
    const cyanColor = new THREE.Color(0x00F0FF);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
      const radius = 2.4 + (Math.random() - 0.5) * 1.2;
      const speed = 0.25 + Math.random() * 0.35;
      const yOffset = (Math.random() - 0.5) * 1.6;

      this.stardustAngles.push({ angle, radius, speed, yOffset });

      const x = radius * Math.cos(angle);
      const z = (radius * 0.8) * Math.sin(angle);
      const y = yOffset;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Pha trộn hạt vàng và hạt cyan
      const isCyan = Math.random() > 0.82;
      const col = isCyan ? cyanColor : goldColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stardustPoints = new THREE.Points(geometry, material);
    this.scene.add(this.stardustPoints);
  }

  updateStardust(delta, speedMultiplier = 1.0) {
    if (!this.stardustPoints) return;
    const positions = this.stardustPoints.geometry.attributes.position.array;
    const count = this.stardustAngles.length;

    for (let i = 0; i < count; i++) {
      const p = this.stardustAngles[i];
      p.angle -= delta * p.speed * speedMultiplier; // Quay ngược chiều tạo luồng gió đối xứng

      positions[i * 3] = p.radius * Math.cos(p.angle);
      positions[i * 3 + 1] = p.yOffset + Math.sin(p.angle * 3) * 0.15;
      positions[i * 3 + 2] = (p.radius * 0.8) * Math.sin(p.angle);
    }
    this.stardustPoints.geometry.attributes.position.needsUpdate = true;
  }

  resize(width, height) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
