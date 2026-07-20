import './style.css';

const bird = () =>
  '<div class="bird"><svg class="bird-wings" viewBox="0 0 32 16"><path d="M1 8 Q8 1 16 8 Q24 1 31 8" /></svg></div>';

const DANGER_LEVELS = {
  high: { label: 'High risk', icon: '☠️', order: 3 },
  moderate: { label: 'Moderate risk', icon: '🔶', order: 2 },
  low: { label: 'Low risk', icon: '⚠️', order: 1 },
};

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
    categories: ['Reptilia'],
    level: 'high',
    tip: 'Stop moving, back away slowly the way you came, and give it at least 6 feet of space. Don’t try to move it or get close for a photo — most bites happen when people try to touch or corner a snake. A venomous bite needs emergency medical care right away.' },
  { match: ['grizzly', 'brown bear'],
    categories: ['Mammalia'],
    level: 'high',
    tip: 'Stay calm, don’t run. Speak calmly, group together, and back away slowly. If it makes contact, drop and play dead (lie flat, hands over your neck). Carry bear spray in known grizzly territory.' },
  { match: ['mountain lion', 'cougar', 'puma'],
    categories: ['Mammalia'],
    level: 'high',
    tip: 'Don’t run or crouch down. Make yourself look big, keep eye contact, speak loudly and firmly, and back away slowly. If it attacks, fight back.' },
  { match: ['black bear'],
    categories: ['Mammalia'],
    level: 'moderate',
    tip: 'Stay calm, don’t run. Speak in a firm, calm voice, make yourself look big, and back away slowly, giving it a clear escape route. Attacks are rare but injuries can happen if it feels cornered.' },
  { match: ['wolf'],
    categories: ['Mammalia'],
    level: 'moderate',
    tip: 'Stay calm, don’t run. Make noise, look big, keep eye contact, and back away slowly. Wolves generally avoid people, but treat one that doesn’t retreat as a real threat.' },
  { match: ['black widow', 'brown recluse'],
    categories: ['Other'],
    level: 'moderate',
    tip: 'Don’t touch it or reach bare-handed into woodpiles, boots, or gear left on the ground — shake things out before use. Bites need medical attention but are rarely fatal to healthy adults.' },
  { match: ['scorpion'],
    categories: ['Other'],
    level: 'low',
    tip: 'Avoid reaching into rocks, logs, or leaf litter with bare hands, and shake out boots and gear before putting them on. Stings are painful but rarely dangerous to healthy adults.' },
];

