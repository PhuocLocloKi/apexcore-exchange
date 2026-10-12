/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV: KHỐI BÀN TAY LƯỢNG TỬ 3D TRUNG TÂM (CYBER HAND MESH)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

/**
 * Xây dựng Khối Bàn Tay Lượng Tử Cybernetic trung tâm (Obsidian & 24K Gold)
 * Dựng trực tiếp bằng hình học chuẩn Three.js, tối ưu hóa 60 FPS không trễ mạng.
 */
export function createCyberHandMesh(THREE) {
  const handGroup = new THREE.Group();
  handGroup.name = 'CyberHandRoot';

  // Vật liệu 1: Kính đen Obsidian kim loại bóng gương (PBR Metallic)
  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e17,
    metalness: 0.95,
    roughness: 0.18,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });

  // Vật liệu 2: Vàng ròng 24K Hoàng Gia (Royal 24K Gold)
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.98,
    roughness: 0.15,
    emissive: 0x997700,
    emissiveIntensity: 0.25
  });

  // Vật liệu 3: Lõi năng lượng phát quang Neon (Cyber Glow)
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0x00F0FF,
    emissive: 0x00F0FF,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });

  // ========================================================
  // 1. CỔ TAY & CẲNG TAY CƠ HỌC (FOREARM & WRIST CHASSIS)
  // ========================================================
  // Trục cẳng tay chính
  const armGeo = new THREE.CylinderGeometry(0.38, 0.48, 1.6, 24);
  const armMesh = new THREE.Mesh(armGeo, obsidianMat);
  armMesh.position.y = -1.2;
  handGroup.add(armMesh);

  // Vòng đai vàng kim bọc quanh cẳng tay
  const armRingGeo = new THREE.TorusGeometry(0.42, 0.04, 16, 32);
  const armRingMesh = new THREE.Mesh(armRingGeo, goldMat);
  armRingMesh.rotation.x = Math.PI / 2;
  armRingMesh.position.y = -0.9;
  handGroup.add(armRingMesh);

  // 2 piston thủy lực mạ vàng 2 bên cẳng tay
  const pistonGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.2, 16);
  const pistonL = new THREE.Mesh(pistonGeo, goldMat);
  pistonL.position.set(-0.35, -1.1, 0.05);
  handGroup.add(pistonL);

  const pistonR = new THREE.Mesh(pistonGeo, goldMat);
  pistonR.position.set(0.35, -1.1, 0.05);
  handGroup.add(pistonR);

  // Khớp cầu cổ tay (Wrist Joint Spheres)
  const wristGeo = new THREE.SphereGeometry(0.36, 24, 24);
  const wristMesh = new THREE.Mesh(wristGeo, goldMat);
  wristMesh.position.y = -0.32;
  handGroup.add(wristMesh);

  // ========================================================
  // 2. KHỐI LÒNG BÀN TAY (PALM CHASSIS & CORE ENERGY)
  // ========================================================
  const palmGeo = new THREE.BoxGeometry(0.72, 0.75, 0.28);
  const palmMesh = new THREE.Mesh(palmGeo, obsidianMat);
  palmMesh.position.y = 0.2;
  handGroup.add(palmMesh);

  // Tấm giáp mu bàn tay vát cạnh vàng
  const backArmorGeo = new THREE.BoxGeometry(0.64, 0.65, 0.08);
  const backArmor = new THREE.Mesh(backArmorGeo, goldMat);
  backArmor.position.set(0, 0.22, 0.14);
  handGroup.add(backArmor);

  // Lõi năng lượng lượng tử trung tâm lòng bàn tay
  const coreEnergyGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16);
  const coreEnergy = new THREE.Mesh(coreEnergyGeo, glowMat);
  coreEnergy.rotation.x = Math.PI / 2;
  coreEnergy.position.set(0, 0.2, -0.14);
  handGroup.add(coreEnergy);

  // ========================================================
  // 3. NĂM NGÓN TAY CƠ HỌC KHỚP NỐI (ARTICULATED 5 FINGERS)
  // ========================================================
  const fingersConfig = [
    { name: 'Thumb', x: -0.42, y: 0.12, rotZ: 0.52, rotX: -0.28, length: 0.48 },
    { name: 'Index', x: -0.26, y: 0.62, rotZ: 0.12, rotX: -0.20, length: 0.72 },
    { name: 'Middle', x: -0.02, y: 0.65, rotZ: 0.02, rotX: -0.16, length: 0.78 },
    { name: 'Ring', x: 0.22, y: 0.60, rotZ: -0.10, rotX: -0.22, length: 0.70 },
    { name: 'Pinky', x: 0.40, y: 0.50, rotZ: -0.25, rotX: -0.32, length: 0.56 }
  ];

  fingersConfig.forEach(cfg => {
    const fingerRoot = new THREE.Group();
    fingerRoot.position.set(cfg.x, cfg.y, 0);
    fingerRoot.rotation.z = cfg.rotZ;
    fingerRoot.rotation.x = cfg.rotX;

    // Đốt ngón tay 1 (Gốc)
    const p1Len = cfg.length * 0.42;
    const p1Geo = new THREE.CylinderGeometry(0.065, 0.075, p1Len, 16);
    const p1Mesh = new THREE.Mesh(p1Geo, obsidianMat);
    p1Mesh.position.y = p1Len / 2;
    fingerRoot.add(p1Mesh);

    // Khớp bản lề 1 (Khớp vàng)
    const j1Geo = new THREE.SphereGeometry(0.072, 14, 14);
    const j1Mesh = new THREE.Mesh(j1Geo, goldMat);
    j1Mesh.position.y = p1Len;
    fingerRoot.add(j1Mesh);

    // Đốt ngón tay 2 (Giữa)
    const p2Len = cfg.length * 0.35;
    const p2Geo = new THREE.CylinderGeometry(0.055, 0.065, p2Len, 16);
    const p2Mesh = new THREE.Mesh(p2Geo, obsidianMat);
    p2Mesh.position.y = p1Len + p2Len / 2;
    p2Mesh.rotation.x = -0.15; // Cong nhẹ tự nhiên
    fingerRoot.add(p2Mesh);

    // Khớp bản lề 2
    const j2Geo = new THREE.SphereGeometry(0.062, 14, 14);
    const j2Mesh = new THREE.Mesh(j2Geo, goldMat);
    j2Mesh.position.y = p1Len + p2Len;
    fingerRoot.add(j2Mesh);

    // Đốt ngón tay 3 (Đầu ngón vuốt nhọn viền mạ vàng)
    const p3Len = cfg.length * 0.28;
    const p3Geo = new THREE.ConeGeometry(0.055, p3Len, 16);
    const p3Mesh = new THREE.Mesh(p3Geo, goldMat);
    p3Mesh.position.y = p1Len + p2Len + p3Len / 2;
    p3Mesh.rotation.x = -0.22;
    fingerRoot.add(p3Mesh);

    handGroup.add(fingerRoot);
  });

  // ========================================================
  // 4. VÒNG HÀO QUANG VÀNG KIM XOAY QUANH BÀN TAY (VORTEX RINGS)
  // ========================================================
  const auraRingGeo = new THREE.TorusGeometry(1.2, 0.018, 16, 64);
  const auraRingMat = new THREE.MeshBasicMaterial({
    color: 0xFFD700,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const auraRing1 = new THREE.Mesh(auraRingGeo, auraRingMat);
  auraRing1.rotation.x = Math.PI / 2.8;
  auraRing1.rotation.y = Math.PI / 6;
  auraRing1.position.y = 0.35;
  handGroup.add(auraRing1);

  const auraRing2 = new THREE.Mesh(auraRingGeo, auraRingMat);
  auraRing2.rotation.x = -Math.PI / 3.2;
  auraRing2.rotation.z = Math.PI / 4;
  auraRing2.position.y = 0.55;
  auraRing2.scale.set(0.85, 0.85, 0.85);
  handGroup.add(auraRing2);

  handGroup.userData.auraRing1 = auraRing1;
  handGroup.userData.auraRing2 = auraRing2;

  // Điều chỉnh vị trí toàn bộ cánh tay cho cân đối tầm nhìn
  handGroup.position.set(0, -0.2, 0);
  handGroup.scale.set(1.15, 1.15, 1.15);

  return handGroup;
}
