/**
 * COMPONENT 4: Text/Quote Explosion
 *
 * Words animate in from alternating sides, then explode outward
 * in all directions when triggered. Creates a dramatic dispersal effect.
 *
 * Usage:
 *   import { TextExplosion } from 'gsap-animation-library';
 *
 *   new TextExplosion('.quote-section', {
 *     textSelector: '.quote-line',
 *     explodeAt: '75%',
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
      contentSelector: '.explosion-content',
      attributionSelector: '.explosion-attribution',
      lineStaggerPercent: 10,    // Percent of scroll between each line reveal
      explodeAt: '75%',          // Scroll position to trigger explosion
      explosionDistance: 400,    // Min distance words travel
      explosionDistanceMax: 600, // Max additional random distance
      explosionDuration: 40,     // Ms between each word animation
      rotationRange: 120,        // Max rotation in degrees
      scaleRange: [0.5, 1.5],    // Scale range for exploded words
      ...options,
    };

    this.lines = this.section.querySelectorAll(this.options.textSelector);
    this.content = this.section.querySelector(this.options.contentSelector);
    this.attribution = this.section.querySelector(this.options.attributionSelector);
    this.explosionWords = [];
    this.hasExploded = false;
    this.triggers = [];

    this.init();
  }

  init() {
    if (this.lines.length === 0) return;

    // Animate lines in from alternating sides
    this.lines.forEach((line, index) => {
      const trigger = ScrollTrigger.create({
        trigger: this.section,
        start: () => `${10 + index * this.options.lineStaggerPercent}% center`,
        onEnter: () => line.classList.add('is-visible'),
        onLeaveBack: () => {
          line.classList.remove('is-visible');
          this.reset();
        },
      });
      this.triggers.push(trigger);
    });

    // Attribution animation
    if (this.attribution) {
      const attrTrigger = ScrollTrigger.create({
        trigger: this.section,
        start: '55% center',
        onEnter: () => this.attribution.classList.add('is-visible'),
        onLeaveBack: () => this.attribution.classList.remove('is-visible'),
      });
      this.triggers.push(attrTrigger);
    }

    // Explosion trigger
    const explosionTrigger = ScrollTrigger.create({
      trigger: this.section,
      start: `${this.options.explodeAt} center`,
      onEnter: () => {
        if (!this.hasExploded) {
          this.explode();
        }
      },
      onLeaveBack: () => this.reset(),
    });
    this.triggers.push(explosionTrigger);
  }

  explode() {
    if (!this.content || this.hasExploded) return;
    this.hasExploded = true;

    // Collect all words
    const words = [];
    this.lines.forEach((line) => {
      const text = line.textContent;
      text.split(/\s+/).forEach((word) => {
        const cleanWord = word.replace(/["""\-—]/g, '').trim();
        if (cleanWord) words.push(cleanWord);
      });
    });

    if (this.attribution) {
      this.attribution.textContent.split(/\s+/).forEach((word) => {
        const cleanWord = word.replace(/[—]/g, '').trim();
        if (cleanWord) words.push(cleanWord);
      });
    }

    // Hide original content
    this.content.classList.add('is-exploding');

    // Get center position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create and animate explosion words
    words.forEach((word, i) => {
      const el = document.createElement('span');
      el.className = 'explosion-word';
      el.textContent = word;
      el.style.left = `${centerX}px`;
      el.style.top = `${centerY}px`;
      el.style.transform = 'translate(-50%, -50%)';

      document.body.appendChild(el);
      this.explosionWords.push(el);

      // Animate to random positions
      requestAnimationFrame(() => {
        setTimeout(() => {
          const angle = (i / words.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
          const distance = this.options.explosionDistance + Math.random() * this.options.explosionDistanceMax;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const rotation = (Math.random() - 0.5) * this.options.rotationRange;
          const scale = this.options.scaleRange[0] + Math.random() * (this.options.scaleRange[1] - this.options.scaleRange[0]);

          el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${scale})`;
          el.classList.add('is-exploding');
        }, 50 + i * this.options.explosionDuration);
      });
    });
  }

  reset() {
    this.hasExploded = false;

    if (this.content) {
      this.content.classList.remove('is-exploding');
    }

    this.explosionWords.forEach((el) => el.remove());
    this.explosionWords = [];
  }

  destroy() {
    this.reset();
    this.triggers.forEach((trigger) => trigger.kill());
    this.triggers = [];
  }

  static getCSS() {
    return `
/* ============================================================
   TEXT EXPLOSION - Component 4
   ============================================================ */

.explosion-section {
  min-height: 200vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.explosion-content {
  text-align: center;
  max-width: 900px;
  padding: 2rem;
  transition: opacity 0.3s ease;
}

.explosion-content.is-exploding {
  opacity: 0;
}

.explosion-line {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
  opacity: 0;
  transform: translateX(-100px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.explosion-line:nth-child(even) {
  transform: translateX(100px);
}

.explosion-line.is-visible {
  opacity: 1;
  transform: translateX(0);
}

.explosion-attribution {
  margin-top: 2rem;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
}

.explosion-attribution.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Explosion words that fly out */
.explosion-word {
  position: fixed;
  font-size: clamp(1rem, 3vw, 2rem);
  font-weight: 700;
  color: #fff;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.5s ease;
  white-space: nowrap;
}

.explosion-word.is-exploding {
  opacity: 1;
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
  <div class="explosion-content">
    ${opts.lines.map((line) => `<p class="explosion-line">${line}</p>`).join('\n    ')}
    <p class="explosion-attribution">${opts.attribution}</p>
  </div>
</section>
`;
  }
}

export default TextExplosion;
