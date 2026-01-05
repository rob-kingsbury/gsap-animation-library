/**
 * SMOOTH SCROLL UTILITY
 *
 * Lenis-based smooth scrolling with GSAP integration.
 *
 * Usage:
 *   import { initSmoothScroll, getLenis } from 'gsap-animation-library';
 *
 *   initSmoothScroll();
 *
 *   // Later, get the instance
 *   getLenis().scrollTo('#section');
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance = null;

export function initSmoothScroll(options = {}) {
  if (lenisInstance) return lenisInstance;

  const config = {
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    ...options,
  };

  lenisInstance = new Lenis(config);

  // Connect to GSAP
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Handle anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenisInstance.scrollTo(target, { offset: 0, duration: 1.5 });
      }
    });
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function destroySmoothScroll() {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

export default initSmoothScroll;
