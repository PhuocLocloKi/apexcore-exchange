/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIX: ĐỘNG CƠ BÀN TAY NGƯỜI SIÊU THỰC 100% (SUBSURFACE SCATTERING SSS)
   100% KHÔNG VIỀN HỘP · NỀN TRONG SUỐT HOÀN TOÀN · GIẢI PHẪU CHUẨN XÁC ẢNH 2
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

/**
 * Render Bàn Tay Người Thật Điêu Khắc Chuẩn 100% Ảnh 2
 * - Nền 100% trong suốt (Zero background fill, tuyệt đối không có viền hộp chữ nhật)
 * - Cấu trúc giải phẫu mềm mại: Ngón tay khum tự nhiên theo phối cảnh 3D
 * - Hiệu ứng Tán Xạ Da SSS ấm áp kẽ tay, ánh sáng Cyan Rim & Violet Key
 * - Đáy cổ tay tan biến êm dịu không để lại vết cắt
 */
export function generateSculptedHandCanvas(width = 800, height = 1060) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const cx = width / 2;

  // 1. NỀN HOÀN TOÀN TRONG SUỐT (KHÔNG FILL KHỐI NỀN NÀO ĐỂ TRIỆT TIÊU 100% VIỀN ẢNH)
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  // ========================================================
  // 2. CẲNG TAY & CỔ TAY THỰC THỂ (VOLUMETRIC ANATOMICAL FOREARM)
  // Đường cong thon gọn tự nhiên, chuyển sắc mượt mà không hộp
  // ========================================================
  const wristW = 108;
  const wristY = 570;
  const armBotW = 142;
  const armBotY = height - 10;

  ctx.beginPath();
  ctx.moveTo(cx - wristW / 2, wristY);
  ctx.bezierCurveTo(cx - wristW / 2 - 10, 680, cx - armBotW / 2 - 6, 860, cx - armBotW / 2, armBotY);
  ctx.lineTo(cx + armBotW / 2, armBotY);
  ctx.bezierCurveTo(cx + armBotW / 2 + 6, 860, cx + wristW / 2 + 8, 680, cx + wristW / 2, wristY);
  ctx.closePath();

  // Đổ bóng khối trụ da người thật
  const armGrad = ctx.createLinearGradient(cx - armBotW / 2, 0, cx + armBotW / 2, 0);
  armGrad.addColorStop(0, '#00f0ff');       // Mép ngoài trái: Cyan Rim Light cực nét
  armGrad.addColorStop(0.04, '#38bdf8');    // Xanh lơ sáng
  armGrad.addColorStop(0.12, '#ff4a36');    // Tán xạ ấm dưới da (Subsurface scattering)
  armGrad.addColorStop(0.28, '#e09880');    // Da tự nhiên
  armGrad.addColorStop(0.55, '#f5cbb8');    // Highlight da sáng
  armGrad.addColorStop(0.78, '#c97862');    // Vùng chuyển tiếp ấm
  armGrad.addColorStop(0.92, '#8b5cf6');    // Violet Key Light
  armGrad.addColorStop(1, '#581c87');       // Viền tối tím
  ctx.fillStyle = armGrad;
  ctx.fill();

  // Vệt sáng viền Cyan Rim sắc bén dọc mép trái cẳng tay
  ctx.beginPath();
  ctx.moveTo(cx - wristW / 2, wristY);
  ctx.bezierCurveTo(cx - wristW / 2 - 10, 680, cx - armBotW / 2 - 6, 860, cx - armBotW / 2, armBotY);
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ========================================================
  // 3. KHỐI LÒNG BÀN TAY HỮU CƠ (ORGANIC ANATOMICAL PALM)
  // Lòng bàn tay khum nhẹ, có độ sâu 3D như ôm giữ không gian
  // ========================================================
  ctx.beginPath();
  ctx.moveTo(cx - wristW / 2 + 2, wristY);
  // Mô ngón cái (Thenar) uốn cong tự nhiên
  ctx.bezierCurveTo(cx - 110, 525, cx - 105, 465, cx - 72, 435);
  // Gốc các ngón tay lượn cong tự nhiên theo dãy Fibonacci
  ctx.bezierCurveTo(cx - 55, 415, cx - 10, 410, cx + 18, 415);
  ctx.bezierCurveTo(cx + 45, 420, cx + 72, 435, cx + 86, 458);
  // Cạnh ngoài lòng bàn tay
  ctx.bezierCurveTo(cx + 94, 490, cx + 88, 535, cx + wristW / 2 - 2, wristY);
  ctx.closePath();

  const palmGrad = ctx.createRadialGradient(cx + 6, 480, 15, cx, 485, 115);
  palmGrad.addColorStop(0, '#f9d5c3');     // Trung tâm lòng bàn tay
  palmGrad.addColorStop(0.45, '#e49f85');   // Da tự nhiên
  palmGrad.addColorStop(0.72, '#cf7359');   // Tán xạ dưới da ấm
  palmGrad.addColorStop(0.88, '#9f3d2a');   // Đổ bóng viền
  palmGrad.addColorStop(1, '#6b21a8');      // Phản quang tím
  ctx.fillStyle = palmGrad;
  ctx.fill();

  // Mô cái phồng mềm (Thenar Eminence)
  ctx.beginPath();
  ctx.ellipse(cx - 44, 492, 34, 44, -0.28, 0, Math.PI * 2);
  const thenarGrad = ctx.createRadialGradient(cx - 44, 492, 6, cx - 44, 492, 40);
  thenarGrad.addColorStop(0, 'rgba(255, 237, 213, 0.7)');
  thenarGrad.addColorStop(0.65, 'rgba(238, 148, 120, 0.35)');
  thenarGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = thenarGrad;
  ctx.fill();

  // Nếp gấp chỉ tay tự nhiên mềm mại
  ctx.beginPath();
  ctx.moveTo(cx - 38, 445);
  ctx.quadraticCurveTo(cx - 18, 482, cx - 22, 525);
  ctx.strokeStyle = 'rgba(120, 53, 15, 0.22)';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // ========================================================
  // 4. VẼ 5 NGÓN TAY THEO PHỐI CẢNH TỰ NHIÊN CHUẨN XÁC ẢNH 2
  // Các ngón hơi khum vào trong, tỷ lệ đốt ngón mềm mại
  // ========================================================

  // [NGÓN 3: NGÓN GIỮA] - Vươn cao nhất, hơi cong nhẹ về trước
  drawPhotorealisticFinger(ctx, {
    baseX: cx - 4,
    baseY: 418,
    midX: cx - 2,
    midY: 265,
    tipX: cx + 4,
    tipY: 110,
    baseW: 32,
    midW: 26,
    tipW: 20,
    curvature: -0.06,
    nailTilt: 0.05
  });

  // [NGÓN 4: NGÓN ÁP ÚT] - Cong duyên dáng ôm không gian
  drawPhotorealisticFinger(ctx, {
    baseX: cx + 26,
    baseY: 426,
    midX: cx + 42,
    midY: 288,
    tipX: cx + 48,
    tipY: 175,
    baseW: 30,
    midW: 24,
    tipW: 18,
    curvature: 0.10,
    nailTilt: 0.12
  });

  // [NGÓN 5: NGÓN ÚT] - Khum nhỏ nhắn, nghiêng tự nhiên
  drawPhotorealisticFinger(ctx, {
    baseX: cx + 58,
    baseY: 446,
    midX: cx + 82,
    midY: 345,
    tipX: cx + 90,
    tipY: 242,
    baseW: 25,
    midW: 20,
    tipW: 15,
    curvature: 0.20,
    nailTilt: 0.22
  });

  // Đổ bóng giữa ngón trỏ và lòng bàn tay
  ctx.beginPath();
  ctx.ellipse(cx - 36, 424, 22, 14, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(80, 24, 16, 0.28)';
  ctx.fill();

  // [NGÓN 2: NGÓN TRỎ] - Hướng lên cao, khum nhẹ đón ánh sáng Cyan
  drawPhotorealisticFinger(ctx, {
    baseX: cx - 38,
    baseY: 424,
    midX: cx - 46,
    midY: 288,
    tipX: cx - 34,
    tipY: 168,
    baseW: 31,
    midW: 25,
    tipW: 19,
    curvature: -0.10,
    nailTilt: -0.08
  });

  // [NGÓN 1: NGÓN CÁI] - Nằm bên trái, vươn tự nhiên chuẩn Ảnh 2
  drawPhotorealisticThumb(ctx, {
    baseX: cx - 58,
    baseY: 512,
    jointX: cx - 102,
    jointY: 438,
    tipX: cx - 78,
    tipY: 342,
    baseW: 42,
    midW: 32,
    tipW: 24
  });

  ctx.restore();

  // ========================================================
  // 5. MẶT NẠ CHÌM NỀN PHI TUYẾN (SMOOTH NON-LINEAR FADE-OUT)
  // Chỉ hòa tan chân cẳng tay ở 25% đáy, không chạm vào viền ngoài
  // ========================================================
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const fadeOut = ctx.createLinearGradient(0, height * 0.76, 0, height);
  fadeOut.addColorStop(0, 'rgba(0, 0, 0, 0)');
  fadeOut.addColorStop(0.35, 'rgba(0, 0, 0, 0.35)');
  fadeOut.addColorStop(0.70, 'rgba(0, 0, 0, 0.85)');
  fadeOut.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
  ctx.fillStyle = fadeOut;
  ctx.fillRect(0, height * 0.76, width, height * 0.24);
  ctx.restore();

  return canvas;
}

