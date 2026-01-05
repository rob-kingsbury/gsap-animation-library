# GSAP Animation Library

A modular, component-based library of reusable scroll animations built with GSAP, ScrollTrigger, and Lenis.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Use with Data Attributes (Easiest)

Simply add `data-anim` to any element:

```html
<div data-anim="1">
  <!-- Your stacking cards content -->
</div>

<div data-anim="video-scale" data-anim-end-scale="1.5">
  <!-- Your video content -->
</div>

<script type="module">
  import { init } from './gsap-animation-library/src/index.js';
  init();
</script>
```

That's it! The library automatically:
- Injects all required CSS
- Initializes smooth scrolling (Lenis)
- Sets up all animations based on data attributes

---

## Animation Reference

| # | Name | Data Attribute | Description |
|---|------|----------------|-------------|
| 1 | Stacking Cards | `data-anim="1"` or `data-anim="stacking-cards"` | Cards stack on scroll with scale-down effect |
| 2 | Video Scale | `data-anim="2"` or `data-anim="video-scale"` | Video/image grows as you scroll |
| 3 | Image Reveal | `data-anim="3"` or `data-anim="image-reveal"` | Dramatic mask reveal with scale |
| 4 | Text Explosion | `data-anim="4"` or `data-anim="text-explosion"` | Words fly in, then explode outward |
| 5 | Parallax Reveal | `data-anim="5"` or `data-anim="parallax-reveal"` | Content reveals fixed element behind |
| 6 | Progress Nav | `data-anim="6"` or `data-anim="progress-nav"` | Blob navigation following scroll |

---

## Customization

### Via Data Attributes

Pass options using `data-anim-*` attributes:

```html
<!-- Stacking cards with custom scale -->
<div data-anim="1" data-anim-scale-amount="0.15" data-anim-stagger-offset="40">
  ...
</div>

<!-- Video with larger scale -->
<div data-anim="2" data-anim-end-scale="1.5" data-anim-start="top top">
  ...
</div>
```

### Via JavaScript

For full control, import and instantiate components directly:

```javascript
import { StackingCards, VideoScaleOnScroll } from './gsap-animation-library/src/index.js';

// With custom options
new StackingCards('.my-container', {
  scaleAmount: 0.15,
  staggerOffset: 40,
  baseTop: 32,
});

new VideoScaleOnScroll('.hero-video', {
  startScale: 1,
  endScale: 1.5,
  trigger: '.section--hero',
});
```

---

## Component Options

### 1. Stacking Cards

```javascript
{
  cardSelector: '.stack-card',  // Selector for cards
  scaleAmount: 0.1,             // How much to scale down (0.1 = 90%)
  staggerOffset: 30,            // Pixels between card tops
  baseTop: 32,                  // Base sticky position
  scrollDistance: '200%',       // Scroll distance for scale animation
}
```

### 2. Video Scale on Scroll

```javascript
{
  trigger: null,        // Custom trigger (defaults to parent)
  startScale: 1,        // Starting scale
  endScale: 1.3,        // Ending scale
  start: 'top top',     // ScrollTrigger start
  end: 'bottom top',    // ScrollTrigger end
  scrub: true,          // Smooth scrubbing
}
```

### 3. Image Reveal

```javascript
{
  direction: 'left',       // 'left', 'right', 'top', 'bottom'
  duration: 1.2,           // Animation duration
  startScale: 1.2,         // Image starts scaled up
  endScale: 1,             // Image ends at normal scale
  triggerStart: 'top 60%', // When to trigger
  useScrollTrigger: true,  // Auto-trigger on scroll
}
```

### 4. Text Explosion

```javascript
{
  textSelector: '.explosion-line',
  lineStaggerPercent: 10,      // Scroll % between each line
  explodeAt: '75%',            // When to trigger explosion
  explosionDistance: 400,      // Min distance words travel
  explosionDistanceMax: 600,   // Max additional distance
  rotationRange: 120,          // Max rotation in degrees
}
```

### 5. Parallax Reveal

