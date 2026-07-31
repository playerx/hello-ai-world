import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="rain" aria-hidden="true"></div>
  <h1>
    Hi Ellen
    <span class="emoji emoji-bounce">👋</span>
    <span class="emoji emoji-spin">🎉</span>
    <span class="emoji emoji-pulse">💖</span>
  </h1>
`;

const EMOJIS = ['👋', '🎉', '💖', '✨', '🌈', '⭐', '😄', '🎈'];

const rain = document.querySelector('.rain');
for (let i = 0; i < 40; i++) {
  const drop = document.createElement('span');
  drop.className = 'drop';
  drop.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  drop.style.left = `${Math.random() * 100}%`;
  drop.style.fontSize = `${1 + Math.random() * 1.5}rem`;
  drop.style.animationDuration = `${2 + Math.random() * 3}s`;
  drop.style.animationDelay = `${Math.random() * 4}s`;
  drop.style.opacity = 0.5 + Math.random() * 0.5;
  rain.appendChild(drop);
}
