/**
 * COMPONENT 4: Text/Quote Explosion
 *
 * Text is split into individual characters that explode outward from center
 * toward the viewer (scaling up) as user scrolls. The section pins during
 * the explosion for dramatic effect.
 *
 * Usage:
 *   import { TextExplosion } from 'gsap-animation-library';
 *
 *   new TextExplosion('.quote-section', {
 *     textSelector: '.explosion-line',
 *     holdDuration: 0.35,  // How long quote stays visible before exploding
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class TextExplosion {
  constructor(sectionSelector, options = {}) {
    this.section = document.querySelector(sectionSelector);
    if (!this.section) {
      console.warn(`TextExplosion: Section "${sectionSelector}" not found`);
      return;
    }

    this.options = {
      textSelector: '.explosion-line',
      pinWrapperSelector: '.explosion-pin-wrapper',
      contentSelector: '.explosion-content',
      attributionSelector: '.explosion-attribution',
      holdDuration: 0.35,        // Portion of scroll where text is static (0-1)
      explosionEnd: 0.85,        // When explosion completes (0-1)
      scrollDistance: '200%',    // Total scroll distance for pin
      explosionDistance: 400,    // Min distance chars travel
      explosionDistanceMax: 600, // Max additional random distance
      rotationRange: 90,         // Max rotation in degrees
      scaleRange: [2, 5],        // Scale range (toward viewer effect)
      ...options,
    };

    this.pinWrapper = this.section.querySelector(this.options.pinWrapperSelector);
    this.content = this.section.querySelector(this.options.contentSelector);
    this.lines = this.section.querySelectorAll(this.options.textSelector);
    this.attribution = this.section.querySelector(this.options.attributionSelector);

    this.allChars = [];
    this.charData = [];
    this.trigger = null;

    this.init();
  }

  init() {
    if (this.lines.length === 0 || !this.pinWrapper) {
      console.warn('TextExplosion: Required elements not found');
      return;
    }

    // 1. Split all text into individual character spans
    this.splitTextIntoChars();

    // 2. Calculate explosion vectors after DOM update
    requestAnimationFrame(() => {
      this.calculateExplosionVectors();
    });

    // 3. Create pinned scroll animation
    this.trigger = ScrollTrigger.create({
      trigger: this.section,
      start: 'top top',
      end: `+=${this.options.scrollDistance}`,
      pin: this.pinWrapper,
      scrub: 0.5,
      onRefresh: () => this.calculateExplosionVectors(),
      onUpdate: (self) => this.onScroll(self.progress),
    });
  }

  splitTextIntoChars() {
    this.allChars = [];

    // Process each line
    this.lines.forEach((line) => {
      const text = line.textContent;
      line.textContent = '';

      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'explosion-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        line.appendChild(span);
        this.allChars.push(span);
      });
    });

    // Process attribution if present
    if (this.attribution) {
      const text = this.attribution.textContent;
      this.attribution.textContent = '';

      [...text].forEach((char) => {
        const span = document.createElement('span');
        span.className = 'explosion-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        this.attribution.appendChild(span);
        this.allChars.push(span);
      });
    }
  }

  calculateExplosionVectors() {
    if (!this.content) return;

    const rect = this.content.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.charData = this.allChars.map((span) => {
      const r = span.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;

      // Vector pointing outward from center
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Calculate explosion trajectory
      const baseDist = this.options.explosionDistance + Math.random() * this.options.explosionDistanceMax;

      return {
        el: span,
        tx: (dx / dist) * baseDist + (Math.random() - 0.5) * 150,
        ty: (dy / dist) * baseDist + (Math.random() - 0.5) * 150,
        tr: (Math.random() - 0.5) * this.options.rotationRange,
        ts: this.options.scaleRange[0] + Math.random() * (this.options.scaleRange[1] - this.options.scaleRange[0]),
      };
    });
  }

  onScroll(progress) {
    // Timeline:
    // 0 to holdDuration: Text visible, no animation
    // holdDuration to explosionEnd: Explosion animates
    // explosionEnd to 1: Fully exploded

    let explosionProgress = 0;

    if (progress <= this.options.holdDuration) {
      explosionProgress = 0;
    } else if (progress <= this.options.explosionEnd) {
      const range = this.options.explosionEnd - this.options.holdDuration;
      explosionProgress = (progress - this.options.holdDuration) / range;
    } else {
      explosionProgress = 1;
    }

    this.applyExplosion(explosionProgress);
  }

  applyExplosion(progress) {
    // Ease function for natural deceleration
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    this.charData.forEach((c, i) => {
      // Slight stagger based on character index
      const stagger = (i % 20) * 0.01;
      const t = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
      const e = ease(t);

      const x = c.tx * e;
      const y = c.ty * e;
      const r = c.tr * e;
      const s = 1 + (c.ts - 1) * e;
      const o = 1 - e;

      c.el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
      c.el.style.opacity = o;
    });
  }

  destroy() {
    if (this.trigger) {
      this.trigger.kill();
      this.trigger = null;
    }
    this.allChars = [];
    this.charData = [];
  }

  static getCSS() {
    return `
/* ============================================================
   TEXT EXPLOSION - Component 4
   ============================================================ */

.explosion-section {
  position: relative;
  overflow: visible;
}

.explosion-pin-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.explosion-content {
  text-align: center;
  max-width: 900px;
  padding: 2rem;
}

.explosion-line {
  display: block;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
}

.explosion-attribution {
  display: block;
  margin-top: 2rem;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Individual character spans */
.explosion-char {
  display: inline-block;
}
`;
  }

  static getHTML(options = {}) {
    const opts = {
      lines: [
        '"Music is the universal',
        'language of mankind."',
      ],
      attribution: '— Henry Wadsworth Longfellow',
      ...options,
    };

    return `
<section class="explosion-section">
  <div class="explosion-pin-wrapper">
    <div class="explosion-content">
      ${opts.lines.map((line) => `<p class="explosion-line">${line}</p>`).join('\n      ')}
      <p class="explosion-attribution">${opts.attribution}</p>
    </div>
  </div>
</section>
`;
  }
}

export default TextExplosion;
