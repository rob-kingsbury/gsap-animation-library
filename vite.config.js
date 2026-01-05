import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'GSAPAnimationLibrary',
      fileName: 'gsap-animation-library',
    },
    rollupOptions: {
      external: ['gsap', 'gsap/ScrollTrigger', 'lenis'],
      output: {
        globals: {
          gsap: 'gsap',
          'gsap/ScrollTrigger': 'ScrollTrigger',
          lenis: 'Lenis',
        },
      },
    },
  },
  server: {
    port: 3001,
    open: '/examples/index.html',
  },
});