const BIRD_BEHAVIOR = [
  { match: ['jay', 'raven', 'crow', 'magpie'],
    zone: 'High branches & treetops', habitat: 'Forests, parks, and urban areas — very adaptable',
    note: 'Loud and easy to hear before you see them. Often perch out in the open on high branches, wires, or fence posts.',
    movement: 'Hops and walks confidently on the ground and branches; flies in a strong, direct, flapping pattern.',
    sound: 'Harsh, loud calls — jays often give a scratchy "jay-jay", while crows and ravens give deep caws or croaks.' },
  { match: ['hawk', 'eagle', 'falcon', 'osprey', 'kestrel', 'harrier'],
    zone: 'High perches & open sky', habitat: 'Open areas, forest edges, near water',
    note: 'Look up — they often soar in slow circles or perch on dead trees, poles, and cliff edges scanning for prey.',
    movement: 'Soars on flat or slightly raised wings in wide circles, or perches upright and still before a fast dive.',
    sound: 'A thin, high-pitched whistle or scream, often given in flight.' },
  { match: ['owl'],
    zone: 'Tree cavities & dense branches (high)', habitat: 'Forests and wooded areas',
    note: 'Active mostly at dawn, dusk, and night. Look for a rounded silhouette tucked close to the trunk, and listen for hooting.',
    movement: 'Sits upright and still for long stretches, then flies almost silently on broad, rounded wings.',
    sound: 'Deep, resonant hooting, though some species screech or bark instead.' },
  { match: ['woodpecker', 'sapsucker', 'flicker'],
    zone: 'Tree trunks & large branches (low–mid)', habitat: 'Forests, wooded parks',
    note: 'Listen for tapping or drumming sounds. They cling upright to trunks rather than perching on branches like most birds.',
    movement: 'Climbs trunks in short upward hops, bracing with its tail; flight is bouncy, alternating flaps and glides.',
    sound: 'A sharp single call note plus a fast drumming rattle on wood.' },
  { match: ['warbler', 'vireo', 'kinglet', 'tanager'],
    zone: 'Leafy canopy (mid–high)', habitat: 'Forests and dense woodland',
    note: 'Small, fast-moving, and easily hidden in foliage. Often easier to locate by song than by sight — binoculars help a lot.',
    movement: 'Flits quickly and almost constantly through foliage, rarely staying still for long.',
    sound: 'High, thin, often complex songs — usually easier to hear than see.' },
  { match: ['chickadee', 'nuthatch', 'titmouse', 'creeper'],
    zone: 'Tree trunks & mid branches', habitat: 'Forests, woodland edges, backyard feeders',
    note: 'Very active and often travel in small mixed flocks, moving quickly from branch to branch.',
    movement: 'Acrobatic — hangs upside down on branches, and nuthatches move headfirst down tree trunks.',
    sound: 'Clear whistled or nasal calls, like a chickadee\'s "chick-a-dee-dee" or a nuthatch\'s nasal "yank-yank".' },
  { match: ['sparrow', 'junco', 'towhee', 'finch', 'bunting'],
    zone: 'Ground & low shrubs', habitat: 'Open areas, brush, backyards, trailsides',
    note: 'Look on or near the ground under bushes — they forage by hopping and scratching through leaf litter.',
    movement: 'Hops rather than walks, often scratching at leaf litter with both feet at once.',
    sound: 'Short, simple chirps or a musical trill, usually sung from a low perch.' },
  { match: ['robin', 'thrush', 'blackbird', 'grackle', 'starling'],
    zone: 'Ground & low branches', habitat: 'Lawns, open woodland, parks',
    note: 'Often seen hopping across open ground hunting for insects and worms, especially after rain.',
    movement: 'Walks or runs across open ground in short bursts, pausing upright to look and listen.',
    sound: 'Rich, musical, warbling song, often sung from a high perch at dawn.' },
  { match: ['grouse', 'quail', 'pheasant', 'turkey', 'ptarmigan'],
    zone: 'Ground level', habitat: 'Forest floor, brush, open fields',
    note: 'Ground-dwelling and well camouflaged — you may hear rustling or a sudden burst of flight before you spot one.',
    movement: 'Walks along the ground and bursts into sudden, loud, whirring flight when startled.',
    sound: 'Low clucks, booming drums, or sharp alarm calls.' },
  { match: ['pigeon', 'dove'],
    zone: 'Ledges, wires & ground', habitat: 'Urban areas and open ground',
    note: 'Very tolerant of people — commonly seen walking on the ground or perched on buildings and wires.',
    movement: 'Walks with a bobbing head motion; wings make a sharp clapping or whistling sound on takeoff.',
    sound: 'Soft, low cooing.' },
  { match: ['gull'],
    zone: 'Open ground, water & rooftops', habitat: 'Coastlines, lakes, parking lots, urban areas',
    note: 'Usually in groups in open areas, especially near water or wherever food is easy to find.',
    movement: 'Walks easily on the ground and swims; flies with slow, steady wingbeats, often gliding.',
    sound: 'Loud, harsh squawks and laughing calls.' },
  { match: ['duck', 'goose', 'swan', 'heron', 'egret', 'kingfisher', 'coot', 'grebe'],
    zone: 'On or near water', habitat: 'Lakes, rivers, ponds, wetlands',
    note: 'Stick close to the shoreline and scan the water surface and edges — herons often stand motionless in shallow water.',
    movement: 'Swims or wades; herons stand motionless before striking, while ducks and geese dabble or dive for food.',
    sound: 'Quacks, honks, or croaks — herons give a harsh, guttural squawk, especially when startled.' },
  { match: ['hummingbird'],
    zone: 'Flowers & understory (low–mid)', habitat: 'Gardens, forest edges, near flowering plants',
    note: 'Look near brightly colored flowers — you’ll often hear their fast wingbeats before you spot them.',
    movement: 'Hovers in place with rapid wingbeats and can fly backward; perches briefly on thin twigs.',
    sound: 'A fast, buzzy wingbeat hum plus sharp, high-pitched chip notes.' },
  { match: ['swallow', 'swift', 'martin'],
    zone: 'In flight (open air)', habitat: 'Open areas, near water, over fields',
    note: 'Rarely perch in view — watch for fast, swooping flight catching insects in the air, often near water at dusk.',
    movement: 'Almost constantly in fast, agile flight, catching insects on the wing; rarely seen perched.',
    sound: 'Soft twittering chatter, usually given in flight.' },
  { match: ['flycatcher', 'phoebe', 'kingbird'],
    zone: 'Exposed mid-level perches', habitat: 'Open woodland, forest edges',
    note: 'Perches upright on an exposed branch, darts out to catch an insect, then returns to nearly the same spot.',
    movement: 'Sits still on an exposed perch, then makes short, fast round-trip flights to snatch insects.',
    sound: 'Short, sharp, often repeated call notes.' },
  { match: ['killdeer', 'plover', 'sandpiper'],
    zone: 'Ground & shorelines', habitat: 'Open ground, gravel, shorelines',
    note: 'Ground-nesting — watch your step in open gravel or grassy areas near water.',
    movement: 'Runs in quick bursts along the ground, then stops abruptly; may fake a broken wing to lure you from a nest.',
    sound: 'Loud, piercing "kill-deer" or high-pitched piping calls.' },
];

