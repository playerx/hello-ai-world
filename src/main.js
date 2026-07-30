import './style.css';

const work = [
  ['01', 'Platform Reliability', 'Hardening critical systems with better observability, automation, and incident response.'],
  ['02', 'Product Engineering', 'Shipping focused customer workflows with clean interfaces and dependable architecture.'],
  ['03', 'Developer Velocity', 'Improving build pipelines, review loops, and internal tools so teams move faster.'],
];

const pageContent = {
  home: `
    <main class="hero">
      <p class="eyebrow">Engineering practice · Systems, products, teams</p>
      <h1>Building software that <em>holds up</em><br />under real use.</h1>
      <div class="hero-bottom">
        <p>We design, ship, and operate dependable products with clear technical judgment and disciplined execution.</p>
        <a class="round-link" href="#work" aria-label="See engineering work">↘</a>
      </div>
    </main>
    <section class="statement">
      <p class="eyebrow">Engineering focus</p>
      <div><h2>Reliable systems, usable products, and development workflows that help teams deliver.</h2><a class="text-link" href="#contact">Start a technical conversation <span>↗</span></a></div>
    </section>
    <section class="home-work"><div class="section-head"><p class="eyebrow">Engineering work</p><a class="text-link" href="#work">View all work <span>↗</span></a></div>${work.slice(0, 2).map(card).join('')}</section>
  `,
  work: `
    <main class="page-intro"><p class="eyebrow">Engineering work</p><h1>Practical systems, <em>built to scale.</em></h1><p>Selected engineering efforts across reliability, product delivery, and team productivity.</p></main>
    <section class="work-list">${work.map(card).join('')}</section>
  `,
  contact: `
    <main class="contact-page"><p class="eyebrow">Get in touch</p><h1>Need stronger engineering?<br /><em>Let's talk through it.</em></h1><a class="email" href="mailto:engineering@example.com">engineering@example.com <span>↗</span></a>
      <div class="contact-details"><div><p class="eyebrow">Based in</p><p>Remote-first engineering<br />for product teams</p></div><div><p class="eyebrow">Channels</p><a href="#contact">GitHub ↗</a><a href="#contact">LinkedIn ↗</a></div></div>
    </main>
  `,
};

function card([number, title, text]) {
  return `<article class="project"><div class="project-image image-${number}"><span>${number}</span><div class="shape"></div></div><div class="project-meta"><h3>${title}</h3><p>${text}</p><span>Architecture · Delivery</span></div></article>`;
}

function getPage() {
  const value = window.location.hash.slice(1);
  return Object.hasOwn(pageContent, value) ? value : 'home';
}

function render() {
  const page = getPage();
  document.querySelector('#app').innerHTML = `
    <header><a class="wordmark" href="#home" aria-label="Engineering home">ENGINEERING<span>®</span></a><nav aria-label="Main navigation">${['home', 'work', 'contact'].map((item) => `<a class="${page === item ? 'active' : ''}" href="#${item}">${item}</a>`).join('')}</nav><button class="menu" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-navigation">☰</button></header>
    <nav class="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" aria-hidden="true">${['home', 'work', 'contact'].map((item, index) => `<a href="#${item}"><span>0${index + 1}</span>${item}</a>`).join('')}</nav>
    ${pageContent[page]}
    <footer><p>© Engineering 2026</p><p>Built for clarity, reliability, and scale.</p></footer>`;
  document.title = `${page[0].toUpperCase() + page.slice(1)} — Engineering`;
  window.scrollTo({ top: 0, behavior: 'instant' });
  const menu = document.querySelector('.menu');
  const mobileNav = document.querySelector('.mobile-nav');
  menu.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.textContent = open ? '×' : '☰';
    mobileNav.setAttribute('aria-hidden', String(!open));
  });
}

window.addEventListener('hashchange', render);
render();
