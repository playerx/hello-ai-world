import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { suggestForContact } from '../src/format.js';

const PORT = process.env.PORT || 3001;
const GATEWAY_LIST_URL = 'https://api.sprites.dev/v1/gateway/list';
const CONTACT_PROPS = 'firstname,lastname,email,company,jobtitle,createdate';

const DATA_DIR = path.join(import.meta.dirname, '.data');
const SKIPPED_FILE = path.join(DATA_DIR, 'skipped.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const loadSkipped = () => {
  try {
    return new Set(JSON.parse(fs.readFileSync(SKIPPED_FILE, 'utf8')));
  } catch {
    return new Set();
  }
};
const skipped = loadSkipped();
const saveSkipped = () =>
  fs.writeFileSync(SKIPPED_FILE, JSON.stringify([...skipped]));

// ---------------------------------------------------------------------------
// HubSpot access, in order of preference:
//   1. HUBSPOT_TOKEN env var (private app token) → direct api.hubapi.com calls
//   2. A Sprite API gateway connection whose provider/name mentions HubSpot
//   3. Demo mode with an in-memory mock store
// ---------------------------------------------------------------------------

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const HUBSPOT_DIRECT_BASE = 'https://api.hubapi.com';

let gatewayBaseUrl = null;
let lastDiscovery = 0;

async function discoverGateway() {
  if (Date.now() - lastDiscovery < 60_000) return gatewayBaseUrl;
  lastDiscovery = Date.now();
  try {
    const res = await fetch(GATEWAY_LIST_URL);
    const { connections = [] } = await res.json();
    const conn = connections.find((c) =>
      `${c.provider} ${c.display_name} ${c.description}`
        .toLowerCase()
        .includes('hubspot')
    );
    gatewayBaseUrl = conn ? conn.gateway_base_url : null;
  } catch {
    gatewayBaseUrl = null;
  }
  return gatewayBaseUrl;
}

// Returns { base, headers } for live HubSpot access, or null for demo mode.
async function hubspotAccess() {
  if (HUBSPOT_TOKEN) {
    return {
      base: HUBSPOT_DIRECT_BASE,
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
    };
  }
  const gw = await discoverGateway();
  return gw ? { base: gw, headers: {} } : null;
}

const mockStore = [
  {
    id: '832806245618',
    properties: {
      firstname: 'EZEKI',
      lastname: '',
      email: 'ez@jok.ge',
      company: '',
      jobtitle: '',
      createdate: '2026-07-30T07:22:31.207Z',
    },
  },
  {
    id: '833827416301',
    properties: {
      firstname: 'BRIAN',
      lastname: 'halligan (sample contact)',
      email: 'bh@hubspot.com',
      company: 'HubSpot',
      jobtitle: 'Executive Chairperson',
      createdate: '2026-07-30T07:21:24.412Z',
    },
  },
  {
    id: '833862502641',
    properties: {
      firstname: 'MARIA',
      lastname: 'johnson (sample contact)',
      email: 'emailmaria@hubspot.com',
      company: 'HubSpot',
      jobtitle: 'Salesperson',
      createdate: '2026-07-30T07:21:23.918Z',
    },
  },
];

async function hubspotFetch(apiPath, options = {}) {
  const access = await hubspotAccess();
  if (!access) return null;
  const res = await fetch(`${access.base}${apiPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...access.headers,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchContacts() {
  const access = await hubspotAccess();
  if (!access) return { mode: 'demo', contacts: mockStore };

  const contacts = [];
  let after;
  do {
    const qs = new URLSearchParams({ limit: '100', properties: CONTACT_PROPS });
    if (after) qs.set('after', after);
    const page = await hubspotFetch(`/crm/v3/objects/contacts?${qs}`);
    contacts.push(...page.results);
    after = page.paging?.next?.after;
  } while (after);
  return { mode: 'live', contacts };
}

async function updateContacts(updates) {
  const access = await hubspotAccess();
  if (!access) {
    for (const u of updates) {
      const c = mockStore.find((m) => m.id === String(u.id));
      if (c) {
        c.properties.firstname = u.firstname;
        c.properties.lastname = u.lastname;
      }
    }
    return { mode: 'demo' };
  }

  await hubspotFetch('/crm/v3/objects/contacts/batch/update', {
    method: 'POST',
    body: JSON.stringify({
      inputs: updates.map((u) => ({
        id: String(u.id),
        properties: { firstname: u.firstname, lastname: u.lastname },
      })),
    }),
  });
  return { mode: 'live' };
}

// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

app.get('/api/status', async (_req, res) => {
  const access = await hubspotAccess();
  res.json({ mode: access ? 'live' : 'demo' });
});

app.get('/api/contacts', async (_req, res) => {
  try {
    const { mode, contacts } = await fetchContacts();
    const items = contacts.map((c) => {
      const current = {
        firstname: c.properties.firstname || '',
        lastname: c.properties.lastname || '',
      };
      const suggested = suggestForContact(current);
      return {
        id: String(c.id),
        email: c.properties.email || '',
        company: c.properties.company || '',
        jobtitle: c.properties.jobtitle || '',
        createdate: c.properties.createdate || '',
        current,
        suggested: { firstname: suggested.firstname, lastname: suggested.lastname },
        needsFormatting: suggested.changed,
        skipped: skipped.has(String(c.id)),
      };
    });
    res.json({ mode, contacts: items });
  } catch (err) {
    res.status(502).json({ error: String(err.message || err) });
  }
});

// Approve one or many: body { updates: [{ id, firstname, lastname }] }
app.post('/api/approve', async (req, res) => {
  const updates = req.body?.updates;
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: 'updates[] required' });
  }
  try {
    const { mode } = await updateContacts(updates);
    for (const u of updates) skipped.delete(String(u.id));
    saveSkipped();
    res.json({ ok: true, mode, updated: updates.length });
  } catch (err) {
    res.status(502).json({ error: String(err.message || err) });
  }
});

// Skip suggestions: body { ids: [...] } — hidden until their name changes again.
app.post('/api/skip', (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids[] required' });
  for (const id of ids) skipped.add(String(id));
  saveSkipped();
  res.json({ ok: true });
});

app.post('/api/unskip', (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids[] required' });
  for (const id of ids) skipped.delete(String(id));
  saveSkipped();
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`formatting-app server on http://localhost:${PORT}`);
});
