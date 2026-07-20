import './style.css';

const bird = () =>
  '<div class="bird"><svg class="bird-wings" viewBox="0 0 32 16"><path d="M1 8 Q8 1 16 8 Q24 1 31 8" /></svg></div>';

const DANGEROUS_KEYWORDS = [
  'rattlesnake', 'copperhead', 'cottonmouth', 'water moccasin', 'coral snake',
  'viper', 'adder', 'black widow', 'brown recluse', 'scorpion',
  'mountain lion', 'cougar', 'puma', 'black bear', 'grizzly', 'brown bear', 'wolf',
];

const CATEGORIES = [
  { key: 'Aves', label: 'Birds', icon: '🐦' },
  { key: 'Reptilia', label: 'Reptiles & Snakes', icon: '🐍' },
  { key: 'Mammalia', label: 'Mammals', icon: '🦌' },
  { key: 'Plantae', label: 'Plants & Trees', icon: '🌲' },
  { key: 'Amphibia', label: 'Amphibians', icon: '🐸' },
  { key: 'Insecta', label: 'Insects', icon: '🐛' },
  { key: 'Other', label: 'Other', icon: '🔎' },
];

const MAX_PER_CATEGORY = 8;

const DEFAULT_TIPS = {
  Aves: 'Safe to watch from a distance. Stay still and quiet, and use binoculars instead of walking up — getting close can flush birds from a nearby nest.',
  Reptilia: 'Give it space and let it move off on its own. Avoid reaching into rocks, logs, or brush piles where one could be hiding.',
  Mammalia: 'Keep at least 100 feet away. Don’t approach or feed it — if it notices you, back away slowly rather than running.',
  Plantae: 'Fine to look at and photograph. Don’t eat or handle anything you can’t positively identify — some plants irritate skin.',
  Amphibia: 'Harmless to watch, but avoid touching — handling can hurt them and some secrete mild irritants.',
  Insecta: 'Mostly harmless. Stay calm and walk away from stinging insects (bees/wasps) rather than swatting at them.',
  Other: 'Observe from a distance and avoid touching unless you know exactly what it is.',
};

const SPECIFIC_TIPS = [
  { match: ['rattlesnake', 'copperhead', 'cottonmouth', 'water moccasin', 'coral snake', 'viper', 'adder'],
    tip: 'Stop moving, back away slowly the way you came, and give it at least 6 feet of space. Don’t try to move it or get close for a photo — most bites happen when people try to touch or corner a snake.' },
  { match: ['black bear'],
    tip: 'Stay calm, don’t run. Speak in a firm, calm voice, make yourself look big, and back away slowly, giving it a clear escape route.' },
  { match: ['grizzly', 'brown bear'],
    tip: 'Stay calm, don’t run. Speak calmly, group together, and back away slowly. If it makes contact, drop and play dead (lie flat, hands over your neck). Carry bear spray in known grizzly territory.' },
  { match: ['mountain lion', 'cougar', 'puma'],
    tip: 'Don’t run or crouch down. Make yourself look big, keep eye contact, speak loudly and firmly, and back away slowly. If it attacks, fight back.' },
  { match: ['wolf'],
    tip: 'Stay calm, don’t run. Make noise, look big, keep eye contact, and back away slowly.' },
  { match: ['black widow', 'brown recluse'],
    tip: 'Don’t touch it or reach bare-handed into woodpiles, boots, or gear left on the ground — shake things out before use. Bites need medical attention but are rarely fatal to healthy adults.' },
  { match: ['scorpion'],
    tip: 'Avoid reaching into rocks, logs, or leaf litter with bare hands, and shake out boots and gear before putting them on. Stings are painful but rarely dangerous to healthy adults.' },
];

const SAFETY_TIPS = [
  'Make some noise as you walk — most animals will clear out of your path if they hear you coming.',
  'If you see a snake, stop and back away slowly. Never try to move, touch, or handle it — that’s when most bites happen.',
  'Wear sturdy, closed boots and long pants on overgrown or rocky trails.',
  'Keep dogs leashed — they’re more likely to provoke wildlife than you are.',
  'In bear country, store food in a sealed container or bear canister, away from your tent.',
  'Never approach or feed wildlife, even animals that look calm or used to people.',
  'If you’re unsure what an animal is, take a photo from a distance instead of getting closer to look.',
];

function isDangerous(text) {
  const lower = text.toLowerCase();
  return DANGEROUS_KEYWORDS.some((k) => lower.includes(k));
}

function tipFor(name, sciName, categoryKey) {
  const lower = `${name} ${sciName}`.toLowerCase();
  const specific = SPECIFIC_TIPS.find((s) => s.match.some((m) => lower.includes(m)));
  if (specific) return specific.tip;
  return DEFAULT_TIPS[categoryKey] || DEFAULT_TIPS.Other;
}

