import './style.css';

const examples = {
  'Q2 board update': {
    company: 'Northstar Holdings', reportTitle: 'Q2 2026 Financial Review', period: 'April – June 2026', preparedFor: 'Board of Directors', currency: 'USD',
    summary: 'Northstar delivered another quarter of disciplined growth, supported by strong enterprise demand and expanding gross margins.',
    metrics: [{ label: 'Revenue', value: '$12.8M', change: '+18.4%', direction: 'up' }, { label: 'Gross margin', value: '71.2%', change: '+2.8 pts', direction: 'up' }, { label: 'Operating income', value: '$2.1M', change: '+31.5%', direction: 'up' }, { label: 'Cash position', value: '$9.6M', change: '+$1.4M', direction: 'up' }],
    highlights: ['Enterprise revenue grew 26% year over year, led by six new strategic accounts.', 'Gross margin expansion reflects higher software mix and cloud-cost optimization.', 'Operating expenses remained below plan while investments in product and sales continued.'],
    revenue: [{ label: 'Q3 2025', value: 7.8 }, { label: 'Q4 2025', value: 9.1 }, { label: 'Q1 2026', value: 10.8 }, { label: 'Q2 2026', value: 12.8 }],
  },
  'Monthly close': {
    company: 'Vela Ventures', reportTitle: 'May 2026 Monthly Close', period: 'May 2026', preparedFor: 'Finance & Operations', currency: 'USD',
    summary: 'May results closed ahead of plan, with lower-than-expected vendor spend offsetting a modest timing shift in subscription billings.',
    metrics: [{ label: 'Revenue', value: '$846K', change: '+4.2%', direction: 'up' }, { label: 'Net burn', value: '$184K', change: '−11.0%', direction: 'up' }, { label: 'Runway', value: '19 mo', change: '+2 months', direction: 'up' }, { label: 'AR over 30d', value: '$42K', change: '−$18K', direction: 'up' }],
    highlights: ['Actual operating expenses finished 7% below budget.', 'Collection activity reduced aged receivables to their lowest point this year.', 'June forecast includes a one-time legal and recruiting spend increase.'],
    revenue: [{ label: 'Feb', value: 710 }, { label: 'Mar', value: 752 }, { label: 'Apr', value: 812 }, { label: 'May', value: 846 }],
  },
  'Investor snapshot': {
    company: 'Crestline Capital', reportTitle: 'Investor Performance Snapshot', period: 'First Half 2026', preparedFor: 'Current & Prospective Investors', currency: 'USD',
    summary: 'Crestline enters the second half with a durable growth profile, improving unit economics, and a clear path to profitability.',
    metrics: [{ label: 'ARR', value: '$51.2M', change: '+42.0%', direction: 'up' }, { label: 'Net retention', value: '119%', change: '+6 pts', direction: 'up' }, { label: 'EBITDA margin', value: '8.6%', change: '+12 pts', direction: 'up' }, { label: 'Customers', value: '1,284', change: '+22.1%', direction: 'up' }],
    highlights: ['Retention is improving across every customer segment.', 'New products contributed 14% of first-half bookings.', 'The company achieved positive EBITDA two quarters ahead of plan.'],
    revenue: [{ label: 'H1 2023', value: 21 }, { label: 'H1 2024', value: 29 }, { label: 'H1 2025', value: 36 }, { label: 'H1 2026', value: 51.2 }],
  },
};

let selectedTemplate = 'executive';
let activeExample = 'Q2 board update';
let report = structuredClone(examples[activeExample]);

const templates = [
  ['executive', 'Executive brief', 'A polished overview for board and leadership updates.'],
  ['monthly', 'Monthly close', 'Operational detail for the monthly finance cadence.'],
  ['investor', 'Investor update', 'A high-level growth narrative for external stakeholders.'],
];

function moneyBar(value, max) { return `<div class="bar-row"><span>${value.label}</span><div class="bar"><i style="width:${Math.max(12, value.value / max * 100)}%"></i></div><b>${typeof value.value === 'number' && value.value < 100 ? `$${value.value}M` : `$${value.value}K`}</b></div>`; }
function metric(m) { return `<article class="metric"><p>${m.label}</p><strong>${m.value}</strong><span class="${m.direction === 'down' ? 'negative' : ''}">${m.change} <i>↗</i></span></article>`; }
function escape(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c]); }

