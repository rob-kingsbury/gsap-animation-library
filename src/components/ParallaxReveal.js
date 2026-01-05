/**
 * COMPONENT 5: Parallax Footer Reveal
 *
 * Content section slides away to reveal a fixed element behind it,
 * creating a "peeking under" effect. Great for footers or transition sections.
 *
 * Usage:
 *   import { ParallaxReveal } from 'gsap-animation-library';
 *
 *   new ParallaxReveal('.content-section', {
 *     revealSelector: '.fixed-footer',
 *     clipPath: true,
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ParallaxReveal {
  constructor(contentSelector, options = {}) {
    this.content = document.querySelector(contentSelector);
    if (!this.content) {
      console.warn(`ParallaxReveal: Content "${contentSelector}" not found`);
      return;
    }

    this.options = {
      revealSelector: '.parallax-reveal-target',
      blocksSelector: '.parallax-block',
      useClipPath: true,          // Use clip-path for reveal effect
      clipPathStart: 'inset(0 0 0 0)',
      clipPathEnd: 'inset(0 0 100% 0)',
      parallaxAmount: 100,        // How much the content moves up
      triggerStart: 'top 60%',
      staggerBlocks: true,        // Stagger block animations
      staggerDelay: 0.1,
      ...options,
    };

    this.reveal = document.querySelector(this.options.revealSelector);
    this.blocks = this.content.querySelectorAll(this.options.blocksSelector);
    this.trigger = null;

    this.init();
  }

  init() {
    // Animate blocks when section comes into view
    if (this.blocks.length > 0) {
      this.trigger = ScrollTrigger.create({
        trigger: this.content,
        start: this.options.triggerStart,
        onEnter: () => this.animateBlocks(),
      });
    }

    // Clip-path reveal effect
    if (this.options.useClipPath && this.reveal) {
      gsap.to(this.content, {
        clipPath: this.options.clipPathEnd,
        ease: 'none',
        scrollTrigger: {
          trigger: this.content,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Parallax movement
    gsap.to(this.content, {
      y: -this.options.parallaxAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: this.content,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  animateBlocks() {
    this.blocks.forEach((block, i) => {
      setTimeout(() => {
        block.classList.add('is-visible');
      }, this.options.staggerBlocks ? i * (this.options.staggerDelay * 1000) : 0);
    });

    // Reveal the fixed element
    if (this.reveal) {
      setTimeout(() => {
        this.reveal.classList.add('is-visible');
      }, this.blocks.length * (this.options.staggerDelay * 1000) + 300);
    }
  }

  destroy() {
    if (this.trigger) {
      this.trigger.kill();
    }
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === this.content) {
        st.kill();
      }
    });
  }

  static getCSS() {
    return `
/* ============================================================
   PARALLAX REVEAL - Component 5
   ============================================================ */

.parallax-section {
  position: relative;
  z-index: 2;
  background: var(--section-bg, #0a0f1a);
  clip-path: inset(0 0 0 0);
  will-change: clip-path;
}

.parallax-reveal-target {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.parallax-reveal-target.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.parallax-block {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.parallax-block.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered animation delays */
.parallax-block:nth-child(1) { transition-delay: 0s; }
.parallax-block:nth-child(2) { transition-delay: 0.1s; }
.parallax-block:nth-child(3) { transition-delay: 0.2s; }
.parallax-block:nth-child(4) { transition-delay: 0.3s; }
`;
  }

  static getHTML(options = {}) {
    const opts = {
      blocks: [
        { title: 'Block 1', content: 'Content for block 1' },
        { title: 'Block 2', content: 'Content for block 2' },
      ],
      footerContent: 'Footer content here',
      ...options,
    };

    return `
<section class="parallax-section">
  <div class="parallax-wrapper">
    ${opts.blocks.map((block) => `
    <div class="parallax-block">
      <h3>${block.title}</h3>
      <p>${block.content}</p>
    </div>`).join('')}
  </div>
</section>

<footer class="parallax-reveal-target">
  ${opts.footerContent}
</footer>
`;
  }
}

export default ParallaxReveal;
