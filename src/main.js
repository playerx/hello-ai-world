import './style.css';

const camelSvg = (id) => `
  <svg class="camel-svg" viewBox="0 0 115 100" xmlns="http://www.w3.org/2000/svg">
    <g class="leg leg-a">
      <rect x="36" y="58" width="5" height="37" rx="2.5" />
    </g>
    <g class="leg leg-b">
      <rect x="46" y="58" width="5" height="37" rx="2.5" />
    </g>
    <g class="leg leg-b">
      <rect x="68" y="58" width="5" height="37" rx="2.5" />
    </g>
    <g class="leg leg-a">
      <rect x="76" y="58" width="5" height="37" rx="2.5" />
    </g>
    <path
      d="M33,48
         C29,54 27,62 30,70
         C31,64 32,56 35,52 Z"
    />
    <path
      d="M32,50
         C33,36 42,22 52,24
         C60,26 64,34 66,40
         C68,41 70,40 72,40
         C78,38 84,26 88,16
         C90,10 98,8 102,12
         C105,13 107,14 106,18
         C104,22 98,22 94,22
         C90,30 86,42 84,50
         C84,56 82,61 76,62
         C60,64 45,64 38,60
         C33,58 31,54 32,50 Z"
    />
    <path d="M89,12 C88,8 90,5 92,7 C93,9 92,11 91,13 Z" />
    <circle cx="97" cy="14" r="1.7" class="camel-eye" />
  </svg>
`;

document.querySelector('#app').innerHTML = `
  <h1>Hi Mohamed!</h1>
  <p class="subtitle" dir="rtl" lang="ar">أهلاً يا محمد!</p>
  <div class="camels" aria-hidden="true">
    <div class="camel camel-1">${camelSvg(1)}</div>
    <div class="camel camel-2">${camelSvg(2)}</div>
    <div class="camel camel-3">${camelSvg(3)}</div>
  </div>
`;
