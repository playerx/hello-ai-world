// Generates public/og.png (1200x630) — the Open Graph card for the portfolio.
// Run: node scripts/generate-og.js
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e0f13"/>
      <stop offset="1" stop-color="#1a1c26"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e8b04b"/>
      <stop offset="1" stop-color="#f2cd80"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- decorative rings, echoing the site's gold accent -->
  <circle cx="1060" cy="110" r="220" fill="none" stroke="#e8b04b" stroke-opacity="0.12" stroke-width="2"/>
  <circle cx="1060" cy="110" r="160" fill="none" stroke="#e8b04b" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="1060" cy="110" r="100" fill="none" stroke="#e8b04b" stroke-opacity="0.25" stroke-width="2"/>
  <circle cx="120" cy="560" r="180" fill="none" stroke="#e8b04b" stroke-opacity="0.1" stroke-width="2"/>

  <rect x="100" y="150" width="56" height="6" rx="3" fill="url(#gold)"/>

  <text x="100" y="205" font-family="DejaVu Sans, sans-serif" font-size="26" letter-spacing="6"
        fill="#e8b04b" font-weight="600">HELLO, I'M</text>

  <text x="96" y="310" font-family="DejaVu Sans, sans-serif" font-size="86" font-weight="bold"
        fill="#f0f1f5">Lizi Tkeshelashvili</text>

  <text x="100" y="380" font-family="DejaVu Sans, sans-serif" font-size="38"
        fill="#c9c9d4">Event &amp; Project Coordinator</text>

  <text x="100" y="470" font-family="DejaVu Sans, sans-serif" font-size="26"
        fill="#9aa0ae">Events · Operations · Logistics · Theatre Production</text>

  <text x="100" y="545" font-family="DejaVu Sans, sans-serif" font-size="24"
        fill="#e8b04b">Tbilisi, Georgia</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(root, 'public', 'og.png'));

console.log('public/og.png written');
