import './style.css';
import { supabaseEnabled, supabase } from './supabase.js';

const STORAGE_KEY = 'cbt-thought-journal';
const TABLE = 'thoughts';

let currentUser = null;
let entries = [];
let activeTab = 'new';

const app = document.querySelector('#app');

// ---------- auth ----------

function mapUser(user) {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email,
    name: meta.full_name || meta.name || user.email,
    picture: meta.avatar_url || meta.picture || '',
  };
}

async function handleGoogleSignIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) {
    console.error('Google sign-in failed', error);
    alert('Sign-in failed. Please try again.');
  }
}

async function signOut() {
  if (supabaseEnabled) {
    await supabase.auth.signOut();
  } else {
    entries = [];
    render();
  }
}

// ---------- storage: local (fallback when Supabase isn't configured) ----------

function loadLocalEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ---------- storage: Supabase (when configured) ----------

function fromRow(row) {
  return { id: row.id, negative: row.negative, positive: row.positive, createdAt: row.created_at, resolvedAt: row.resolved_at, emoji: row.emoji || null };
}

async function fetchEmoji(text) {
  if (!supabaseEnabled) return null;
  try {
    const { data, error } = await supabase.functions.invoke('generate-emoji', { body: { text } });
    if (error) {
      console.error('Failed to generate emoji', error);
      return null;
    }
    return data?.emoji || null;
  } catch (err) {
    console.error('Failed to generate emoji', err);
    return null;
  }
}

async function fetchEntries() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to load thoughts', error);
    return [];
  }
  return data.map(fromRow);
}

async function refreshAndRender() {
  entries = supabaseEnabled && currentUser ? await fetchEntries() : loadLocalEntries();
  render();
}

// ---------- mutations ----------

async function addEntry(negative, positive) {
  const now = new Date().toISOString();
  const emoji = await fetchEmoji(negative);

  if (supabaseEnabled && currentUser) {
    const { error } = await supabase.from(TABLE).insert({
      user_id: currentUser.id,
      negative,
      positive: positive || null,
      created_at: now,
      resolved_at: positive ? now : null,
      emoji,
    });
    if (error) console.error('Failed to save thought', error);
  } else {
    entries.unshift({ id: uid(), negative, positive: positive || null, createdAt: now, resolvedAt: positive ? now : null, emoji });
    saveLocalEntries();
  }
}

async function resolveEntry(id, positive) {
  const resolvedAt = new Date().toISOString();

  if (supabaseEnabled && currentUser) {
    const { error } = await supabase.from(TABLE).update({ positive, resolved_at: resolvedAt }).eq('id', id);
    if (error) console.error('Failed to save reframe', error);
  } else {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    entry.positive = positive;
    entry.resolvedAt = resolvedAt;
    saveLocalEntries();
  }
}

async function deleteEntry(id) {
  if (supabaseEnabled && currentUser) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) console.error('Failed to delete thought', error);
  } else {
    entries = entries.filter((e) => e.id !== id);
    saveLocalEntries();
  }
}

async function clearAllEntries() {
  if (supabaseEnabled && currentUser) {
    const { error } = await supabase.from(TABLE).delete().eq('user_id', currentUser.id);
    if (error) console.error('Failed to clear thoughts', error);
  } else {
    entries = [];
    saveLocalEntries();
  }
}

// ---------- analytics ----------

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'at', 'is', 'it', 'im', "i'm",
  'my', 'me', 'am', 'be', 'was', 'were', 'will', 'so', 'that', 'this', 'for', 'with', 'not',
  'no', 'you', 'your', 'have', 'has', 'had', 'going', 'get', 'if', 'as', 'are', 'they', 'them',
  'he', 'she', 'we', 'do', 'does', 'about', 'just', 'all', 'can', 'because',
]);

function computeStreak() {
  if (!entries.length) return 0;
  const days = new Set(entries.map((e) => new Date(e.createdAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeLast7Days() {
  const result = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayKey = d.toDateString();
    const count = entries.filter((e) => new Date(e.createdAt).toDateString() === dayKey).length;
    result.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), count });
  }
  return result;
}

