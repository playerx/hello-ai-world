import './style.css';

const POLL_MS = 30_000;

const state = {
  mode: 'demo',
  contacts: [],
  busy: false,
  lastRefresh: null,
  showClean: false,
  error: null,
};

const app = document.querySelector('#app');

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);

const fullName = (n) =>
  [n.firstname, n.lastname].filter(Boolean).join(' ') || '(no name)';

async function api(path, options) {
  const res = await fetch(path, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `${res.status} ${res.statusText}`);
  return body;
}

async function refresh() {
  try {
    const data = await api('/api/contacts');
    state.mode = data.mode;
    state.contacts = data.contacts;
    state.lastRefresh = new Date();
    state.error = null;
  } catch (err) {
    state.error = err.message;
  }
  render();
}

async function approve(updates) {
  if (state.busy || updates.length === 0) return;
  state.busy = true;
  render();
  try {
    await api('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
  } catch (err) {
    state.error = err.message;
  }
  state.busy = false;
  await refresh();
}

async function skip(ids) {
  try {
    await api('/api/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  } catch (err) {
    state.error = err.message;
  }
  await refresh();
}

function render() {
  const pending = state.contacts.filter((c) => c.needsFormatting && !c.skipped);
  const skippedList = state.contacts.filter((c) => c.needsFormatting && c.skipped);
  const clean = state.contacts.filter((c) => !c.needsFormatting);

  const pendingRows = pending
    .map(
      (c) => `
      <div class="review-row" data-id="${c.id}">
        <div class="names">
          <div class="name-line current">
            <span class="tag tag-current">current</span>
            <span class="name-text">${esc(fullName(c.current))}</span>
          </div>
          <div class="name-line suggested">
            <span class="tag tag-suggested">suggested</span>
            <span class="name-text">${esc(fullName(c.suggested))}</span>
          </div>
          <div class="meta">${esc(c.email)}${c.company ? ' · ' + esc(c.company) : ''}</div>
        </div>
        <div class="actions">
          <button class="btn btn-primary" data-action="approve" data-id="${c.id}" ${state.busy ? 'disabled' : ''}>Approve</button>
          <button class="btn" data-action="skip" data-id="${c.id}" ${state.busy ? 'disabled' : ''}>Skip</button>
        </div>
      </div>`
    )
    .join('');

  const cleanRows = clean
    .map(
      (c) => `
      <div class="clean-row">
        <span class="check">✓</span>
        <span>${esc(fullName(c.current))}</span>
        <span class="meta">${esc(c.email)}</span>
      </div>`
    )
    .join('');

  const skippedRows = skippedList
    .map(
      (c) => `
      <div class="clean-row">
        <span class="muted">⤫</span>
        <span>${esc(fullName(c.current))}</span>
        <span class="meta">suggestion: ${esc(fullName(c.suggested))}</span>
        <button class="btn btn-small" data-action="unskip" data-id="${c.id}">Restore</button>
      </div>`
    )
    .join('');

  app.innerHTML = `
    <main class="page">
      <header class="page-header">
        <div>
          <h1>Contact Name Formatter</h1>
          <p class="subtitle">New HubSpot contacts appear here with a formatting suggestion.</p>
        </div>
        <div class="header-right">
          <span class="mode ${state.mode}">${state.mode === 'live' ? 'Connected to HubSpot' : 'Demo mode'}</span>
          <button class="btn" data-action="refresh" ${state.busy ? 'disabled' : ''}>Refresh</button>
        </div>
      </header>

      ${state.mode === 'demo' ? `
        <div class="banner">
          Demo mode — changes are not sent to HubSpot. Add a HubSpot connection
          in the Sprites gateway (Custom API → https://api.hubapi.com) and this
          app switches to live automatically.
        </div>` : ''}

      ${state.error ? `<div class="banner banner-error">Error: ${esc(state.error)}</div>` : ''}

      <section class="card">
        <div class="card-head">
          <h2>Needs formatting <span class="count">${pending.length}</span></h2>
          <button class="btn btn-primary" data-action="approve-all"
            ${state.busy || pending.length === 0 ? 'disabled' : ''}>
            Approve all (${pending.length})
          </button>
        </div>
        ${pending.length ? pendingRows : '<div class="empty">All caught up — no contacts need formatting.</div>'}
      </section>

      ${skippedList.length ? `
      <section class="card">
        <div class="card-head"><h2>Skipped <span class="count">${skippedList.length}</span></h2></div>
        ${skippedRows}
      </section>` : ''}

      <section class="card">
        <div class="card-head">
          <h2>Correctly formatted <span class="count">${clean.length}</span></h2>
          <button class="btn" data-action="toggle-clean">${state.showClean ? 'Hide' : 'Show'}</button>
        </div>
        ${state.showClean ? (cleanRows || '<div class="empty">None yet.</div>') : ''}
      </section>

      <footer class="footer">
        ${state.lastRefresh ? `Last checked ${state.lastRefresh.toLocaleTimeString()}` : 'Loading…'} ·
        auto-refreshes every ${POLL_MS / 1000}s
      </footer>
    </main>
  `;
}

const toUpdate = (c) => ({
  id: c.id,
  firstname: c.suggested.firstname,
  lastname: c.suggested.lastname,
});

app.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  const byId = (x) => x.id === id;

  if (action === 'refresh') refresh();
  if (action === 'toggle-clean') { state.showClean = !state.showClean; render(); }
  if (action === 'approve') {
    const c = state.contacts.find(byId);
    if (c) approve([toUpdate(c)]);
  }
  if (action === 'approve-all') {
    approve(state.contacts.filter((c) => c.needsFormatting && !c.skipped).map(toUpdate));
  }
  if (action === 'skip') skip([id]);
  if (action === 'unskip') {
    fetch('/api/unskip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    }).then(refresh);
  }
});

render();
refresh();
setInterval(refresh, POLL_MS);
