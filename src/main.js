import './style.css';

const birdSvg = `<svg viewBox="0 0 40 20"><path d="M0 10 Q10 0 20 10 Q30 0 40 10" /></svg>`;

const birds = [
  { top: '15%', duration: '16s', delay: '0s' },
  { top: '25%', duration: '20s', delay: '3s' },
  { top: '10%', duration: '14s', delay: '6s' },
  { top: '30%', duration: '22s', delay: '1.5s' },
]
  .map(
    ({ top, duration, delay }) =>
      `<div class="bird" style="--bird-top:${top}; --bird-duration:${duration}; --bird-delay:${delay}">${birdSvg}</div>`
  )
  .join('');

document.querySelector('#app').innerHTML = `
  ${birds}
  <form class="login-card" id="loginForm" novalidate>
    <h1>Welcome back</h1>
    <p class="login-subtitle">Log in to continue</p>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="you@example.com" required autocomplete="email" />

    <label for="password">Password</label>
    <input type="password" id="password" name="password" placeholder="••••••••" required autocomplete="current-password" />

    <button type="submit">Log in</button>

    <p class="login-footer">Don't have an account? <a href="#signup">Sign up</a></p>
  </form>
`;

const burgerBtn = document.querySelector('#burgerBtn');
const navLinks = document.querySelector('#navLinks');

burgerBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burgerBtn.setAttribute('aria-expanded', String(isOpen));
});

navLinks.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    navLinks.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }
});

document.querySelector('#loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
});