function computeTopWords() {
  const freq = new Map();
  entries.forEach((e) => {
    const words = e.negative.toLowerCase().replace(/[^a-z0-9'\s]/g, '').split(/\s+/);
    words.forEach((w) => {
      if (!w || w.length < 3 || STOPWORDS.has(w)) return;
      freq.set(w, (freq.get(w) || 0) + 1);
    });
  });
  return [...freq.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));
}

function computeAnalytics() {
  const total = entries.length;
  const resolved = entries.filter((e) => e.positive);
  const pendingCount = total - resolved.length;
  const reframeRate = total ? Math.round((resolved.length / total) * 100) : 0;

  const reframeDurationsHours = resolved
    .filter((e) => e.resolvedAt && e.createdAt !== e.resolvedAt)
    .map((e) => (new Date(e.resolvedAt) - new Date(e.createdAt)) / 36e5);
  const avgReframeHours = reframeDurationsHours.length
    ? reframeDurationsHours.reduce((a, b) => a + b, 0) / reframeDurationsHours.length
    : null;

  const last7 = computeLast7Days();
  const maxDay = Math.max(1, ...last7.map((d) => d.count));

  return {
    total,
    resolvedCount: resolved.length,
    pendingCount,
    reframeRate,
    avgReframeHours,
    streak: computeStreak(),
    last7,
    maxDay,
    topWords: computeTopWords(),
  };
}

// ---------- formatting ----------

function formatDuration(hours) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${Math.round(hours)} hr`;
  return `${Math.round(hours / 24)} days`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- rendering ----------

function render() {
  if (supabaseEnabled && !currentUser) {
    renderLoginScreen();
    return;
  }

  const pending = entries.filter((e) => !e.positive);
  const resolved = entries.filter((e) => e.positive);

  app.innerHTML = `
    <div class="journal">
      <header class="journal-header">
        ${currentUser ? renderUserChip() : ''}
        <h1>Flip</h1>
        <p class="subtitle">Log the negative thought. Add the reframe when it's ready. Watch the pattern change.</p>
      </header>

      <nav class="tabs">
        <button data-tab="new" class="tab-btn ${activeTab === 'new' ? 'active' : ''}">New Entry</button>
        <button data-tab="todo" class="tab-btn ${activeTab === 'todo' ? 'active' : ''}">To Reframe${pending.length ? ` <span class="badge">${pending.length}</span>` : ''}</button>
        <button data-tab="log" class="tab-btn ${activeTab === 'log' ? 'active' : ''}">Thought Log${resolved.length ? ` <span class="badge badge-positive">${resolved.length}</span>` : ''}</button>
        <button data-tab="insights" class="tab-btn ${activeTab === 'insights' ? 'active' : ''}">Insights</button>
      </nav>

      <main class="tab-content">
        ${activeTab === 'new' ? renderNewEntryTab() : ''}
        ${activeTab === 'todo' ? renderTodoTab(pending) : ''}
        ${activeTab === 'log' ? renderLogTab(resolved) : ''}
        ${activeTab === 'insights' ? renderInsightsTab() : ''}
      </main>
    </div>
  `;

  attachListeners();
}

function renderLoginScreen() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="card login-card">
        <h1>Flip</h1>
        <p class="subtitle">Sign in with Google to keep your journal private to you and synced across your devices.</p>
        <button type="button" id="google-signin-btn" class="btn-google">Sign in with Google</button>
      </div>
    </div>
  `;
  attachListeners();
}

function renderUserChip() {
  return `
    <div class="user-chip">
      ${currentUser.picture ? `<img src="${currentUser.picture}" alt="" class="avatar" referrerpolicy="no-referrer" />` : ''}
      <span class="user-name">${escapeHtml(currentUser.name || currentUser.email)}</span>
      <button type="button" id="sign-out-btn" class="btn-danger">Sign out</button>
    </div>
  `;
}

function renderNewEntryTab() {
  return `
    <form id="entry-form" class="card entry-form" novalidate>
      <label for="negative-input">What's the negative thought?</label>
      <textarea id="negative-input" rows="3" placeholder="e.g. I'm going to mess up this presentation"></textarea>
      <div id="negative-error" class="field-error" hidden>Enter the negative thought before saving — it's required.</div>

      <label for="positive-input">What's a more balanced or positive thought? <span class="optional">(optional)</span></label>
      <textarea id="positive-input" rows="3" placeholder="e.g. I've prepared well and handled tough questions before"></textarea>
      <p class="hint">No reframe yet? Leave it blank — the entry goes on your <strong>To Reframe</strong> list until you're ready.</p>

      <button type="submit" class="btn-primary">Save entry</button>
    </form>
  `;
}

