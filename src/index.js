/**
 * GSAP ANIMATION LIBRARY
 *
 * A modular, component-based library of reusable scroll animations.
 *
 * QUICK START (Auto-init with data attributes):
 * =============================================
 *
 *   <script type="module">
 *     import { init } from './gsap-animation-library/src/index.js';
 *     init();
 *   </script>
 *
 *   <div data-anim="1">Your stacking cards here</div>
 *   <div data-anim="video-scale" data-anim-end-scale="1.5">Video here</div>
 *
 *
 * ANIMATION NUMBERS:
 * ==================
 *   1 = Stacking Cards (concom.tv style)
 *   2 = Video Scale on Scroll
 *   3 = Image Reveal / Grow
 *   4 = Text / Quote Explosion
 *   5 = Parallax Footer Reveal
 *   6 = Progress Nav with Blob
 *
 *
 * MANUAL USAGE:
 * =============
 *
 *   import { StackingCards, VideoScaleOnScroll } from './gsap-animation-library';
 *
 *   new StackingCards('.my-container', { scaleAmount: 0.15 });
 *   new VideoScaleOnScroll('.hero-video', { endScale: 1.5 });
 */

// Core dependencies
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Components
export { StackingCards } from './components/StackingCards.js';
export { VideoScaleOnScroll } from './components/VideoScaleOnScroll.js';
export { ImageReveal } from './components/ImageReveal.js';
export { TextExplosion } from './components/TextExplosion.js';
export { ParallaxReveal } from './components/ParallaxReveal.js';
export { ProgressNavBlob } from './components/ProgressNavBlob.js';

// Auto-init utilities
export {
  autoInit,
  initAnimations,
  getAnimationCSS,
  getAnimationHTML,
  injectCSS,
  getAllCSS,
  ANIMATIONS,
} from './utils/AutoInit.js';

// Smooth scroll setup
import { initSmoothScroll as _initSmoothScroll, getLenis as _getLenis, destroySmoothScroll as _destroySmoothScroll } from './utils/SmoothScroll.js';
export const initSmoothScroll = _initSmoothScroll;
export const getLenis = _getLenis;
export const destroySmoothScroll = _destroySmoothScroll;

// Import for init function
import { autoInit as _autoInit, injectCSS as _injectCSS } from './utils/AutoInit.js';

// Main initialization function
export function init(options = {}) {
  const {
    smoothScroll = true,
    autoInitAnimations = true,
    injectStyles = true,
    container = document,
  } = options;

  // Initialize smooth scrolling
  let lenisInstance = null;
  if (smoothScroll) {
    lenisInstance = _initSmoothScroll();
  }

  // Inject CSS if requested
  if (injectStyles) {
    _injectCSS();
  }

  // Auto-initialize animations
  let instances = [];
  if (autoInitAnimations) {
    instances = _autoInit(container);
  }

  return {
    lenis: lenisInstance,
    instances,
    refresh: () => ScrollTrigger.refresh(),
  };
}

// Version
export const VERSION = '1.0.0';
