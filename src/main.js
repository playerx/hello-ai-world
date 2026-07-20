import './style.css';

document.querySelector('#app').innerHTML = '<h1>hi Akaki</h1>';

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

const chopper = document.createElement('div');
chopper.className = 'chopper';
chopper.innerHTML = `
  <svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
    <ellipse class="chopper-shadow" cx="125" cy="114" rx="105" ry="6" />

    <!-- straight-pipe exhaust -->
    <path d="M112 78 C 75 92, 45 96, 15 92" class="chopper-exhaust" />
    <circle cx="13" cy="91.5" r="4.5" class="chopper-exhaust-tip" />

    <!-- hardtail frame triangle -->
    <path d="M52 84 Q 95 36 148 40" class="chopper-frame-line" />
    <path d="M52 84 L 104 78 L 148 40" class="chopper-frame-line" />

    <!-- sissy bar -->
    <path d="M70 52 L 61 22" class="chopper-frame-line chopper-thin" />

    <!-- fuel tank -->
    <ellipse cx="118" cy="45" rx="21" ry="11" class="chopper-tank" />
    <ellipse cx="118" cy="45" rx="21" ry="11" class="chopper-tank-outline" />
    <path d="M99 45 L137 45" class="chopper-tank-stripe" />

    <!-- seat -->
    <rect x="68" y="50" width="25" height="9" rx="4.5" class="chopper-seat" />

    <!-- V-twin engine -->
    <g class="chopper-engine">
      <rect x="86" y="58" width="17" height="22" rx="2" transform="rotate(-22 94.5 69)" />
      <rect x="100" y="58" width="17" height="22" rx="2" transform="rotate(22 108.5 69)" />
    </g>

    <!-- extended raked front fork -->
    <path d="M148 40 L 205 96" class="chopper-fork" />
    <path d="M152 44 L 209 94" class="chopper-fork chopper-fork-highlight" />

    <!-- headlight -->
    <circle cx="172" cy="49" r="6.5" class="chopper-headlight" />

    <!-- ape-hanger handlebars -->
    <path d="M148 40 C 132 14, 120 4, 107 3" class="chopper-bar" />
    <circle cx="106" cy="3" r="3.2" class="chopper-grip" />

    <!-- rear wheel: big & fat -->
    <g class="chopper-wheel" style="transform-origin: 52px 84px">
      <circle cx="52" cy="84" r="28" class="chopper-tire" />
      <circle cx="52" cy="84" r="17" class="chopper-rim" />
      <circle cx="52" cy="84" r="4" class="chopper-hub" />
      <line x1="52" y1="67" x2="52" y2="101" class="chopper-spoke" />
      <line x1="35" y1="84" x2="69" y2="84" class="chopper-spoke" />
      <line x1="40" y1="72" x2="64" y2="96" class="chopper-spoke" />
      <line x1="40" y1="96" x2="64" y2="72" class="chopper-spoke" />
    </g>

    <!-- front wheel: skinny -->
    <g class="chopper-wheel" style="transform-origin: 205px 96px">
      <circle cx="205" cy="96" r="16" class="chopper-tire" />
      <circle cx="205" cy="96" r="9.5" class="chopper-rim" />
      <circle cx="205" cy="96" r="3" class="chopper-hub" />
      <line x1="205" y1="86.5" x2="205" y2="105.5" class="chopper-spoke" />
      <line x1="195.5" y1="96" x2="214.5" y2="96" class="chopper-spoke" />
      <line x1="198.5" y1="89" x2="211.5" y2="103" class="chopper-spoke" />
      <line x1="198.5" y1="103" x2="211.5" y2="89" class="chopper-spoke" />
    </g>
  </svg>
`;
document.body.appendChild(chopper);
