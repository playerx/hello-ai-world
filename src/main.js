import './style.css';

document.querySelector('#app').innerHTML = '<h1>Hi Dato</h1>';

const snowContainer = document.createElement('div');
snowContainer.className = 'snow';
document.body.appendChild(snowContainer);

const SNOWFLAKE_COUNT = 50;
for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
  const flake = document.createElement('div');
  flake.className = 'snowflake';
  flake.textContent = '❄';
  flake.style.left = `${Math.random() * 100}vw`;
  flake.style.animationDuration = `${5 + Math.random() * 10}s`;
  flake.style.animationDelay = `${Math.random() * 10}s`;
  flake.style.fontSize = `${0.5 + Math.random() * 1}rem`;
  flake.style.opacity = `${0.4 + Math.random() * 0.6}`;
  snowContainer.appendChild(flake);
}
