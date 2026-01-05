/**
 * COMPONENT 6: Progress Nav with Blob
 *
 * MetaMask-style navigation with a morphing blob indicator that
 * follows the active section. Dots have tooltips showing section names.
 *
 * Usage:
 *   import { ProgressNavBlob } from 'gsap-animation-library';
 *
 *   new ProgressNavBlob('.progress-nav', {
 *     dotSelector: '.progress-dot',
 *     sections: ['hero', 'about', 'services', 'contact'],
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ProgressNavBlob {
  constructor(navSelector, options = {}) {
    this.nav = document.querySelector(navSelector);
    if (!this.nav) {
      console.warn(`ProgressNavBlob: Nav "${navSelector}" not found`);
      return;
    }

    this.options = {
      dotSelector: '.progress-dot',
      blobSelector: '.progress-blob',
      sectionAttribute: 'data-section',
      dotHeight: 32,
      gap: 12,
      padding: 16,
      showDelay: 1500,          // Delay before showing nav
      scrollDuration: 1.5,      // Smooth scroll duration
      lenis: null,              // Optional Lenis instance for smooth scrolling
      ...options,
    };

    this.blob = this.nav.querySelector(this.options.blobSelector);
    this.dots = this.nav.querySelectorAll(this.options.dotSelector);
    this.sections = document.querySelectorAll(`[${this.options.sectionAttribute}]`);
    this.triggers = [];

    this.init();
  }

  init() {
    if (!this.blob || this.dots.length === 0) return;

    // Show nav after delay
    setTimeout(() => {
      this.nav.classList.add('is-visible');
    }, this.options.showDelay);

    // Track sections
    this.sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.setActive(section.getAttribute(this.options.sectionAttribute)),
        onEnterBack: () => this.setActive(section.getAttribute(this.options.sectionAttribute)),
      });
      this.triggers.push(trigger);
    });

    // Click handlers
    this.dots.forEach((dot) => {
      dot.addEventListener('click', () => this.scrollToSection(dot));
    });
  }

  setActive(sectionId) {
    this.dots.forEach((dot, index) => {
      const isActive = dot.dataset.section === sectionId;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        this.moveBlobTo(index);
      }
    });
  }

  moveBlobTo(index) {
    const targetTop = this.options.padding + index * (this.options.dotHeight + this.options.gap);
    this.blob.classList.add('is-moving');
    this.blob.style.top = `${targetTop}px`;

    setTimeout(() => {
      this.blob.classList.remove('is-moving');
    }, 500);
  }

  scrollToSection(dot) {
    const sectionId = dot.dataset.section;
    const target = document.querySelector(`#${sectionId}`);
    if (!target) return;

    if (this.options.lenis) {
      this.options.lenis.scrollTo(target, { duration: this.options.scrollDuration });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  destroy() {
    this.triggers.forEach((trigger) => trigger.kill());
    this.triggers = [];
  }

  static getCSS() {
    return `
/* ============================================================
   PROGRESS NAV BLOB - Component 6
   ============================================================ */

.progress-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.progress-nav.is-visible {
  opacity: 1;
}

.progress-blob {
  position: absolute;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  transition: top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
              border-radius 0.3s ease;
  z-index: 0;
}

.progress-blob.is-moving {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.progress-dot {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  z-index: 1;
  margin-bottom: 12px;
  transition: border-color 0.3s ease;
}

.progress-dot:last-child {
  margin-bottom: 0;
}

.progress-dot:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.progress-dot.is-active {
  border-color: transparent;
}

/* Tooltip */
.progress-dot::before {
  content: attr(data-label);
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 16px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.progress-dot:hover::before {
  opacity: 1;
  transform: translateY(-50%) translateX(-5px);
}

@media (max-width: 768px) {
  .progress-nav {
    right: 1rem;
    padding: 12px;
  }

  .progress-dot::before {
    display: none;
  }
}
`;
  }

  static getHTML(options = {}) {
    const opts = {
      sections: [
        { id: 'hero', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' },
      ],
      ...options,
    };

    return `
<nav class="progress-nav">
  <div class="progress-blob"></div>
  ${opts.sections.map((section) => `
  <button class="progress-dot" data-section="${section.id}" data-label="${section.label}"></button>`).join('')}
</nav>
`;
  }
}

export default ProgressNavBlob;
