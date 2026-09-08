/**
 * ElectricBorder Component - React Bits Integration
 * Inspired by Balint Ferenczy (@BalintFerenczy on X / CodePen)
 * Advanced SVG Filter Turbulence & Displacement based Animated Electric Border Effect
 */

(function () {
  'use strict';

  class ElectricBorderManager {
    constructor(options = {}) {
      this.color = options.color || '#555965';
      this.speed = options.speed || 1;
      this.chaos = options.chaos || 0.14;
      this.thickness = options.thickness || 2;
      this.seed = 1;
      this.lastTime = 0;
      this.interval = 1000 / (24 * this.speed); // 24fps electric arc jitter for realistic plasma crackle

      this.initFilters();
      this.initCards();
      this.startAnimation();
    }

    initFilters() {
      if (document.getElementById('electric-svg-filter-defs')) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'electric-svg-filter-defs';
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      svg.style.width = '0';
      svg.style.height = '0';
      svg.style.overflow = 'hidden';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '-9999';

      svg.innerHTML = `
        <defs>
          <!-- Primary Electric Lightning Filter -->
          <filter id="electric-filter" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
            <feTurbulence id="electric-turb-1" type="fractalNoise" baseFrequency="0.08 0.08" numOctaves="4" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="0.8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="displaced" />
            </feMerge>
          </filter>

          <!-- Outer Electric Plasma Halo Filter -->
          <filter id="electric-halo-filter" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
            <feTurbulence id="electric-turb-2" type="turbulence" baseFrequency="0.06 0.06" numOctaves="3" result="noise2" seed="12" />
            <feDisplacementMap in="SourceGraphic" in2="noise2" scale="20" xChannelSelector="R" yChannelSelector="G" result="displaced2" />
            <feGaussianBlur in="displaced2" stdDeviation="2.2" result="halo" />
            <feMerge>
              <feMergeNode in="halo" />
              <feMergeNode in="displaced2" opacity="0.6" />
            </feMerge>
          </filter>
        </defs>
      `;

      document.body.prepend(svg);
      this.turb1 = document.getElementById('electric-turb-1');
      this.turb2 = document.getElementById('electric-turb-2');
    }

    initCards() {
      const cards = document.querySelectorAll('.electric-card');
      cards.forEach((card) => {
        if (card.querySelector('.electric-border-svg')) return;

        // Ensure card has relative positioning
        if (getComputedStyle(card).position === 'static') {
          card.style.position = 'relative';
        }

        const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgWrapper.setAttribute('class', 'electric-border-svg');
        svgWrapper.setAttribute('viewBox', '0 0 100 100');
        svgWrapper.setAttribute('preserveAspectRatio', 'none');
        svgWrapper.setAttribute('aria-hidden', 'true');

        svgWrapper.innerHTML = `
          <!-- Soft wide ambient plasma halo -->
          <rect class="electric-rect-halo" x="1.5" y="1.5" width="97" height="97" rx="7" ry="7" vector-effect="non-scaling-stroke" />
          <!-- Main crackling electric jagged line -->
          <rect class="electric-rect-main" x="1.5" y="1.5" width="97" height="97" rx="7" ry="7" vector-effect="non-scaling-stroke" />
          <!-- Inner bright lightning core -->
          <rect class="electric-rect-core" x="1.5" y="1.5" width="97" height="97" rx="7" ry="7" vector-effect="non-scaling-stroke" />
        `;

        card.appendChild(svgWrapper);
      });
    }

    startAnimation() {
      const loop = (currentTime) => {
        if (!this.lastTime) this.lastTime = currentTime;
        const delta = currentTime - this.lastTime;

        if (delta >= this.interval) {
          this.lastTime = currentTime;
          this.seed = (this.seed + Math.floor(1 + this.chaos * 25)) % 1000;

          if (this.turb1) {
            this.turb1.setAttribute('seed', this.seed);
            const freqX = (0.075 + Math.sin(this.seed * 0.15) * 0.02).toFixed(3);
            const freqY = (0.075 + Math.cos(this.seed * 0.15) * 0.02).toFixed(3);
            this.turb1.setAttribute('baseFrequency', `${freqX} ${freqY}`);
          }

          if (this.turb2) {
            this.turb2.setAttribute('seed', (this.seed + 15) % 1000);
          }
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    }
  }

  // Expose globally
  window.ElectricBorderManager = ElectricBorderManager;

  function init() {
    window.electricBorder = new ElectricBorderManager({
      color: '#555965',
      speed: 1,
      chaos: 0.14,
      thickness: 2
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
