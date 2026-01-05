/**
 * COMPONENT 3: Image Reveal / Grow
 *
 * Dramatic image reveal with a mask that wipes away and the image
 * scales up simultaneously, creating a cinematic reveal effect.
 *
 * Usage:
 *   import { ImageReveal } from 'gsap-animation-library';
 *
 *   new ImageReveal('.about-reveal-container', {
 *     direction: 'left',
 *     duration: 1.2,
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ImageReveal {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn(`ImageReveal: Container "${containerSelector}" not found`);
      return;
    }

    this.options = {
      revealerSelector: '.image-revealer',
      imageSelector: '.reveal-image',
      direction: 'left',       // 'left', 'right', 'top', 'bottom'
      duration: 1.2,           // Animation duration
      startScale: 1.2,         // Image starts scaled up
      endScale: 1,             // Image ends at normal scale
      ease: 'power3.out',
      triggerStart: 'top 60%',
      useScrollTrigger: true,  // Auto-trigger on scroll (false for manual)
      ...options,
    };

    this.revealer = this.container.querySelector(this.options.revealerSelector);
    this.image = this.container.querySelector(this.options.imageSelector);
    this.trigger = null;
    this.hasRevealed = false;

    this.init();
  }

  init() {
    if (!this.revealer || !this.image) {
      console.warn('ImageReveal: Missing revealer or image element');
      return;
    }

    // Set initial states
    gsap.set(this.image, { scale: this.options.startScale });

    if (this.options.useScrollTrigger) {
      this.trigger = ScrollTrigger.create({
        trigger: this.container,
        start: this.options.triggerStart,
        onEnter: () => this.reveal(),
      });
    }
  }

  reveal() {
    if (this.hasRevealed) return;
    this.hasRevealed = true;

    // Get animation properties based on direction
    const revealProps = this.getRevealProps();

    // Animate revealer (mask slides away)
    gsap.to(this.revealer, {
      ...revealProps,
      duration: this.options.duration,
      ease: this.options.ease,
    });

    // Animate image (scales down to normal)
    gsap.to(this.image, {
      scale: this.options.endScale,
      duration: this.options.duration * 1.2,
      ease: this.options.ease,
    });

    // Add revealed class for CSS hooks
    this.container.classList.add('is-revealed');
  }

  getRevealProps() {
    switch (this.options.direction) {
      case 'right':
        return { xPercent: 100 };
      case 'top':
        return { yPercent: -100 };
      case 'bottom':
        return { yPercent: 100 };
      case 'left':
      default:
        return { xPercent: -100 };
    }
  }

  reset() {
    this.hasRevealed = false;
    gsap.set(this.revealer, { xPercent: 0, yPercent: 0 });
    gsap.set(this.image, { scale: this.options.startScale });
    this.container.classList.remove('is-revealed');
  }

  destroy() {
    if (this.trigger) {
      this.trigger.kill();
    }
  }

  static getCSS() {
    return `
/* ============================================================
   IMAGE REVEAL - Component 3
   ============================================================ */

.image-reveal-container {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.image-revealer {
  position: absolute;
  inset: 0;
  background: var(--reveal-color, #0a0f1a);
  z-index: 2;
  will-change: transform;
}

.reveal-image-wrapper {
  position: relative;
  overflow: hidden;
}

.reveal-image {
  width: 100%;
  height: auto;
  display: block;
  will-change: transform;
  transform-origin: center center;
}

/* Directional variations */
.image-reveal-container[data-direction="left"] .image-revealer {
  transform-origin: left center;
}

.image-reveal-container[data-direction="right"] .image-revealer {
  transform-origin: right center;
}

.image-reveal-container[data-direction="top"] .image-revealer {
  transform-origin: center top;
}

.image-reveal-container[data-direction="bottom"] .image-revealer {
  transform-origin: center bottom;
}

/* Revealed state */
.image-reveal-container.is-revealed .reveal-image {
  opacity: 1;
}
`;
  }

  static getHTML(options = {}) {
    const opts = {
      imageSrc: 'image.jpg',
      imageAlt: 'Revealed image',
      direction: 'left',
      ...options,
    };

    return `
<div class="image-reveal-container" data-direction="${opts.direction}">
  <div class="image-revealer"></div>
  <div class="reveal-image-wrapper">
    <img class="reveal-image" src="${opts.imageSrc}" alt="${opts.imageAlt}">
  </div>
</div>
`;
  }
}

export default ImageReveal;
