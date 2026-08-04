import './style.css';

const emojis = ['🎉', '🎂', '🥳', '🎈', '🎁', '✨'];

document.querySelector('#app').innerHTML = `
  <canvas id="matrix"></canvas>
  <h1>Happy Birthday!</h1>
  <a class="site-link" href="https://ezeki.ai" target="_blank" rel="noopener">ezeki.ai</a>
`;

const canvas = document.querySelector('#matrix');
const ctx = canvas.getContext('2d');

const fontSize = 28;
let columns;
let drops;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = Array.from({ length: columns }, () => Math.random() * -50);
}

resize();
window.addEventListener('resize', resize);

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = 'center';

  for (let i = 0; i < drops.length; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const x = i * fontSize + fontSize / 2;
    const y = drops[i] * fontSize;

    ctx.fillText(emoji, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  requestAnimationFrame(draw);
}

draw();
