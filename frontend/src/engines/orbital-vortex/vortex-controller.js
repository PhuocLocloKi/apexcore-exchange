/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XVI: BỘ ĐIỀU KHIỂN BÀN TAY QUỸ ĐẠO CHÌM NỀN KHÔNG VIỀN (BORDERLESS CONTROLLER)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

import { BorderlessVortexEngine } from './borderless-vortex-engine.js';
import { HybridCss3dVortexEngine } from './hybrid-css3d-engine.js';

export class OrbitalVortexController {
  constructor(containerElement, options = {}) {
    this.container = typeof containerElement === 'string'
      ? document.getElementById(containerElement)
      : containerElement;

    this.options = {
      autoStart: true,
      tiltParallax: true,
      engineMode: 'canvas3d', // 'canvas3d' (Bulletproof PBR) | 'css3d' (Hybrid CSS 3D 120 FPS)
      ...options
    };

    this.engine = null;
  }

  async init() {
    if (!this.container) {
      console.warn('[OrbitalVortexController] Viewport element not found.');
      return false;
    }

    try {
      if (this.options.engineMode === 'css3d') {
        this.engine = new HybridCss3dVortexEngine(this.container, this.options);
      } else {
        this.engine = new BorderlessVortexEngine(this.container, this.options);
      }

      const ok = this.engine.init();
      console.log(`[ApexCore] ✋ Orbital Vortex Engine V17 [${this.options.engineMode}] đã khởi chạy thành công.`);
      return ok;
    } catch (err) {
      console.error('[OrbitalVortexController] Error during engine init:', err);
      return false;
    }
  }

  switchMode(mode) {
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
    this.options.engineMode = mode;
    return this.init();
  }

  start() {
    if (this.engine && this.engine.start) {
      this.engine.start();
    }
  }

  pause() {
    if (this.engine && this.engine.pause) {
      this.engine.pause();
    }
  }

  destroy() {
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
  }
}
