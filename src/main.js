import './style.css';

document.querySelector('#app').innerHTML = '<h1>hi Lusi</h1>';

const bubbles = document.createElement('div');
bubbles.className = 'bubbles';
document.body.appendChild(bubbles);

for (let i = 0; i < 40; i++) {
  const bubble = document.createElement('span');
  bubble.className = 'bubble';
  const size = 4 + Math.random() * 10;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
  bubble.style.animationDuration = `${4 + Math.random() * 6}s`;
  bubble.style.animationDelay = `${Math.random() * 6}s`;
  bubbles.appendChild(bubble);
}
