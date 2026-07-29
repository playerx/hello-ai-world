import './style.css';

document.querySelector('#app').innerHTML = `
  <h1>Hi Anano</h1>
  <svg class="ghomi" viewBox="0 0 320 220" width="320" height="220" role="img" aria-label="ღომი სულგუნით">
    <!-- steam -->
    <g class="steam" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7">
      <path d="M120 55 q-8 -14 0 -26 q8 -12 0 -24" />
      <path d="M160 48 q-8 -14 0 -26 q8 -12 0 -24" />
      <path d="M200 55 q-8 -14 0 -26 q8 -12 0 -24" />
    </g>
    <!-- plate -->
    <ellipse cx="160" cy="170" rx="140" ry="34" fill="#e9ecef" />
    <ellipse cx="160" cy="163" rx="120" ry="27" fill="#ffffff" />
    <!-- ghomi mound -->
    <path d="M60 165 q10 -60 100 -60 q90 0 100 60 q-45 18 -100 18 q-55 0 -100 -18 z" fill="#fdf3d8" />
    <path d="M60 165 q10 -60 100 -60 q90 0 100 60" fill="none" stroke="#eddfb7" stroke-width="3" />
    <!-- texture dots -->
    <g fill="#eddfb7">
      <circle cx="110" cy="140" r="3" />
      <circle cx="145" cy="125" r="3" />
      <circle cx="185" cy="132" r="3" />
      <circle cx="215" cy="150" r="3" />
      <circle cx="130" cy="158" r="3" />
      <circle cx="190" cy="160" r="3" />
    </g>
    <!-- sulguni cheese wedge -->
    <g class="cheese">
      <path d="M150 70 l40 0 l-8 55 q-12 6 -24 0 z" fill="#fffbe8" stroke="#efe6bd" stroke-width="2" />
      <ellipse cx="170" cy="70" rx="20" ry="6" fill="#fff6d6" stroke="#efe6bd" stroke-width="2" />
    </g>
  </svg>
`;
