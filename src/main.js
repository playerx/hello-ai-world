import './style.css';

const iceCream = `
  <svg class="ice-cream" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <!-- scoop -->
    <circle cx="50" cy="42" r="30" fill="#f7e26b" />
    <circle cx="38" cy="34" r="9" fill="#fdf3a8" />
    <!-- drips -->
    <path d="M28 60 q0 12 6 12 t6 -12 Z" fill="#f7e26b" />
    <path d="M58 64 q0 10 5 10 t5 -10 Z" fill="#f7e26b" />
    <!-- lemon slice garnish -->
    <g transform="translate(68,22) rotate(20)">
      <circle r="11" fill="#ffd93b" stroke="#e3b505" stroke-width="2"/>
      <g stroke="#fff8d6" stroke-width="2">
        <line x1="0" y1="-9" x2="0" y2="9"/>
        <line x1="-9" y1="0" x2="9" y2="0"/>
        <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5"/>
        <line x1="-6.5" y1="6.5" x2="6.5" y2="-6.5"/>
      </g>
    </g>
    <!-- cone -->
    <path d="M26 66 L50 142 L74 66 Z" fill="#e0a05e" />
    <g stroke="#c07f3e" stroke-width="2">
      <line x1="30" y1="78" x2="66" y2="70"/>
      <line x1="34" y1="92" x2="68" y2="82"/>
      <line x1="38" y1="106" x2="64" y2="97"/>
      <line x1="43" y1="120" x2="59" y2="113"/>
      <line x1="33" y1="70" x2="45" y2="128"/>
      <line x1="52" y1="68" x2="55" y2="128"/>
      <line x1="69" y1="70" x2="50" y2="132"/>
    </g>
  </svg>
`;

const cones = Array.from({ length: 7 }, (_, i) => {
  const left = 5 + i * 13 + Math.random() * 6;
  const size = 60 + Math.random() * 60;
  const duration = 6 + Math.random() * 6;
  const delay = -Math.random() * 12;
  const sway = 3 + Math.random() * 4;
  return `
    <div class="cone-float" style="
      left: ${left}%;
      width: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --sway: ${sway}deg;
    ">${iceCream}</div>
  `;
}).join('');

document.querySelector('#app').innerHTML = `
  <div class="cones">${cones}</div>
  <h1>Hi Sandro</h1>
`;