function renderPreview() {
  const max = Math.max(...report.revenue.map(x => x.value));
  const templateClass = `template-${selectedTemplate}`;
  document.querySelector('#preview').innerHTML = `
    <article class="report-sheet ${templateClass}">
      <div class="report-topline"><span>${escape(report.company)}</span><span>Confidential · ${escape(report.period)}</span></div>
      <header class="report-header"><div><p class="report-kicker">Financial report</p><h1>${escape(report.reportTitle)}</h1><p class="report-for">Prepared for ${escape(report.preparedFor)}</p></div><div class="report-mark">${escape(report.company).split(' ').map(x => x[0]).slice(0, 2).join('')}</div></header>
      <p class="summary">${escape(report.summary)}</p>
      <section class="metrics">${report.metrics.map(metric).join('')}</section>
      <section class="report-grid"><div class="chart-block"><div class="block-title"><span>Revenue trajectory</span><small>${escape(report.currency)} · reported</small></div><div class="bar-chart">${report.revenue.map(x => moneyBar(x, max)).join('')}</div></div>
      <div class="highlights"><div class="block-title"><span>Key highlights</span></div><ol>${report.highlights.map(h => `<li>${escape(h)}</li>`).join('')}</ol></div></section>
      <footer class="report-footer"><span>${escape(report.company)} · Finance</span><span>Generated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></footer>
    </article>`;
}

function render() {
  document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#"><span class="brand-mark">N</span><span>NUMERA</span></a>
      <nav><a class="active" href="#builder"><span>▣</span> Report builder</a><a href="#library"><span>◫</span> Template library</a><a href="#exports"><span>↓</span> Exports</a></nav>
      <div class="sidebar-bottom"><div class="avatar">MH</div><div><b>Marina H.</b><span>Finance team</span></div><button aria-label="More options">•••</button></div>
    </aside>
    <main class="workspace">
      <header class="topbar"><div><p class="eyebrow">New report</p><h2>Build a finance report</h2></div><button class="ghost-button" id="save-button">Save draft</button></header>
      <div class="builder-layout">
        <section class="controls">
          <div class="step"><span>01</span><div><p class="section-label">Choose a template</p><p class="helper">Pick a layout for your report.</p></div></div>
          <div class="template-grid">${templates.map(([id, name, description]) => `<button class="template-card ${selectedTemplate === id ? 'selected' : ''}" data-template="${id}"><div class="template-art ${id}"><i></i><i></i><i></i></div><b>${name}</b><span>${description}</span><em>✓</em></button>`).join('')}</div>
          <div class="step input-step"><span>02</span><div><p class="section-label">Add your report data</p><p class="helper">Paste JSON or start with an example below.</p></div></div>
          <div class="examples"><span>Try an example</span>${Object.keys(examples).map(name => `<button class="example ${activeExample === name ? 'chosen' : ''}" data-example="${name}">${name}</button>`).join('')}</div>
          <textarea id="json-input" spellcheck="false" aria-label="Report JSON">${escape(JSON.stringify(report, null, 2))}</textarea>
          <div class="input-footer"><span id="status">Ready to generate</span><button id="format-button">Format JSON</button></div>
        </section>
        <section class="preview-panel"><div class="preview-heading"><div><p class="section-label">Live preview</p><span>Updates as you edit</span></div><button class="download-button" id="download-button">Download PDF <b>↓</b></button></div><div class="preview-canvas" id="preview"></div></section>
      </div>
    </main>
  </div>`;
  bindEvents(); renderPreview();
}

function bindEvents() {
  document.querySelectorAll('[data-template]').forEach(button => button.addEventListener('click', () => { selectedTemplate = button.dataset.template; render(); }));
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => { activeExample = button.dataset.example; report = structuredClone(examples[activeExample]); render(); }));
  const input = document.querySelector('#json-input'); const status = document.querySelector('#status');
  input.addEventListener('input', () => { try { report = JSON.parse(input.value); status.textContent = 'Preview updated'; status.className = 'valid'; renderPreview(); } catch { status.textContent = 'Fix JSON to update preview'; status.className = 'error'; } });
  document.querySelector('#format-button').addEventListener('click', () => { try { input.value = JSON.stringify(JSON.parse(input.value), null, 2); status.textContent = 'JSON formatted'; status.className = 'valid'; } catch { status.textContent = 'Invalid JSON'; status.className = 'error'; } });
  document.querySelector('#download-button').addEventListener('click', () => { document.body.classList.add('printing'); window.print(); setTimeout(() => document.body.classList.remove('printing'), 700); });
  document.querySelector('#save-button').addEventListener('click', event => { event.currentTarget.textContent = 'Saved ✓'; setTimeout(() => event.currentTarget.textContent = 'Save draft', 1500); });
}

render();
