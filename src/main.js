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

const SAFETY_TIPS = [
  'Make some noise as you walk — most animals will clear out of your path if they hear you coming.',
  'If you see a snake, stop and back away slowly. Never try to move, touch, or handle it — that’s when most bites happen.',
  'Wear sturdy, closed boots and long pants on overgrown or rocky trails.',
  'Keep dogs leashed — they’re more likely to provoke wildlife than you are.',
  'In bear country, store food in a sealed container or bear canister, away from your tent.',
  'Never approach or feed wildlife, even animals that look calm or used to people.',
  'If you’re unsure what an animal is, take a photo from a distance instead of getting closer to look.',
];

function isDangerous(name) {
  const lower = name.toLowerCase();
  return DANGEROUS_KEYWORDS.some((k) => lower.includes(k));
}

function categoryFor(iconicTaxonName) {
  return CATEGORIES.find((c) => c.key === iconicTaxonName) || CATEGORIES[CATEGORIES.length - 1];
}

function renderCard(obs) {
  const taxon = obs.taxon;
  if (!taxon) return '';
  const name = taxon.preferred_common_name || taxon.name;
  const sciName = taxon.name;
  const photo = taxon.default_photo && (taxon.default_photo.medium_url || taxon.default_photo.square_url);
  const dangerous = isDangerous(name) || isDangerous(sciName);

  return `
    <div class="wildlife-card ${dangerous ? 'is-dangerous' : ''}">
      ${photo ? `<img src="${photo}" alt="${name}" loading="lazy" />` : '<div class="wildlife-card-noimg">🌿</div>'}
      <div class="wildlife-card-body">
        <div class="wildlife-card-name">${name}</div>
        <div class="wildlife-card-sci">${sciName}</div>
        ${dangerous ? '<div class="wildlife-card-warning">⚠ Use caution — keep your distance</div>' : ''}
      </div>
    </div>
  `;
}

function renderResults(results, resultsEl) {
  if (!results || results.length === 0) {
    resultsEl.innerHTML = '<p class="wildlife-status">No recent sightings found nearby. Try again in a different spot.</p>';
    return;
  }

  const grouped = {};
  for (const obs of results) {
    if (!obs.taxon) continue;
    const cat = categoryFor(obs.taxon.iconic_taxon_name);
    grouped[cat.label] = grouped[cat.label] || { icon: cat.icon, items: [] };
    grouped[cat.label].items.push(obs);
  }

  const order = CATEGORIES.map((c) => c.label);
  const sections = order
    .filter((label) => grouped[label])
    .map((label) => {
      const group = grouped[label];
      return `
        <div class="wildlife-group">
          <h3>${group.icon} ${label}</h3>
          <div class="wildlife-grid">
            ${group.items.map(renderCard).join('')}
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
        const url = `https://api.inaturalist.org/v1/observations?lat=${latitude}&lng=${longitude}&radius=20&order_by=observed_on&order=desc&per_page=30&quality_grade=research&photos=true`;
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
      <p class="wildlife-intro">See real, recently reported sightings of birds, reptiles, mammals and more near your current location.</p>
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