```javascript
{
  revealSelector: '.parallax-reveal-target',
  useClipPath: true,           // Use clip-path effect
  parallaxAmount: 100,         // Content movement amount
  staggerBlocks: true,         // Stagger block animations
  staggerDelay: 0.1,           // Delay between blocks
}
```

### 6. Progress Nav Blob

```javascript
{
  dotSelector: '.progress-dot',
  blobSelector: '.progress-blob',
  dotHeight: 32,
  gap: 12,
  padding: 16,
  showDelay: 1500,       // Delay before showing nav
  scrollDuration: 1.5,   // Smooth scroll duration
  lenis: null,           // Optional Lenis instance
}
```

---

## Page Builder Tool

Open `examples/index.html` in your browser to use the visual page builder:

1. Select animations from the sidebar
2. Preview the wireframe layout
3. Generate ready-to-use code
4. Copy and customize for your project

---

## API Reference

### init(options)

Initialize everything at once:

```javascript
import { init } from './gsap-animation-library/src/index.js';

const { lenis, instances, refresh } = init({
  smoothScroll: true,       // Enable Lenis smooth scroll
  autoInitAnimations: true, // Auto-init data-anim elements
  injectStyles: true,       // Auto-inject CSS
  container: document,      // Container to search for elements
});
```

### autoInit(container)

Initialize only elements with `data-anim`:

```javascript
import { autoInit } from './gsap-animation-library/src/index.js';

const instances = autoInit(document);
```

### initAnimations(numbers, container)

Initialize specific animations:

```javascript
import { initAnimations } from './gsap-animation-library/src/index.js';

// Only initialize animations 1 and 3
const instances = initAnimations([1, 3]);
```

### getAnimationCSS(numbers)

Get CSS for specific animations:

```javascript
import { getAnimationCSS } from './gsap-animation-library/src/index.js';

const css = getAnimationCSS([1, 2, 4]);
```

### injectCSS(numbers)

Inject CSS into the document:

```javascript
import { injectCSS } from './gsap-animation-library/src/index.js';

// Inject CSS for animations 1, 2, and 3
injectCSS([1, 2, 3]);

// Or inject all CSS
injectCSS();
```

### Static Methods

Each component has static methods for HTML and CSS templates:

```javascript
import { StackingCards } from './gsap-animation-library/src/index.js';

// Get CSS template
const css = StackingCards.getCSS({
  cardWidth: 'calc(100% - 8rem)',
  colors: ['#1a2744', '#2d1f3d', '#1f3d2d'],
});

// Get HTML template
const html = StackingCards.getHTML([
  { title: 'Card 1', content: 'Content 1', image: 'img1.jpg' },
  { title: 'Card 2', content: 'Content 2', image: 'img2.jpg' },
]);
```

---

## Example Usage

### Full Page with Multiple Animations

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Animated Page</title>
</head>
<body>
  <!-- Progress Navigation -->
  <nav data-anim="6" class="progress-nav">
    <div class="progress-blob"></div>
    <button class="progress-dot" data-section="hero" data-label="Home"></button>
    <button class="progress-dot" data-section="about" data-label="About"></button>
    <button class="progress-dot" data-section="services" data-label="Services"></button>
  </nav>

  <!-- Hero with Video Scale -->
  <section id="hero" data-section="hero">
    <div data-anim="2" class="hero-video-container">
      <video class="hero-video" autoplay muted loop playsinline>
        <source src="hero.mp4" type="video/mp4">
      </video>
    </div>
  </section>

  <!-- About with Image Reveal -->
  <section id="about" data-section="about">
    <div data-anim="3" class="image-reveal-container">
      <div class="image-revealer"></div>
      <img class="reveal-image" src="about.jpg" alt="About">
    </div>
  </section>

  <!-- Services with Stacking Cards -->
  <section id="services" data-section="services">
    <div data-anim="1" class="stack-container">
      <article class="stack-card" data-index="0">Service 1</article>
      <article class="stack-card" data-index="1">Service 2</article>
      <article class="stack-card" data-index="2">Service 3</article>
    </div>
  </section>

  <script type="module">
    import { init } from './gsap-animation-library/src/index.js';
    init();
  </script>
</body>
</html>
```

---

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build
```

---

## License

MIT