function renderTodoTab(pending) {
  if (!pending.length) {
    return `<div class="empty-state">Nothing waiting on you right now — nice work. 🎉</div>`;
  }
  return `
    <div class="entry-list">
      ${pending
        .map(
          (e) => `
        <div class="card entry-card">
          <div class="entry-meta">${e.emoji ? `<span class="entry-emoji">${e.emoji}</span> ` : ''}${formatDate(e.createdAt)}</div>
          <div class="entry-line"><span class="tag tag-negative">Negative</span> ${escapeHtml(e.negative)}</div>
          <form class="reframe-form" data-id="${e.id}">
            <textarea rows="2" placeholder="Add your reframe when you're ready..."></textarea>
            <div class="entry-actions">
              <button type="submit" class="btn-secondary">Save reframe</button>
              <button type="button" class="btn-danger" data-delete="${e.id}">Delete</button>
            </div>
          </form>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function renderLogTab(resolved) {
  if (!resolved.length) {
    return `<div class="empty-state">No reframed thoughts yet — they'll show up here once you add a positive thought.</div>`;
  }
  return `
    <div class="entry-list">
      ${resolved
        .map((e) => {
          const took =
            e.resolvedAt && e.resolvedAt !== e.createdAt
              ? ` · reframed ${formatDuration((new Date(e.resolvedAt) - new Date(e.createdAt)) / 36e5)} later`
              : '';
          return `
        <div class="card entry-card">
          <div class="entry-meta">${e.emoji ? `<span class="entry-emoji">${e.emoji}</span> ` : ''}${formatDate(e.createdAt)}${took}</div>
          <div class="entry-line"><span class="tag tag-negative">Negative</span> ${escapeHtml(e.negative)}</div>
          <div class="entry-line"><span class="tag tag-positive">Reframe</span> ${escapeHtml(e.positive)}</div>
          <div class="entry-actions">
            <button type="button" class="btn-danger" data-delete="${e.id}">Delete</button>
          </div>
        </div>
      `;
        })
        .join('')}
    </div>
  `;
}

function renderInsightsTab() {
  const stats = computeAnalytics();
  const storageNote =
    supabaseEnabled && currentUser
      ? 'Synced securely to your account — available from any device you sign into.'
      : 'Stored only in this browser (localStorage) — nothing is sent to a server.';

  return `
    <div class="insights">
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Total thoughts logged</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.resolvedCount}</div>
          <div class="stat-label">Reframed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.pendingCount}</div>
          <div class="stat-label">Waiting on you</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.streak}</div>
          <div class="stat-label">Day streak</div>
        </div>
      </div>

      <div class="card">
        <h3>Reframe rate</h3>
        <div class="progress-bar"><div class="progress-fill" style="width:${stats.reframeRate}%"></div></div>
        <p class="stat-note">${stats.reframeRate}% of logged thoughts have a positive reframe${
          stats.avgReframeHours !== null ? ` · average time to reframe: ${formatDuration(stats.avgReframeHours)}` : ''
        }</p>
      </div>

      <div class="card">
        <h3>Last 7 days</h3>
        <div class="bar-chart">
          ${stats.last7
            .map(
              (d) => `
            <div class="bar-col">
              <div class="bar" style="height:${d.count ? Math.max(8, (d.count / stats.maxDay) * 80) : 2}px" title="${d.count} thought${d.count === 1 ? '' : 's'}"></div>
              <div class="bar-label">${d.label}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      ${
        stats.topWords.length
          ? `
        <div class="card">
          <h3>Recurring words in your negative thoughts</h3>
          <div class="word-tags">
            ${stats.topWords
              .map((w) => `<span class="word-tag">${escapeHtml(w.word)} <span class="word-count">${w.count}</span></span>`)
              .join('')}
          </div>
        </div>
      `
          : ''
      }

      <div class="card danger-zone">
        <h3>Your data</h3>
        <p class="stat-note">${storageNote}</p>
        <button type="button" id="clear-data" class="btn-danger">Clear all entries</button>
      </div>
    </div>
  `;
}

// ---------- events ----------

function attachListeners() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      render();
    });
  });

  const entryForm = document.querySelector('#entry-form');
  if (entryForm) {
    entryForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      const negativeInput = entryForm.querySelector('#negative-input');
      const positiveInput = entryForm.querySelector('#positive-input');
      const negative = negativeInput.value.trim();
      const positive = positiveInput.value.trim();

      if (!negative) {
        document.querySelector('#negative-error').hidden = false;
        negativeInput.focus();
        return;
      }

      await addEntry(negative, positive);
      activeTab = positive ? 'log' : 'todo';
      await refreshAndRender();
    });
  }

  document.querySelectorAll('.reframe-form').forEach((form) => {
    form.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      const textarea = form.querySelector('textarea');
      const positive = textarea.value.trim();
      if (!positive) {
        textarea.focus();
        return;
      }
      await resolveEntry(form.dataset.id, positive);
      await refreshAndRender();
    });
  });

  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await deleteEntry(btn.dataset.delete);
      await refreshAndRender();
    });
  });

  const clearBtn = document.querySelector('#clear-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      if (confirm('Delete all logged thoughts? This cannot be undone.')) {
        await clearAllEntries();
        await refreshAndRender();
      }
    });
  }

  const signOutBtn = document.querySelector('#sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', signOut);
  }

  const googleBtn = document.querySelector('#google-signin-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleSignIn);
  }
}

// ---------- boot ----------

async function boot() {
  if (supabaseEnabled) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    currentUser = session?.user ? mapUser(session.user) : null;
    await refreshAndRender();

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      currentUser = newSession?.user ? mapUser(newSession.user) : null;
      await refreshAndRender();
    });
  } else {
    await refreshAndRender();
  }
}

boot();