function drawPhotorealisticFinger(ctx, cfg) {
  const { baseX, baseY, midX, midY, tipX, tipY, baseW, midW, tipW, curvature, nailTilt } = cfg;

  ctx.save();

  const ctrl1LeftX = baseX - baseW / 2 + curvature * 18;
  const ctrl1LeftY = (baseY + midY) / 2;
  const ctrl2LeftX = midX - midW / 2;
  const ctrl2LeftY = (midY + tipY) / 2;

  const ctrl2RightX = midX + midW / 2;
  const ctrl2RightY = (midY + tipY) / 2;
  const ctrl1RightX = baseX + baseW / 2 + curvature * 18;
  const ctrl1RightY = (baseY + midY) / 2;

  ctx.beginPath();
  ctx.moveTo(baseX - baseW / 2, baseY);
  ctx.bezierCurveTo(ctrl1LeftX, ctrl1LeftY, ctrl2LeftX - tipW * 0.15, ctrl2LeftY, tipX - tipW / 2, tipY);
  ctx.arc(tipX, tipY, tipW / 2, Math.PI, 0, false);
  ctx.bezierCurveTo(ctrl2RightX + tipW * 0.15, ctrl2RightY, ctrl1RightX, ctrl1RightY, baseX + baseW / 2, baseY);
  ctx.closePath();

  // Gradient da người thật có tán xạ ánh sáng SSS
  const fGrad = ctx.createLinearGradient(baseX - baseW / 2, midY, baseX + baseW / 2, midY);
  fGrad.addColorStop(0, '#00f0ff');       // Cyan Rim viền ngoài
  fGrad.addColorStop(0.06, '#38bdf8');
  fGrad.addColorStop(0.16, '#ff4a36');    // SSS Tán xạ đỏ cam ấm mép ngón
  fGrad.addColorStop(0.35, '#e0957b');    // Da tự nhiên
  fGrad.addColorStop(0.62, '#f4c3b0');    // Vùng sáng da
  fGrad.addColorStop(0.82, '#fde1d3');    // Highlight mịn
  fGrad.addColorStop(0.94, '#8b5cf6');    // Violet Key Light
  fGrad.addColorStop(1, '#581c87');
  ctx.fillStyle = fGrad;
  ctx.fill();

  // Viền Cyan Rim sắc bén ở mép trái ngón tay
  ctx.beginPath();
  ctx.moveTo(baseX - baseW / 2, baseY);
  ctx.bezierCurveTo(ctrl1LeftX, ctrl1LeftY, ctrl2LeftX - tipW * 0.15, ctrl2LeftY, tipX - tipW / 2, tipY);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Khớp đốt ngón tay tự nhiên
  ctx.beginPath();
  ctx.ellipse(midX, midY, midW * 0.40, 5, curvature, 0, Math.PI);
  ctx.strokeStyle = 'rgba(154, 52, 18, 0.25)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Móng tay bóng gương
  ctx.save();
  ctx.translate(tipX, tipY - tipW * 0.15);
  ctx.rotate(nailTilt || 0);
  ctx.beginPath();
  ctx.ellipse(0, 0, tipW * 0.38, tipW * 0.45, 0, 0, Math.PI * 2);
  const nailGrad = ctx.createLinearGradient(-tipW * 0.4, -tipW * 0.4, tipW * 0.4, tipW * 0.4);
  nailGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
  nailGrad.addColorStop(0.45, 'rgba(254, 215, 170, 0.55)');
  nailGrad.addColorStop(1, 'rgba(0, 240, 255, 0.4)');
  ctx.fillStyle = nailGrad;
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawPhotorealisticThumb(ctx, cfg) {
  const { baseX, baseY, jointX, jointY, tipX, tipY, baseW, midW, tipW } = cfg;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(baseX - baseW / 2, baseY);
  ctx.bezierCurveTo(jointX - midW / 2, jointY + 25, jointX - tipW / 2, jointY - 18, tipX - tipW / 2, tipY);
  ctx.arc(tipX, tipY, tipW / 2, Math.PI * 0.85, -Math.PI * 0.15, false);
  ctx.bezierCurveTo(jointX + tipW / 2, jointY - 18, jointX + midW / 2, jointY + 18, baseX + baseW / 2, baseY - 18);
  ctx.closePath();

  const thumbGrad = ctx.createLinearGradient(jointX - midW / 2, jointY, jointX + midW / 2, jointY);
  thumbGrad.addColorStop(0, '#00f0ff');
  thumbGrad.addColorStop(0.08, '#38bdf8');
  thumbGrad.addColorStop(0.18, '#ff4a36'); // SSS ửng ấm
  thumbGrad.addColorStop(0.48, '#e69d84');
  thumbGrad.addColorStop(0.78, '#fad4c0');
  thumbGrad.addColorStop(0.92, '#8b5cf6');
  thumbGrad.addColorStop(1, '#581c87');
  ctx.fillStyle = thumbGrad;
  ctx.fill();

  // Viền Cyan Rim sắc sảo ngón cái
  ctx.beginPath();
  ctx.moveTo(baseX - baseW / 2, baseY);
  ctx.bezierCurveTo(jointX - midW / 2, jointY + 25, jointX - tipW / 2, jointY - 18, tipX - tipW / 2, tipY);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
  ctx.lineWidth = 2.4;
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Bầu thịt ngón cái
  ctx.beginPath();
  ctx.ellipse(tipX + 3, tipY + 10, tipW * 0.62, tipW * 0.82, 0.32, 0, Math.PI * 2);
  const padGrad = ctx.createRadialGradient(tipX + 3, tipY + 10, 3, tipX + 3, tipY + 10, tipW * 0.82);
  padGrad.addColorStop(0, 'rgba(255, 237, 213, 0.75)');
  padGrad.addColorStop(0.6, 'rgba(238, 148, 120, 0.32)');
  padGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = padGrad;
  ctx.fill();

  ctx.restore();
}
