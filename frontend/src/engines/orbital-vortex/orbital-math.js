/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XV: PHƯƠNG TRÌNH TOÁN HỌC QUỸ ĐẠO XOẮN ỐC ELIP 3D (ORBITAL MATH)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

/**
 * Tham số quỹ đạo chuẩn Chương XV:
 * Rx = 2.8, Rz = 2.2: Bán kính trục elip không gian
 * ω = 0.45 rad/s: Vận tốc góc xoay mượt mà (chậm lại 0.15 rad/s khi hover)
 * θi = 2π * i / N: Góc lệch pha phân bổ đều cho N sàn
 * Ybase = 0.15, A = 0.42, tiltY = 0.18
 */
export const DEFAULT_ORBITAL_PARAMS = {
  radiusX: 2.75,
  radiusZ: 2.15,
  baseY: 0.15,
  amplitudeY: 0.42,
  tiltY: 0.18,
  defaultSpeed: 0.45,
  hoverSpeed: 0.18,
  hoverSlowSpeed: 0.18
};

/**
 * Tính toán tọa độ vị trí (X, Y, Z) của từng khối sàn i tại thời điểm t
 * Xi(t) = Rx * cos(θi + ωt)
 * Zi(t) = Rz * sin(θi + ωt)
 * Yi(t) = Ybase + A * sin(2(θi + ωt)) + tiltY * Zi(t)
 */
export function calculateOrbitalPosition(
  index,
  totalCount,
  elapsedTime,
  speed = DEFAULT_ORBITAL_PARAMS.defaultSpeed,
  params = DEFAULT_ORBITAL_PARAMS
) {
  const theta = (2 * Math.PI * index) / totalCount;
  const angle = theta + elapsedTime * speed;

  const x = params.radiusX * Math.cos(angle);
  const z = params.radiusZ * Math.sin(angle);
  const y = params.baseY + params.amplitudeY * Math.sin(2 * angle) + params.tiltY * z;

  return { x, y, z, angle };
}

/**
 * Hàm nội suy tuyến tính LERP (Linear Interpolation) cho chuyển động mượt mà
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Tính toán độ chao nghiêng nhẹ tự nhiên dựa trên góc quay
 */
export function calculateDynamicTilt(angle) {
  const pitch = Math.sin(angle * 2) * 0.08;
  const roll = Math.cos(angle) * 0.06;
  return { pitch, roll };
}
