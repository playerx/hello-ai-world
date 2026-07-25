import './style.css';

const londonIcons = ['🚌', '🎡', '🌉', '☂️', '👑', '🚕', '🕰️', '🇬🇧'];

const iconsHTML = londonIcons
  .map((icon, i) => {
    const left = Math.round((i / londonIcons.length) * 100 + Math.random() * 8);
    const duration = (14 + Math.random() * 8).toFixed(1);
    const delay = (Math.random() * 10).toFixed(1);
    const size = (2 + Math.random() * 1.5).toFixed(1);
    return `<span class="float-icon" style="left:${left}%; animation-duration:${duration}s; animation-delay:-${delay}s; font-size:${size}rem;">${icon}</span>`;
  })
  .join('');

document.querySelector('#app').innerHTML = `
  <div class="london-sky">${iconsHTML}</div>
  <h1>Hi Sandro</h1>
`;