const DEFAULT_BIRD_INFO = {
  zone: 'Varies — check branches from low to high',
  habitat: 'Varies by species',
  note: 'Behavior varies by species — scan from ground level up to the treetops, and listen for calls to help locate it.',
  movement: 'Movement varies by species — watch for hopping, walking, or quick flitting between perches.',
  sound: 'Listen for repeated call notes or song near where you see it move.',
};

function birdInfoFor(name, sciName) {
  const lower = `${name} ${sciName}`.toLowerCase();
  return BIRD_BEHAVIOR.find((b) => b.match.some((m) => lower.includes(m))) || DEFAULT_BIRD_INFO;
}

const SAFETY_TIPS = [
  'Make some noise as you walk — most animals will clear out of your path if they hear you coming.',
  'If you see a snake, stop and back away slowly. Never try to move, touch, or handle it — that’s when most bites happen.',
  'Wear sturdy, closed boots and long pants on overgrown or rocky trails.',
  'Keep dogs leashed — they’re more likely to provoke wildlife than you are.',
  'In bear country, store food in a sealed container or bear canister, away from your tent.',
  'Never approach or feed wildlife, even animals that look calm or used to people.',
  'If you’re unsure what an animal is, take a photo from a distance instead of getting closer to look.',
];

function dangerInfoFor(name, sciName, categoryKey) {
  const lower = `${name} ${sciName}`.toLowerCase();
  const specific = SPECIFIC_TIPS.find(
    (s) => s.categories.includes(categoryKey) && s.match.some((m) => lower.includes(m))
  );
  return specific || null;
}

function tipFor(name, sciName, categoryKey) {
  const specific = dangerInfoFor(name, sciName, categoryKey);
  if (specific) return specific.tip;
  return DEFAULT_TIPS[categoryKey] || DEFAULT_TIPS.Other;
}

function categoryFor(iconicTaxonName) {
  return CATEGORIES.find((c) => c.key === iconicTaxonName) || CATEGORIES[CATEGORIES.length - 1];
}

