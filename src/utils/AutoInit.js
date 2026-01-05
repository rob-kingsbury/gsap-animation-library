/**
 * AUTO-INIT SYSTEM
 *
 * Automatically initializes animations based on data attributes.
 * Just add data-anim="1" or data-anim="stacking-cards" to any element!
 *
 * Usage:
 *   <div data-anim="1">...</div>
 *   <div data-anim="stacking-cards" data-anim-scale="0.15">...</div>
 *
 * Or import and call manually:
 *   import { autoInit } from 'gsap-animation-library';
 *   autoInit();
 */

import { StackingCards } from '../components/StackingCards.js';
import { VideoScaleOnScroll } from '../components/VideoScaleOnScroll.js';
import { ImageReveal } from '../components/ImageReveal.js';
import { TextExplosion } from '../components/TextExplosion.js';
import { ParallaxReveal } from '../components/ParallaxReveal.js';
import { ProgressNavBlob } from '../components/ProgressNavBlob.js';

// Animation registry - map numbers and names to components
export const ANIMATIONS = {
  // By number
  1: { component: StackingCards, name: 'stacking-cards' },
  2: { component: VideoScaleOnScroll, name: 'video-scale' },
  3: { component: ImageReveal, name: 'image-reveal' },
  4: { component: TextExplosion, name: 'text-explosion' },
  5: { component: ParallaxReveal, name: 'parallax-reveal' },
  6: { component: ProgressNavBlob, name: 'progress-nav' },

  // By name (aliases)
  'stacking-cards': { component: StackingCards, name: 'stacking-cards' },
  'video-scale': { component: VideoScaleOnScroll, name: 'video-scale' },
  'image-reveal': { component: ImageReveal, name: 'image-reveal' },
  'text-explosion': { component: TextExplosion, name: 'text-explosion' },
  'parallax-reveal': { component: ParallaxReveal, name: 'parallax-reveal' },
  'progress-nav': { component: ProgressNavBlob, name: 'progress-nav' },
};

// Parse data attributes into options object
function parseDataOptions(element, prefix = 'anim') {
  const options = {};
  const attrs = element.attributes;

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name.startsWith(`data-${prefix}-`)) {
      // Convert data-anim-scale-amount to scaleAmount
      const key = attr.name
        .replace(`data-${prefix}-`, '')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      // Try to parse as number or boolean
      let value = attr.value;
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(value) && value !== '') value = parseFloat(value);

      options[key] = value;
    }
  }

  return options;
}

// Initialize a single element
function initElement(element) {
  const animId = element.getAttribute('data-anim');
  if (!animId) return null;

  const animConfig = ANIMATIONS[animId];
  if (!animConfig) {
    console.warn(`Unknown animation: "${animId}". Available: 1-6 or names like "stacking-cards"`);
    return null;
  }

  const options = parseDataOptions(element);
  const Component = animConfig.component;

  // Create unique selector for this element
  if (!element.id) {
    element.id = `anim-${animConfig.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return new Component(`#${element.id}`, options);
}

// Initialize all elements with data-anim attribute
export function autoInit(container = document) {
  const elements = container.querySelectorAll('[data-anim]');
  const instances = [];

  elements.forEach((element) => {
    const instance = initElement(element);
    if (instance) {
      instances.push(instance);
    }
  });

  return instances;
}

// Initialize specific animations by number
export function initAnimations(numbers = [], container = document) {
  const instances = [];

  numbers.forEach((num) => {
    const animConfig = ANIMATIONS[num];
    if (!animConfig) {
      console.warn(`Unknown animation number: ${num}`);
      return;
    }

    const elements = container.querySelectorAll(`[data-anim="${num}"], [data-anim="${animConfig.name}"]`);
    elements.forEach((element) => {
      const instance = initElement(element);
      if (instance) {
        instances.push(instance);
      }
    });
  });

  return instances;
}

// Get CSS for specific animations
export function getAnimationCSS(numbers = []) {
  let css = '';

  numbers.forEach((num) => {
    const animConfig = ANIMATIONS[num];
    if (animConfig && animConfig.component.getCSS) {
      css += animConfig.component.getCSS() + '\n';
    }
  });

  return css;
}

// Get HTML template for specific animation
export function getAnimationHTML(num, options = {}) {
  const animConfig = ANIMATIONS[num];
  if (animConfig && animConfig.component.getHTML) {
    return animConfig.component.getHTML(options);
  }
  return '';
}

// Inject CSS into document
export function injectCSS(numbers = []) {
  const css = numbers.length > 0 ? getAnimationCSS(numbers) : getAllCSS();
  const style = document.createElement('style');
  style.id = 'gsap-animation-library-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

// Get all CSS
export function getAllCSS() {
  return Object.values(ANIMATIONS)
    .filter((config, index, arr) =>
      arr.findIndex((c) => c.name === config.name) === index
    )
    .map((config) => config.component.getCSS ? config.component.getCSS() : '')
    .join('\n');
}

export default autoInit;
