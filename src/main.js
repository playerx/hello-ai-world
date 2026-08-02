import './style.css';

const experience = [
  {
    role: 'Event Coordinator',
    company: 'Biletebi.ge (Online Ticketing Platform)',
    period: 'Mar 2025 – Today · Hybrid',
    points: [
      'Coordinate with event organizers and support smooth event execution',
      'Manage ticketing operations, sales tracking, and event data updates',
      'Collaborate with marketing, finance, support and IT teams on event processes',
      'Train partners on ticketing systems and provide technical support',
    ],
  },
  {
    role: 'Operations Coordinator',
    company: 'Harvard Business Review Georgia (Publishing)',
    period: 'Nov 2021 – Today · Remote',
    points: [
      'Managed logistics, inventory, and warehouse operations for publishing activities',
      'Coordinated relationships with bookstores and tracked sales data for major events',
      'Negotiated with transport companies to optimize delivery processes',
    ],
  },
  {
    role: 'Producer / Assistant Director / Team Member',
    company: 'Theatre Company Haraki',
    period: 'Oct 2023 – Mar 2026 · Project based',
    points: [
      '"Hamlet" — Theatre Company Haraki',
      '"Pathetic Monologues" — Theatre Company Haraki',
      '"Berserkers II: The Sunny Side" — City Theatre',
    ],
  },
  {
    role: 'Administrative Assistant',
    company: 'Holy Motors (Creative Agency)',
    period: 'Apr 2024 – Nov 2024 · Part time',
    points: [
      'Maintained records for contracts and correspondence',
      'Supported operational efficiency in a dynamic work environment',
      'Assisted in administrative tasks and human resources management',
    ],
  },
  {
    role: 'Office & Community Manager',
    company: 'Space Z (Co-working Space)',
    period: 'Feb 2020 – Apr 2024 · Part time',
    points: [
      'Oversaw daily operations for a 100+ member co-working space, ensuring efficiency',
      'Organized 10+ events, workshops, and networking sessions, boosting engagement by 30%',
      'Managed bookings, payments, and database systems, streamlining operations',
    ],
  },
  {
    role: 'Bookstore Manager',
    company: 'Book Space (Small Book Shop)',
    period: 'Feb 2020 – Apr 2024 · Part time',
    points: [
      'Led operations, sales, and customer service, maintaining high service standards',
      'Optimized inventory management, ordering, and shelving processes',
      'Supervised staff and streamlined daily store operations',
    ],
  },
];

const softSkills = [
  'Operations & Project Management',
  'Event Coordination',
  'Time & Task Management',
  'Cross-functional Communication',
  'Office Administration',
];

const techSkills = [
  'Microsoft Office',
  'Google Workspace',
  'Canva',
  'ClickUp',
  'Slack',
  'CRM software',
];

document.querySelector('#app').innerHTML = `
  <nav class="nav">
    <span class="nav-name">Lizi Tkeshelashvili</span>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#experience">Experience</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-text">
      <p class="hero-kicker">Hello, I'm</p>
      <h1>Lizi<br>Tkeshelashvili</h1>
      <p class="hero-headline">Event &amp; Project Coordinator</p>
      <p class="hero-sub">Passionate about entertainment, theatre production, events, operations,
      logistics, and administration — combining strong organizational abilities with a creative
      mindset to deliver high-quality events. Based in Tbilisi, Georgia.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#contact">Get in touch</a>
        <a class="btn btn-ghost" href="https://www.linkedin.com/in/lizitkeshelashvili" target="_blank" rel="noopener">LinkedIn ↗</a>
      </div>
    </div>
  </header>

  <section id="about" class="section">
    <h2>About</h2>
    <p class="about-text">
      I'm an event and project coordinator with experience across entertainment, theatre
      production, events, operations, logistics, and administration. I'm skilled at coordinating
      productions, managing stakeholders, and delivering high-quality events — and enthusiastic
      about film, television, music, festivals, and live entertainment, with a proven ability to
      support creative teams through effective planning and communication.
    </p>
  </section>

  <section id="experience" class="section">
    <h2>Experience</h2>
    <div class="timeline">
      ${experience
        .map(
          (job) => `
        <article class="job">
          <div class="job-dot"></div>
          <div class="job-body">
            <h3>${job.role}</h3>
            <p class="job-company">${job.company}</p>
            <p class="job-period">${job.period}</p>
            <ul>${job.points.map((p) => `<li>${p}</li>`).join('')}</ul>
          </div>
        </article>`
        )
        .join('')}
    </div>
  </section>

  <section class="section section-split">
    <div>
      <h2>Education</h2>
      <div class="edu-card">
        <h3>Bachelor of Business Administration (BBA)</h3>
        <p>BTU — Business and Technology University</p>
        <p class="edu-period">Sep 2019 – June 2023</p>
      </div>
    </div>
    <div>
      <h2>Volunteering</h2>
      <div class="edu-card">
        <h3>Community &amp; Creative Projects</h3>
        <p>Video Commercial Productions · TEDxTbilisi 2023 · Tbilisi Open Air 2019</p>
      </div>
    </div>
  </section>

  <section id="skills" class="section">
    <h2>Skills</h2>
    <h3 class="skills-label">Core</h3>
    <div class="chips">
      ${softSkills.map((s) => `<span class="chip">${s}</span>`).join('')}
    </div>
    <h3 class="skills-label">Tools</h3>
    <div class="chips">
      ${techSkills.map((s) => `<span class="chip chip-alt">${s}</span>`).join('')}
    </div>
    <h3 class="skills-label">Languages</h3>
    <div class="chips">
      <span class="chip chip-alt">Georgian — Fluent</span>
      <span class="chip chip-alt">English — Upper-Intermediate</span>
    </div>
  </section>

  <section id="contact" class="section contact">
    <h2>Let's work together</h2>
    <p>Tbilisi, Georgia</p>
    <div class="hero-actions contact-actions">
      <a class="btn btn-primary" href="mailto:Lizitkeshi@gmail.com">Lizitkeshi@gmail.com</a>
      <a class="btn btn-ghost" href="https://www.linkedin.com/in/lizitkeshelashvili" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 Lizi Tkeshelashvili · Tbilisi, Georgia</p>
  </footer>
`;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.section, .job').forEach((el) => observer.observe(el));
