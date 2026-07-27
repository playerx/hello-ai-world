import './style.css';

function khinkaliSVG(size) {
  return `
  <svg width="${size}" height="${Math.round(size * 1.15)}" viewBox="0 0 120 138" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dough" cx="42%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#f9efd8"/>
        <stop offset="65%" stop-color="#eeddb4"/>
        <stop offset="100%" stop-color="#d9bf8a"/>
      </radialGradient>
    </defs>
    <!-- body -->
    <path d="M60 34 C34 36 20 58 18 88 C16 114 36 130 60 130 C84 130 104 114 102 88 C100 58 86 36 60 34 Z"
          fill="url(#dough)" stroke="#c2a065" stroke-width="3" stroke-linejoin="round"/>
    <!-- pleats fanning down from the knot -->
    <path d="M60 36 C38 50 28 68 26 92" stroke="#cbab72" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M60 36 C48 54 43 78 45 108" stroke="#cbab72" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M60 36 L60 114" stroke="#cbab72" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M60 36 C72 54 77 78 75 108" stroke="#cbab72" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M60 36 C82 50 92 68 94 92" stroke="#cbab72" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <!-- twisted topknot -->
    <path d="M50 33 C48 26 49 17 54 13 C57 10 63 10 66 13 C71 17 72 26 70 33 C70 39 50 39 50 33 Z"
          fill="#e6d09f" stroke="#c2a065" stroke-width="3" stroke-linejoin="round"/>
    <path d="M52 27 C58 24 62 24 68 27" stroke="#c2a065" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M53 20 C58 17 62 17 67 20" stroke="#c2a065" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- soft highlight -->
    <ellipse cx="44" cy="62" rx="10" ry="16" fill="#fff" opacity="0.35" transform="rotate(-18 44 62)"/>
  </svg>`;
}

document.querySelector('#app').innerHTML = `
  <h1>Hi Ani</h1>
  <p class="portfolio-link"><a href="/portfolio.html">View Ana's portfolio →</a></p>
  <div class="khinkali-hero">
    <div class="steam s1"></div>
    <div class="steam s2"></div>
    <div class="steam s3"></div>
    ${khinkaliSVG(110)}
  </div>
`;

const floatFoods = ['🍣', '🍤', '🍙', '🍥', '🍱', '🍣', '🍤', '🍙'];
for (const food of floatFoods) {
  const s = document.createElement('div');
  s.className = 'floaty sushi';
  s.textContent = food;
  s.style.left = `${Math.random() * 94}vw`;
  s.style.fontSize = `${1.4 + Math.random() * 1.5}rem`;
  s.style.animationDuration = `${11 + Math.random() * 12}s`;
  s.style.animationDelay = `${Math.random() * 14}s`;
  document.body.appendChild(s);
}

for (let i = 0; i < 3; i++) {
  const k = document.createElement('div');
  k.className = 'floaty';
  k.innerHTML = khinkaliSVG(38 + Math.random() * 30);
  k.style.left = `${Math.random() * 94}vw`;
  k.style.animationDuration = `${13 + Math.random() * 10}s`;
  k.style.animationDelay = `${Math.random() * 14}s`;
  document.body.appendChild(k);
}

const planeCount = 6;
const planes = [];

for (let i = 0; i < planeCount; i++) {
  const el = document.createElement('div');
  el.className = 'airplane';
  el.textContent = '✈️';
  document.body.appendChild(el);
  planes.push(spawnPlane(el, Math.random() * -800));
}

function spawnPlane(el, x) {
  const depth = 0.5 + Math.random() * 0.9; // scale ⇒ near/far illusion
  const reversed = Math.random() < 0.35;
  return {
    el,
    x: x ?? -100,
    baseY: (10 + Math.random() * 75) * window.innerHeight / 100,
    speed: (90 + Math.random() * 120) * depth,
    depth,
    reversed,
    waveAmp: 20 + Math.random() * 60,
    waveFreq: 0.4 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
    trailTimer: 0,
  };
}

let lastTime = performance.now();
function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const w = window.innerWidth;

  for (const p of planes) {
    p.x += p.speed * dt;
    const t = p.x / 100;
    const y = p.baseY + Math.sin(t * p.waveFreq + p.phase) * p.waveAmp;
    // bank the plane along the slope of its wave
    const slope = Math.cos(t * p.waveFreq + p.phase) * p.waveAmp * p.waveFreq / 100;
    const angle = Math.atan2(slope, 1) * (180 / Math.PI);

    const screenX = p.reversed ? w - p.x : p.x;
    const flip = p.reversed ? ' scaleX(-1)' : '';
    const el = p.el;
    el.style.transform =
      `translate(${screenX}px, ${y}px) rotate(${p.reversed ? -angle : angle}deg) scale(${p.depth})${flip}`;
    el.style.opacity = 0.4 + p.depth * 0.5;

    p.trailTimer -= dt;
    if (p.trailTimer <= 0) {
      p.trailTimer = 0.09;
      puff(screenX + (p.reversed ? 34 * p.depth : -6), y + 10 * p.depth, p.depth);
    }

    if (p.x > w + 150) Object.assign(p, spawnPlane(p.el, -100 - Math.random() * 400));
  }
  requestAnimationFrame(tick);
}

function puff(x, y, depth) {
  const dot = document.createElement('div');
  dot.className = 'puff';
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.style.width = dot.style.height = `${6 * depth}px`;
  document.body.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
}

requestAnimationFrame(tick);
