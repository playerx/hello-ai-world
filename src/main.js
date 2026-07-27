import './style.css';

const BOTTLE_SVG = `
<svg viewBox="0 0 40 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 4 h10 v14 c0 4 6 6 6 14 v78 c0 5 -4 9 -9 9 h-4 c-5 0 -9 -4 -9 -9 v-78 c0 -8 6 -10 6 -14 z"
        fill="#3a7d3a" stroke="#1f4d1f" stroke-width="1.5"/>
  <rect x="14" y="0" width="12" height="6" rx="2" fill="#c0392b"/>
  <rect x="8" y="70" width="24" height="34" rx="3" fill="#f2f2f2" opacity="0.9"/>
  <text x="20" y="90" font-size="8" font-family="Georgia, serif" font-style="italic"
        fill="#c0392b" text-anchor="middle">Coke</text>
</svg>`;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="bottle-field"></div>
  <h1>hi Shalva</h1>
`;

const field = app.querySelector('.bottle-field');
const BOTTLE_COUNT = 12;

for (let i = 0; i < BOTTLE_COUNT; i++) {
  const bottle = document.createElement('div');
  bottle.className = 'coke-bottle';
  bottle.innerHTML = BOTTLE_SVG;
  bottle.style.left = `${Math.random() * 100}%`;
  bottle.style.setProperty('--duration', `${6 + Math.random() * 6}s`);
  bottle.style.setProperty('--delay', `${Math.random() * 6}s`);
  bottle.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
  bottle.style.setProperty('--scale', `${0.5 + Math.random() * 0.7}`);
  field.appendChild(bottle);
}
