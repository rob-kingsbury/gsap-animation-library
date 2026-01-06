/**
 * Scans example folders and generates manifest.json
 * Run: node build-manifest.js
 */

const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = __dirname;
const OUTPUT_FILE = path.join(EXAMPLES_DIR, 'manifest.json');

// Category metadata
const categoryMeta = {
  scroll: { icon: '↕', label: 'Scroll Animations' },
  text: { icon: 'Aa', label: 'Text Animations' },
  cards: { icon: '▢', label: 'Card Animations' },
  navigation: { icon: '☰', label: 'Navigation' },
  hero: { icon: '★', label: 'Hero Animations' },
  'micro-interactions': { icon: '✦', label: 'Micro Interactions' },
};

// Extract title from HTML file
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/<title>([^<]+)<\/title>/i);
    if (match) {
      // Clean up title - remove " | GSAP Animation Library" etc
      return match[1]
        .replace(/\s*\|\s*GSAP.*$/i, '')
        .replace(/\s*-\s*GSAP.*$/i, '')
        .trim();
    }
  } catch (e) {}

  // Fallback: convert filename to title
  return path.basename(filePath, '.html')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Extract description from HTML (look for meta description or first paragraph)
function extractDescription(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Try meta description
    const metaMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (metaMatch) return metaMatch[1];

    // Try first .anim-desc or .demo-desc
    const descMatch = content.match(/class=["'][^"']*desc[^"']*["'][^>]*>([^<]+)</i);
    if (descMatch) return descMatch[1].trim();

  } catch (e) {}
  return '';
}

// Scan a category folder
function scanCategory(categoryName) {
  const categoryPath = path.join(EXAMPLES_DIR, categoryName);

  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    return null;
  }

  const files = fs.readdirSync(categoryPath)
    .filter(f => f.endsWith('.html'))
    .map(filename => {
      const filePath = path.join(categoryPath, filename);
      return {
        file: `${categoryName}/${filename}`,
        title: extractTitle(filePath),
        description: extractDescription(filePath),
      };
    });

  if (files.length === 0) return null;

  const meta = categoryMeta[categoryName] || { icon: '•', label: categoryName };

  return {
    id: categoryName,
    label: meta.label,
    icon: meta.icon,
    examples: files,
  };
}

// Scan root-level standalone examples
function scanStandalone() {
  const files = fs.readdirSync(EXAMPLES_DIR)
    .filter(f => f.endsWith('.html') && !['index.html', 'gallery.html'].includes(f))
    .map(filename => {
      const filePath = path.join(EXAMPLES_DIR, filename);
      return {
        file: filename,
        title: extractTitle(filePath),
        description: extractDescription(filePath),
      };
    });

  if (files.length === 0) return null;

  return {
    id: 'standalone',
    label: 'Standalone',
    icon: '◈',
    examples: files,
  };
}

// Main
function buildManifest() {
  const categories = [];

  // Scan known category folders
  const folders = fs.readdirSync(EXAMPLES_DIR)
    .filter(f => {
      const fullPath = path.join(EXAMPLES_DIR, f);
      return fs.statSync(fullPath).isDirectory() && !f.startsWith('.') && f !== 'node_modules';
    });

  for (const folder of folders) {
    const category = scanCategory(folder);
    if (category) categories.push(category);
  }

  // Add standalone examples
  const standalone = scanStandalone();
  if (standalone) categories.push(standalone);

  // Build manifest
  const manifest = {
    generated: new Date().toISOString(),
    totalExamples: categories.reduce((sum, cat) => sum + cat.examples.length, 0),
    categories,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`  ${manifest.totalExamples} examples across ${categories.length} categories`);
}

buildManifest();