const altNameCache = new Map();

async function fetchAltNames(taxonId) {
  if (altNameCache.has(taxonId)) return altNameCache.get(taxonId);
  const promise = (async () => {
    try {
      const res = await fetch(`https://api.inaturalist.org/v1/taxa/${taxonId}?all_names=true`);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      const taxon = data.results && data.results[0];
      const names = (taxon && taxon.names) || [];
      return [...new Set(names.filter((n) => n.locale === 'en').map((n) => n.name))];
    } catch (err) {
      return [];
    }
  })();
  altNameCache.set(taxonId, promise);
  return promise;
}

const soundCache = new Map();

async function fetchBirdSound(taxonId) {
  if (soundCache.has(taxonId)) return soundCache.get(taxonId);
  const promise = (async () => {
    try {
      const res = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&sounds=true&per_page=1&quality_grade=research`);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      const obs = data.results && data.results[0];
      const sound = obs && obs.sounds && obs.sounds[0];
      return sound ? { fileUrl: sound.file_url, attribution: sound.attribution } : null;
    } catch (err) {
      return null;
    }
  })();
  soundCache.set(taxonId, promise);
  return promise;
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
  const category = categoryFor(taxon.iconic_taxon_name);
  const danger = dangerInfoFor(name, sciName, category.key);
  const levelMeta = danger ? DANGER_LEVELS[danger.level] : null;
  const percent = formatPercent(item.count, total);
  const tip = tipFor(name, sciName, category.key);
  const birdInfo = category.key === 'Aves' ? birdInfoFor(name, sciName) : null;

  return `
    <div class="wildlife-card ${danger ? `is-dangerous danger-${danger.level}` : ''}">
      ${photo ? `<img src="${photo}" alt="${name}" loading="lazy" />` : '<div class="wildlife-card-noimg">🌿</div>'}
      <div class="wildlife-card-body">
        <div class="wildlife-card-top">
          <div class="wildlife-card-name">${name}</div>
          <div class="wildlife-card-pct" title="Share of recent local sightings that were this species">${percent}</div>
        </div>
        <div class="wildlife-card-sci">${sciName}</div>
        ${levelMeta ? `<div class="wildlife-card-warning danger-${danger.level}">${levelMeta.icon} ${levelMeta.label} — keep your distance</div>` : ''}
        <details class="wildlife-card-tip wildlife-altnames" data-taxon-id="${taxon.id}" data-primary-name="${name.toLowerCase()}">
          <summary>Other names</summary>
          <p class="altnames-body">Tap to load other common names…</p>
        </details>
        ${birdInfo ? `
          <details class="wildlife-card-tip">
            <summary>Where to spot it</summary>
            <p><strong>Height:</strong> ${birdInfo.zone}<br />
            <strong>Habitat:</strong> ${birdInfo.habitat}<br />
            ${birdInfo.note}</p>
          </details>
          <details class="wildlife-card-tip wildlife-sound-details" data-taxon-id="${taxon.id}">
            <summary>Sound & movement</summary>
            <p><strong>Movement:</strong> ${birdInfo.movement}</p>
            <p><strong>Typical sound:</strong> ${birdInfo.sound}</p>
            <div class="wildlife-sound-player">
              <button type="button" class="sound-load-btn">🔊 Try to load a real recording</button>
            </div>
          </details>
        ` : ''}
        <details class="wildlife-card-tip">
          <summary>If you encounter one</summary>
          <p>${tip}</p>
        </details>
      </div>
    </div>
  `;
}

function wireUpCards(container) {
  container.querySelectorAll('.wildlife-altnames').forEach((details) => {
    details.addEventListener('toggle', async () => {
      if (!details.open || details.dataset.loaded) return;
      details.dataset.loaded = '1';
      const body = details.querySelector('.altnames-body');
      const names = await fetchAltNames(details.dataset.taxonId);
      const others = names.filter((n) => n.toLowerCase() !== details.dataset.primaryName);
      body.textContent = others.length
        ? others.slice(0, 6).join(', ')
        : 'No other common names on record for this species.';
    });
  });

  container.querySelectorAll('.sound-load-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const details = btn.closest('.wildlife-sound-details');
      const player = details.querySelector('.wildlife-sound-player');
      player.innerHTML = '<span class="sound-status">Looking for a recording…</span>';
      const sound = await fetchBirdSound(details.dataset.taxonId);
      if (sound) {
        player.innerHTML = `
          <audio controls preload="none" src="${sound.fileUrl}"></audio>
          ${sound.attribution ? `<span class="sound-attribution">${sound.attribution}</span>` : ''}
        `;
      } else {
        player.innerHTML = '<span class="sound-status">No recording found for this species right now — see the description above.</span>';
      }
    });
  });
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
  wireUpCards(resultsEl);
}

async function loadWildlifeForCoords(latitude, longitude, statusEl, resultsEl, placeLabel) {
  statusEl.textContent = placeLabel ? `Looking for wildlife near ${placeLabel}…` : 'Looking for wildlife near you…';
  resultsEl.innerHTML = '';
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
}

function findWildlifeNearMe(statusEl, resultsEl) {
  if (!navigator.geolocation) {
    statusEl.textContent = 'Your browser doesn’t support location — try searching for a place instead.';
    return;
  }

  statusEl.textContent = 'Getting your location…';
  resultsEl.innerHTML = '';

  navigator.geolocation.getCurrentPosition(
    (pos) => loadWildlifeForCoords(pos.coords.latitude, pos.coords.longitude, statusEl, resultsEl),
    () => {
      statusEl.textContent = 'Location access was denied. Enable location access, or search for a place instead.';
    }
  );
}

async function findWildlifeForPlace(query, statusEl, resultsEl) {
  if (!query.trim()) {
    statusEl.textContent = 'Type a place name first.';
    return;
  }

  statusEl.textContent = `Looking up "${query}"…`;
  resultsEl.innerHTML = '';

  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();
    if (!geoData.length) {
      statusEl.textContent = `Couldn’t find "${query}". Try a more specific place name.`;
      return;
    }
    const { lat, lon, display_name } = geoData[0];
    await loadWildlifeForCoords(lat, lon, statusEl, resultsEl, display_name);
  } catch (err) {
    statusEl.textContent = 'Couldn’t look up that place right now. Please try again.';
  }
}

document.querySelector('#app').innerHTML = `
  <div class="birds">
    ${bird()}${bird()}${bird()}${bird()}${bird()}
  </div>
  <div class="page">
    <h1>Hi Kate</h1>

    <section class="wildlife-panel">
      <h2>🐾 Wildlife Near You</h2>
      <p class="wildlife-intro">See how often each species has actually been reported near a location, and what to do if you run into one. Percentages reflect how common each species is in local sightings — not a guarantee, but a real, data-based sense of likelihood.</p>

      <div class="danger-legend">
        <span class="danger-legend-item danger-low">⚠️ Low risk</span>
        <span class="danger-legend-item danger-moderate">🔶 Moderate risk</span>
        <span class="danger-legend-item danger-high">☠️ High risk</span>
      </div>

      <div class="location-controls">
        <button id="find-wildlife-btn" class="wildlife-btn">📍 Use my location</button>
        <span class="location-or">or</span>
        <form id="location-form" class="location-form">
          <input id="location-input" type="text" placeholder="Enter a place, e.g. Yosemite Valley, CA" />
          <button type="submit" class="wildlife-btn wildlife-btn-secondary">Search</button>
        </form>
      </div>

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

const statusEl = document.querySelector('#wildlife-status');
const resultsEl = document.querySelector('#wildlife-results');

document.querySelector('#find-wildlife-btn').addEventListener('click', () => {
  findWildlifeNearMe(statusEl, resultsEl);
});

document.querySelector('#location-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#location-input');
  findWildlifeForPlace(input.value, statusEl, resultsEl);
});
