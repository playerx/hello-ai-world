import './style.css';

// Official video from Britney Spears' YouTube channel — embedded, not copied,
// so it's the legit way to get the real song on the page.
const VIDEO_ID = 'LOZuxwVk7TU'; // Britney Spears - Toxic
const VIDEO_TITLE = 'Britney Spears - Toxic';

document.querySelector('#app').innerHTML = `
  <h1>hi Ellen</h1>
  <div class="sushi">🍣</div>
  <button class="music-toggle" id="music-toggle">▶️ Hit me with Britney</button>
  <div class="player" id="player"></div>
`;

const toggle = document.getElementById('music-toggle');
const player = document.getElementById('player');
let playing = false;

toggle.addEventListener('click', () => {
  playing = !playing;
  if (playing) {
    // Inserting the iframe on click counts as a user gesture, so autoplay works.
    player.innerHTML = `
      <iframe
        width="480" height="270"
        src="https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1"
        title="${VIDEO_TITLE}"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>`;
    toggle.textContent = '⏹️ Stop the music';
  } else {
    player.innerHTML = '';
    toggle.textContent = '▶️ Hit me with Britney';
  }
});
