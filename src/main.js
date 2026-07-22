import './style.css';

const swissFoods = [
  { emoji: '🫕', name: 'Fondue' },
  { emoji: '🧀', name: 'Raclette' },
  { emoji: '🥔', name: 'Rösti' },
  { emoji: '🍫', name: 'Swiss Chocolate' },
];

document.querySelector('#app').innerHTML = `
  <h1>hi Florian</h1>
  <div class="food-row">
    ${swissFoods
      .map(
        (food, i) => `
          <div class="food-card" style="animation-delay: ${i * 0.15}s">
            <span class="food-emoji">${food.emoji}</span>
            <span class="food-name">${food.name}</span>
          </div>
        `
      )
      .join('')}
  </div>
`;
