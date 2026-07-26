import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="greeting">
    <h1>Hi, YC <span class="coffee">☕</span></h1>
    <div class="coffee-row">
      <span class="coffee">☕</span>
      <span class="coffee">☕</span>
      <span class="coffee">☕</span>
      <span class="coffee">☕</span>
      <span class="coffee">☕</span>
    </div>
    <div class="pricing">
      <h2>Pricing</h2>
      <div class="price">$7.99</div>
      <p class="price-note">per month</p>
    </div>
  </div>
`;
