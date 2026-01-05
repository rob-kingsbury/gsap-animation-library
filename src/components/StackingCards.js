/**
 * COMPONENT 1: Stacking Cards
 *
 * Creates a stacked card effect where cards stick and scale down
 * as the next card scrolls over them, like papers stacking.
 *
 * Inspired by: concom.tv services section
 *
 * Usage:
 *   import { StackingCards } from 'gsap-animation-library';
 *
 *   new StackingCards('.stack-container', {
 *     cardSelector: '.stack-card',
 *     scaleAmount: 0.1,
 *     staggerOffset: 30,
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class StackingCards {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn(`StackingCards: Container "${containerSelector}" not found`);
      return;
    }

    // Default options
    this.options = {
      cardSelector: '.stack-card',
      scaleAmount: 0.1,        // How much to scale down (0.1 = scale to 0.9)
      staggerOffset: 30,       // Pixels between card tops
      baseTop: 32,             // Base top position in pixels
      scrollDistance: '200%',  // How far to scroll before card is fully scaled
      ...options,
    };

    this.cards = this.container.querySelectorAll(this.options.cardSelector);
    this.triggers = [];

    this.init();
  }

  init() {
    if (this.cards.length === 0) return;

    this.cards.forEach((card, index) => {
      // Set staggered top positions
      card.style.top = `${this.options.baseTop + index * this.options.staggerOffset}px`;
      card.style.zIndex = index + 1;

      // Skip the last card - it doesn't need to scale down
      if (index === this.cards.length - 1) return;

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        end: `+=${this.options.scrollDistance}`,
        scrub: true,
        onUpdate: (self) => {
          const scale = 1 - self.progress * this.options.scaleAmount;
          card.style.transform = `scale(${scale})`;
        },
      });

      this.triggers.push(trigger);
    });
  }

  // Destroy all ScrollTriggers
  destroy() {
    this.triggers.forEach((trigger) => trigger.kill());
    this.triggers = [];
  }

  // Refresh ScrollTriggers (call after DOM changes)
  refresh() {
    ScrollTrigger.refresh();
  }

  // Get required CSS
  static getCSS(options = {}) {
    const opts = {
      cardWidth: 'calc(100% - 8rem)',
      cardMinHeight: '85vh',
      borderRadius: '24px',
      colors: ['#1a2744', '#2d1f3d', '#1f3d2d', '#3d2d1f'],
      ...options,
    };

    return `
/* ============================================================
   STACKING CARDS - Component 1
   ============================================================ */

.stack-container {
  position: relative;
  padding-bottom: 50vh;
}

.stack-card {
  position: sticky;
  width: ${opts.cardWidth};
  margin: 0 auto;
  min-height: ${opts.cardMinHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 5rem;
  will-change: transform;
  transform-origin: center top;
  border-radius: ${opts.borderRadius};
  overflow: hidden;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
}

.stack-card-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  width: 100%;
  max-width: 1400px;
  align-items: center;
}

.stack-card-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.stack-card-image img {
  width: 100%;
  height: auto;
  display: block;
}

.stack-card-content {
  color: #fff;
}

/* Card color variations */
${opts.colors.map((color, i) => `
.stack-card[data-index="${i}"] {
  background: ${color};
}`).join('')}

/* Responsive */
@media (max-width: 1024px) {
  .stack-card {
    width: calc(100% - 4rem);
    padding: 3rem;
  }

  .stack-card-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .stack-card {
    width: calc(100% - 2rem);
    min-height: auto;
    padding: 2rem;
  }
}
`;
  }

  // Get required HTML template
  static getHTML(cards = []) {
    if (cards.length === 0) {
      cards = [
        { title: 'Card 1', content: 'Content for card 1' },
        { title: 'Card 2', content: 'Content for card 2' },
        { title: 'Card 3', content: 'Content for card 3' },
      ];
    }

    return `
<div class="stack-container">
  ${cards.map((card, i) => `
  <article class="stack-card" data-index="${i}">
    <div class="stack-card-inner">
      ${card.image ? `
      <div class="stack-card-image">
        <img src="${card.image}" alt="${card.title}">
      </div>` : ''}
      <div class="stack-card-content">
        <h3>${card.title}</h3>
        <p>${card.content}</p>
      </div>
    </div>
  </article>`).join('')}
</div>
`;
  }
}

export default StackingCards;