function categoryFor(iconicTaxonName) {
  return CATEGORIES.find((c) => c.key === iconicTaxonName) || CATEGORIES[CATEGORIES.length - 1];
}

function formatPercent(count, total) {
  const pct = (count / total) * 100;
  if (pct < 1) return '< 1%';
  return `${pct.toFixed(pct < 10 ? 1 : 0)}%`;
}

function renderCard(item, total) {
  const taxon = item.taxon;
  if (!taxon) return '';
  const name = taxon.preferred_common_name || taxon.name;
  const sciName = taxon.name;
  const photo = taxon.default_photo && (taxon.default_photo.medium_url || taxon.default_photo.square_url);
  const dangerous = isDangerous(name) || isDangerous(sciName);
  const category = categoryFor(taxon.iconic_taxon_name);
  const percent = formatPercent(item.count, total);
  const tip = tipFor(name, sciName, category.key);

  return `
    <div class="wildlife-card ${dangerous ? 'is-dangerous' : ''}">
      ${photo ? `<img src="${photo}" alt="${name}" loading="lazy" />` : '<div class="wildlife-card-noimg">🌿</div>'}
      <div class="wildlife-card-body">
        <div class="wildlife-card-top">
          <div class="wildlife-card-name">${name}</div>
          <div class="wildlife-card-pct" title="Share of recent local sightings that were this species">${percent}</div>
        </div>
        <div class="wildlife-card-sci">${sciName}</div>
        ${dangerous ? '<div class="wildlife-card-warning">⚠ Use caution — keep your distance</div>' : ''}
        <details class="wildlife-card-tip">
          <summary>If you encounter one</summary>
          <p>${tip}</p>
        </details>
      </div>
    </div>
  `;
}

function renderResults(results, resultsEl) {
  if (!results || results.length === 0) {
    resultsEl.innerHTML = '<p class="wildlife-status">No recorded sightings found nearby. Try again in a different spot.</p>';
    return;
  }

  const total = results.reduce((sum, r) => sum + r.count, 0);

  const grouped = {};
  for (const item of results) {
    if (!item.taxon) continue;
    const cat = categoryFor(item.taxon.iconic_taxon_name);
    grouped[cat.label] = grouped[cat.label] || { icon: cat.icon, items: [] };
    grouped[cat.label].items.push(item);
  }

  const order = CATEGORIES.map((c) => c.label);
  const sections = order
    .filter((label) => grouped[label])
    .map((label) => {
      const group = grouped[label];
      const items = group.items.slice(0, MAX_PER_CATEGORY);
      return `
        <div class="wildlife-group">
          <h3>${group.icon} ${label}</h3>
          <div class="wildlife-grid">
            ${items.map((item) => renderCard(item, total)).join('')}
          </div>
        </div>
      `;
    })
    .join('');

  resultsEl.innerHTML = sections;
}

function findWildlife(statusEl, resultsEl) {
  if (!navigator.geolocation) {
    statusEl.textContent = 'Your browser doesn’t support location — try a different device.';
    return;
  }

  statusEl.textContent = 'Getting your location…';
  resultsEl.innerHTML = '';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      statusEl.textContent = 'Looking for wildlife near you…';
      try {
        const url = `https://api.inaturalist.org/v1/observations/species_counts?lat=${latitude}&lng=${longitude}&radius=20&per_page=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        statusEl.textContent = '';
        renderResults(data.results, resultsEl);
      } catch (err) {
        statusEl.textContent = 'Couldn’t load wildlife data right now. Please try again.';
      }
    },
    () => {
      statusEl.textContent = 'Location access was denied. Enable location access in your browser to see wildlife near you.';
    }
  );
}

document.querySelector('#app').innerHTML = `
  <div class="birds">
    ${bird()}${bird()}${bird()}${bird()}${bird()}
  </div>
  <div class="page">
    <h1>Hi Kate</h1>

    <section class="wildlife-panel">
      <h2>🐾 Wildlife Near You</h2>
      <p class="wildlife-intro">See how often each species has actually been reported near your location, and what to do if you run into one. Percentages reflect how common each species is in local sightings — not a guarantee, but a real, data-based sense of likelihood.</p>
      <button id="find-wildlife-btn" class="wildlife-btn">Find wildlife near me</button>
      <p id="wildlife-status" class="wildlife-status"></p>
      <div id="wildlife-results"></div>
    </section>

    <section class="safety-panel">
      <h2>⚠ General Safety Tips</h2>
      <ul class="safety-list">
        ${SAFETY_TIPS.map((tip) => `<li>${tip}</li>`).join('')}
      </ul>
    </section>
  </div>
`;

document.querySelector('#find-wildlife-btn').addEventListener('click', () => {
  findWildlife(document.querySelector('#wildlife-status'), document.querySelector('#wildlife-results'));
});
