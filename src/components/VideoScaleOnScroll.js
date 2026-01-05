/**
 * COMPONENT 2: Video Scale on Scroll
 *
 * Video or image grows/scales as user scrolls, creating an immersive
 * zoom effect. Often used in hero sections.
 *
 * Usage:
 *   import { VideoScaleOnScroll } from 'gsap-animation-library';
 *
 *   new VideoScaleOnScroll('.hero-video', {
 *     startScale: 1,
 *     endScale: 1.3,
 *     trigger: '.section--hero',
 *   });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class VideoScaleOnScroll {
  constructor(elementSelector, options = {}) {
    this.element = document.querySelector(elementSelector);
    if (!this.element) {
      console.warn(`VideoScaleOnScroll: Element "${elementSelector}" not found`);
      return;
    }

    this.options = {
      trigger: null,           // Custom trigger element (defaults to element itself)
      startScale: 1,           // Starting scale
      endScale: 1.3,           // Ending scale
      start: 'top top',        // ScrollTrigger start
      end: 'bottom top',       // ScrollTrigger end
      scrub: true,             // Smooth scrubbing
      ease: 'none',            // Easing function
      ...options,
    };

    this.trigger = null;
    this.init();
  }

  init() {
    const triggerElement = this.options.trigger
      ? document.querySelector(this.options.trigger)
      : this.element.parentElement;

    this.animation = gsap.to(this.element, {
      scale: this.options.endScale,
      ease: this.options.ease,
      scrollTrigger: {
        trigger: triggerElement,
        start: this.options.start,
        end: this.options.end,
        scrub: this.options.scrub,
      },
    });

    this.trigger = this.animation.scrollTrigger;
  }

  destroy() {
    if (this.trigger) {
      this.trigger.kill();
    }
    if (this.animation) {
      this.animation.kill();
    }
  }

  static getCSS() {
    return `
/* ============================================================
   VIDEO SCALE ON SCROLL - Component 2
   ============================================================ */

.hero-video-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform-origin: center center;
}

/* Optional overlay for text readability */
.hero-video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
}
`;
  }

  static getHTML(options = {}) {
    const opts = {
      videoSrc: 'video.mp4',
      posterSrc: 'poster.jpg',
      ...options,
    };

    return `
<div class="hero-video-container">
  <video
    class="hero-video"
    autoplay
    muted
    loop
    playsinline
    poster="${opts.posterSrc}"
  >
    <source src="${opts.videoSrc}" type="video/mp4">
  </video>
  <div class="hero-video-overlay"></div>
</div>
`;
  }
}

export default VideoScaleOnScroll;
