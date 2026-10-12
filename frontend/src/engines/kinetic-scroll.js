/* ==========================================================================
   APEXCORE SOVEREIGN QUANTUM TERMINAL — MASTER SYSTEM BLUEPRINT V17
   CHƯƠNG XIV: ĐỘNG CƠ CUỘN TRANG LERP 3D PARALLAX KINETIC (60 FPS)
   Founder & Chief Architect: NGUYỄN PHƯỚC LỘC (UID: 1107519625)
   ========================================================================== */

export class KineticScrollEngine {
  constructor() {
    this.currentScroll = 0;
    this.targetScroll = 0;
    this.ease = 0.08;
    this.rafId = null;
    this.isTicking = false;
    this.tiltCards = [];
    this.marketSlab = null;
    this.onScrollBound = this.onScroll.bind(this);
    this.updateLoopBound = this.updateLoop.bind(this);
  }

  init() {
    this.marketSlab = document.getElementById('marketGlassSlab');
    this.tiltCards = Array.from(document.querySelectorAll('.pillar-glass-slab, .glass-slab-card, .mobile-pro-slab'));
    
    // Add will-change and transform styles
    this.tiltCards.forEach(card => {
      card.style.willChange = 'transform, opacity';
    });
    if (this.marketSlab) {
      this.marketSlab.style.willChange = 'transform';
    }

    window.addEventListener('scroll', this.onScrollBound, { passive: true });
    this.startLoop();
  }

  onScroll() {
    this.targetScroll = window.scrollY || window.pageYOffset;
    if (!this.isTicking) {
      this.isTicking = true;
      this.startLoop();
    }
  }

  startLoop() {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.updateLoopBound);
    }
  }

  updateLoop() {
    this.currentScroll += (this.targetScroll - this.currentScroll) * this.ease;
    const diff = Math.abs(this.targetScroll - this.currentScroll);

    this.applyKineticParallax(this.currentScroll);

    if (diff > 0.05) {
      this.rafId = requestAnimationFrame(this.updateLoopBound);
    } else {
      this.isTicking = false;
      this.rafId = null;
    }
  }

  applyKineticParallax(scrollY) {
    // 1. Chao nghiêng Phiến Kính Giá Thị Trường (Hero Glass Slab)
    if (this.marketSlab) {
      const scrollFactor = Math.min(scrollY / 400, 1);
      const rotateY = -6 + scrollFactor * 4; // -6deg -> -2deg
      const rotateX = 4 - scrollFactor * 3;
      const translateY = scrollFactor * 18;
      this.marketSlab.style.transform = `perspective(1000px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) translateY(${translateY.toFixed(2)}px)`;
    }

    // 2. Bốn Trụ Cột: Staggered Wave Tilt khi cuộn lướt qua
    this.tiltCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how close the element is to the center of the viewport
      const centerOffset = (rect.top + rect.height / 2) - (viewportHeight / 2);
      const normalizedOffset = Math.max(-1, Math.min(1, centerOffset / (viewportHeight / 2)));
      
      // Staggered fan wave tilt
      const staggerDelay = (index % 4) * 0.08;
      const tiltAngle = normalizedOffset * (4 + staggerDelay * 4);
      const translateY = normalizedOffset * 10;

      card.style.transform = `perspective(800px) rotateX(${(-tiltAngle).toFixed(2)}deg) translateY(${translateY.toFixed(2)}px)`;
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.onScrollBound);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export const kineticScroll = new KineticScrollEngine();
